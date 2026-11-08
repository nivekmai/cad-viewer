package com.nivek.stlviewer

import java.nio.FloatBuffer
import kotlin.math.abs
import kotlin.math.sqrt

/** Cross-section analysis: ray-cast face picking and clip-plane math. Pure
 * Kotlin with no Android or GL dependency, so it is unit-testable. A clip
 * plane keeps the fragments where dot(point, normal) <= offset and hides
 * the rest. The plane lives in model space (mesh coordinates after instance
 * transforms, before the view rotation), so it stays attached to the model
 * when the user rotates the view. */
object SectionClip {
    data class Pick(val point: FloatArray, val normal: FloatArray, val distance: Float)

    /** Möller–Trumbore ray/triangle test. Returns the distance along [dir]
     * to the hit, or null. [dir] must be normalized. Both sides of the
     * triangle are hit: a tap can land on a face whose stored normal points
     * away, and the stored normal (not the geometric one) decides the plane
     * direction. */
    fun rayTriangle(
        ox: Float, oy: Float, oz: Float, dx: Float, dy: Float, dz: Float,
        v0x: Float, v0y: Float, v0z: Float, v1x: Float, v1y: Float, v1z: Float,
        v2x: Float, v2y: Float, v2z: Float
    ): Float? {
        val e1x = v1x - v0x; val e1y = v1y - v0y; val e1z = v1z - v0z
        val e2x = v2x - v0x; val e2y = v2y - v0y; val e2z = v2z - v0z
        val px = dy * e2z - dz * e2y; val py = dz * e2x - dx * e2z; val pz = dx * e2y - dy * e2x
        val det = e1x * px + e1y * py + e1z * pz
        if (det > -1e-8f && det < 1e-8f) return null
        val inv = 1f / det
        val tx = ox - v0x; val ty = oy - v0y; val tz = oz - v0z
        val u = (tx * px + ty * py + tz * pz) * inv
        if (u < 0f || u > 1f) return null
        val qx = ty * e1z - tz * e1y; val qy = tz * e1x - tx * e1z; val qz = tx * e1y - ty * e1x
        val v = (dx * qx + dy * qy + dz * qz) * inv
        if (v < 0f || u + v > 1f) return null
        val t = (e2x * qx + e2y * qy + e2z * qz) * inv
        return if (t > 1e-6f) t else null
    }

    /** Inverse-transpose of the upper 3x3 of a column-major 4x4 matrix, for
     * transforming normals. Returns the matrix row-major, or null for a
     * singular matrix. A mirrored placement flips the geometric normal, so
     * the stored face normal (run through this) is the reliable direction. */
    fun normalMatrix3(m: FloatArray): FloatArray? {
        val a = m[0]; val b = m[4]; val c = m[8]
        val d = m[1]; val e = m[5]; val f = m[9]
        val g = m[2]; val h = m[6]; val i = m[10]
        val det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
        if (det == 0f || !det.isFinite()) return null
        val inv = 1f / det
        return floatArrayOf(
            (e * i - f * h) * inv, (f * g - d * i) * inv, (d * h - e * g) * inv,
            (c * h - b * i) * inv, (a * i - c * g) * inv, (b * g - a * h) * inv,
            (b * f - c * e) * inv, (c * d - a * f) * inv, (a * e - b * d) * inv
        )
    }

    /** Half-extents of the model in model space. Rendered geometry is
     * centered at the origin with its largest dimension spanning 2, so the
     * half-extent along each axis is that axis' share of the largest
     * dimension, whether the mesh dimensions are raw or already normalized. */
    fun modelHalfExtents(mesh: StlParser.Mesh): FloatArray {
        val span = maxOf(mesh.width, mesh.depth, mesh.height)
        if (span <= 0.0) return floatArrayOf(1f, 1f, 1f)
        return floatArrayOf(
            (mesh.width / span).toFloat(),
            (mesh.depth / span).toFloat(),
            (mesh.height / span).toFloat()
        )
    }

    /** Extent of a box centered at the origin (given by its half-extents)
     * along a unit normal. Returns (min, max) of dot(point, normal) over
     * the box; the box is symmetric, so the range is (-extent, +extent). */
    fun planeRange(halfExtents: FloatArray, normal: FloatArray): Pair<Float, Float> {
        val extent = halfExtents[0] * abs(normal[0]) +
            halfExtents[1] * abs(normal[1]) + halfExtents[2] * abs(normal[2])
        return -extent to extent
    }

    /** Nearest triangle hit by a ray in model space, across the static
     * geometry and every instanced resource placement. Returns the hit
     * point, the face's stored normal (unit length, in model space), and
     * the distance along the ray. */
    fun pick(mesh: StlParser.Mesh, origin: FloatArray, dir: FloatArray): Pick? {
        var best: Pick? = null
        var bestT = Float.MAX_VALUE
        if (mesh.triangles > 0) {
            pickBuffer(mesh.data, 0, mesh.triangles * 3, null, origin, dir, bestT)?.let {
                best = it; bestT = it.distance
            }
        }
        val resourceData = mesh.resourceData
        if (resourceData != null) {
            for (resource in mesh.resources) {
                if (resource.count < 3) continue
                for (instance in resource.instances) {
                    pickBuffer(resourceData, resource.first, resource.count, instance, origin, dir, bestT)?.let {
                        best = it; bestT = it.distance
                    }
                }
            }
        }
        return best
    }

    private fun pickBuffer(
        data: FloatBuffer, firstVertex: Int, vertexCount: Int, instance: FloatArray?,
        origin: FloatArray, dir: FloatArray, bestT: Float
    ): Pick? {
        val nMat = instance?.let { normalMatrix3(it) }
        // Read in triangle-aligned chunks so a 3M-triangle model is scanned
        // from bulk reads instead of one bounds-checked get() per float.
        val chunkTris = 1024
        val chunk = FloatArray(chunkTris * 3 * 6)
        val source = data.duplicate()
        var best: Pick? = null
        var bestDistance = bestT
        var done = 0
        val totalTris = vertexCount / 3
        while (done < totalTris) {
            val tris = minOf(chunkTris, totalTris - done)
            val floats = tris * 3 * 6
            source.position((firstVertex + done * 3) * 6)
            source.get(chunk, 0, floats)
            for (t in 0 until tris) {
                val base = t * 18
                var v0x = chunk[base]; var v0y = chunk[base + 1]; var v0z = chunk[base + 2]
                var v1x = chunk[base + 6]; var v1y = chunk[base + 7]; var v1z = chunk[base + 8]
                var v2x = chunk[base + 12]; var v2y = chunk[base + 13]; var v2z = chunk[base + 14]
                var nx = chunk[base + 3]; var ny = chunk[base + 4]; var nz = chunk[base + 5]
                if (instance != null) {
                    // Transform into fresh locals: each output component
                    // reads the original vertex, not the one just written.
                    var x = v0x; var y = v0y; var z = v0z
                    v0x = instance[0] * x + instance[4] * y + instance[8] * z + instance[12]
                    v0y = instance[1] * x + instance[5] * y + instance[9] * z + instance[13]
                    v0z = instance[2] * x + instance[6] * y + instance[10] * z + instance[14]
                    x = v1x; y = v1y; z = v1z
                    v1x = instance[0] * x + instance[4] * y + instance[8] * z + instance[12]
                    v1y = instance[1] * x + instance[5] * y + instance[9] * z + instance[13]
                    v1z = instance[2] * x + instance[6] * y + instance[10] * z + instance[14]
                    x = v2x; y = v2y; z = v2z
                    v2x = instance[0] * x + instance[4] * y + instance[8] * z + instance[12]
                    v2y = instance[1] * x + instance[5] * y + instance[9] * z + instance[13]
                    v2z = instance[2] * x + instance[6] * y + instance[10] * z + instance[14]
                    if (nMat != null) {
                        val tx = nMat[0] * nx + nMat[1] * ny + nMat[2] * nz
                        val ty = nMat[3] * nx + nMat[4] * ny + nMat[5] * nz
                        val tz = nMat[6] * nx + nMat[7] * ny + nMat[8] * nz
                        nx = tx; ny = ty; nz = tz
                    }
                }
                val t = rayTriangle(
                    origin[0], origin[1], origin[2], dir[0], dir[1], dir[2],
                    v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z
                ) ?: continue
                if (t >= bestDistance) continue
                val length = sqrt(nx * nx + ny * ny + nz * nz)
                if (length == 0f || !length.isFinite()) continue
                bestDistance = t
                best = Pick(
                    floatArrayOf(origin[0] + dir[0] * t, origin[1] + dir[1] * t, origin[2] + dir[2] * t),
                    floatArrayOf(nx / length, ny / length, nz / length),
                    t
                )
            }
            done += tris
        }
        return best
    }
}

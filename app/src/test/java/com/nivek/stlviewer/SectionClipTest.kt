package com.nivek.stlviewer

import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import org.junit.Assert.*
import org.junit.Test
import kotlin.math.sqrt

class SectionClipTest {
    // One triangle, (0,0,0) (2,0,0) (0,2,0). The mesh constructor centers
    // and scales it to (-1,-1,0) (1,-1,0) (-1,1,0) with normal (0,0,1).
    private fun triangleMesh(): StlParser.Mesh =
        StlParser.Mesh(floatArrayOf(0f,0f,0f, 2f,0f,0f, 0f,2f,0f), 9)

    private fun identity(): FloatArray =
        floatArrayOf(1f,0f,0f,0f, 0f,1f,0f,0f, 0f,0f,1f,0f, 0f,0f,0f,1f)

    private fun buffer(vararg values: Float): FloatBuffer =
        ByteBuffer.allocateDirect(values.size * 4).order(ByteOrder.nativeOrder()).asFloatBuffer()
            .apply { put(values); position(0) }

    @Test fun rayHitsTriangleAtKnownDistance() {
        val t = SectionClip.rayTriangle(
            0f,0f,5f, 0f,0f,-1f,
            -1f,-1f,0f, 1f,-1f,0f, -1f,1f,0f
        )
        assertNotNull(t)
        assertEquals(5f, t!!, 1e-5f)
    }

    @Test fun rayMissesOutsideTriangle() {
        assertNull(
            SectionClip.rayTriangle(
                0.9f,0.9f,5f, 0f,0f,-1f,
                -1f,-1f,0f, 1f,-1f,0f, -1f,1f,0f
            )
        )
    }

    @Test fun rayParallelToTriangleMisses() {
        assertNull(
            SectionClip.rayTriangle(
                0f,0f,5f, 1f,0f,0f,
                -1f,-1f,0f, 1f,-1f,0f, -1f,1f,0f
            )
        )
    }

    @Test fun rayHitsBackFaceToo() {
        val t = SectionClip.rayTriangle(
            0f,0f,-5f, 0f,0f,1f,
            -1f,-1f,0f, 1f,-1f,0f, -1f,1f,0f
        )
        assertNotNull(t)
        assertEquals(5f, t!!, 1e-5f)
    }

    @Test fun normalMatrixOfIdentityIsIdentity() {
        val n = SectionClip.normalMatrix3(identity())!!
        assertArrayEquals(floatArrayOf(1f,0f,0f, 0f,1f,0f, 0f,0f,1f), n, 0f)
    }

    @Test fun normalMatrixOfMirrorFlipsTheNormal() {
        // Mirror in x: column-major diag(-1,1,1,1).
        val m = identity().apply { this[0] = -1f }
        val n = SectionClip.normalMatrix3(m)!!
        assertArrayEquals(floatArrayOf(-1f,0f,0f, 0f,1f,0f, 0f,0f,1f), n, 0f)
    }

    @Test fun normalMatrixOfRotationIsTheRotation() {
        // 90 degrees about z, column-major: columns (0,1,0), (-1,0,0), (0,0,1).
        val m = floatArrayOf(0f,1f,0f,0f, -1f,0f,0f,0f, 0f,0f,1f,0f, 0f,0f,0f,1f)
        val n = SectionClip.normalMatrix3(m)!!
        assertArrayEquals(floatArrayOf(0f,-1f,0f, 1f,0f,0f, 0f,0f,1f), n, 0f)
    }

    @Test fun modelHalfExtentsUseLargestDimension() {
        val points = floatArrayOf(
            0f,0f,0f, 4f,0f,0f, 0f,2f,0f,
            0f,0f,0f, 0f,2f,0f, 0f,0f,2f,
            0f,0f,0f, 0f,0f,2f, 4f,0f,0f,
            4f,0f,0f, 0f,0f,2f, 0f,2f,0f
        )
        val mesh = StlParser.Mesh(points, points.size)
        assertEquals(4.0, mesh.width, 0.0)
        assertEquals(2.0, mesh.depth, 0.0)
        assertEquals(2.0, mesh.height, 0.0)
        assertArrayEquals(floatArrayOf(1f, 0.5f, 0.5f), SectionClip.modelHalfExtents(mesh), 0f)
    }

    @Test fun planeRangeIsBoxExtentAlongNormal() {
        val half = floatArrayOf(1f, 0.5f, 0.5f)
        assertEquals(-1f to 1f, SectionClip.planeRange(half, floatArrayOf(1f, 0f, 0f)))
        assertEquals(-0.5f to 0.5f, SectionClip.planeRange(half, floatArrayOf(0f, 1f, 0f)))
        val diagonal = SectionClip.planeRange(half, floatArrayOf(1f, 1f, 1f).let { v ->
            val l = sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
            floatArrayOf(v[0] / l, v[1] / l, v[2] / l)
        })
        assertEquals(2.0 / sqrt(3.0), diagonal.second.toDouble(), 1e-5)
        assertEquals(-diagonal.second, diagonal.first, 0f)
    }

    @Test fun pickFindsStaticTriangle() {
        val mesh = triangleMesh()
        val hit = SectionClip.pick(mesh, floatArrayOf(-0.5f, -0.5f, 5f), floatArrayOf(0f, 0f, -1f))
        assertNotNull(hit)
        assertArrayEquals(floatArrayOf(-0.5f, -0.5f, 0f), hit!!.point, 1e-5f)
        assertArrayEquals(floatArrayOf(0f, 0f, 1f), hit.normal, 1e-5f)
        assertEquals(5f, hit.distance, 1e-5f)
    }

    @Test fun pickMissesWhenRayClearsTheModel() {
        val mesh = triangleMesh()
        assertNull(SectionClip.pick(mesh, floatArrayOf(0.9f, 0.9f, 5f), floatArrayOf(0f, 0f, -1f)))
    }

    @Test fun pickFindsInstancedTriangleTheStaticGeometryMisses() {
        val mesh = triangleMesh()
        // Resource triangle covering (0.9, 0.9), where the static triangle
        // (x + y <= 0) does not reach. Identity placement.
        mesh.resourceData = buffer(
            0.5f,0.5f,0f, 0f,0f,1f,
            1.5f,0.5f,0f, 0f,0f,1f,
            0.5f,1.5f,0f, 0f,0f,1f
        )
        mesh.resources = listOf(
            CadMeshParser.Resource(0, 3, emptyList(), listOf(identity()), FloatBuffer.allocate(0))
        )
        val hit = SectionClip.pick(mesh, floatArrayOf(0.9f, 0.9f, 5f), floatArrayOf(0f, 0f, -1f))
        assertNotNull(hit)
        assertArrayEquals(floatArrayOf(0.9f, 0.9f, 0f), hit!!.point, 1e-5f)
        assertArrayEquals(floatArrayOf(0f, 0f, 1f), hit.normal, 1e-5f)
        assertEquals(5f, hit.distance, 1e-5f)
    }

    @Test fun pickAppliesInstanceTranslation() {
        val mesh = triangleMesh()
        mesh.resourceData = buffer(
            0.5f,0.5f,0f, 0f,0f,1f,
            1.5f,0.5f,0f, 0f,0f,1f,
            0.5f,1.5f,0f, 0f,0f,1f
        )
        val moved = identity().apply { this[14] = 1f } // Translate +1 in z.
        mesh.resources = listOf(
            CadMeshParser.Resource(0, 3, emptyList(), listOf(moved), FloatBuffer.allocate(0))
        )
        val hit = SectionClip.pick(mesh, floatArrayOf(0.9f, 0.9f, 5f), floatArrayOf(0f, 0f, -1f))
        assertNotNull(hit)
        assertArrayEquals(floatArrayOf(0.9f, 0.9f, 1f), hit!!.point, 1e-5f)
        assertEquals(4f, hit.distance, 1e-5f)
    }
}

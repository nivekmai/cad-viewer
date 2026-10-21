package com.nivek.stlviewer

import java.io.BufferedReader
import java.io.IOException
import java.io.InterruptedIOException
import java.util.TreeSet
import kotlin.math.abs
import kotlin.math.max

class Geometry {
    class Floats {
        var values = FloatArray(1024)
        var size = 0
        fun add(value: Double) {
            if (!value.isFinite() || abs(value) > Float.MAX_VALUE) throw IOException("Invalid coordinate in model.")
            if (size >= StlParser.MAX_TRIANGLES * 9) throw IOException("This model exceeds the geometry limit (500,000 triangles/segments).")
            if (size == values.size) values = values.copyOf(minOf(StlParser.MAX_TRIANGLES * 9, size * 2))
            values[size++] = value.toFloat()
        }
        fun point(p: DoubleArray) { p.forEach(::add) }
        fun point(index: Int): DoubleArray {
            if (index < 0 || index >= size / 3) throw IOException("A face refers to a missing vertex.")
            return DoubleArray(3) { values[index * 3 + it].toDouble() }
        }
    }
    val triangles = Floats()
    val lines = Floats()
    val skipped = TreeSet<String>()
    private var origin: DoubleArray? = null
    private fun point(target: Floats, p: DoubleArray) {
        // Preserve small annotation details in drawings with large survey coordinates.
        val base = origin ?: p.copyOf().also { origin = it }
        for (i in 0..2) target.add(p[i] - base[i])
    }
    fun triangle(a: DoubleArray, b: DoubleArray, c: DoubleArray) {
        check(); point(triangles, a); point(triangles, b); point(triangles, c)
    }
    fun line(a: DoubleArray, b: DoubleArray) { check(); point(lines, a); point(lines, b) }
    fun check() {
        if (Thread.currentThread().isInterrupted) throw InterruptedIOException()
        if (triangles.size / 9 + lines.size / 6 >= StlParser.MAX_TRIANGLES)
            throw IOException("This model exceeds the geometry limit (500,000 triangles/segments).")
    }
    fun mesh() = StlParser.Mesh(triangles.values, triangles.size, lines.values, lines.size).also {
        if (skipped.isNotEmpty()) it.notice = "Not displayed: ${skipped.joinToString(", ")}."
    }
    // Ear clipping in the dominant plane preserves concave faces.
    fun polygon(input: List<DoubleArray>) {
        val p = input.toMutableList()
        if (p.size > 3 && p.first().contentEquals(p.last())) p.removeAt(p.lastIndex)
        if (p.size !in 3..4096) throw IOException("Invalid or excessively complex polygon.")
        val normal = DoubleArray(3)
        for (i in p.indices) {
            val a = p[i]; val b = p[(i + 1) % p.size]
            normal[0] += (a[1] - b[1]) * (a[2] + b[2])
            normal[1] += (a[2] - b[2]) * (a[0] + b[0])
            normal[2] += (a[0] - b[0]) * (a[1] + b[1])
        }
        var drop = if (abs(normal[0]) > abs(normal[1])) 0 else 1
        if (abs(normal[2]) > abs(normal[drop])) drop = 2
        val x = (drop + 1) % 3; val y = (drop + 2) % 3
        var area = 0.0; var scale = 0.0
        val base = p.first()
        for (i in p.indices) {
            val a = p[i]; val b = p[(i + 1) % p.size]
            area += (a[x] - base[x]) * (b[y] - base[y]) - (b[x] - base[x]) * (a[y] - base[y])
            scale = max(scale, max(abs(a[x] - base[x]), abs(a[y] - base[y])))
        }
        val sign = if (area < 0) -1 else 1
        val epsilon = scale * scale * 1e-12
        if (abs(area) <= epsilon) throw IOException("Degenerate polygon in model.")
        while (p.size > 3) {
            check()
            var found = false
            for (i in p.indices) {
                val a = p[(i + p.size - 1) % p.size]; val b = p[i]; val c = p[(i + 1) % p.size]
                val turn = cross(a, b, c, x, y) * sign
                if (abs(turn) <= epsilon) { p.removeAt(i); found = true; break }
                if (turn < 0) continue
                val inside = p.any { q -> q !== a && q !== b && q !== c &&
                    cross(a, b, q, x, y) * sign >= -epsilon && cross(b, c, q, x, y) * sign >= -epsilon &&
                    cross(c, a, q, x, y) * sign >= -epsilon }
                if (!inside) { triangle(a, b, c); p.removeAt(i); found = true; break }
            }
            if (!found) throw IOException("A polygon is self-intersecting or cannot be triangulated.")
        }
        triangle(p[0], p[1], p[2])
    }
    companion object {
        @JvmStatic fun number(value: String): Double = value.toDoubleOrNull()?.takeIf { it.isFinite() }
            ?: throw IOException("Invalid number in model: ${value.take(40)}")
        @JvmStatic fun integer(value: String): Int = value.toIntOrNull() ?: throw IOException("Invalid index in model.")
        @JvmStatic fun readLine(reader: BufferedReader): String? = readRawLine(reader)?.trim()
        @JvmStatic fun readRawLine(reader: BufferedReader): String? {
            val s = StringBuilder()
            var c: Int
            while (true) {
                c = reader.read()
                if (c == -1 || c == '\n'.code) break
                if (s.length == 65536) throw IOException("A text record is too long.")
                s.append(c.toChar())
            }
            if (c == -1 && s.isEmpty()) return null
            if (s.startsWith('\ufeff')) s.deleteCharAt(0)
            if (s.endsWith('\r')) s.setLength(s.length - 1)
            return s.toString()
        }
        @JvmStatic fun identity() = doubleArrayOf(1.0,0.0,0.0,0.0, 0.0,1.0,0.0,0.0, 0.0,0.0,1.0,0.0, 0.0,0.0,0.0,1.0)
        @JvmStatic fun transform(m: DoubleArray, p: DoubleArray) = DoubleArray(3) { r ->
            m[r*4]*p[0] + m[r*4+1]*p[1] + m[r*4+2]*p[2] + m[r*4+3]
        }
        @JvmStatic fun multiply(a: DoubleArray, b: DoubleArray): DoubleArray {
            val c = DoubleArray(16)
            for (r in 0..3) for (s in 0..3) for (k in 0..3) c[r*4+s] += a[r*4+k]*b[k*4+s]
            return c
        }
        private fun cross(a: DoubleArray, b: DoubleArray, c: DoubleArray, x: Int, y: Int) =
            (b[x]-a[x])*(c[y]-a[y]) - (b[y]-a[y])*(c[x]-a[x])
    }
}

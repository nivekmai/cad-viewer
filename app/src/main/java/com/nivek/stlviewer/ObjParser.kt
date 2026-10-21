package com.nivek.stlviewer

import java.io.File
import java.io.IOException

object ObjParser {
    @JvmStatic @Throws(IOException::class)
    fun read(file: File): StlParser.Mesh {
        val g = Geometry(); val vertices = Geometry.Floats()
        file.bufferedReader(Charsets.UTF_8).use { reader ->
            while (true) {
                var line = Geometry.readLine(reader) ?: break
                g.check()
                while (line.endsWith("\\")) {
                    val next = Geometry.readLine(reader) ?: throw IOException("Incomplete OBJ continuation.")
                    line = line.dropLast(1) + " " + next
                    if (line.length > 65536) throw IOException("OBJ face too large.")
                }
                line = line.substringBefore('#').trim()
                if (line.isEmpty()) continue
                val w = line.split(Regex("\\s+"))
                when (w[0]) {
                    "v" -> {
                        if (w.size < 4) throw IOException("Incomplete OBJ vertex.")
                        val weight = if (w.size == 5) Geometry.number(w[4]) else 1.0
                        if (weight == 0.0) throw IOException("Invalid OBJ vertex weight.")
                        for (i in 1..3) vertices.add(Geometry.number(w[i]) / weight)
                    }
                    "f" -> g.polygon(w.drop(1).map { vertices.point(index(it, vertices.size / 3)) })
                    "l" -> for (i in 2 until w.size) g.line(vertices.point(index(w[i-1], vertices.size/3)), vertices.point(index(w[i], vertices.size/3)))
                    "mtllib", "usemtl" -> g.skipped.add("OBJ materials/textures")
                    "vt", "vn", "o", "g", "s" -> Unit
                    else -> g.skipped.add("OBJ ${w[0]}")
                }
            }
        }
        return g.mesh()
    }
    private fun index(reference: String, count: Int): Int {
        val n = Geometry.integer(reference.substringBefore('/'))
        if (n == 0) throw IOException("OBJ indices cannot be zero.")
        return if (n < 0) count + n else n - 1
    }
}

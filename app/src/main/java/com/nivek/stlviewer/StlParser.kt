package com.nivek.stlviewer

import java.io.*
import java.nio.*
import kotlin.math.sqrt

/** Binary STL is detected by its length rather than the ambiguous "solid" prefix. */
object StlParser {
    const val MAX_TRIANGLES = 500_000
    const val MAX_BYTES = 64L * 1024 * 1024

    class Mesh @JvmOverloads @Throws(IOException::class) constructor(
        points: FloatArray, count: Int, edges: FloatArray = FloatArray(0), edgeCount: Int = 0
    ) {
        @JvmField val data: FloatBuffer
        @JvmField val lines: FloatBuffer
        @JvmField val triangles = count / 9
        @JvmField val segments = edgeCount / 6
        @JvmField var units = "units"
        @JvmField var notice = ""
        @JvmField val width: Double
        @JvmField val depth: Double
        @JvmField val height: Double
        init {
            if (count + edgeCount == 0 || count % 9 != 0 || edgeCount % 6 != 0) throw IOException("No viewable geometry in this file.")
            val min = DoubleArray(3) { Double.POSITIVE_INFINITY }
            val max = DoubleArray(3) { Double.NEGATIVE_INFINITY }
            for ((values, length) in listOf(points to count, edges to edgeCount)) for (i in 0 until length) {
                if (!values[i].isFinite()) throw IOException("The file contains invalid coordinates.")
                min[i%3] = minOf(min[i%3], values[i].toDouble()); max[i%3] = maxOf(max[i%3], values[i].toDouble())
            }
            width = max[0]-min[0]; depth = max[1]-min[1]; height = max[2]-min[2]
            val span = maxOf(width, depth, height)
            if (span == 0.0) throw IOException("This file has no visible geometry.")
            for (i in 0 until count) points[i] = ((points[i] - (min[i%3]+max[i%3])/2)*2/span).toFloat()
            data = ByteBuffer.allocateDirect(count*2*4).order(ByteOrder.nativeOrder()).asFloatBuffer()
            for (i in 0 until count step 9) {
                val ux=(points[i+3]-points[i]).toDouble(); val uy=(points[i+4]-points[i+1]).toDouble(); val uz=(points[i+5]-points[i+2]).toDouble()
                val vx=(points[i+6]-points[i]).toDouble(); val vy=(points[i+7]-points[i+1]).toDouble(); val vz=(points[i+8]-points[i+2]).toDouble()
                var nx=uy*vz-uz*vy; var ny=uz*vx-ux*vz; var nz=ux*vy-uy*vx
                var length=sqrt(nx*nx+ny*ny+nz*nz)
                if (length == 0.0) { nx=0.0; ny=0.0; nz=1.0; length=1.0 }
                for (v in 0..2) {
                    data.put(points[i+v*3]).put(points[i+v*3+1]).put(points[i+v*3+2])
                    data.put((nx/length).toFloat()).put((ny/length).toFloat()).put((nz/length).toFloat())
                }
            }
            data.position(0)
            lines = ByteBuffer.allocateDirect(edgeCount*4).order(ByteOrder.nativeOrder()).asFloatBuffer()
            for (i in 0 until edgeCount) lines.put(((edges[i]-(min[i%3]+max[i%3])/2)*2/span).toFloat())
            lines.position(0)
        }
    }
    @JvmStatic @Throws(IOException::class)
    fun read(file: File): Mesh {
        if (file.length() > MAX_BYTES) throw IOException("Please choose an STL smaller than 64 MB.")
        file.inputStream().buffered().use { input ->
            input.mark(84)
            val header = ByteArray(minOf(84, file.length().toInt()))
            DataInputStream(input).readFully(header); input.reset()
            if (header.size == 84) {
                val triangles = ByteBuffer.wrap(header).order(ByteOrder.LITTLE_ENDIAN).getInt(80).toLong() and 0xffffffffL
                if (84 + triangles * 50 == file.length()) return binary(input, triangles)
            }
            return ascii(input)
        }
    }
    private fun binary(input: InputStream, triangles: Long): Mesh {
        if (triangles > MAX_TRIANGLES) throw IOException("Please choose an STL with at most 500,000 triangles.")
        val stream = DataInputStream(input)
        stream.readFully(ByteArray(84))
        val points = FloatArray(triangles.toInt()*9); val record = ByteArray(50)
        val buffer = ByteBuffer.wrap(record).order(ByteOrder.LITTLE_ENDIAN)
        for (i in 0 until triangles.toInt()) {
            if (Thread.currentThread().isInterrupted) throw InterruptedIOException()
            stream.readFully(record)
            for (j in 0..8) points[i*9+j] = buffer.getFloat(12+j*4)
        }
        return Mesh(points, points.size)
    }
    private fun ascii(input: InputStream): Mesh {
        val reader = input.bufferedReader(Charsets.US_ASCII)
        var points = FloatArray(9000); var count=0; var state=0; var vertices=0
        var solid=false; var sawSolid=false
        while (true) {
            val line = readLine(reader)?.trim() ?: break
            if (Thread.currentThread().isInterrupted) throw InterruptedIOException()
            if (line.isEmpty()) continue
            val w=line.split(Regex("\\s+")); val tag=w[0]
            when {
                tag=="solid" && state==0 && !solid -> { solid=true; sawSolid=true }
                tag=="endsolid" && state==0 && solid -> solid=false
                tag=="facet" && w.size==5 && w[1]=="normal" && state==0 && solid -> { state=1; vertices=0 }
                tag=="outer" && w.size==2 && w[1]=="loop" && state==1 -> state=2
                tag=="vertex" && w.size==4 && state==2 && vertices<3 -> {
                    if (count>=MAX_TRIANGLES*9) throw IOException("Please choose an STL with at most 500,000 triangles.")
                    if (count+3>points.size) points=points.copyOf(minOf(MAX_TRIANGLES*9, points.size*2))
                    try { for (j in 1..3) points[count++]=w[j].toFloat() }
                    catch (_: NumberFormatException) { throw IOException("The STL contains an invalid vertex.") }
                    vertices++
                }
                tag=="endloop" && state==2 && vertices==3 -> state=3
                tag=="endfacet" && state==3 -> state=0
                else -> throw IOException("This file is not a valid binary or text STL.")
            }
        }
        if (!sawSolid || solid || state!=0) throw IOException("This STL is incomplete or damaged.")
        return Mesh(points,count)
    }
    private fun readLine(reader: BufferedReader): String? {
        val line=StringBuilder()
        while (true) {
            val c=reader.read()
            if (c == -1) return if (line.isEmpty()) null else line.toString()
            if (c == '\n'.code) return line.toString()
            if (line.length>=4096) throw IOException("This STL contains an invalid text record.")
            line.append(c.toChar())
        }
    }
}

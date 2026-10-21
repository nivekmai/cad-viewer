package com.nivek.stlviewer

import java.io.DataInputStream
import java.io.IOException

/** Portable annotation layout using the bundled DejaVu-derived outline font. */
object CadText {
    private data class Glyph(val advance: Float, val edges: FloatArray)
    private val font: Map<Int, Glyph> by lazy {
        val resource = CadText::class.java.getResourceAsStream("/cad-font.bin") ?: throw IOException("The bundled CAD font is missing.")
        DataInputStream(resource).use { input ->
            buildMap {
                repeat(input.readInt()) {
                    val code=input.readInt(); val advance=input.readFloat()
                    put(code, Glyph(advance, FloatArray(input.readInt()) { input.readFloat() }))
                }
            }
        }
    }
    @JvmStatic @Throws(IOException::class)
    fun width(text: String): Double = text.codePoints().toArray().sumOf { (font[it] ?: font.getValue('?'.code)).advance.toDouble() }
    fun draw(geometry: Geometry, text: String, matrix: DoubleArray) {
        var offset=0.0
        for (code in text.codePoints().toArray()) {
            val glyph=font[code] ?: font.getValue('?'.code).also { geometry.skipped.add("some text characters (shown as ?)") }
            for (i in glyph.edges.indices step 4) geometry.line(
                Geometry.transform(matrix, doubleArrayOf(offset+glyph.edges[i], glyph.edges[i+1].toDouble(), 0.0)),
                Geometry.transform(matrix, doubleArrayOf(offset+glyph.edges[i+2], glyph.edges[i+3].toDouble(), 0.0)))
            offset+=glyph.advance
        }
    }
    fun wrap(text: String, width: Double): List<String> {
        val lines=mutableListOf<String>()
        for (paragraph in text.split('\n')) {
            if (width<=0) { lines.add(paragraph); continue }
            val line=StringBuilder(); var used=0.0
            for (word in paragraph.split(Regex("(?<= )"))) {
                if (used>0 && used+width(word)>width) { lines.add(line.toString().trimEnd()); line.setLength(0); used=0.0 }
                for (code in word.codePoints().toArray()) {
                    val letter=String(Character.toChars(code)); val advance=width(letter)
                    if (used>0 && used+advance>width) { lines.add(line.toString()); line.setLength(0); used=0.0 }
                    line.append(letter); used+=advance
                }
            }
            lines.add(line.toString().trimEnd())
        }
        return lines
    }
    @JvmStatic fun plain(raw: String, multiline: Boolean): String {
        val result=StringBuilder(); var i=0
        while (i<raw.length) {
            val c=raw[i++]
            if (c=='%' && i+1<raw.length && raw[i]=='%') {
                val key=raw[i+1].lowercaseChar(); i+=2
                when(key) {
                    'd' -> result.append('°'); 'p' -> result.append('±'); 'c' -> result.append('Ø'); '%' -> result.append('%')
                    'u','o','k' -> Unit
                    else -> result.append("%%").append(key)
                }
                continue
            }
            if (c=='\\' && i<raw.length) {
                val key=raw[i++]
                if (key=='U' && i+4<raw.length && raw[i]=='+') {
                    val code=raw.substring(i+1,i+5).toIntOrNull(16)
                    if (code!=null) { result.append(code.toChar()); i+=5; continue }
                }
                if (key in "\\{}") { result.append(key); continue }
                if (multiline && key in "PN") { result.append('\n'); continue }
                if (multiline && key=='~') { result.append(' '); continue }
                if (multiline && key in "LlOoKk") continue
                if (multiline && key in "ACcFfHhQqTtWwSp") {
                    val end=raw.indexOf(';',i)
                    if (end>=0) {
                        if (key=='S') result.append(raw.substring(i,end).replace('^','/').replace('#','/'))
                        i=end+1; continue
                    }
                }
                result.append('\\').append(key); continue
            }
            if (multiline && c in "{}") continue
            result.append(c)
        }
        return result.toString()
    }
}

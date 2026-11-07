package com.nivek.stlviewer

import java.io.File
import java.io.IOException
import java.util.Locale

object ModelParser {
    @JvmStatic fun extension(name: String) = name.substringAfterLast('.', "").lowercase(Locale.ROOT)
    @JvmStatic fun supported(name: String) = extension(name) in setOf("stl", "obj", "3mf", "dxf", "scad", "step", "stp", "dwg", "skp")
    @JvmStatic fun needsEngine(name: String) = extension(name) in setOf("scad", "step", "stp", "dwg", "skp")
    @JvmStatic @Throws(IOException::class)
    fun read(file: File, name: String): StlParser.Mesh {
        return when (extension(name)) {
            "obj" -> ObjParser.read(file)
            "3mf" -> ThreeMfParser.read(file)
            "dxf" -> DxfParser.read(file)
            "stl" -> StlParser.read(file)
            else -> throw IOException("Choose an STL, OBJ, 3MF, DXF, SCAD, STEP/STP, DWG, or SketchUp (SKP) file.")
        }
    }
}

package com.nivek.stlviewer;

import java.io.*;
import java.util.Locale;

final class ModelParser {
    static String extension(String name){int dot=name.lastIndexOf('.');return dot<0?"":name.substring(dot+1).toLowerCase(Locale.ROOT);}
    static boolean supported(String name){return java.util.Arrays.asList("stl","obj","3mf","dxf","scad","step","stp","dwg").contains(extension(name));}
    static boolean needsEngine(String name){return java.util.Arrays.asList("scad","step","stp","dwg").contains(extension(name));}
    static StlParser.Mesh read(File file,String name)throws IOException {
        if(file.length()>StlParser.MAX_BYTES)throw new IOException("Please choose a model smaller than 64 MB.");
        switch(extension(name)) {
            case "obj":return ObjParser.read(file);
            case "3mf":return ThreeMfParser.read(file);
            case "dxf":return DxfParser.read(file);
            case "stl":return StlParser.read(file);
            default:throw new IOException("Choose an STL, OBJ, 3MF, DXF, SCAD, STEP/STP, or DWG file.");
        }
    }
}

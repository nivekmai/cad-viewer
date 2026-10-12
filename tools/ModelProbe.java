package com.nivek.stlviewer;

import java.io.File;

/** Exercises the exact Android-independent parsers against converted integration fixtures. */
public final class ModelProbe {
    public static void main(String[] paths) throws Exception {
        boolean failed=false;
        for(String path:paths) {
            File file=new File(path);
            try {
                StlParser.Mesh mesh=ModelParser.read(file,file.getName());
                if(mesh.triangles+mesh.segments==0)throw new AssertionError("No geometry");
                System.out.println(file.getName()+": "+mesh.triangles+" triangles, "+mesh.segments+" segments, "+mesh.width+" x "+mesh.depth+" x "+mesh.height+" "+mesh.units+"; "+mesh.notice);
            }catch(Exception error){failed=true;System.err.println(file.getName()+": "+error);}
        }
        if(failed)throw new AssertionError("A converted model failed to load.");
    }
}

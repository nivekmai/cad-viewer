package com.nivek.stlviewer;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

final class ObjParser {
    static StlParser.Mesh read(File file) throws IOException {
        Geometry g=new Geometry(); Geometry.Floats vertices=new Geometry.Floats();
        try(BufferedReader reader=new BufferedReader(new InputStreamReader(new FileInputStream(file),StandardCharsets.UTF_8))) {
            String line;
            while((line=Geometry.readLine(reader))!=null) {
                g.check();
                while(line.endsWith("\\")) { String next=Geometry.readLine(reader); if(next==null)throw new IOException("Incomplete OBJ continuation."); line=line.substring(0,line.length()-1)+" "+next; if(line.length()>65536)throw new IOException("OBJ face too large."); }
                int comment=line.indexOf('#'); if(comment>=0)line=line.substring(0,comment).trim();
                if(line.isEmpty())continue;
                String[] w=line.split("\\s+");
                switch(w[0]) {
                    case "v":
                        if(w.length<4)throw new IOException("Incomplete OBJ vertex.");
                        double weight=w.length==5?Geometry.number(w[4]):1;
                        if(weight==0)throw new IOException("Invalid OBJ vertex weight.");
                        for(int i=1;i<=3;i++)vertices.add(Geometry.number(w[i])/weight);
                        break;
                    case "f":
                        List<double[]> face=new ArrayList<>();
                        for(int i=1;i<w.length;i++)face.add(vertices.point(index(w[i],vertices.size/3)));
                        g.polygon(face); break;
                    case "l":
                        for(int i=2;i<w.length;i++)g.line(vertices.point(index(w[i-1],vertices.size/3)),vertices.point(index(w[i],vertices.size/3)));
                        break;
                    case "mtllib": case "usemtl": g.skipped.add("OBJ materials/textures"); break;
                    case "vt": case "vn": case "o": case "g": case "s": break;
                    default: g.skipped.add("OBJ " + w[0]);
                }
            }
        }
        return g.mesh();
    }
    private static int index(String reference,int count)throws IOException {
        int slash=reference.indexOf('/'); int n=Geometry.integer(slash<0?reference:reference.substring(0,slash));
        if(n==0)throw new IOException("OBJ indices cannot be zero.");
        return n<0?count+n:n-1;
    }
}

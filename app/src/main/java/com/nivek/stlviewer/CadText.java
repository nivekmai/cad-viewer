package com.nivek.stlviewer;

import java.io.*;
import java.util.*;

/** Portable CAD annotation layout, using the bundled DejaVu-derived outline font. */
final class CadText {
    static final class Glyph {float advance;float[] edges;}
    private static Map<Integer,Glyph> font;
    private static synchronized Map<Integer,Glyph> font()throws IOException {
        if(font!=null)return font;
        Map<Integer,Glyph> result=new HashMap<>();
        InputStream resource=CadText.class.getResourceAsStream("/cad-font.bin");
        if(resource==null)throw new IOException("The bundled CAD font is missing.");
        try(DataInputStream in=new DataInputStream(resource)) {
            int count=in.readInt();
            for(int i=0;i<count;i++) {int code=in.readInt();Glyph g=new Glyph();g.advance=in.readFloat();g.edges=new float[in.readInt()];for(int j=0;j<g.edges.length;j++)g.edges[j]=in.readFloat();result.put(code,g);}
        }
        font=result;return font;
    }
    static double width(String text)throws IOException {
        double width=0;Map<Integer,Glyph> glyphs=font();
        for(int code:text.codePoints().toArray())width+=glyphs.getOrDefault(code,glyphs.get((int)'?')).advance;
        return width;
    }
    static void draw(Geometry geometry,String text,double[] matrix)throws IOException {
        Map<Integer,Glyph> glyphs=font();double offset=0;
        for(int code:text.codePoints().toArray()) {
            Glyph g=glyphs.get(code);
            if(g==null){g=glyphs.get((int)'?');geometry.skipped.add("some text characters (shown as ?)");}
            for(int i=0;i<g.edges.length;i+=4)geometry.line(
                Geometry.transform(matrix,new double[]{offset+g.edges[i],g.edges[i+1],0}),
                Geometry.transform(matrix,new double[]{offset+g.edges[i+2],g.edges[i+3],0}));
            offset+=g.advance;
        }
    }
    static List<String> wrap(String text,double width)throws IOException {
        List<String> lines=new ArrayList<>();
        for(String paragraph:text.split("\n",-1)) {
            if(width<=0){lines.add(paragraph);continue;}
            StringBuilder line=new StringBuilder();double used=0;
            for(String word:paragraph.split("(?<= )")) {
                double size=width(word);
                if(used>0 && used+size>width){lines.add(line.toString().replaceAll("\\s+$", ""));line.setLength(0);used=0;}
                // Long words are split too, so the reference rectangle remains useful.
                for(int code:word.codePoints().toArray()) {
                    String letter=new String(Character.toChars(code));double advance=width(letter);
                    if(used>0 && used+advance>width){lines.add(line.toString());line.setLength(0);used=0;}
                    line.append(letter);used+=advance;
                }
            }
            lines.add(line.toString().replaceAll("\\s+$", ""));
        }
        return lines;
    }
    static String plain(String raw,boolean multiline) {
        StringBuilder result=new StringBuilder();
        for(int i=0;i<raw.length();i++) {
            char c=raw.charAt(i);
            if(c=='%' && i+2<raw.length() && raw.charAt(i+1)=='%') {
                char key=Character.toLowerCase(raw.charAt(i+2));i+=2;
                if(key=='d')result.append('°');else if(key=='p')result.append('±');else if(key=='c')result.append('Ø');
                else if(key=='%')result.append('%');else if("uok".indexOf(key)<0)result.append("%%").append(key);
                continue;
            }
            if(c=='\\' && i+1<raw.length()) {
                char key=raw.charAt(++i);
                if(key=='U' && i+5<raw.length() && raw.charAt(i+1)=='+') {
                    try{result.append((char)Integer.parseInt(raw.substring(i+2,i+6),16));i+=5;continue;}catch(NumberFormatException ignored){}
                }
                if(key=='\\'||key=='{'||key=='}'){result.append(key);continue;}
                if(multiline && (key=='P'||key=='N')){result.append('\n');continue;}
                if(multiline && key=='~'){result.append(' ');continue;}
                if(multiline && "LlOoKk".indexOf(key)>=0)continue;
                if(multiline && "ACcFfHhQqTtWwSp".indexOf(key)>=0) {
                    int end=raw.indexOf(';',i+1);
                    if(end>=0){if(key=='S')result.append(raw.substring(i+1,end).replace('^','/').replace('#','/'));i=end;continue;}
                }
                result.append('\\').append(key);continue;
            }
            if(multiline && (c=='{'||c=='}'))continue;
            result.append(c);
        }
        return result.toString();
    }
}

import java.awt.Font;
import java.awt.font.FontRenderContext;
import java.awt.geom.PathIterator;
import java.io.*;
import java.util.*;

/** Generates the bundled outline font; build-time only, no AWT dependency on Android. */
public class GenerateCadFont {
    public static void main(String[] args) throws Exception {
        Font font=Font.createFont(Font.TRUETYPE_FONT,new File(args[0])).deriveFont(1000f);
        FontRenderContext context=new FontRenderContext(null,true,true);
        double cap=font.createGlyphVector(context,"H").getVisualBounds().getHeight();
        SortedSet<Integer> codes=new TreeSet<>();
        for(int c=32;c<1024;c++)if(font.canDisplay(c))codes.add(c);
        for(int c:new int[]{0x2013,0x2014,0x2018,0x2019,0x201c,0x201d,0x2032,0x2033,0x2022,0x2026,0x2104,0x2126,0x2205,0x2260,0x2264,0x2265,0x2300,0x25a1})if(font.canDisplay(c))codes.add(c);
        try(DataOutputStream out=new DataOutputStream(new FileOutputStream(args[1]))) {
            out.writeInt(codes.size());
            for(int code:codes) {
                var glyph=font.createGlyphVector(context,new String(Character.toChars(code)));
                PathIterator it=glyph.getOutline().getPathIterator(null,cap*.012);
                List<Double> edges=new ArrayList<>();double[] p=new double[6];double x=0,y=0,sx=0,sy=0;
                while(!it.isDone()) {
                    int type=it.currentSegment(p);double nx=p[0]/cap,ny=-p[1]/cap;
                    if(type==PathIterator.SEG_CLOSE){nx=sx;ny=sy;}
                    if(type==PathIterator.SEG_MOVETO){sx=nx;sy=ny;}
                    else if(type==PathIterator.SEG_LINETO || type==PathIterator.SEG_CLOSE) {
                        if(x!=nx||y!=ny){edges.add(x);edges.add(y);edges.add(nx);edges.add(ny);}
                    }
                    x=nx;y=ny;it.next();
                }
                out.writeInt(code);out.writeFloat((float)(glyph.getGlyphMetrics(0).getAdvance()/cap));
                out.writeInt(edges.size());for(double v:edges)out.writeFloat((float)v);
            }
        }
    }
}

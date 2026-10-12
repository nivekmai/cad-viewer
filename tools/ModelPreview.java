package com.nivek.stlviewer;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;

/** Top-view preview of the same normalized geometry sent to Android OpenGL. */
public class ModelPreview {
    public static void main(String[] args)throws Exception {
        StlParser.Mesh mesh=ModelParser.read(new File(args[0]),args[0]);
        BufferedImage image=new BufferedImage(1800,1800,BufferedImage.TYPE_INT_RGB);
        Graphics2D g=image.createGraphics();g.setColor(new Color(16,23,31));g.fillRect(0,0,1800,1800);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);
        g.setColor(new Color(112,230,201));
        for(int i=0;i<mesh.lines.limit();i+=6)g.drawLine((int)(900+mesh.lines.get(i)*800),(int)(900-mesh.lines.get(i+1)*800),(int)(900+mesh.lines.get(i+3)*800),(int)(900-mesh.lines.get(i+4)*800));
        g.dispose();ImageIO.write(image,"png",new File(args[1]));
    }
}

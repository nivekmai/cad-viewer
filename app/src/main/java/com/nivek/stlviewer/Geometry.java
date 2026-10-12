package com.nivek.stlviewer;

import java.io.*;
import java.util.*;

final class Geometry {
    static final class Floats {
        float[] values = new float[1024]; int size;
        void add(double value) throws IOException {
            if (!Double.isFinite(value) || Math.abs(value) > Float.MAX_VALUE) throw new IOException("Invalid coordinate in model.");
            if (size >= StlParser.MAX_TRIANGLES * 9) throw new IOException("This model exceeds the geometry limit (500,000 triangles/segments).");
            if (size == values.length) values = Arrays.copyOf(values, Math.min(StlParser.MAX_TRIANGLES * 9, size * 2));
            values[size++] = (float)value;
        }
        void point(double[] p) throws IOException { for (int i=0;i<3;i++) add(p[i]); }
        double[] point(int index) throws IOException {
            if (index < 0 || index >= size/3) throw new IOException("A face refers to a missing vertex.");
            return new double[]{values[index*3], values[index*3+1], values[index*3+2]};
        }
    }
    final Floats triangles = new Floats(), lines = new Floats();
    final Set<String> skipped = new TreeSet<>();
    private double[] origin;
    private void point(Floats target,double[] p)throws IOException {
        // Survey drawings often use million-unit coordinates. Subtract in double
        // precision before storing floats so small letters and arrows retain detail.
        if(origin==null)origin=p.clone();
        for(int i=0;i<3;i++)target.add(p[i]-origin[i]);
    }
    void triangle(double[] a, double[] b, double[] c) throws IOException { check(); point(triangles,a); point(triangles,b); point(triangles,c); }
    void line(double[] a, double[] b) throws IOException { check(); point(lines,a); point(lines,b); }
    void check() throws IOException {
        if (Thread.currentThread().isInterrupted()) throw new InterruptedIOException();
        if (triangles.size/9 + lines.size/6 >= StlParser.MAX_TRIANGLES) throw new IOException("This model exceeds the geometry limit (500,000 triangles/segments).");
    }
    StlParser.Mesh mesh() throws IOException {
        StlParser.Mesh mesh = new StlParser.Mesh(triangles.values, triangles.size, lines.values, lines.size);
        if (!skipped.isEmpty()) mesh.notice = "Not displayed: " + String.join(", ", skipped) + ".";
        return mesh;
    }
    static double number(String value) throws IOException {
        try { double n = Double.parseDouble(value); if (Double.isFinite(n)) return n; }
        catch (NumberFormatException ignored) { }
        throw new IOException("Invalid number in model: " + value.substring(0, Math.min(value.length(), 40)));
    }
    static int integer(String value) throws IOException {
        try { return Integer.parseInt(value); } catch (NumberFormatException e) { throw new IOException("Invalid index in model."); }
    }
    static String readLine(BufferedReader reader) throws IOException {
        String line=readRawLine(reader);return line==null?null:line.trim();
    }
    static String readRawLine(BufferedReader reader) throws IOException {
        StringBuilder s = new StringBuilder(); int c;
        while ((c = reader.read()) != -1 && c != '\n') {
            if (s.length() == 65536) throw new IOException("A text record is too long.");
            s.append((char)c);
        }
        if (c == -1 && s.length() == 0) return null;
        if (s.length() > 0 && s.charAt(0) == '\ufeff') s.deleteCharAt(0);
        if(s.length()>0 && s.charAt(s.length()-1)=='\r')s.setLength(s.length()-1);
        return s.toString();
    }
    static double[] identity() { return new double[]{1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1}; }
    static double[] transform(double[] m, double[] p) {
        return new double[]{m[0]*p[0]+m[1]*p[1]+m[2]*p[2]+m[3], m[4]*p[0]+m[5]*p[1]+m[6]*p[2]+m[7], m[8]*p[0]+m[9]*p[1]+m[10]*p[2]+m[11]};
    }
    static double[] multiply(double[] a, double[] b) {
        double[] c = new double[16];
        for (int r=0;r<4;r++) for (int s=0;s<4;s++) for (int k=0;k<4;k++) c[r*4+s] += a[r*4+k]*b[k*4+s];
        return c;
    }
    // Ear clipping in the polygon's dominant plane, preserving concave OBJ faces.
    void polygon(List<double[]> input) throws IOException {
        List<double[]> p = new ArrayList<>(input);
        if (p.size()>3 && Arrays.equals(p.get(0),p.get(p.size()-1))) p.remove(p.size()-1);
        if (p.size()<3 || p.size()>4096) throw new IOException("Invalid or excessively complex polygon.");
        double[] normal = new double[3];
        for (int i=0;i<p.size();i++) {
            double[] a=p.get(i), b=p.get((i+1)%p.size());
            normal[0]+=(a[1]-b[1])*(a[2]+b[2]); normal[1]+=(a[2]-b[2])*(a[0]+b[0]); normal[2]+=(a[0]-b[0])*(a[1]+b[1]);
        }
        int drop=Math.abs(normal[0])>Math.abs(normal[1])?0:1;
        if(Math.abs(normal[2])>Math.abs(normal[drop]))drop=2;
        int x=(drop+1)%3,y=(drop+2)%3;
        double area=0, scale=0;
        double[] origin=p.get(0);
        for(int i=0;i<p.size();i++) { double[] a=p.get(i),b=p.get((i+1)%p.size()); area+=(a[x]-origin[x])*(b[y]-origin[y])-(b[x]-origin[x])*(a[y]-origin[y]); scale=Math.max(scale,Math.max(Math.abs(a[x]-origin[x]),Math.abs(a[y]-origin[y]))); }
        double sign=area<0?-1:1, epsilon=scale*scale*1e-12;
        if (Math.abs(area)<=epsilon) throw new IOException("Degenerate polygon in model.");
        while(p.size()>3) {
            check(); boolean found=false;
            for(int i=0;i<p.size();i++) {
                double[] a=p.get((i+p.size()-1)%p.size()), b=p.get(i), c=p.get((i+1)%p.size());
                double turn=cross(a,b,c,x,y)*sign;
                if (Math.abs(turn)<=epsilon) { p.remove(i); found=true; break; }
                if(turn<0)continue;
                boolean inside=false;
                for(double[] q:p) if(q!=a && q!=b && q!=c && cross(a,b,q,x,y)*sign>=-epsilon && cross(b,c,q,x,y)*sign>=-epsilon && cross(c,a,q,x,y)*sign>=-epsilon) {inside=true;break;}
                if(!inside) {triangle(a,b,c);p.remove(i);found=true;break;}
            }
            if(!found)throw new IOException("A polygon is self-intersecting or cannot be triangulated.");
        }
        triangle(p.get(0),p.get(1),p.get(2));
    }
    private static double cross(double[] a,double[] b,double[] c,int x,int y) {return (b[x]-a[x])*(c[y]-a[y])-(b[y]-a[y])*(c[x]-a[x]);}
}

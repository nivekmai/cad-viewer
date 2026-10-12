package com.nivek.stlviewer;

import java.io.*;
import java.nio.*;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

/** Bounded parser. Binary format is detected by size, not the ambiguous 'solid' prefix. */
public final class StlParser {
    public static final int MAX_TRIANGLES = 500_000;
    public static final long MAX_BYTES = 64L * 1024 * 1024;

    public static final class Mesh {
        public final FloatBuffer data;
        public final FloatBuffer lines;
        public final int triangles;
        public final int segments;
        public String units = "units";
        public String notice = "";
        public final double width, depth, height;
        Mesh(float[] points, int count) throws IOException {
            this(points, count, new float[0], 0);
        }
        Mesh(float[] points, int count, float[] edges, int edgeCount) throws IOException {
            if (count + edgeCount == 0 || count % 9 != 0 || edgeCount % 6 != 0) throw new IOException("No viewable geometry in this file.");
            double[] min = {Double.POSITIVE_INFINITY, Double.POSITIVE_INFINITY, Double.POSITIVE_INFINITY};
            double[] max = {Double.NEGATIVE_INFINITY, Double.NEGATIVE_INFINITY, Double.NEGATIVE_INFINITY};
            for (int kind = 0; kind < 2; kind++) {
                float[] values = kind == 0 ? points : edges;
                int length = kind == 0 ? count : edgeCount;
                for (int i = 0; i < length; i++) {
                    if (!Float.isFinite(values[i])) throw new IOException("The file contains invalid coordinates.");
                    min[i % 3] = Math.min(min[i % 3], values[i]);
                    max[i % 3] = Math.max(max[i % 3], values[i]);
                }
            }
            width = max[0] - min[0]; depth = max[1] - min[1]; height = max[2] - min[2];
            double span = Math.max(width, Math.max(depth, height));
            if (span == 0) throw new IOException("This file has no visible geometry.");
            for (int i = 0; i < count; i++)
                points[i] = (float) ((points[i] - (min[i % 3] + max[i % 3]) / 2) * 2 / span);
            triangles = count / 9;
            data = ByteBuffer.allocateDirect(count * 2 * Float.BYTES).order(ByteOrder.nativeOrder()).asFloatBuffer();
            for (int i = 0; i < count; i += 9) {
                double ux = points[i+3]-points[i], uy = points[i+4]-points[i+1], uz = points[i+5]-points[i+2];
                double vx = points[i+6]-points[i], vy = points[i+7]-points[i+1], vz = points[i+8]-points[i+2];
                double nx = uy*vz-uz*vy, ny = uz*vx-ux*vz, nz = ux*vy-uy*vx;
                double length = Math.sqrt(nx*nx+ny*ny+nz*nz);
                if (length == 0) { nx = 0; ny = 0; nz = 1; length = 1; }
                for (int v = 0; v < 3; v++) {
                    data.put(points[i+v*3]).put(points[i+v*3+1]).put(points[i+v*3+2]);
                    data.put((float)(nx/length)).put((float)(ny/length)).put((float)(nz/length));
                }
            }
            data.position(0);
            segments = edgeCount / 6;
            lines = ByteBuffer.allocateDirect(edgeCount * Float.BYTES).order(ByteOrder.nativeOrder()).asFloatBuffer();
            for (int i = 0; i < edgeCount; i++) lines.put((float)((edges[i] - (min[i%3]+max[i%3])/2) * 2/span));
            lines.position(0);
        }
    }

    public static Mesh read(File file) throws IOException {
        if (file.length() > MAX_BYTES) throw new IOException("Please choose an STL smaller than 64 MB.");
        try (BufferedInputStream input = new BufferedInputStream(new FileInputStream(file))) {
            input.mark(84);
            byte[] header = new byte[(int)Math.min(84, file.length())];
            new DataInputStream(input).readFully(header);
            input.reset();
            if (header.length == 84) {
                long triangles = Integer.toUnsignedLong(ByteBuffer.wrap(header).order(ByteOrder.LITTLE_ENDIAN).getInt(80));
                if (84 + triangles * 50 == file.length()) return binary(input, triangles);
            }
            return ascii(input);
        }
    }

    private static Mesh binary(InputStream input, long triangles) throws IOException {
        if (triangles > MAX_TRIANGLES) throw new IOException("Please choose an STL with at most 500,000 triangles.");
        new DataInputStream(input).readFully(new byte[84]);
        float[] points = new float[(int)triangles * 9];
        byte[] record = new byte[50];
        DataInputStream stream = new DataInputStream(input);
        ByteBuffer buffer = ByteBuffer.wrap(record).order(ByteOrder.LITTLE_ENDIAN);
        for (int i = 0; i < triangles; i++) {
            if (Thread.currentThread().isInterrupted()) throw new InterruptedIOException();
            stream.readFully(record);
            for (int j = 0; j < 9; j++) points[i*9+j] = buffer.getFloat(12+j*4);
        }
        return new Mesh(points, points.length);
    }

    private static Mesh ascii(InputStream input) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.US_ASCII));
        float[] points = new float[9000];
        int count = 0, state = 0, vertices = 0;
        boolean solid = false, sawSolid = false;
        String line;
        while ((line = readLine(reader)) != null) {
            if (Thread.currentThread().isInterrupted()) throw new InterruptedIOException();
            line = line.trim();
            if (line.isEmpty()) continue;
            String[] words = line.split("\\s+");
            String tag = words[0];
            if (tag.equals("solid") && state == 0 && !solid) { solid = true; sawSolid = true; }
            else if (tag.equals("endsolid") && state == 0 && solid) solid = false;
            else if (tag.equals("facet") && words.length == 5 && words[1].equals("normal") && state == 0 && solid) { state = 1; vertices = 0; }
            else if (tag.equals("outer") && words.length == 2 && words[1].equals("loop") && state == 1) state = 2;
            else if (tag.equals("vertex") && words.length == 4 && state == 2 && vertices < 3) {
                if (count >= MAX_TRIANGLES * 9) throw new IOException("Please choose an STL with at most 500,000 triangles.");
                if (count + 3 > points.length) points = Arrays.copyOf(points, Math.min(MAX_TRIANGLES * 9, points.length * 2));
                try { for (int j = 1; j <= 3; j++) points[count++] = Float.parseFloat(words[j]); }
                catch (NumberFormatException e) { throw new IOException("The STL contains an invalid vertex."); }
                vertices++;
            }
            else if (tag.equals("endloop") && state == 2 && vertices == 3) state = 3;
            else if (tag.equals("endfacet") && state == 3) state = 0;
            else throw new IOException("This file is not a valid binary or text STL.");
        }
        if (!sawSolid || solid || state != 0) throw new IOException("This STL is incomplete or damaged.");
        return new Mesh(points, count);
    }

    private static String readLine(BufferedReader reader) throws IOException {
        StringBuilder line = new StringBuilder();
        int c;
        while ((c = reader.read()) != -1 && c != '\n') {
            if (line.length() >= 4096) throw new IOException("This STL contains an invalid text record.");
            line.append((char)c);
        }
        return c == -1 && line.length() == 0 ? null : line.toString();
    }
}

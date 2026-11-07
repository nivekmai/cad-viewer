package com.nivek.stlviewer;

import org.junit.Test;
import java.io.*;
import java.nio.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import static org.junit.Assert.*;

public class StlParserTest {
    private final String triangle = "solid test\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 2 0 0\nvertex 0 2 0\nendloop\nendfacet\nendsolid test\n";
    private StlParser.Mesh parse(byte[] bytes) throws IOException {
        File file = File.createTempFile("parser-test", ".stl");
        try { Files.write(file.toPath(), bytes); return StlParser.read(file); }
        finally { file.delete(); }
    }
    private StlParser.Mesh parse(String text) throws IOException { return parse(text.getBytes(StandardCharsets.US_ASCII)); }
    private byte[] binary() {
        ByteBuffer b = ByteBuffer.allocate(134).order(ByteOrder.LITTLE_ENDIAN);
        b.put("solid binary header".getBytes(StandardCharsets.US_ASCII));
        b.position(80); b.putInt(1); b.position(96);
        for (float p : new float[]{0,0,0,2,0,0,0,2,0}) b.putFloat(p);
        return b.array();
    }
    @Test public void readsAsciiAndCentersGeometry() throws Exception {
        StlParser.Mesh mesh = parse(triangle);
        assertEquals(1, mesh.triangles); assertEquals(2, mesh.width, 0); assertEquals(2, mesh.depth, 0);
        assertEquals(-1, mesh.data.get(0), 0); assertEquals(-1, mesh.data.get(1), 0);
        assertEquals(1, mesh.data.get(5), 0); assertEquals(1, mesh.data.get(6), 0);
    }
    @Test public void binaryHeaderMayStartWithSolid() throws Exception {
        StlParser.Mesh a = parse(triangle), b = parse(binary());
        assertEquals(a.data, b.data);
    }
    @Test public void supportsMultipleAsciiSolidsAndWhitespace() throws Exception {
        assertEquals(2, parse("\n" + triangle.replace(" ", "\t") + triangle).triangles);
    }
    @Test(expected = IOException.class) public void rejectsTruncatedBinary() throws Exception {
        parse(java.util.Arrays.copyOf(binary(), 132));
    }
    @Test(expected = IOException.class) public void rejectsMissingVertex() throws Exception {
        parse(triangle.replace("vertex 0 2 0\n", ""));
    }
    @Test(expected = IOException.class) public void rejectsUnfinishedSolid() throws Exception {
        parse(triangle.replace("endsolid test\n", ""));
    }
    @Test(expected = IOException.class) public void rejectsNonFiniteCoordinates() throws Exception {
        parse(triangle.replace("vertex 2 0 0", "vertex NaN 0 0"));
    }
    @Test(expected = IOException.class) public void rejectsEmptyModel() throws Exception { parse("solid empty\nendsolid empty"); }
    @Test(expected = IOException.class) public void rejectsNonStl() throws Exception { parse("<html>not an STL</html>"); }
    @Test(expected = IOException.class) public void rejectsExcessivelyLongTextRecord() throws Exception {
        parse("solid " + "x".repeat(5000) + "\nendsolid");
    }
    @Test(expected = IOException.class) public void rejectsZeroSizeGeometry() throws Exception {
        parse(triangle.replace("2", "0"));
    }
    @Test public void normalizesExtremeFiniteCoordinatesWithoutOverflow() throws Exception {
        StlParser.Mesh mesh = parse(triangle.replace("vertex 0 0 0", "vertex -3e38 0 0").replace("vertex 2 0 0", "vertex 3e38 0 0"));
        for (int i = 0; i < mesh.data.limit(); i++) assertTrue(Float.isFinite(mesh.data.get(i)));
    }
    @Test public void acceptsValidFileLargerThanOldSizeCutoff() throws Exception {
        File file = File.createTempFile("parser-large", ".stl");
        try {
            try (OutputStream out = new BufferedOutputStream(new FileOutputStream(file))) {
                out.write(triangle.getBytes(StandardCharsets.US_ASCII));
                byte[] padding = (" ".repeat(1023) + "\n").getBytes(StandardCharsets.US_ASCII);
                for (int i=0; i<65*1024; i++) out.write(padding);
            }
            assertTrue(file.length() > 64L*1024*1024);
            assertEquals(1, ModelParser.read(file, "large.stl").triangles);
        } finally { file.delete(); }
    }
    @Test public void acceptsBinaryStlAboveFormerTriangleLimit() throws Exception {
        File file = File.createTempFile("parser-count", ".stl");
        int count = 500_001;
        try {
            byte[] one = binary();
            byte[] header = java.util.Arrays.copyOf(one, 84);
            ByteBuffer.wrap(header).order(ByteOrder.LITTLE_ENDIAN).putInt(80, count);
            try (OutputStream out = new BufferedOutputStream(new FileOutputStream(file))) {
                out.write(header);
                for (int i=0;i<count;i++) out.write(one,84,50);
            }
            StlParser.Mesh mesh = StlParser.read(file);
            assertEquals(count, mesh.triangles);
            assertEquals(count*18, mesh.data.limit());
        } finally { file.delete(); }
    }
    @Test public void sharedGeometryGrowsPastFormerTriangleLimit() throws Exception {
        Geometry geometry = new Geometry();
        double[] a={0,0,0}, b={1,0,0}, c={0,1,0};
        for(int i=0;i<500_001;i++) geometry.triangle(a,b,c);
        assertEquals(500_001, geometry.mesh().triangles);
    }
}

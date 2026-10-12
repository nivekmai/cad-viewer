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
    @Test(expected = IOException.class) public void rejectsOversizedFileBeforeAllocation() throws Exception {
        File file = File.createTempFile("parser-limit", ".stl");
        try {
            try (RandomAccessFile out = new RandomAccessFile(file, "rw")) { out.setLength(StlParser.MAX_BYTES + 1); }
            StlParser.read(file);
        } finally { file.delete(); }
    }
    @Test(expected = IOException.class) public void rejectsExcessiveTriangleCountBeforeAllocation() throws Exception {
        File file = File.createTempFile("parser-count", ".stl");
        try {
            try (RandomAccessFile out = new RandomAccessFile(file, "rw")) {
                out.setLength(84L + (StlParser.MAX_TRIANGLES + 1L) * 50);
                out.seek(80); out.write(ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(StlParser.MAX_TRIANGLES + 1).array());
            }
            StlParser.read(file);
        } finally { file.delete(); }
    }
}

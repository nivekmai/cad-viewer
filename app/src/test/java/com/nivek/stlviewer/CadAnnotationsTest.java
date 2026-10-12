package com.nivek.stlviewer;

import org.junit.Test;
import java.io.*;
import java.nio.file.Files;
import java.util.*;
import static org.junit.Assert.*;

public class CadAnnotationsTest {
    private StlParser.Mesh read(String blocks,String entities)throws IOException {
        File file=File.createTempFile("cad-annotations", ".dxf");
        try {
            Files.writeString(file.toPath(),"0\nSECTION\n2\nBLOCKS\n"+blocks+"0\nENDSEC\n0\nSECTION\n2\nENTITIES\n"+entities+"0\nENDSEC\n0\nEOF\n");
            return ModelParser.read(file,"drawing.dxf");
        } finally {file.delete();}
    }
    private String text(String extra){return "0\nTEXT\n1\nTEST 123\n40\n2\n"+extra;}
    private String block(String name,String contents){return "0\nBLOCK\n2\n"+name+"\n"+contents+"0\nENDBLK\n";}
    @Test public void textOnlyDrawingHasReadableGeometry()throws Exception {
        StlParser.Mesh mesh=read("",text(""));assertTrue(mesh.segments>50);assertTrue(mesh.width>mesh.depth);assertTrue(mesh.notice.contains("substitute"));
    }
    @Test public void textRotationAndHeightAreApplied()throws Exception {
        StlParser.Mesh a=read("",text("")),b=read("",text("50\n90\n"));
        assertEquals(a.width,b.depth,1e-5);assertEquals(a.depth,b.width,1e-5);
        StlParser.Mesh c=read("",text("").replace("40\n2","40\n4"));assertEquals(a.width*2,c.width,1e-5);
    }
    @Test public void surveyCoordinatesRetainSmallLetterDetails()throws Exception {
        StlParser.Mesh a=read("",text("")),b=read("",text("10\n6103365.5\n20\n1949171.8\n"));
        assertEquals(a.width,b.width,1e-5);assertEquals(a.depth,b.depth,1e-5);
        for(int i=0;i<a.lines.limit();i++)assertEquals(a.lines.get(i),b.lines.get(i),1e-5);
    }
    @Test public void textNestedInBlockUsesInstanceTransforms()throws Exception {
        String b=block("label",text(""));
        StlParser.Mesh a=read(b,"0\nINSERT\n2\nlabel\n"),c=read(b,"0\nINSERT\n2\nlabel\n41\n2\n42\n2\n50\n90\n");
        assertEquals(a.width*2,c.depth,1e-5);assertEquals(a.depth*2,c.width,1e-5);
    }
    @Test public void invisibleAttributesAndNonconstantDefinitionsAreNotDrawn()throws Exception {
        StlParser.Mesh a=read("",text(""));
        String attributes="0\nATTRIB\n1\nHIDDEN\n70\n1\n40\n100\n0\nATTDEF\n1\nDEFAULT\n70\n0\n40\n100\n";
        StlParser.Mesh b=read("",text("")+attributes);assertEquals(a.segments,b.segments);assertEquals(a.width,b.width,0);
        StlParser.Mesh c=read("",text("")+"0\nATTRIB\n1\nVISIBLE\n40\n1\n");assertTrue(c.segments>a.segments);
        StlParser.Mesh d=read("", "0\nATTDEF\n1\nCONSTANT\n70\n2\n40\n1\n");assertTrue(d.segments>0);
    }
    @Test public void mtextChunksAndParagraphs()throws Exception {
        String m="0\nMTEXT\n3\nFirst \\U+00B0\n1\nline\\PSecond\\PThird\n40\n1\n71\n1\n";
        StlParser.Mesh mesh=read("",m);assertTrue(mesh.depth>3);assertTrue(mesh.segments>100);
    }
    @Test public void mtextWidthWrapsLongNotes()throws Exception {
        String m="0\nMTEXT\n1\nThis is a long note that needs several lines\n40\n1\n";
        StlParser.Mesh a=read("",m),b=read("",m+"41\n5\n");assertTrue(b.depth>a.depth*3);assertTrue(b.width<6);
    }
    @Test public void mtextDirectionAndRadianRotationAgree()throws Exception {
        String m="0\nMTEXT\n1\nTEST\n40\n1\n";
        StlParser.Mesh a=read("",m+"11\n0\n21\n1\n31\n0\n"),b=read("",m+"50\n1.5707963267948966\n");
        assertEquals(a.width,b.width,1e-5);assertEquals(a.depth,b.depth,1e-5);
        StlParser.Mesh c=read("",m+"50\n0\n11\n0\n21\n1\n31\n0\n");assertEquals(a.depth,c.depth,1e-5);
    }
    @Test public void mtextWorldPositionNotRotatedByExtrusion()throws Exception {
        StlParser.Mesh a=read("","0\nMTEXT\n1\nTEST\n40\n1\n10\n10\n20\n20\n30\n30\n210\n0\n220\n1\n230\n0\n11\n1\n21\n0\n31\n0\n");
        assertEquals(0,a.depth,1e-6);assertTrue(a.height>0);
    }
    @Test public void escapesAndFractionsRemainReadable() {
        assertEquals("Ø10 ±2°",CadText.plain("%%c10 %%p2%%d",false));
        assertEquals("Area\n1/2 m²",CadText.plain("{\\fArial;Area}\\P\\S1#2; m\\U+00B2",true));
        assertEquals("{a}\\b",CadText.plain("\\{a\\}\\\\b",true));
    }
    @Test public void savedDimensionPictureRendersLinesArrowsAndLabelOnce()throws Exception {
        String picture="0\nLINE\n10\n0\n11\n10\n0\nSOLID\n10\n0\n11\n1\n21\n0.5\n12\n1\n22\n-0.5\n13\n1\n23\n-0.5\n"+text("10\n3\n20\n1\n");
        StlParser.Mesh direct=read("",picture);
        for(int kind=0;kind<=6;kind++) {
            StlParser.Mesh dim=read(block("*D1",picture),"0\nDIMENSION\n2\n*D1\n70\n"+(32+kind)+"\n10\n99999\n20\n99999\n");
            assertEquals(direct.segments,dim.segments);assertEquals(direct.triangles,dim.triangles);assertEquals(direct.width,dim.width,1e-6);
            assertFalse(dim.notice.contains("DXF DIMENSION"));
        }
    }
    @Test public void dimensionWithoutBlockReportsOmission()throws Exception {
        StlParser.Mesh mesh=read("",text("")+"0\nDIMENSION\n2\nmissing\n");assertTrue(mesh.notice.contains("without saved drawing blocks"));
    }
    @Test(expected=IOException.class) public void recursiveDimensionBlockIsRejected()throws Exception {
        read(block("*D1","0\nDIMENSION\n2\n*D1\n"),"0\nDIMENSION\n2\n*D1\n");
    }
    @Test public void unsupportedUnicodeIsVisibleAndReported()throws Exception {
        StlParser.Mesh mesh=read("","0\nTEXT\n1\nTEST 中文\n40\n1\n");assertTrue(mesh.notice.contains("shown as ?"));
    }
}

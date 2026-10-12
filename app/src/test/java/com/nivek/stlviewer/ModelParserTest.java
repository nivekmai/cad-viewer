package com.nivek.stlviewer;

import org.junit.Test;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import java.util.zip.*;
import static org.junit.Assert.*;

public class ModelParserTest {
    @Test public void dxfIgnoresUnusedMaterialMetadataWithRawNewlines()throws Exception {
        String metadata="0\nSECTION\n2\nOBJECTS\n0\nMATERIAL\n300\nmaterial string\nraw continuation\nmore text\n0\nENDSEC\n";
        String drawing="0\nSECTION\n2\nENTITIES\n0\nLINE\n10\n0\n20\n0\n11\n3\n21\n4\n0\nENDSEC\n";
        for(String content:List.of(metadata+drawing,drawing+metadata)) {
            StlParser.Mesh mesh=text(".dxf",content+"0\nEOF\n");
            assertEquals(1,mesh.segments);assertEquals(3,mesh.width,0);assertEquals(4,mesh.depth,0);
        }
    }
    @Test(expected=IOException.class) public void dxfRejectsUnterminatedUnusedSection()throws Exception {
        text(".dxf","0\nSECTION\n2\nOBJECTS\n300\nmetadata\n");
    }
    private StlParser.Mesh text(String suffix,String text)throws IOException {
        File file=File.createTempFile("model-test",suffix);
        try{Files.write(file.toPath(),text.getBytes(StandardCharsets.UTF_8));return ModelParser.read(file,"sample"+suffix);}finally{file.delete();}
    }
    @Test public void objNegativeIndicesAndQuads()throws Exception {
        StlParser.Mesh mesh=text(".obj","v 0 0 0\nv 2 0 0\nv 2 2 0\nv 0 2 0\nf -4/1/1 -3/2/1 -2/3/1 -1/4/1\n");
        assertEquals(2,mesh.triangles);assertEquals(2,mesh.width,0);
    }
    @Test public void objConcaveFacesPreserveArea()throws Exception {
        StlParser.Mesh mesh=text(".obj","v 0 0 0\nv 2 0 0\nv 2 2 0\nv 1 1 0\nv 0 2 0\nf 1 2 3 4 5\n");
        double area=0;for(int t=0;t<mesh.triangles;t++){int i=t*18;double ax=mesh.data.get(i),ay=mesh.data.get(i+1),bx=mesh.data.get(i+6),by=mesh.data.get(i+7),cx=mesh.data.get(i+12),cy=mesh.data.get(i+13);area+=Math.abs((bx-ax)*(cy-ay)-(by-ay)*(cx-ax))/2;}
        assertEquals(3,mesh.triangles);assertEquals(3,area,1e-6);
    }
    @Test public void objLineOnlyGeometry()throws Exception {
        StlParser.Mesh mesh=text(".OBJ","v 0 0 0\nv 3 4 0\nl 1 2\n");assertEquals(1,mesh.segments);assertEquals(0,mesh.triangles);assertEquals(4,mesh.depth,0);
    }
    @Test public void objContinuationAndMaterialNotice()throws Exception {
        StlParser.Mesh mesh=text(".obj","mtllib colors.mtl\nv 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 \\\n 3 # face\n");assertEquals(1,mesh.triangles);assertTrue(mesh.notice.contains("materials"));
    }
    @Test(expected=IOException.class)public void objRejectsOutOfRangeIndex()throws Exception {text(".obj","v 0 0 0\nf 1 2 3\n");}
    @Test(expected=IOException.class)public void objRejectsZeroIndex()throws Exception {text(".obj","v 0 0 0\nv 1 0 0\nv 0 1 0\nf 0 2 3\n");}
    @Test(expected=IOException.class)public void objRejectsNonFinite()throws Exception {text(".obj","v NaN 0 0\n");}

    private static final String TRI="<object id='1'><mesh><vertices><vertex x='0' y='0' z='0'/><vertex x='1' y='0' z='0'/><vertex x='0' y='1' z='0'/></vertices><triangles><triangle v1='0' v2='1' v3='2'/></triangles></mesh></object>";
    private String model(String objects,String build){return "<model xmlns='http://schemas.microsoft.com/3dmanufacturing/core/2015/02' xmlns:p='http://schemas.microsoft.com/3dmanufacturing/production/2015/06' unit='millimeter'><resources>"+objects+"</resources><build>"+build+"</build></model>";}
    private StlParser.Mesh threeMf(Map<String,String> models)throws IOException {
        File file=File.createTempFile("model-test",".3mf");
        try {
            try(ZipOutputStream zip=new ZipOutputStream(new FileOutputStream(file))) {
                zip.putNextEntry(new ZipEntry("_rels/.rels"));zip.write("<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'><Relationship Id='r1' Type='http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel' Target='/3D/main.model'/></Relationships>".getBytes(StandardCharsets.UTF_8));zip.closeEntry();
                for(Map.Entry<String,String> e:models.entrySet()){zip.putNextEntry(new ZipEntry(e.getKey()));zip.write(e.getValue().getBytes(StandardCharsets.UTF_8));zip.closeEntry();}
            }
            return ModelParser.read(file,"model.3mf");
        }finally{file.delete();}
    }
    @Test public void threeMfUsesBuildInstancesAndTransforms()throws Exception {
        StlParser.Mesh mesh=threeMf(Map.of("3D/main.model",model(TRI,"<item objectid='1'/><item objectid='1' transform='1 0 0 0 1 0 0 0 1 10 0 0'/>")));
        assertEquals(2,mesh.triangles);assertEquals(11,mesh.width,0);assertEquals("millimeter",mesh.units);
    }
    @Test public void threeMfComposesComponentAndBuildTransforms()throws Exception {
        String objects=TRI+"<object id='2'><components><component objectid='1' transform='1 0 0 0 1 0 0 0 1 5 0 0'/></components></object>";
        StlParser.Mesh mesh=threeMf(Map.of("3D/main.model",model(objects,"<item objectid='1'/><item objectid='2' transform='2 0 0 0 2 0 0 0 2 3 0 0'/>")));
        assertEquals(15,mesh.width,0);assertEquals(2,mesh.depth,0);
    }
    @Test public void threeMfExternalPartAndUnits()throws Exception {
        StlParser.Mesh mesh=threeMf(Map.of("3D/main.model",model("<object id='2'><components><component objectid='1' p:path='/3D/Objects/part.model'/></components></object>","<item objectid='2'/>"),"3D/Objects/part.model",model(TRI,"").replace("unit='millimeter'","unit='inch'")));
        assertEquals(25.4,mesh.width,1e-5);
    }
    @Test public void threeMfDoesNotRenderUnusedResources()throws Exception {
        StlParser.Mesh mesh=threeMf(Map.of("3D/main.model",model(TRI+TRI.replace("id='1'","id='2'").replace("x='1'","x='999'"),"<item objectid='1'/>")));assertEquals(1,mesh.width,0);
    }
    @Test(expected=IOException.class)public void threeMfRejectsCycles()throws Exception {
        threeMf(Map.of("3D/main.model",model("<object id='1'><components><component objectid='1'/></components></object>","<item objectid='1'/>")));
    }
    @Test(expected=IOException.class)public void threeMfRejectsEntities()throws Exception {
        threeMf(Map.of("3D/main.model","<!DOCTYPE model [<!ENTITY boom 'xx'>]>"+model(TRI,"<item objectid='1'/>")));
    }
    @Test(expected=IOException.class)public void threeMfRejectsMissingVertex()throws Exception {
        threeMf(Map.of("3D/main.model",model(TRI.replace("v3='2'","v3='99'"),"<item objectid='1'/>")));
    }
    @Test(expected=IOException.class)public void threeMfRejectsUnknownRequiredExtension()throws Exception {
        threeMf(Map.of("3D/main.model",model(TRI,"<item objectid='1'/>").replace("<model ","<model requiredextensions='x' xmlns:x='urn:unsupported' ")));
    }

    private String dxf(String entities){return "0\nSECTION\n2\nENTITIES\n"+entities+"0\nENDSEC\n0\nEOF\n";}
    @Test public void dxfLine()throws Exception {StlParser.Mesh m=text(".dxf",dxf("0\nLINE\n10\n0\n20\n0\n11\n10\n21\n5\n"));assertEquals(1,m.segments);assertEquals(10,m.width,0);assertEquals(5,m.depth,0);}
    @Test public void dxfClosedPolyline()throws Exception {StlParser.Mesh m=text(".dxf",dxf("0\nLWPOLYLINE\n70\n1\n10\n0\n20\n0\n10\n10\n20\n0\n10\n10\n20\n10\n"));assertEquals(3,m.segments);}
    @Test public void dxfBulgeProducesSemicircle()throws Exception {
        StlParser.Mesh m=text(".dxf",dxf("0\nLWPOLYLINE\n10\n0\n20\n0\n42\n1\n10\n10\n20\n0\n"));assertEquals(10,m.width,1e-5);assertEquals(5,m.depth,1e-5);assertTrue(m.segments>10);
    }
    @Test public void dxfCircleAndEllipse()throws Exception {
        StlParser.Mesh m=text(".dxf",dxf("0\nCIRCLE\n10\n0\n20\n0\n40\n5\n0\nELLIPSE\n10\n0\n20\n0\n11\n10\n21\n0\n40\n0.5\n"));assertEquals(20,m.width,1e-5);assertEquals(10,m.depth,1e-5);
    }
    @Test public void dxfFaceIsFilled()throws Exception {
        StlParser.Mesh m=text(".dxf",dxf("0\n3DFACE\n10\n0\n20\n0\n11\n1\n21\n0\n12\n1\n22\n1\n13\n0\n23\n1\n"));assertEquals(2,m.triangles);
    }
    @Test public void dxfInsertRespectsBlockBaseAndRotation()throws Exception {
        String blocks="0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n2\npart\n10\n2\n20\n0\n0\nLINE\n10\n2\n20\n0\n11\n5\n21\n0\n0\nENDBLK\n0\nENDSEC\n";
        StlParser.Mesh m=text(".dxf",blocks+dxf("0\nINSERT\n2\npart\n10\n10\n20\n10\n41\n2\n50\n90\n"));assertEquals(0,m.width,1e-6);assertEquals(6,m.depth,1e-6);
    }
    @Test public void dxfSplineUsesControlPointsAndKnots()throws Exception {
        StlParser.Mesh m=text(".dxf",dxf("0\nSPLINE\n71\n2\n40\n0\n40\n0\n40\n0\n40\n1\n40\n1\n40\n1\n10\n0\n20\n0\n10\n1\n20\n2\n10\n2\n20\n0\n"));assertEquals(2,m.width,1e-6);assertEquals(1,m.depth,1e-6);
    }
    @Test public void dxfUnsupportedAnnotationsReported()throws Exception {
        StlParser.Mesh m=text(".dxf",dxf("0\nLINE\n10\n0\n11\n1\n0\nHATCH\n"));assertTrue(m.notice.contains("HATCH"));
    }
    @Test(expected=IOException.class)public void dxfRejectsBinary()throws Exception {text(".dxf","AutoCAD Binary DXF\r\n\u001a\0");}
    @Test(expected=IOException.class)public void dxfRejectsInvalidGroups()throws Exception {text(".dxf","oops\nLINE\n");}
    @Test public void formatDetectionIsCaseInsensitive(){assertTrue(ModelParser.supported("part.SCAD"));assertTrue(ModelParser.supported("part.3MF"));assertFalse(ModelParser.supported("image.png"));}
    @Test public void cadFormatsAndAliasesUseLocalEngine(){
        for(String filename:new String[]{"part.STEP","assembly.stp","drawing.DWG"}){assertTrue(ModelParser.supported(filename));assertTrue(ModelParser.needsEngine(filename));}
        assertFalse(ModelParser.needsEngine("part.stl"));assertFalse(ModelParser.supported("file.pdf"));
    }
    @Test public void dxfPolyfacePointAndEdgeRecordsDoNotPreventPreview()throws Exception {
        StlParser.Mesh m=text(".dxf",dxf("0\nPOLYLINE\n70\n64\n0\nVERTEX\n70\n192\n10\n0\n20\n0\n0\nVERTEX\n70\n192\n10\n5\n20\n0\n0\nVERTEX\n70\n128\n71\n1\n0\nVERTEX\n70\n128\n71\n1\n72\n2\n0\nSEQEND\n"));
        assertEquals(1,m.segments);assertEquals(5,m.width,0);assertTrue(m.notice.contains("point-only"));
    }
    @Test public void dxfPolygonMeshIsTessellated()throws Exception {
        StlParser.Mesh m=text(".dxf",dxf("0\nPOLYLINE\n70\n16\n71\n2\n72\n2\n0\nVERTEX\n10\n0\n20\n0\n0\nVERTEX\n10\n0\n20\n2\n0\nVERTEX\n10\n3\n20\n0\n0\nVERTEX\n10\n3\n20\n2\n0\nSEQEND\n"));
        assertEquals(2,m.triangles);assertEquals(3,m.width,0);assertEquals(2,m.depth,0);
    }
    @Test public void readsRealDwgConvertedDrawing()throws Exception {
        File file=File.createTempFile("dwg-output",".dxf");
        try(InputStream input=getClass().getResourceAsStream("/dwg-sample-2018.dxf")) {
            assertNotNull(input);Files.copy(input,file.toPath(),java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            StlParser.Mesh mesh=ModelParser.read(file,"drawing.dxf");
            assertTrue(mesh.segments>187);assertFalse(mesh.notice.contains("DXF TEXT"));assertTrue(mesh.notice.contains("substitute"));assertEquals(270,mesh.width,1e-3);assertEquals(280,mesh.depth,1e-3);assertEquals("millimeter",mesh.units);
        }finally{file.delete();}
    }
    @Test public void handlesUtf8Bom()throws Exception {
        assertEquals(1,text(".obj","\ufeffv 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3\n").triangles);
    }
    @Test public void readsRealOpenScad2dOutput()throws Exception {
        File file=File.createTempFile("scad-output",".dxf");
        try(InputStream input=getClass().getResourceAsStream("/scad-2d.dxf")) {
            assertNotNull(input);Files.copy(input,file.toPath(),java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            StlParser.Mesh mesh=ModelParser.read(file,"result.dxf");
            assertEquals(28,mesh.segments);assertEquals(10,mesh.width,1e-5);assertEquals(0,mesh.height,0);assertTrue(mesh.notice.isEmpty());
        }finally{file.delete();}
    }
    @Test public void readsRealOpenScadBooleanOutput()throws Exception {
        File file=File.createTempFile("scad-output",".stl");
        try(InputStream input=getClass().getResourceAsStream("/scad-boolean.stl")) {
            assertNotNull(input);Files.copy(input,file.toPath(),java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            StlParser.Mesh mesh=ModelParser.read(file,"result.stl");
            assertEquals(112,mesh.triangles);assertEquals(10,mesh.height,1e-5);
        }finally{file.delete();}
    }
}

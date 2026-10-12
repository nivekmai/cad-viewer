package com.nivek.stlviewer;

import java.io.*;
import java.net.URI;
import java.util.*;
import java.util.zip.*;
import javax.xml.parsers.*;
import org.xml.sax.*;
import org.xml.sax.ext.DefaultHandler2;

/** Reads core meshes, build/component transforms, and production-extension part references. */
final class ThreeMfParser implements Closeable {
    private final ZipFile zip;
    private final Map<String,Part> parts=new HashMap<>();
    private final Geometry geometry=new Geometry();
    private long expanded;
    private int nodes;
    private static final class Object3d {
        Geometry.Floats vertices=new Geometry.Floats();
        List<int[]> faces=new ArrayList<>();
        List<Ref> components=new ArrayList<>();
    }
    private static final class Ref { String id,path; double[] matrix; }
    private static final class Part { Map<String,Object3d> objects=new HashMap<>(); List<Ref> build=new ArrayList<>(); String unit="millimeter"; }
    private ThreeMfParser(File file)throws IOException {
        zip=new ZipFile(file);
        Set<String> names=new HashSet<>(); Enumeration<? extends ZipEntry> entries=zip.entries();
        try {
            while(entries.hasMoreElements()) {
                String name=entries.nextElement().getName();
                if(!names.add(name) || names.size()>4096)throw new IOException("Invalid or overly complex 3MF archive.");
            }
        } catch(IOException e) {zip.close();throw e;}
    }
    static StlParser.Mesh read(File file)throws IOException {
        try(ThreeMfParser parser=new ThreeMfParser(file)) {return parser.read();}
    }
    @Override public void close()throws IOException {zip.close();}
    private StlParser.Mesh read()throws IOException {
        final String[] start={null};
        xml("_rels/.rels",new Handler(){
            @Override void element(String name,Attributes a)throws IOException {
                if(name.equals("Relationship") && value(a,"Type","").endsWith("/3dmodel")) {
                    if(value(a,"TargetMode","").equals("External"))throw new IOException("External 3MF models are not supported.");
                    start[0]=resolve("",required(a,"Target"));
                }
            }
        });
        if(start[0]==null)throw new IOException("The 3MF archive has no model relationship.");
        Part root=part(start[0]);
        if(root.build.isEmpty())throw new IOException("The 3MF build contains no objects.");
        for(Ref ref:root.build)visit(start[0],ref,Geometry.identity(),new HashSet<>(),0);
        StlParser.Mesh mesh=geometry.mesh(); mesh.units=root.unit;
        return mesh;
    }
    private Part part(String path)throws IOException {
        if(parts.containsKey(path))return parts.get(path);
        Part part=new Part(); parts.put(path,part);
        xml(path,new Handler(){
            Object3d current;
            @Override void element(String name,Attributes a)throws IOException {
                switch(name) {
                    case "model":
                        part.unit=value(a,"unit","millimeter"); unitScale(part.unit);
                        String extensions=value(a,"requiredextensions","");
                        for(String prefix:extensions.split("\\s+")) if(!prefix.isEmpty()) {
                            String ns=namespaces.get(prefix);
                            if(ns==null || !ns.contains("/production/") && !ns.contains("/material/"))
                                throw new IOException("This 3MF requires an unsupported extension: "+prefix);
                        }
                        break;
                    case "object":
                        current=new Object3d();
                        if(part.objects.put(required(a,"id"),current)!=null)throw new IOException("Duplicate 3MF object ID.");
                        break;
                    case "vertex":
                        if(current==null)throw new IOException("Invalid 3MF vertex.");
                        current.vertices.add(Geometry.number(required(a,"x")));current.vertices.add(Geometry.number(required(a,"y")));current.vertices.add(Geometry.number(required(a,"z")));break;
                    case "triangle":
                        if(current==null || current.faces.size()>=StlParser.MAX_TRIANGLES)throw new IOException("3MF mesh exceeds 500,000 triangles.");
                        current.faces.add(new int[]{Geometry.integer(required(a,"v1")),Geometry.integer(required(a,"v2")),Geometry.integer(required(a,"v3"))});break;
                    case "component":
                        if(current==null)throw new IOException("Invalid 3MF component.");
                        current.components.add(reference(a));break;
                    case "item":part.build.add(reference(a));break;
                    case "basematerials":case "colorgroup":case "texture2d":case "texture2dgroup":case "multiproperties":
                        geometry.skipped.add("3MF colors/materials/textures");break;
                }
            }
            @Override public void endElement(String uri,String local,String q){if(local.equals("object"))current=null;}
        });
        return part;
    }
    private void visit(String parentPath,Ref ref,double[] parent,Set<String> active,int depth)throws IOException {
        geometry.check();
        if(depth>64)throw new IOException("3MF components are nested too deeply.");
        String path=ref.path==null?parentPath:resolve(parentPath,ref.path);
        Part source=part(path); Object3d object=source.objects.get(ref.id);
        if(object==null)throw new IOException("A 3MF component refers to a missing object.");
        String key=path+"#"+ref.id;
        if(!active.add(key))throw new IOException("Circular 3MF component reference.");
        double[] matrix=Geometry.multiply(parent,ref.matrix);
        if(!path.equals(parentPath)) {
            double[] scale=Geometry.identity(); scale[0]=scale[5]=scale[10]=unitScale(source.unit)/unitScale(part(parentPath).unit);
            matrix=Geometry.multiply(matrix,scale);
        }
        double determinant=matrix[0]*(matrix[5]*matrix[10]-matrix[6]*matrix[9])-matrix[1]*(matrix[4]*matrix[10]-matrix[6]*matrix[8])+matrix[2]*(matrix[4]*matrix[9]-matrix[5]*matrix[8]);
        for(int[] face:object.faces) {
            double[] a=Geometry.transform(matrix,object.vertices.point(face[0])),b=Geometry.transform(matrix,object.vertices.point(face[1])),c=Geometry.transform(matrix,object.vertices.point(face[2]));
            geometry.triangle(a,determinant<0?c:b,determinant<0?b:c);
        }
        for(Ref child:object.components)visit(path,child,matrix,active,depth+1);
        active.remove(key);
    }
    private static Ref reference(Attributes a)throws IOException {
        Ref r=new Ref(); r.id=required(a,"objectid");r.path=value(a,"path",null);r.matrix=Geometry.identity();
        String transform=value(a,"transform",null);
        if(transform!=null) {
            String[] v=transform.trim().split("\\s+");if(v.length!=12)throw new IOException("Invalid 3MF transform.");
            for(int i=0;i<12;i++)r.matrix[(i%3)*4+i/3]=Geometry.number(v[i]);
        }
        return r;
    }
    private static double unitScale(String unit)throws IOException {
        switch(unit){case "micron":return .001;case "millimeter":return 1;case "centimeter":return 10;case "inch":return 25.4;case "foot":return 304.8;case "meter":return 1000;default:throw new IOException("Unknown 3MF unit: "+unit);}
    }
    private static String resolve(String source,String target)throws IOException {
        try {
            URI uri=URI.create("/"+source).resolve(target).normalize();
            if(uri.getScheme()!=null || uri.getAuthority()!=null || uri.getQuery()!=null || uri.getFragment()!=null || uri.getPath().contains(".."))throw new IllegalArgumentException();
            String path=uri.getPath();return path.startsWith("/")?path.substring(1):path;
        }catch(IllegalArgumentException e){throw new IOException("Invalid 3MF part path.");}
    }
    private static String value(Attributes a,String name,String fallback) {
        for(int i=0;i<a.getLength();i++)if(a.getLocalName(i).equals(name))return a.getValue(i);
        return fallback;
    }
    private static String required(Attributes a,String name)throws IOException {
        String value=value(a,name,null);if(value==null)throw new IOException("Missing 3MF attribute: "+name);return value;
    }
    private abstract class Handler extends DefaultHandler2 {
        final Map<String,String> namespaces=new HashMap<>();
        abstract void element(String name,Attributes a)throws IOException;
        @Override public void startPrefixMapping(String prefix,String uri){namespaces.put(prefix,uri);}
        @Override public void startElement(String uri,String local,String q,Attributes a)throws SAXException {
            try {if(++nodes>2_000_000)throw new IOException("3MF XML is too complex.");geometry.check();element(local,a);}catch(IOException e){throw new SAXException(e);}
        }
        @Override public void startDTD(String name,String publicId,String systemId)throws SAXException {throw new SAXException("DTDs are not allowed in 3MF files.");}
        @Override public InputSource resolveEntity(String publicId,String systemId)throws SAXException {throw new SAXException("External XML entities are not allowed.");}
    }
    private void xml(String path,Handler handler)throws IOException {
        ZipEntry entry=zip.getEntry(path);if(entry==null)throw new IOException("Missing 3MF part: "+path);
        if(entry.getSize()>StlParser.MAX_BYTES)throw new IOException("Expanded 3MF model is too large.");
        try(InputStream stream=new FilterInputStream(zip.getInputStream(entry)) {
            private void count(int n)throws IOException{if(n>0 && (expanded+=n)>StlParser.MAX_BYTES)throw new IOException("Expanded 3MF data exceeds 64 MB.");}
            @Override public int read()throws IOException{int n=in.read();if(n>=0)count(1);return n;}
            @Override public int read(byte[] b,int off,int len)throws IOException{int n=in.read(b,off,len);count(n);return n;}
        }) {
            SAXParserFactory factory=SAXParserFactory.newInstance();factory.setNamespaceAware(true);
            XMLReader reader=factory.newSAXParser().getXMLReader();
            reader.setContentHandler(handler);reader.setEntityResolver(handler);reader.setErrorHandler(handler);
            reader.setProperty("http://xml.org/sax/properties/lexical-handler",handler);
            reader.parse(new InputSource(stream));
        }catch(ParserConfigurationException|SAXException e){throw new IOException("Invalid 3MF: "+e.getMessage(),e);}
    }
}

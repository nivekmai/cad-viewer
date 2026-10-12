package com.nivek.stlviewer;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** ASCII DXF geometry and annotations, with explicit notices for omitted styling. */
final class DxfParser {
    private static final class Pair {int code;String value;Pair(int c,String v){code=c;value=v;}}
    private static final class Entity {
        String type;List<Pair> pairs=new ArrayList<>();
        Entity(String type){this.type=type;}
        String text(int code,String fallback){for(Pair p:pairs)if(p.code==code)return p.value;return fallback;}
        double n(int code,double fallback)throws IOException{return Geometry.number(text(code,Double.toString(fallback)));}
        int flags()throws IOException{return (int)n(70,0);}
        double[] point(int code)throws IOException{return new double[]{n(code,0),n(code+10,0),n(code+20,0)};}
    }
    private static final class Block {double[] base;List<Entity> entities=new ArrayList<>();}
    private final Map<String,Block> blocks=new HashMap<>();
    private final Geometry geometry=new Geometry();
    private String units="units";
    private boolean renderedText;
    static StlParser.Mesh read(File file)throws IOException{return new DxfParser().parse(file);}
    private StlParser.Mesh parse(File file)throws IOException {
        List<Entity> entities=new ArrayList<>();String section="";Entity current=null;Block block=null;int count=0;
        try(BufferedReader reader=new BufferedReader(new InputStreamReader(new FileInputStream(file),StandardCharsets.UTF_8))) {
            String line;
            while((line=Geometry.readLine(reader))!=null) {
                geometry.check();
                if(line.startsWith("AutoCAD Binary DXF"))throw new IOException("Binary DXF is not supported. Save the drawing as ASCII DXF.");
                String value=Geometry.readRawLine(reader);if(value==null)throw new IOException("Incomplete DXF group.");
                int code=Geometry.integer(line);
                if(code!=1 && code!=3)value=value.trim();
                if(++count>2_000_000)throw new IOException("DXF drawing is too complex.");
                if(code==9 && value.equals("$INSUNITS")) {
                    String unitCode=Geometry.readLine(reader),unitValue=Geometry.readLine(reader);
                    if(unitCode==null || unitValue==null)throw new IOException("Incomplete DXF header.");
                    int unit=Geometry.integer(unitValue);String[] names={"units","inch","foot","mile","millimeter","centimeter","meter","kilometer","microinch","mil","yard","angstrom","nanometer","micron","decimeter","decameter","hectometer","gigameter","astronomical unit","light year","parsec"};
                    if(unit>=0 && unit<names.length)units=names[unit];continue;
                }
                if(code==0) {
                    if(current!=null) {
                        if(section.equals("BLOCKS")) {
                            if(current.type.equals("BLOCK")) {block=new Block();block.base=current.point(10);blocks.put(current.text(2,""),block);}
                            else if(current.type.equals("ENDBLK"))block=null;
                            else if(block!=null)block.entities.add(current);
                        } else if(section.equals("ENTITIES"))entities.add(current);
                    }
                    current=null;
                    if(value.equals("SECTION")) {
                        String nextCode=Geometry.readLine(reader),nextValue=Geometry.readLine(reader);
                        if(!"2".equals(nextCode) || nextValue==null)throw new IOException("Invalid DXF section.");
                        section=nextValue;
                        // The viewer only consumes these sections. In particular, DWG
                        // material/proxy metadata can contain raw newlines in OBJECTS.
                        // Do not interpret those unused strings as numeric group codes.
                        if(!section.equals("HEADER") && !section.equals("BLOCKS") && !section.equals("ENTITIES")) {
                            String previous="",ignored;boolean ended=false;
                            while((ignored=Geometry.readLine(reader))!=null) {
                                geometry.check();
                                if(++count>2_000_000)throw new IOException("DXF drawing is too complex.");
                                if(previous.equals("0") && ignored.equals("ENDSEC")){ended=true;break;}
                                previous=ignored;
                            }
                            if(!ended)throw new IOException("Incomplete DXF section.");
                            section="";
                        }
                    } else if(value.equals("ENDSEC")){section="";block=null;}
                    else if(value.equals("EOF"))break;
                    else current=new Entity(value);
                } else if(current!=null)current.pairs.add(new Pair(code,value));
            }
        }
        draw(entities,Geometry.identity(),new HashSet<>(),0);
        if(geometry.triangles.size+geometry.lines.size==0)throw new IOException("No supported DXF geometry found. Unsupported entities: "+String.join(", ",geometry.skipped));
        StlParser.Mesh mesh=geometry.mesh();mesh.units=units;
        if(renderedText)mesh.notice+=(mesh.notice.isEmpty()?"":"\n")+"Text uses a substitute outline font. Original fonts, rich text styling, and exact text spacing may differ.";
        return mesh;
    }
    private void draw(List<Entity> entities,double[] matrix,Set<String> active,int depth)throws IOException {
        if(depth>32)throw new IOException("DXF blocks are nested too deeply.");
        for(int i=0;i<entities.size();i++) {
            geometry.check();Entity e=entities.get(i);
            if(e.n(67,0)!=0 || e.n(60,0)==1)continue; // Model space only; honor entity visibility.
            double[] ocs=Geometry.multiply(matrix,ocs(e));
            switch(e.type) {
                case "TEXT":case "MTEXT":case "ATTRIB":case "ATTDEF":
                    if((e.type.equals("ATTRIB")||e.type.equals("ATTDEF")) && ((e.flags()&1)!=0 || e.type.equals("ATTDEF")&&(e.flags()&2)==0))break;
                    text(e,matrix);break;
                case "DIMENSION": {
                    // The anonymous block is the saved dimension picture, including
                    // arrows, extension lines, formatted measurement and overrides.
                    String name=e.text(2,"");Block block=blocks.get(name);
                    if(block==null){geometry.skipped.add("dimensions without saved drawing blocks");break;}
                    if(!active.add(name))throw new IOException("Circular DXF dimension block reference.");
                    double[] offset=e.point(12);
                    offset=Geometry.transform(ocs(e),offset);
                    double[] local=translate(offset[0]-block.base[0],offset[1]-block.base[1],offset[2]-block.base[2]);
                    draw(block.entities,Geometry.multiply(matrix,local),active,depth+1);
                    active.remove(name);break;
                }
                case "LEADER": {
                    List<double[]> points=new ArrayList<>();double[] point=null;
                    for(Pair p:e.pairs) {
                        if(p.code==10){point=new double[]{Geometry.number(p.value),0,0};points.add(point);}
                        else if(p.code==20 && point!=null)point[1]=Geometry.number(p.value);
                        else if(p.code==30 && point!=null)point[2]=Geometry.number(p.value);
                    }
                    for(int j=1;j<points.size();j++)line(matrix,points.get(j-1),points.get(j));
                    if(e.n(71,0)!=0)geometry.skipped.add("leader arrowheads");
                    if(e.n(72,0)!=0)geometry.skipped.add("leader curve smoothing");
                    break;
                }
                case "LINE":line(matrix,e.point(10),e.point(11));break;
                case "LWPOLYLINE":polyline(e,ocs);break;
                case "POLYLINE": {
                    List<Entity> vertices=new ArrayList<>();
                    while(i+1<entities.size() && entities.get(i+1).type.equals("VERTEX"))vertices.add(entities.get(++i));
                    if((e.flags()&64)!=0) {
                        List<double[]> positions=new ArrayList<>();
                        for(Entity v:vertices)if(!faceRecord(v))positions.add(v.point(10));
                        for(Entity v:vertices)if(faceRecord(v)) {
                            List<double[]> face=new ArrayList<>();
                            for(int c=71;c<=74;c++){int index=Math.abs((int)v.n(c,0));if(index>positions.size())throw new IOException("Invalid DXF polyface index.");if(index>0)face.add(Geometry.transform(matrix,positions.get(index-1)));}
                            if(face.size()>=3)geometry.polygon(face);
                            else if(face.size()==2)geometry.line(face.get(0),face.get(1));
                            else geometry.skipped.add("DXF point-only polyface records");
                        }
                    } else if((e.flags()&16)!=0) {
                        int m=(int)e.n(71,0),n=(int)e.n(72,0);
                        if(m<2||n<2||(long)m*n!=vertices.size())throw new IOException("Invalid DXF polygon mesh dimensions.");
                        int rows=(e.flags()&1)!=0?m:m-1,columns=(e.flags()&32)!=0?n:n-1;
                        for(int row=0;row<rows;row++)for(int col=0;col<columns;col++) {
                            double[] a=Geometry.transform(matrix,vertices.get(row*n+col).point(10));
                            double[] b=Geometry.transform(matrix,vertices.get(((row+1)%m)*n+col).point(10));
                            double[] c=Geometry.transform(matrix,vertices.get(((row+1)%m)*n+(col+1)%n).point(10));
                            double[] d=Geometry.transform(matrix,vertices.get(row*n+(col+1)%n).point(10));
                            geometry.triangle(a,b,c);geometry.triangle(a,c,d);
                        }
                        if(e.n(75,0)!=0)geometry.skipped.add("DXF polygon mesh smoothing");
                    }
                    else {
                        List<double[]> points=new ArrayList<>();List<Double> bulges=new ArrayList<>();
                        for(Entity v:vertices){double[] p=v.point(10);if((e.flags()&8)==0)p[2]=e.n(30,0);points.add(p);bulges.add(v.n(42,0));}
                        path(points,bulges,(e.flags()&1)!=0,(e.flags()&8)!=0?matrix:ocs);
                    }
                    break;
                }
                case "CIRCLE": case "ARC": {
                    double start=e.type.equals("CIRCLE")?0:Math.toRadians(e.n(50,0));
                    double end=e.type.equals("CIRCLE")?Math.PI*2:Math.toRadians(e.n(51,360));
                    while(end<=start)end+=Math.PI*2;
                    double radius=e.n(40,0);if(radius<=0)throw new IOException("Invalid DXF circle radius.");
                    arc(ocs,e.point(10),new double[]{radius,0,0},new double[]{0,radius,0},start,end-start);break;
                }
                case "ELLIPSE": {
                    double[] axis=e.point(11),normal=normal(e),minor=cross(normal,axis);double ratio=e.n(40,1);
                    for(int k=0;k<3;k++)minor[k]*=ratio;
                    double start=e.n(41,0),end=e.n(42,Math.PI*2);while(end<=start)end+=Math.PI*2;
                    arc(matrix,e.point(10),axis,minor,start,end-start);break;
                }
                case "3DFACE": case "SOLID": case "TRACE": {
                    double[] a=e.point(10),b=e.point(11),c=e.point(12),d=e.point(13);double[] transform=e.type.equals("3DFACE")?matrix:ocs;
                    if(!e.type.equals("3DFACE")){double[] swap=c;c=d;d=swap;}
                    geometry.triangle(Geometry.transform(transform,a),Geometry.transform(transform,b),Geometry.transform(transform,c));
                    if(!Arrays.equals(c,d))geometry.triangle(Geometry.transform(transform,a),Geometry.transform(transform,c),Geometry.transform(transform,d));break;
                }
                case "INSERT": {
                    String name=e.text(2,"");Block b=blocks.get(name);if(b==null)throw new IOException("Missing DXF block: "+name);
                    if(!active.add(name))throw new IOException("Circular DXF block reference.");
                    int columns=(int)e.n(70,1),rows=(int)e.n(71,1);
                    if(columns<1||rows<1||(long)rows*columns>10000)throw new IOException("DXF block array is too large.");
                    double angle=Math.toRadians(e.n(50,0)),c=Math.cos(angle),s=Math.sin(angle);
                    double[] rotate=Geometry.identity();rotate[0]=c;rotate[1]=-s;rotate[4]=s;rotate[5]=c;
                    double[] scale=Geometry.identity();scale[0]=e.n(41,1);scale[5]=e.n(42,1);scale[10]=e.n(43,1);
                    double[] base=translate(-b.base[0],-b.base[1],-b.base[2]);
                    double[] origin=e.point(10);
                    for(int row=0;row<rows;row++)for(int col=0;col<columns;col++) {
                        double[] local=Geometry.multiply(translate(origin[0],origin[1],origin[2]),Geometry.multiply(rotate,Geometry.multiply(translate(col*e.n(44,0),row*e.n(45,0),0),Geometry.multiply(scale,base))));
                        draw(b.entities,Geometry.multiply(ocs,local),active,depth+1);
                    }
                    active.remove(name);break;
                }
                case "SPLINE":spline(e,matrix);break;
                case "SEQEND":case "ENDBLK":break;
                default:geometry.skipped.add("DXF "+e.type);
            }
            if(e.n(39,0)!=0)geometry.skipped.add("DXF entity thickness");
            if(e.n(43,0)!=0 && e.type.equals("LWPOLYLINE"))geometry.skipped.add("DXF polyline widths");
        }
    }
    private static boolean faceRecord(Entity vertex)throws IOException {
        int flags=vertex.flags();
        return (flags&128)!=0 && (flags&64)==0 || flags==0 && vertex.n(71,0)!=0;
    }
    private void text(Entity e,double[] parent)throws IOException {
        boolean multi=e.type.equals("MTEXT");StringBuilder raw=new StringBuilder();
        if(multi){for(Pair p:e.pairs)if(p.code==3||p.code==1)raw.append(p.value);}
        else raw.append(e.text(1,""));
        if(raw.length()>65536)throw new IOException("CAD text is too long.");
        String content=CadText.plain(raw.toString(),multi);
        if(content.trim().isEmpty())return;
        double height=e.n(40,1);if(height<=0){geometry.skipped.add("text with invalid height");return;}
        double[] position=e.point(10),basis=ocs(e);
        double angle=Math.toRadians(e.n(50,0)),xScale=height*(multi?1:e.n(41,1)),yScale=height;
        double shiftX=0,shiftY=0;
        List<String> lines;
        double spacing=multi?Math.max(.25,Math.min(4,e.n(44,1)))*5d/3:1;
        if(multi) {
            // MTEXT insertion and direction are WCS, unlike TEXT's OCS points.
            double[] direction=null;
            for(Pair p:e.pairs) {
                if(p.code==75||p.code==1001)break; // Subsequent 50 codes can be column heights.
                if(p.code==11)direction=e.point(11);
                if(p.code==50){angle=Geometry.number(p.value);direction=null;}
            }
            if(direction!=null) {
                double[] n=normal(e);double length=Math.sqrt(direction[0]*direction[0]+direction[1]*direction[1]+direction[2]*direction[2]);
                if(length==0)throw new IOException("Invalid MTEXT direction.");
                for(int k=0;k<3;k++)direction[k]/=length;
                double[] y=cross(n,direction);basis=Geometry.identity();
                for(int k=0;k<3;k++){basis[k*4]=direction[k];basis[k*4+1]=y[k];basis[k*4+2]=n[k];}
                angle=0;
            }
            lines=CadText.wrap(content,e.n(41,0)/height);
            double width=0;for(String line:lines)width=Math.max(width,CadText.width(line));
            int attach=Math.max(1,Math.min(9,(int)e.n(71,1)))-1;
            shiftX=-(attach%3)*width/2;
            // Top of first cap is y=1; following baselines descend with spacing.
            double bottom=-(lines.size()-1)*spacing;
            shiftY=attach/3==0?-1:attach/3==1?-(1+bottom)/2:-bottom;
            if(e.n(90,0)!=0)geometry.skipped.add("text background masks");
            if(e.n(75,0)!=0)geometry.skipped.add("text column layout");
            if(e.n(72,1)==3)geometry.skipped.add("vertical text layout");
        } else {
            lines=Collections.singletonList(content);
            int horizontal=(int)e.n(72,0),vertical=(int)e.n(e.type.equals("TEXT")?73:74,0);
            double width=CadText.width(content);
            if(horizontal==3||horizontal==5) {
                double[] end=e.point(11);double dx=end[0]-position[0],dy=end[1]-position[1];
                if(width>0){xScale=Math.hypot(dx,dy)/width;if(horizontal==3)yScale=xScale;}
                angle=Math.atan2(dy,dx);
            } else {
                if(horizontal!=0||vertical!=0)position=e.point(11);
                if(horizontal==1||horizontal==4)shiftX=-width/2;else if(horizontal==2)shiftX=-width;
                if(vertical==2||horizontal==4)shiftY=-.5;else if(vertical==3)shiftY=-1;
            }
            int flags=(int)e.n(71,0);if((flags&2)!=0)xScale=-xScale;if((flags&4)!=0)yScale=-yScale;
        }
        double c=Math.cos(angle),s=Math.sin(angle),oblique=multi?0:Math.tan(Math.toRadians(e.n(51,0)));
        double[] layout=Geometry.identity();layout[0]=c*xScale;layout[4]=s*xScale;
        layout[1]=(c*oblique-s)*yScale;layout[5]=(s*oblique+c)*yScale;
        double[] transform=multi?Geometry.multiply(parent,Geometry.multiply(translate(position[0],position[1],position[2]),basis)):
            Geometry.multiply(parent,Geometry.multiply(basis,translate(position[0],position[1],position[2])));
        transform=Geometry.multiply(transform,layout);
        for(int i=0;i<lines.size();i++)CadText.draw(geometry,lines.get(i),Geometry.multiply(transform,translate(shiftX,shiftY-i*spacing,0)));
        renderedText=true;
    }
    private void polyline(Entity e,double[] matrix)throws IOException {
        List<double[]> points=new ArrayList<>();List<Double> bulges=new ArrayList<>();double[] p=null;
        for(Pair pair:e.pairs) {
            if(pair.code==10){p=new double[]{Geometry.number(pair.value),0,e.n(38,0)};points.add(p);bulges.add(0d);}
            else if(pair.code==20 && p!=null)p[1]=Geometry.number(pair.value);
            else if(pair.code==42 && p!=null)bulges.set(bulges.size()-1,Geometry.number(pair.value));
            else if((pair.code==40||pair.code==41)&&Geometry.number(pair.value)!=0)geometry.skipped.add("DXF polyline widths");
        }
        path(points,bulges,(e.flags()&1)!=0,matrix);
    }
    private void path(List<double[]> points,List<Double> bulges,boolean closed,double[] matrix)throws IOException {
        int count=points.size();for(int i=0;i<(closed?count:count-1);i++) {
            double[] a=points.get(i),b=points.get((i+1)%count);double bulge=bulges.get(i);
            if(Math.abs(bulge)<1e-10){line(matrix,a,b);continue;}
            double dx=b[0]-a[0],dy=b[1]-a[1],distance=Math.hypot(dx,dy);if(distance==0)continue;
            double offset=(1-bulge*bulge)/(4*bulge);
            double[] center={(a[0]+b[0])/2-dy*offset,(a[1]+b[1])/2+dx*offset,a[2]};
            double radius=Math.hypot(a[0]-center[0],a[1]-center[1]);
            arc(matrix,center,new double[]{radius,0,0},new double[]{0,radius,0},Math.atan2(a[1]-center[1],a[0]-center[0]),4*Math.atan(bulge));
        }
    }
    private void arc(double[] matrix,double[] center,double[] x,double[] y,double start,double sweep)throws IOException {
        if(!Double.isFinite(sweep)||Math.abs(sweep)>Math.PI*2+1e-6)throw new IOException("Invalid DXF arc.");
        int steps=Math.max(8,(int)Math.ceil(Math.abs(sweep)/(Math.PI/90)));double[] previous=null;
        for(int i=0;i<=steps;i++) {
            double angle=start+sweep*i/steps;double[] p=new double[3];
            for(int j=0;j<3;j++)p[j]=center[j]+x[j]*Math.cos(angle)+y[j]*Math.sin(angle);
            if(previous!=null)line(matrix,previous,p);previous=p;
        }
    }
    private void spline(Entity e,double[] matrix)throws IOException {
        List<double[]> controls=new ArrayList<>();List<Double> knots=new ArrayList<>(),weights=new ArrayList<>();double[] point=null;
        for(Pair p:e.pairs) {
            if(p.code==10){point=new double[]{Geometry.number(p.value),0,0};controls.add(point);}
            else if(p.code==20 && point!=null)point[1]=Geometry.number(p.value);
            else if(p.code==30 && point!=null)point[2]=Geometry.number(p.value);
            else if(p.code==40)knots.add(Geometry.number(p.value));
            else if(p.code==41)weights.add(Geometry.number(p.value));
        }
        int degree=(int)e.n(71,3),n=controls.size();
        if(degree<1||degree>10||n<=degree||knots.size()!=n+degree+1||!weights.isEmpty()&&weights.size()!=n){geometry.skipped.add("DXF spline without supported control data");return;}
        for(int i=1;i<knots.size();i++)if(knots.get(i)<knots.get(i-1))throw new IOException("Invalid DXF spline knots.");
        double start=knots.get(degree),end=knots.get(n);if(end<=start)throw new IOException("Invalid DXF spline domain.");
        int steps=Math.min(4096,Math.max(64,n*16));double[] previous=null;
        for(int step=0;step<=steps;step++) {
            double t=start+(end-start)*step/steps;int span=degree;
            while(span<n-1 && knots.get(span+1)<=t)span++;
            double[][] d=new double[degree+1][4];
            for(int j=0;j<=degree;j++){int k=span-degree+j;double w=weights.isEmpty()?1:weights.get(k);for(int a=0;a<3;a++)d[j][a]=controls.get(k)[a]*w;d[j][3]=w;}
            for(int r=1;r<=degree;r++)for(int j=degree;j>=r;j--){int k=span-degree+j;double denom=knots.get(k+degree-r+1)-knots.get(k);double alpha=denom==0?0:(t-knots.get(k))/denom;for(int a=0;a<4;a++)d[j][a]=(1-alpha)*d[j-1][a]+alpha*d[j][a];}
            double w=d[degree][3];if(w==0)throw new IOException("Invalid rational DXF spline.");
            double[] p={d[degree][0]/w,d[degree][1]/w,d[degree][2]/w};if(previous!=null)line(matrix,previous,p);previous=p;
        }
    }
    private void line(double[] matrix,double[] a,double[] b)throws IOException{geometry.line(Geometry.transform(matrix,a),Geometry.transform(matrix,b));}
    private static double[] translate(double x,double y,double z){double[] m=Geometry.identity();m[3]=x;m[7]=y;m[11]=z;return m;}
    private static double[] cross(double[] a,double[] b){return new double[]{a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]};}
    private static double[] normal(Entity e)throws IOException {
        double[] n={e.n(210,0),e.n(220,0),e.n(230,1)};double length=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);
        if(length==0)throw new IOException("Invalid DXF extrusion direction.");for(int i=0;i<3;i++)n[i]/=length;return n;
    }
    private static double[] ocs(Entity e)throws IOException {
        double[] n=normal(e),x=cross(Math.abs(n[0])<1d/64 && Math.abs(n[1])<1d/64?new double[]{0,1,0}:new double[]{0,0,1},n);
        double length=Math.sqrt(x[0]*x[0]+x[1]*x[1]+x[2]*x[2]);for(int i=0;i<3;i++)x[i]/=length;double[] y=cross(n,x),m=Geometry.identity();
        for(int i=0;i<3;i++){m[i*4]=x[i];m[i*4+1]=y[i];m[i*4+2]=n[i];}return m;
    }
}

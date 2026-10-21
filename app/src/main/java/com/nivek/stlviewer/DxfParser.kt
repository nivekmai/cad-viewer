package com.nivek.stlviewer

import java.io.File
import java.io.IOException
import kotlin.math.*

/** ASCII DXF geometry and annotations, with explicit notices for omitted styling. */
class DxfParser private constructor() {
    private data class Pair(val code: Int,val value: String)
    private class Entity(val type: String) {
        val pairs=mutableListOf<Pair>()
        fun text(code: Int,fallback: String)=pairs.firstOrNull { it.code==code }?.value ?: fallback
        fun n(code: Int,fallback: Double)=Geometry.number(text(code,fallback.toString()))
        fun flags()=n(70,0.0).toInt()
        fun point(code: Int)=doubleArrayOf(n(code,0.0),n(code+10,0.0),n(code+20,0.0))
    }
    private class Block(val base: DoubleArray) { val entities=mutableListOf<Entity>() }
    private val blocks=mutableMapOf<String,Block>()
    private val geometry=Geometry()
    private var units="units"
    private var renderedText=false
    private fun parse(file: File): StlParser.Mesh {
        val entities=mutableListOf<Entity>()
        var section=""; var current: Entity?=null; var block: Block?=null; var count=0
        file.bufferedReader(Charsets.UTF_8).use { reader ->
            while(true) {
                val line=Geometry.readLine(reader) ?: break
                geometry.check()
                if(line.startsWith("AutoCAD Binary DXF"))throw IOException("Binary DXF is not supported. Save the drawing as ASCII DXF.")
                var value=Geometry.readRawLine(reader) ?: throw IOException("Incomplete DXF group.")
                val code=Geometry.integer(line)
                if(code!=1 && code!=3)value=value.trim()
                if(++count>2_000_000)throw IOException("DXF drawing is too complex.")
                if(code==9 && value=="\$INSUNITS") {
                    val unitCode=Geometry.readLine(reader); val unitValue=Geometry.readLine(reader)
                    if(unitCode==null || unitValue==null)throw IOException("Incomplete DXF header.")
                    val unit=Geometry.integer(unitValue)
                    val names=listOf("units","inch","foot","mile","millimeter","centimeter","meter","kilometer","microinch","mil","yard","angstrom","nanometer","micron","decimeter","decameter","hectometer","gigameter","astronomical unit","light year","parsec")
                    if(unit in names.indices)units=names[unit]
                    continue
                }
                if(code==0) {
                    current?.let { entity ->
                        if(section=="BLOCKS") {
                            when(entity.type) {
                                "BLOCK" -> { block=Block(entity.point(10)); blocks[entity.text(2,"")]=block!! }
                                "ENDBLK" -> block=null
                                else -> block?.entities?.add(entity)
                            }
                        } else if(section=="ENTITIES")entities.add(entity)
                    }
                    current=null
                    when(value) {
                        "SECTION" -> {
                            val nextCode=Geometry.readLine(reader); val nextValue=Geometry.readLine(reader)
                            if(nextCode!="2" || nextValue==null)throw IOException("Invalid DXF section.")
                            section=nextValue
                            // Ignore unused metadata, including raw newlines from DWG materials.
                            if(section !in setOf("HEADER","BLOCKS","ENTITIES")) {
                                var previous=""; var ended=false
                                while(true) {
                                    val ignored=Geometry.readLine(reader) ?: break
                                    geometry.check()
                                    if(++count>2_000_000)throw IOException("DXF drawing is too complex.")
                                    if(previous=="0" && ignored=="ENDSEC") { ended=true; break }
                                    previous=ignored
                                }
                                if(!ended)throw IOException("Incomplete DXF section.")
                                section=""
                            }
                        }
                        "ENDSEC" -> { section=""; block=null }
                        "EOF" -> break
                        else -> current=Entity(value)
                    }
                } else current?.pairs?.add(Pair(code,value))
            }
        }
        draw(entities,Geometry.identity(),hashSetOf(),0)
        if(geometry.triangles.size+geometry.lines.size==0)throw IOException("No supported DXF geometry found. Unsupported entities: ${geometry.skipped.joinToString(", ")}")
        return geometry.mesh().also {
            it.units=units
            if(renderedText)it.notice+=(if(it.notice.isEmpty())"" else "\n")+"Text uses a substitute outline font. Original fonts, rich text styling, and exact text spacing may differ."
        }
    }
    private fun draw(entities: List<Entity>,matrix: DoubleArray,active: MutableSet<String>,depth: Int) {
        if(depth>32)throw IOException("DXF blocks are nested too deeply.")
        var i=0
        while(i<entities.size) {
            geometry.check(); val e=entities[i++]
            if(e.n(67,0.0)!=0.0 || e.n(60,0.0)==1.0)continue
            val ocs=Geometry.multiply(matrix,ocs(e))
            when(e.type) {
                "TEXT","MTEXT","ATTRIB","ATTDEF" -> {
                    if(e.type in setOf("ATTRIB","ATTDEF") && (e.flags() and 1!=0 || e.type=="ATTDEF" && e.flags() and 2==0))continue
                    text(e,matrix)
                }
                "DIMENSION" -> {
                    val name=e.text(2,""); val block=blocks[name]
                    if(block==null) { geometry.skipped.add("dimensions without saved drawing blocks"); continue }
                    if(!active.add(name))throw IOException("Circular DXF dimension block reference.")
                    val offset=Geometry.transform(ocs(e),e.point(12))
                    val local=translate(offset[0]-block.base[0],offset[1]-block.base[1],offset[2]-block.base[2])
                    draw(block.entities,Geometry.multiply(matrix,local),active,depth+1)
                    active.remove(name)
                }
                "LEADER" -> {
                    val points=mutableListOf<DoubleArray>(); var point: DoubleArray?=null
                    for(p in e.pairs)when(p.code) {
                        10 -> { point=doubleArrayOf(Geometry.number(p.value),0.0,0.0); points.add(point) }
                        20 -> point?.set(1,Geometry.number(p.value))
                        30 -> point?.set(2,Geometry.number(p.value))
                    }
                    for(j in 1 until points.size)line(matrix,points[j-1],points[j])
                    if(e.n(71,0.0)!=0.0)geometry.skipped.add("leader arrowheads")
                    if(e.n(72,0.0)!=0.0)geometry.skipped.add("leader curve smoothing")
                }
                "LINE" -> line(matrix,e.point(10),e.point(11))
                "LWPOLYLINE" -> polyline(e,ocs)
                "POLYLINE" -> {
                    val vertices=mutableListOf<Entity>()
                    while(i<entities.size && entities[i].type=="VERTEX")vertices.add(entities[i++])
                    if(e.flags() and 64!=0) {
                        val positions=vertices.filterNot(::faceRecord).map { it.point(10) }
                        for(v in vertices.filter(::faceRecord)) {
                            val face=mutableListOf<DoubleArray>()
                            for(c in 71..74) {
                                val index=abs(v.n(c,0.0).toInt())
                                if(index>positions.size)throw IOException("Invalid DXF polyface index.")
                                if(index>0)face.add(Geometry.transform(matrix,positions[index-1]))
                            }
                            when {
                                face.size>=3 -> geometry.polygon(face)
                                face.size==2 -> geometry.line(face[0],face[1])
                                else -> geometry.skipped.add("DXF point-only polyface records")
                            }
                        }
                    } else if(e.flags() and 16!=0) {
                        val m=e.n(71,0.0).toInt(); val n=e.n(72,0.0).toInt()
                        if(m<2 || n<2 || m.toLong()*n!=vertices.size.toLong())throw IOException("Invalid DXF polygon mesh dimensions.")
                        val rows=if(e.flags() and 1!=0)m else m-1; val columns=if(e.flags() and 32!=0)n else n-1
                        for(row in 0 until rows)for(col in 0 until columns) {
                            val a=Geometry.transform(matrix,vertices[row*n+col].point(10))
                            val b=Geometry.transform(matrix,vertices[((row+1)%m)*n+col].point(10))
                            val c=Geometry.transform(matrix,vertices[((row+1)%m)*n+(col+1)%n].point(10))
                            val d=Geometry.transform(matrix,vertices[row*n+(col+1)%n].point(10))
                            geometry.triangle(a,b,c); geometry.triangle(a,c,d)
                        }
                        if(e.n(75,0.0)!=0.0)geometry.skipped.add("DXF polygon mesh smoothing")
                    } else {
                        val points=vertices.map { v -> v.point(10).also { if(e.flags() and 8==0)it[2]=e.n(30,0.0) } }
                        path(points,vertices.map { it.n(42,0.0) },e.flags() and 1!=0,if(e.flags() and 8!=0)matrix else ocs)
                    }
                }
                "CIRCLE","ARC" -> {
                    val start=if(e.type=="CIRCLE")0.0 else Math.toRadians(e.n(50,0.0))
                    var end=if(e.type=="CIRCLE")PI*2 else Math.toRadians(e.n(51,360.0))
                    while(end<=start)end+=PI*2
                    val radius=e.n(40,0.0)
                    if(radius<=0)throw IOException("Invalid DXF circle radius.")
                    arc(ocs,e.point(10),doubleArrayOf(radius,0.0,0.0),doubleArrayOf(0.0,radius,0.0),start,end-start)
                }
                "ELLIPSE" -> {
                    val axis=e.point(11); val minor=cross(normal(e),axis); val ratio=e.n(40,1.0)
                    for(k in 0..2)minor[k]*=ratio
                    val start=e.n(41,0.0); var end=e.n(42,PI*2)
                    while(end<=start)end+=PI*2
                    arc(matrix,e.point(10),axis,minor,start,end-start)
                }
                "3DFACE","SOLID","TRACE" -> {
                    val a=e.point(10); val b=e.point(11); var c=e.point(12); var d=e.point(13)
                    val transform=if(e.type=="3DFACE")matrix else ocs
                    if(e.type!="3DFACE") { val swap=c; c=d; d=swap }
                    geometry.triangle(Geometry.transform(transform,a),Geometry.transform(transform,b),Geometry.transform(transform,c))
                    if(!c.contentEquals(d))geometry.triangle(Geometry.transform(transform,a),Geometry.transform(transform,c),Geometry.transform(transform,d))
                }
                "INSERT" -> {
                    val name=e.text(2,""); val b=blocks[name] ?: throw IOException("Missing DXF block: $name")
                    if(!active.add(name))throw IOException("Circular DXF block reference.")
                    val columns=e.n(70,1.0).toInt(); val rows=e.n(71,1.0).toInt()
                    if(columns<1 || rows<1 || rows.toLong()*columns>10000)throw IOException("DXF block array is too large.")
                    val angle=Math.toRadians(e.n(50,0.0)); val c=cos(angle); val s=sin(angle)
                    val rotate=Geometry.identity().apply { this[0]=c; this[1]=-s; this[4]=s; this[5]=c }
                    val scale=Geometry.identity().apply { this[0]=e.n(41,1.0); this[5]=e.n(42,1.0); this[10]=e.n(43,1.0) }
                    val base=translate(-b.base[0],-b.base[1],-b.base[2]); val origin=e.point(10)
                    for(row in 0 until rows)for(col in 0 until columns) {
                        val local=Geometry.multiply(translate(origin[0],origin[1],origin[2]),Geometry.multiply(rotate,Geometry.multiply(translate(col*e.n(44,0.0),row*e.n(45,0.0),0.0),Geometry.multiply(scale,base))))
                        draw(b.entities,Geometry.multiply(ocs,local),active,depth+1)
                    }
                    active.remove(name)
                }
                "SPLINE" -> spline(e,matrix)
                "SEQEND","ENDBLK" -> Unit
                else -> geometry.skipped.add("DXF ${e.type}")
            }
            if(e.n(39,0.0)!=0.0)geometry.skipped.add("DXF entity thickness")
            if(e.n(43,0.0)!=0.0 && e.type=="LWPOLYLINE")geometry.skipped.add("DXF polyline widths")
        }
    }
    private fun faceRecord(v: Entity): Boolean = v.flags() and 128!=0 && v.flags() and 64==0 || v.flags()==0 && v.n(71,0.0)!=0.0
    private fun text(e: Entity,parent: DoubleArray) {
        val multi=e.type=="MTEXT"
        val raw=if(multi)e.pairs.filter { it.code==3 || it.code==1 }.joinToString("") { it.value } else e.text(1,"")
        if(raw.length>65536)throw IOException("CAD text is too long.")
        val content=CadText.plain(raw,multi)
        if(content.trim().isEmpty())return
        val height=e.n(40,1.0)
        if(height<=0) { geometry.skipped.add("text with invalid height"); return }
        var position=e.point(10); var basis=ocs(e)
        var angle=Math.toRadians(e.n(50,0.0)); var xScale=height*(if(multi)1.0 else e.n(41,1.0)); var yScale=height
        var shiftX=0.0; var shiftY=0.0
        val lines: List<String>
        val spacing=if(multi)e.n(44,1.0).coerceIn(.25,4.0)*5/3 else 1.0
        if(multi) {
            var direction: DoubleArray?=null
            for(p in e.pairs) {
                if(p.code==75 || p.code==1001)break
                if(p.code==11)direction=e.point(11)
                if(p.code==50) { angle=Geometry.number(p.value); direction=null }
            }
            if(direction!=null) {
                val n=normal(e); val length=sqrt(direction.sumOf { it*it })
                if(length==0.0)throw IOException("Invalid MTEXT direction.")
                for(k in 0..2)direction[k]/=length
                val y=cross(n,direction); basis=Geometry.identity()
                for(k in 0..2) { basis[k*4]=direction[k]; basis[k*4+1]=y[k]; basis[k*4+2]=n[k] }
                angle=0.0
            }
            lines=CadText.wrap(content,e.n(41,0.0)/height)
            val width=lines.maxOfOrNull(CadText::width) ?: 0.0
            val attach=e.n(71,1.0).toInt().coerceIn(1,9)-1
            shiftX=-(attach%3)*width/2
            val bottom=-(lines.size-1)*spacing
            shiftY=when(attach/3) { 0 -> -1.0; 1 -> -(1+bottom)/2; else -> -bottom }
            if(e.n(90,0.0)!=0.0)geometry.skipped.add("text background masks")
            if(e.n(75,0.0)!=0.0)geometry.skipped.add("text column layout")
            if(e.n(72,1.0)==3.0)geometry.skipped.add("vertical text layout")
        } else {
            lines=listOf(content)
            val horizontal=e.n(72,0.0).toInt(); val vertical=e.n(if(e.type=="TEXT")73 else 74,0.0).toInt()
            val width=CadText.width(content)
            if(horizontal==3 || horizontal==5) {
                val end=e.point(11); val dx=end[0]-position[0]; val dy=end[1]-position[1]
                if(width>0) { xScale=hypot(dx,dy)/width; if(horizontal==3)yScale=xScale }
                angle=atan2(dy,dx)
            } else {
                if(horizontal!=0 || vertical!=0)position=e.point(11)
                if(horizontal==1 || horizontal==4)shiftX=-width/2 else if(horizontal==2)shiftX=-width
                if(vertical==2 || horizontal==4)shiftY=-.5 else if(vertical==3)shiftY=-1.0
            }
            val flags=e.n(71,0.0).toInt()
            if(flags and 2!=0)xScale=-xScale
            if(flags and 4!=0)yScale=-yScale
        }
        val c=cos(angle); val s=sin(angle); val oblique=if(multi)0.0 else tan(Math.toRadians(e.n(51,0.0)))
        val layout=Geometry.identity().apply { this[0]=c*xScale; this[4]=s*xScale; this[1]=(c*oblique-s)*yScale; this[5]=(s*oblique+c)*yScale }
        val translation=translate(position[0],position[1],position[2])
        var transform=Geometry.multiply(parent,if(multi)Geometry.multiply(translation,basis) else Geometry.multiply(basis,translation))
        transform=Geometry.multiply(transform,layout)
        for(i in lines.indices)CadText.draw(geometry,lines[i],Geometry.multiply(transform,translate(shiftX,shiftY-i*spacing,0.0)))
        renderedText=true
    }
    private fun polyline(e: Entity,matrix: DoubleArray) {
        val points=mutableListOf<DoubleArray>(); val bulges=mutableListOf<Double>(); var p: DoubleArray?=null
        for(pair in e.pairs)when(pair.code) {
            10 -> { p=doubleArrayOf(Geometry.number(pair.value),0.0,e.n(38,0.0)); points.add(p); bulges.add(0.0) }
            20 -> p?.set(1,Geometry.number(pair.value))
            42 -> if(p!=null)bulges[bulges.lastIndex]=Geometry.number(pair.value)
            40,41 -> if(Geometry.number(pair.value)!=0.0)geometry.skipped.add("DXF polyline widths")
        }
        path(points,bulges,e.flags() and 1!=0,matrix)
    }
    private fun path(points: List<DoubleArray>,bulges: List<Double>,closed: Boolean,matrix: DoubleArray) {
        val count=points.size
        for(i in 0 until if(closed)count else count-1) {
            val a=points[i]; val b=points[(i+1)%count]; val bulge=bulges[i]
            if(abs(bulge)<1e-10) { line(matrix,a,b); continue }
            val dx=b[0]-a[0]; val dy=b[1]-a[1]; val distance=hypot(dx,dy)
            if(distance==0.0)continue
            val offset=(1-bulge*bulge)/(4*bulge)
            val center=doubleArrayOf((a[0]+b[0])/2-dy*offset,(a[1]+b[1])/2+dx*offset,a[2])
            val radius=hypot(a[0]-center[0],a[1]-center[1])
            arc(matrix,center,doubleArrayOf(radius,0.0,0.0),doubleArrayOf(0.0,radius,0.0),atan2(a[1]-center[1],a[0]-center[0]),4*atan(bulge))
        }
    }
    private fun arc(matrix: DoubleArray,center: DoubleArray,x: DoubleArray,y: DoubleArray,start: Double,sweep: Double) {
        if(!sweep.isFinite() || abs(sweep)>PI*2+1e-6)throw IOException("Invalid DXF arc.")
        val steps=maxOf(8,ceil(abs(sweep)/(PI/90)).toInt()); var previous: DoubleArray?=null
        for(i in 0..steps) {
            val angle=start+sweep*i/steps
            val p=DoubleArray(3) { center[it]+x[it]*cos(angle)+y[it]*sin(angle) }
            previous?.let { line(matrix,it,p) }; previous=p
        }
    }
    private fun spline(e: Entity,matrix: DoubleArray) {
        val controls=mutableListOf<DoubleArray>(); val knots=mutableListOf<Double>(); val weights=mutableListOf<Double>(); var point: DoubleArray?=null
        for(p in e.pairs)when(p.code) {
            10 -> { point=doubleArrayOf(Geometry.number(p.value),0.0,0.0); controls.add(point) }
            20 -> point?.set(1,Geometry.number(p.value))
            30 -> point?.set(2,Geometry.number(p.value))
            40 -> knots.add(Geometry.number(p.value))
            41 -> weights.add(Geometry.number(p.value))
        }
        val degree=e.n(71,3.0).toInt(); val n=controls.size
        if(degree !in 1..10 || n<=degree || knots.size!=n+degree+1 || weights.isNotEmpty() && weights.size!=n) { geometry.skipped.add("DXF spline without supported control data"); return }
        for(i in 1 until knots.size)if(knots[i]<knots[i-1])throw IOException("Invalid DXF spline knots.")
        val start=knots[degree]; val end=knots[n]
        if(end<=start)throw IOException("Invalid DXF spline domain.")
        val steps=minOf(4096,maxOf(64,n*16)); var previous: DoubleArray?=null
        for(step in 0..steps) {
            val t=start+(end-start)*step/steps; var span=degree
            while(span<n-1 && knots[span+1]<=t)span++
            val d=Array(degree+1) { DoubleArray(4) }
            for(j in 0..degree) {
                val k=span-degree+j; val w=if(weights.isEmpty())1.0 else weights[k]
                for(a in 0..2)d[j][a]=controls[k][a]*w
                d[j][3]=w
            }
            for(r in 1..degree)for(j in degree downTo r) {
                val k=span-degree+j; val denom=knots[k+degree-r+1]-knots[k]
                val alpha=if(denom==0.0)0.0 else (t-knots[k])/denom
                for(a in 0..3)d[j][a]=(1-alpha)*d[j-1][a]+alpha*d[j][a]
            }
            val w=d[degree][3]
            if(w==0.0)throw IOException("Invalid rational DXF spline.")
            val p=DoubleArray(3) { d[degree][it]/w }
            previous?.let { line(matrix,it,p) }; previous=p
        }
    }
    private fun line(matrix: DoubleArray,a: DoubleArray,b: DoubleArray) = geometry.line(Geometry.transform(matrix,a),Geometry.transform(matrix,b))
    companion object {
        @JvmStatic @Throws(IOException::class) fun read(file: File): StlParser.Mesh = DxfParser().parse(file)
        private fun translate(x: Double,y: Double,z: Double)=Geometry.identity().apply { this[3]=x; this[7]=y; this[11]=z }
        private fun cross(a: DoubleArray,b: DoubleArray)=doubleArrayOf(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
        private fun normal(e: Entity): DoubleArray {
            val n=doubleArrayOf(e.n(210,0.0),e.n(220,0.0),e.n(230,1.0)); val length=sqrt(n.sumOf { it*it })
            if(length==0.0)throw IOException("Invalid DXF extrusion direction.")
            for(i in 0..2)n[i]/=length
            return n
        }
        private fun ocs(e: Entity): DoubleArray {
            val n=normal(e)
            val x=cross(if(abs(n[0])<1.0/64 && abs(n[1])<1.0/64)doubleArrayOf(0.0,1.0,0.0) else doubleArrayOf(0.0,0.0,1.0),n)
            val length=sqrt(x.sumOf { it*it }); for(i in 0..2)x[i]/=length
            val y=cross(n,x); val m=Geometry.identity()
            for(i in 0..2) { m[i*4]=x[i]; m[i*4+1]=y[i]; m[i*4+2]=n[i] }
            return m
        }
    }
}

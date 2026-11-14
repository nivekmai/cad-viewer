package com.nivek.stlviewer

import java.io.*
import java.nio.*
import java.nio.channels.FileChannel
import java.util.IdentityHashMap
import kotlin.math.sqrt

/** PLY records are streamed; expanded geometry lives in unlinked disk-backed mappings. */
object PlyParser {
    private data class Type(val bytes: Int, val signed: Boolean = false, val floating: Boolean = false)
    private fun type(s: String): Type = when(s) {
        "char", "int8" -> Type(1,true); "uchar", "uint8" -> Type(1)
        "short", "int16" -> Type(2,true); "ushort", "uint16" -> Type(2)
        "int", "int32" -> Type(4,true); "uint", "uint32" -> Type(4)
        "float", "float32" -> Type(4,true,true); "double", "float64" -> Type(8,true,true)
        else -> throw IOException("Unsupported PLY property type: $s")
    }
    private data class Property(val name: String, val type: Type, val count: Type? = null) {
        val axis=listOf("x","y","z","red","green","blue","alpha").indexOf(name)
    }
    private data class Element(val name: String, val count: Int, val properties: MutableList<Property> = ArrayList())
    private fun count(v: Double): Int {
        if(!v.isFinite() || v<0 || v>Int.MAX_VALUE || v!=v.toInt().toDouble())throw IOException("Invalid PLY count or index.")
        return v.toInt()
    }
    private class Reader(val input: DataInputStream, val ascii: Boolean, val little: Boolean) {
        fun number(t: Type): Double {
            val v = if(ascii) {
                val s=StringBuilder(); var c=input.read()
                while(c>=0 && c<=32)c=input.read()
                while(c>32) { s.append(c.toChar()); c=input.read() }
                if(s.isEmpty())throw EOFException("Truncated PLY data.")
                s.toString().toDoubleOrNull() ?: throw IOException("Invalid PLY number.")
            } else when(t.bytes) {
                1 -> if(t.signed)input.readByte().toDouble() else input.readUnsignedByte().toDouble()
                2 -> { val raw=input.readShort(); val n=if(little)java.lang.Short.reverseBytes(raw) else raw
                    if(t.signed)n.toDouble() else (n.toInt() and 65535).toDouble() }
                4 -> { val raw=input.readInt(); val n=if(little)Integer.reverseBytes(raw) else raw
                    if(t.floating)Float.fromBits(n).toDouble() else if(t.signed)n.toDouble() else (n.toLong() and 0xffffffffL).toDouble() }
                else -> { val raw=input.readLong(); Double.fromBits(if(little)java.lang.Long.reverseBytes(raw) else raw) }
            }
            if(!v.isFinite())throw IOException("Non-finite PLY value.")
            if(!t.floating) {
                val bits=t.bytes*8; val min=if(t.signed)-Math.scalb(1.0,bits-1) else 0.0
                val max=Math.scalb(1.0,if(t.signed)bits-1 else bits)-1
                if(v<min || v>max || v!=kotlin.math.floor(v))throw IOException("PLY integer is outside its declared type.")
            }
            return v
        }
    }
    private fun mapping(file: File, bytes: Long): ByteBuffer {
        if(bytes>Int.MAX_VALUE)throw IOException("PLY geometry exceeds the runtime buffer capacity.")
        return RandomAccessFile(file,"rw").use { it.setLength(bytes); it.channel.map(FileChannel.MapMode.READ_WRITE,0,bytes).order(ByteOrder.BIG_ENDIAN) }
    }
    fun read(file: File): StlParser.Mesh {
        val temporary=ArrayList<File>()
        fun temp()=File.createTempFile("ply-", ".bin", file.parentFile).also { temporary.add(it) }
        try {
            return DataInputStream(BufferedInputStream(file.inputStream(),65536)).use { input ->
                fun line(): String {
                    val s=StringBuilder()
                    while(true) { val c=input.read(); if(c<0)throw EOFException("Missing PLY header."); if(c==10)break; s.append(c.toChar()) }
                    return s.toString().trim()
                }
                if(line()!="ply")throw IOException("Not a PLY file.")
                val elements=ArrayList<Element>(); var format=""
                while(true) {
                    val words=line().split(Regex("\\s+")); if(words[0]=="end_header")break
                    when(words[0]) {
                        "comment", "obj_info", "" -> Unit
                        "format" -> { if(words.size!=3 || words[2]!="1.0" || format.isNotEmpty())throw IOException("Invalid PLY format."); format=words[1] }
                        "element" -> { if(words.size!=3)throw IOException("Invalid PLY element."); elements.add(Element(words[1],count(Geometry.number(words[2])))) }
                        "property" -> {
                            val e=elements.lastOrNull() ?: throw IOException("PLY property without element.")
                            val p=if(words.size==3)Property(words[2],type(words[1])) else if(words.size==5 && words[1]=="list")Property(words[4],type(words[3]),type(words[2])) else throw IOException("Invalid PLY property.")
                            if(p.count?.floating==true || e.properties.any { it.name==p.name })throw IOException("Invalid PLY property declaration.")
                            e.properties.add(p)
                        }
                        else -> throw IOException("Invalid PLY header directive.")
                    }
                }
                if(format !in setOf("ascii","binary_little_endian","binary_big_endian"))throw IOException("Unsupported PLY encoding.")
                val vertex=elements.singleOrNull { it.name=="vertex" } ?: throw IOException("PLY requires one vertex element.")
                if(vertex.count==0 || !listOf("x","y","z").all { name->vertex.properties.any { it.name==name && it.count==null } })throw IOException("PLY has no vertex coordinates.")
                val colored=listOf("red","green","blue").all { name->vertex.properties.any { it.name==name && it.count==null } }
                val vertices=mapping(temp(),vertex.count.toLong()*40)
                val faces=temp(); val reader=Reader(input,format=="ascii",format=="binary_little_endian")
                val min=DoubleArray(3){Double.POSITIVE_INFINITY}; val max=DoubleArray(3){Double.NEGATIVE_INFINITY}
                var faceCount=0
                DataOutputStream(BufferedOutputStream(faces.outputStream(),65536)).use { out ->
                    for(e in elements)repeat(e.count) { row ->
                        if(row%4096==0 && Thread.currentThread().isInterrupted)throw InterruptedIOException()
                        val values=if(e===vertex)doubleArrayOf(0.0,0.0,0.0,1.0,1.0,1.0,1.0) else null
                        var indices: IntArray?=null
                        for(p in e.properties) {
                            if(p.count!=null) {
                                val n=count(reader.number(p.count)); val face=e.name=="face" && (p.name=="vertex_indices" || p.name=="vertex_index")
                                if(face && (p.type.floating || indices!=null || n<3))throw IOException("Invalid PLY face.")
                                if(face) {
                                    // A list cannot contain more values than there are bytes remaining in the source.
                                    if(n.toLong()>file.length())throw IOException("Truncated PLY list.")
                                    indices=IntArray(n) { count(reader.number(p.type)).also { if(it>=vertex.count)throw IOException("PLY face refers to a missing vertex.") } }
                                } else repeat(n) { reader.number(p.type) }
                            } else {
                                val value=reader.number(p.type)
                                if(values!=null) {
                                    val axis=p.axis
                                    if(axis>=0)values[axis]=if(axis<3)value else {
                                        val scale=if(p.type.floating)1.0 else Math.scalb(1.0,p.type.bytes*8-(if(p.type.signed)1 else 0))-1
                                        (value/scale).coerceIn(0.0,1.0)
                                    }
                                }
                            }
                        }
                        if(values!=null) {
                            for(axis in 0..2) { vertices.putDouble(row*40+axis*8,values[axis]); min[axis]=minOf(min[axis],values[axis]); max[axis]=maxOf(max[axis],values[axis]) }
                            for(c in 0..3)vertices.putFloat(row*40+24+c*4,values[c+3].toFloat())
                        }
                        if(e.name=="face") { val ids=indices ?: throw IOException("PLY face has no vertex indices."); out.writeInt(ids.size); ids.forEach(out::writeInt); faceCount++ }
                    }
                }
                val dimensions=DoubleArray(3){max[it]-min[it]}; val span=dimensions.max().let { if(it==0.0)1.0 else it }
                if(!span.isFinite())throw IOException("Invalid PLY coordinate range.")
                fun point(id: Int)=DoubleArray(3){ ((vertices.getDouble(id*40+it*8)-min[it])-dimensions[it]/2)*2/span }
                val render=temp(); val colors=temp(); var total=0L
                DataOutputStream(BufferedOutputStream(render.outputStream(),65536)).use { geometry ->
                    DataOutputStream(BufferedOutputStream(colors.outputStream(),65536)).use { rgb ->
                        fun emit(ids: IntArray) {
                            if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
                            total+=ids.size
                            if(total*24>Int.MAX_VALUE)throw IOException("PLY geometry exceeds the runtime buffer capacity.")
                            val points=ids.map(::point)
                            val normal=if(ids.size==3) {
                                val a=DoubleArray(3){points[1][it]-points[0][it]}; val b=DoubleArray(3){points[2][it]-points[0][it]}
                                doubleArrayOf(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
                            } else doubleArrayOf(0.0,0.0,1.0)
                            val length=sqrt(normal.sumOf { it*it }).let { if(it==0.0)1.0 else it }
                            for((i,id) in ids.withIndex()) { points[i].forEach { geometry.writeFloat(it.toFloat()) }; normal.forEach { geometry.writeFloat((it/length).toFloat()) }
                                if(colored)for(c in 0..3)rgb.writeFloat(vertices.getFloat(id*40+24+c*4)) }
                        }
                        DataInputStream(BufferedInputStream(faces.inputStream(),65536)).use { f ->
                            repeat(faceCount) {
                                val ids=IntArray(f.readInt()){f.readInt()}
                                if(ids.size==3)emit(ids) else {
                                    val points=ids.map(::point); val index=IdentityHashMap<DoubleArray,Int>(); points.forEachIndexed { i,p->index[p]=ids[i] }
                                    Geometry().polygon(points) { a,b,c->emit(intArrayOf(index.getValue(a),index.getValue(b),index.getValue(c))) }
                                }
                            }
                        }
                        if(faceCount==0)repeat(vertex.count){emit(intArrayOf(it))}
                    }
                }
                StlParser.Mesh(FloatArray(0),if(faceCount>0)(total*3).toInt() else 0,prepared=StlParser.Prepared(mapping(render,render.length()).asFloatBuffer(),dimensions)).also {
                    it.residentGeometry=true
                    if(colored)it.vertexColors=mapping(colors,colors.length()).asFloatBuffer()
                    if(faceCount==0)it.pointCount=vertex.count
                }
            }
        } catch(e: EOFException) { throw IOException("Truncated PLY file.",e) }
        finally { temporary.forEach { it.delete() } }
    }
}

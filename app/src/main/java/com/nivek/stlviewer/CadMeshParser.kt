package com.nivek.stlviewer

import java.io.*
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.channels.FileChannel
import kotlin.math.sqrt

/** Disk-backed geometry and texture views avoid retaining model-sized heap arrays. */
object CadMeshParser {
    data class Surface(val first: Int, val count: Int, val color: FloatArray, val texture: Int, val flags: Int, val cutoff: Float)
    fun textureStream(bytes: ByteBuffer): InputStream = object: InputStream() {
        private val source=bytes.asReadOnlyBuffer()
        override fun read(): Int = if(source.hasRemaining())source.get().toInt() and 255 else -1
        override fun read(b: ByteArray,off: Int,len: Int): Int {
            if(len==0)return 0
            if(!source.hasRemaining())return -1
            val n=minOf(len,source.remaining());source.get(b,off,n);return n
        }
        override fun skip(n: Long): Long {
            val count=minOf(maxOf(0L,n),source.remaining().toLong()).toInt();source.position(source.position()+count);return count.toLong()
        }
    }
    fun read(file: File): StlParser.Mesh = RandomAccessFile(file,"r").use { input ->
        fun integer() = Integer.reverseBytes(input.readInt())
        fun scalar(): Float = Float.fromBits(integer()).also { if(!it.isFinite())throw IOException("Invalid material/vertex value.") }
        if(input.readInt()!=0x43564d31)throw IOException("Invalid CAD mesh header.")
        val vertices=integer();val batches=integer();val images=integer()
        if(vertices<=0 || vertices%3!=0 || batches<=0 || images<0 ||
            16L+vertices.toLong()*20+batches.toLong()*36+images.toLong()*4>file.length())throw IOException("Invalid CAD mesh lengths.")
        if(vertices.toLong()*24>Int.MAX_VALUE)throw IOException("Geometry exceeds the runtime buffer capacity.")
        val original=input.channel.map(FileChannel.MapMode.READ_ONLY,16,vertices.toLong()*20).order(ByteOrder.LITTLE_ENDIAN).asFloatBuffer()
        val min=DoubleArray(3){Double.POSITIVE_INFINITY};val max=DoubleArray(3){Double.NEGATIVE_INFINITY}
        for(i in 0 until vertices) {
            if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
            for(axis in 0..4) {
                val value=original.get(i*5+axis)
                if(!value.isFinite())throw IOException("Invalid material/vertex value.")
                if(axis<3){min[axis]=minOf(min[axis],value.toDouble());max[axis]=maxOf(max[axis],value.toDouble())}
            }
        }
        input.seek(16L+vertices.toLong()*20)
        var next=0L
        val surfaces=List(batches) {
            val first=integer();val count=integer();val color=FloatArray(4){scalar()};val texture=integer();val flags=integer();val cutoff=scalar()
            if(first.toLong()!=next || count<=0 || count%3!=0 || next+count>vertices || texture < -1 || texture>=images ||
                flags !in 0..7 || color.any { it !in 0f..1f } || cutoff !in 0f..1f)throw IOException("Invalid CAD material batch.")
            next+=count
            Surface(first,count,color,texture,flags,cutoff)
        }
        if(next!=vertices.toLong())throw IOException("Incomplete CAD material batches.")
        val textures=List(images) {
            val length=integer();val offset=input.filePointer
            if(length<=0 || length>file.length()-offset)throw IOException("Invalid embedded texture length.")
            input.channel.map(FileChannel.MapMode.READ_ONLY,offset,length.toLong()).also { input.seek(offset+length) }
        }
        if(input.filePointer!=file.length())throw IOException("Unexpected CAD mesh data.")
        val dimensions=DoubleArray(3){max[it]-min[it]};val span=dimensions.max()
        if(span==0.0)throw IOException("This file has no visible geometry.")
        val center=DoubleArray(3){(min[it]+max[it])/2}
        val cache=File.createTempFile("render-",".bin",file.parentFile)
        try {
            val render=RandomAccessFile(cache,"rw").use { out ->
                out.setLength(vertices.toLong()*24)
                out.channel.map(FileChannel.MapMode.READ_WRITE,0,vertices.toLong()*24).order(ByteOrder.nativeOrder()).asFloatBuffer()
            }
            val p=DoubleArray(9)
            for(i in 0 until vertices step 3) {
                if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
                for(v in 0..2)for(axis in 0..2)p[v*3+axis]=(original.get((i+v)*5+axis)-center[axis])*2/span
                val ux=p[3]-p[0];val uy=p[4]-p[1];val uz=p[5]-p[2]
                val vx=p[6]-p[0];val vy=p[7]-p[1];val vz=p[8]-p[2]
                var nx=uy*vz-uz*vy;var ny=uz*vx-ux*vz;var nz=ux*vy-uy*vx
                var length=sqrt(nx*nx+ny*ny+nz*nz)
                if(length==0.0){nx=0.0;ny=0.0;nz=1.0;length=1.0}
                for(v in 0..2){for(axis in 0..2)render.put(p[v*3+axis].toFloat());render.put((nx/length).toFloat()).put((ny/length).toFloat()).put((nz/length).toFloat())}
            }
            render.position(0)
            StlParser.Mesh(FloatArray(0),vertices*3,prepared=StlParser.Prepared(render,dimensions)).also {
                it.textureCoordinates=original;it.textureStride=20;it.textureOffset=3;it.surfaces=surfaces;it.textures=textures
            }
        } finally { cache.delete() } // Mapping remains valid; storage is released when the mesh is collected.
    }
}

package com.nivek.stlviewer

import java.io.*
import java.nio.ByteBuffer
import java.nio.ByteOrder

/** Private worker transfer format, preserving material batches and embedded images. */
object CadMeshParser {
    data class Surface(val first: Int, val count: Int, val color: FloatArray, val texture: Int, val flags: Int, val cutoff: Float)
    fun read(file: File): StlParser.Mesh = DataInputStream(file.inputStream().buffered()).use { input ->
        fun integer() = Integer.reverseBytes(input.readInt())
        fun scalar(): Float = Float.fromBits(integer()).also { if(!it.isFinite())throw IOException("Invalid material/vertex value.") }
        if(input.readInt()!=0x43564d31)throw IOException("Invalid CAD mesh header.")
        val vertices=integer();val batches=integer();val images=integer()
        if(vertices<=0 || vertices%3!=0 || batches<=0 || images<0 ||
            16L+vertices.toLong()*20+batches.toLong()*36+images.toLong()*4>file.length())throw IOException("Invalid CAD mesh lengths.")
        if(vertices.toLong()*24>Int.MAX_VALUE)throw IOException("Geometry exceeds the runtime buffer capacity.")
        val points=FloatArray(vertices*3)
        val uv=ByteBuffer.allocateDirect(vertices*8).order(ByteOrder.nativeOrder()).asFloatBuffer()
        for(i in 0 until vertices) {
            if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
            for(axis in 0..2)points[i*3+axis]=scalar()
            uv.put(scalar()).put(scalar())
        }
        var next=0L
        val surfaces=List(batches) {
            val first=integer();val count=integer();val color=FloatArray(4){scalar()};val texture=integer();val flags=integer();val cutoff=scalar()
            if(first.toLong()!=next || count<=0 || count%3!=0 || next+count>vertices || texture < -1 || texture>=images ||
                flags !in 0..7 || color.any { it !in 0f..1f } || cutoff !in 0f..1f)throw IOException("Invalid CAD material batch.")
            next+=count
            Surface(first,count,color,texture,flags,cutoff)
        }
        if(next!=vertices.toLong())throw IOException("Incomplete CAD material batches.")
        var remaining=file.length()-(16L+vertices.toLong()*20+batches.toLong()*36)
        val textures=List(images) {
            val length=integer();remaining-=4
            if(length<=0 || length>remaining)throw IOException("Invalid embedded texture length.")
            ByteArray(length).also { input.readFully(it);remaining-=length }
        }
        if(remaining!=0L)throw IOException("Unexpected CAD mesh data.")
        uv.position(0)
        StlParser.Mesh(points,points.size).also { it.textureCoordinates=uv;it.surfaces=surfaces;it.textures=textures }
    }
}

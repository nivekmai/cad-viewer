package com.nivek.stlviewer

import java.nio.ByteBuffer
import java.nio.ByteOrder

/** Reusable staging storage; capacity controls upload size, never model size. */
internal class GeometryBatch(val capacity: Int=32766) {
    val data=ByteBuffer.allocateDirect(capacity*32).order(ByteOrder.nativeOrder()).asFloatBuffer()
    data class Draw(val surface: CadMeshParser.Surface?,val first: Int,val count: Int)
    val draws=ArrayList<Draw>()
    val size: Int get()=data.position()/8
    fun clear() { data.clear(); draws.clear() }
    fun append(mesh: StlParser.Mesh,first: Int,count: Int,surface: CadMeshParser.Surface?,lines: Boolean=false) {
        require(count<=capacity-size)
        val start=size
        val source=if(lines)mesh.lines else mesh.data
        val stride=if(lines)3 else 6
        val uv=if(lines)null else mesh.textureCoordinates
        for(vertex in first until first+count) {
            for(axis in 0..2)data.put(source.get(vertex*stride+axis))
            for(axis in 0..2)data.put(if(lines)0f else source.get(vertex*stride+3+axis))
            for(axis in 0..1)data.put(uv?.get(vertex*(mesh.textureStride/4)+mesh.textureOffset+axis) ?: 0f)
        }
        draws.add(Draw(surface,start,count))
    }
}

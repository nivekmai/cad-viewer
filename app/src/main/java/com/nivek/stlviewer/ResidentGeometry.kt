package com.nivek.stlviewer

import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.roundToInt

/** Upload once per model/context; camera and section changes never touch geometry. */
internal class ResidentGeometry(private val gpu: Gpu) {
    interface Gpu {
        fun allocate(bytes: Int): Int
        fun upload(id: Int, offset: Int, data: ByteBuffer)
        fun delete(id: Int)
    }
    companion object {
        const val STRIDE=28 // xyz + normal as floats, RGBA as normalized bytes
        const val BATCH_VERTICES=32766
    }
    private var model: StlParser.Mesh?=null
    private var buffer=0
    private val staging=ByteBuffer.allocateDirect(BATCH_VERTICES*STRIDE).order(ByteOrder.nativeOrder())
    var transparent=false
        private set

    fun clear() {
        if(buffer!=0)gpu.delete(buffer)
        forgetContext()
    }
    // Old GL names are invalid after context loss; do not delete a recycled name.
    fun forgetContext() { model=null;buffer=0;transparent=false }
    fun ensure(mesh: StlParser.Mesh): Int {
        if(model===mesh)return buffer
        clear()
        val count=mesh.data.capacity()/6
        val bytes=count.toLong()*STRIDE
        check(bytes<=Int.MAX_VALUE) { "Geometry exceeds the graphics buffer capacity." }
        try {
            buffer=gpu.allocate(bytes.toInt())
            check(buffer!=0) { "Could not allocate model geometry." }
            var first=0
            while(first<count) {
                staging.clear()
                val end=minOf(count,first+BATCH_VERTICES)
                for(v in first until end) {
                    for(a in 0..5)staging.putFloat(mesh.data.get(v*6+a))
                    for(c in 0..3) {
                        val value=mesh.vertexColors?.get(v*4+c) ?: 1f
                        if(c==3 && value<1f)transparent=true
                        staging.put((value.coerceIn(0f,1f)*255).roundToInt().toByte())
                    }
                }
                staging.flip();gpu.upload(buffer,first*STRIDE,staging)
                first=end
            }
            model=mesh
            return buffer
        } catch(error: Throwable) { clear();throw error }
    }
}

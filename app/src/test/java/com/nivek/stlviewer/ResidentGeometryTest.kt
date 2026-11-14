package com.nivek.stlviewer

import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import org.junit.Assert.*
import org.junit.Test

class ResidentGeometryTest {
    private class Gpu: ResidentGeometry.Gpu {
        var allocations=0;var uploads=0;var bytes=0L;var deleted=0;var fail=false
        var sample: ByteArray?=null
        override fun allocate(bytes: Int): Int { allocations++;return allocations }
        override fun upload(id: Int,offset: Int,data: ByteBuffer) {
            if(fail)error("upload failed")
            uploads++;bytes+=data.remaining()
            if(offset==0)sample=ByteArray(28).also { data.duplicate().get(it) }
        }
        override fun delete(id: Int) { deleted++ }
    }
    private fun mesh()=StlParser.Mesh(FloatArray(0),9,prepared=StlParser.Prepared(
        FloatBuffer.wrap(floatArrayOf(-1f,-1f,0f,0f,0f,1f,1f,-1f,0f,0f,0f,1f,0f,1f,0f,0f,0f,1f)),doubleArrayOf(2.0,2.0,0.0))).also {
        it.residentGeometry=true
        it.vertexColors=FloatBuffer.wrap(floatArrayOf(1f,0f,.5f,1f,0f,1f,0f,1f,0f,0f,1f,.5f))
    }
    @Test fun repeatedFramesReusePackedGeometry() {
        val gpu=Gpu();val resident=ResidentGeometry(gpu);val mesh=mesh()
        repeat(100) { assertEquals(1,resident.ensure(mesh)) }
        assertEquals(1,gpu.allocations);assertEquals(1,gpu.uploads);assertEquals(84L,gpu.bytes)
        assertTrue(resident.transparent)
        val bytes=ByteBuffer.wrap(gpu.sample!!).order(ByteOrder.nativeOrder())
        for(i in 0..5)assertEquals(mesh.data.get(i),bytes.getFloat(i*4),0f)
        assertEquals(listOf(255,0,128,255),(24..27).map { bytes.get(it).toInt() and 255 })
        assertEquals(0,mesh.data.position());assertEquals(0,mesh.vertexColors!!.position())
    }
    @Test fun replacementContextLossAndFailureReleaseCorrectBuffers() {
        val gpu=Gpu();val resident=ResidentGeometry(gpu);val mesh=mesh()
        resident.ensure(mesh);resident.ensure(mesh());assertEquals(1,gpu.deleted)
        resident.forgetContext();resident.ensure(mesh);assertEquals(1,gpu.deleted);assertEquals(3,gpu.allocations)
        resident.clear();resident.clear();assertEquals(2,gpu.deleted)
        gpu.fail=true
        assertThrows(IllegalStateException::class.java) { resident.ensure(mesh) }
        assertEquals(3,gpu.deleted)
        gpu.fail=false;resident.ensure(mesh);assertEquals(5,gpu.allocations)
    }
    @Test fun privateScansUploadOnceAndRetainEveryVertex() {
        val path=System.getenv("CAD_PLY_TEST_DIR");org.junit.Assume.assumeTrue(path!=null)
        for((file,triangles) in listOf("fridge.ply" to 730205,"sink.ply" to 1492172)) {
            val mesh=PlyParser.read(java.io.File(path!!,file));assertTrue(mesh.residentGeometry)
            val gpu=Gpu();val resident=ResidentGeometry(gpu)
            resident.ensure(mesh)
            val uploads=gpu.uploads
            repeat(120) { resident.ensure(mesh) }
            assertEquals(1,gpu.allocations);assertEquals(uploads,gpu.uploads)
            assertEquals(triangles.toLong()*3*28,gpu.bytes);assertFalse(resident.transparent)
            resident.clear();assertEquals(1,gpu.deleted)
        }
    }
}

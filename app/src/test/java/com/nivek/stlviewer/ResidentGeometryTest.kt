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
        var contents=ByteArray(0)
        override fun allocate(bytes: Int): Int { allocations++;return allocations }
        override fun upload(id: Int,offset: Int,data: ByteBuffer) {
            if(fail)error("upload failed")
            uploads++;bytes+=data.remaining()
            if(bytes<1024) { val copy=ByteArray(data.remaining());data.duplicate().get(copy);contents+=copy }
            if(offset==0)sample=ByteArray(28).also { data.duplicate().get(it) }
        }
        override fun delete(id: Int) { deleted++ }
    }
    private fun mesh()=StlParser.Mesh(FloatArray(0),9,prepared=StlParser.Prepared(
        FloatBuffer.wrap(floatArrayOf(-1f,-1f,0f,0f,0f,1f,1f,-1f,0f,0f,0f,1f,0f,1f,0f,0f,0f,1f)),doubleArrayOf(2.0,2.0,0.0))).also {
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
    @Test fun allMeshFeaturesUseRetainedBuffersWithoutFormatFlags() {
        val mesh=StlParser.Mesh(floatArrayOf(0f,0f,0f,1f,0f,0f,0f,1f,0f),9,floatArrayOf(0f,0f,0f,1f,1f,0f),6)
        mesh.textureCoordinates=FloatBuffer.wrap(floatArrayOf(90f,91f,92f,.25f,.5f,90f,91f,92f,.75f,.5f,90f,91f,92f,.5f,1f))
        mesh.textureStride=20;mesh.textureOffset=3
        val gpu=Gpu();val resident=ResidentGeometry(gpu)
        repeat(3){resident.ensure(mesh)}
        assertEquals(36,resident.stride);assertEquals(180L,gpu.bytes);assertEquals(1,gpu.uploads)
        val packed=ByteBuffer.wrap(gpu.contents).order(ByteOrder.nativeOrder())
        assertEquals(.25f,packed.getFloat(28),0f);assertEquals(.5f,packed.getFloat(32),0f)
        for(v in 0..1)for(a in 0..2)assertEquals(mesh.lines.get(v*3+a),packed.getFloat((v+3)*36+a*4),0f)
        for(c in 24..27)assertEquals(255,packed.get(c).toInt() and 255)
        assertFalse(resident.transparent)
    }
    @Test fun lineOnlyModelsAreRetained() {
        val mesh=StlParser.Mesh(FloatArray(0),0,floatArrayOf(0f,0f,0f,1f,1f,0f),6)
        val gpu=Gpu();val resident=ResidentGeometry(gpu)
        repeat(3){resident.ensure(mesh)}
        assertEquals(56L,gpu.bytes);assertEquals(1,gpu.uploads)
    }
    @Test fun privateScansUploadOnceAndRetainEveryVertex() {
        val path=System.getenv("CAD_PLY_TEST_DIR");org.junit.Assume.assumeTrue(path!=null)
        for((file,triangles) in listOf("fridge.ply" to 730205,"sink.ply" to 1492172)) {
            val mesh=PlyParser.read(java.io.File(path!!,file))
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

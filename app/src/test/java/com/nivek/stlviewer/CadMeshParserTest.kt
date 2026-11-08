package com.nivek.stlviewer

import java.io.File
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import org.junit.Assert.*
import org.junit.Test

class CadMeshParserTest {
    private fun fixture(): ByteArray {
        val b=ByteBuffer.allocate(16+60+36+7).order(ByteOrder.LITTLE_ENDIAN)
        b.put(byteArrayOf(67,86,77,49));b.putInt(3);b.putInt(1);b.putInt(1)
        for(v in arrayOf(floatArrayOf(0f,0f,0f,0f,0f),floatArrayOf(2f,0f,0f,2f,0f),floatArrayOf(0f,2f,0f,0f,2f)))for(f in v)b.putFloat(f)
        b.putInt(0);b.putInt(3);for(f in floatArrayOf(1f,.5f,.25f,1f))b.putFloat(f)
        b.putInt(0);b.putInt(4);b.putFloat(.5f);b.putInt(3);b.put(byteArrayOf(1,2,3))
        return b.array()
    }
    private fun read(bytes: ByteArray): StlParser.Mesh {
        val file=File.createTempFile("cadmesh-test",".cadmesh")
        try {file.writeBytes(bytes);return ModelParser.read(file,file.name)} finally {file.delete()}
    }
    @Test fun preservesUvsMaterialsAndImagesWhileNormalizingPositions() {
        val mesh=read(fixture())
        assertEquals(1,mesh.triangles);assertEquals(2.0,mesh.width,0.0)
        assertEquals(-1f,mesh.data.get(0),0f)
        val uv=FloatArray(6){i->mesh.textureCoordinates!!.get(i/2*5+3+i%2)}
        assertArrayEquals(floatArrayOf(0f,0f,2f,0f,0f,2f),uv,0f)
        assertArrayEquals(byteArrayOf(1,2,3),CadMeshParser.textureStream(mesh.textures.single()).readBytes())
        assertEquals(0,mesh.surfaces.single().texture)
        assertEquals(4,mesh.surfaces.single().flags)
        assertArrayEquals(floatArrayOf(1f,.5f,.25f,1f),mesh.surfaces.single().color,0f)
    }
    @Test(expected=IOException::class) fun rejectsMissingTextureReference() {
        val bytes=fixture();ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).putInt(16+60+24,1);read(bytes)
    }
    @Test(expected=IOException::class) fun rejectsOverlappingOrOutOfRangeBatches() {
        val bytes=fixture();ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).putInt(16+60,3);read(bytes)
    }
    @Test(expected=IOException::class) fun rejectsNonFiniteUvs() {
        val bytes=fixture();ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).putFloat(28,Float.NaN);read(bytes)
    }
    @Test(expected=IOException::class) fun rejectsTruncatedImage() {read(fixture().dropLast(1).toByteArray())}
    @Test(expected=IOException::class) fun rejectsImpossibleAllocationBeforeAllocating() {
        val bytes=fixture();ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).putInt(4,Int.MAX_VALUE-1);read(bytes)
    }
    // Minimal CVM2: one static triangle, one instanced resource (one
    // identity placement), one embedded texture.
    private fun fixtureV2(): ByteArray {
        val b=ByteBuffer.allocate(24+60+36+8+60+36+68+4+3).order(ByteOrder.LITTLE_ENDIAN)
        b.put(byteArrayOf(67,86,77,50));b.putInt(3);b.putInt(1);b.putInt(1);b.putInt(1);b.putInt(1)
        for(v in arrayOf(floatArrayOf(0f,0f,0f,0f,0f),floatArrayOf(2f,0f,0f,2f,0f),floatArrayOf(0f,2f,0f,0f,2f)))for(f in v)b.putFloat(f)
        b.putInt(0);b.putInt(3);for(f in floatArrayOf(1f,.5f,.25f,1f))b.putFloat(f)
        b.putInt(0);b.putInt(4);b.putFloat(.5f)
        b.putInt(3);b.putInt(1)
        for(v in arrayOf(floatArrayOf(0f,0f,0f,0f,0f),floatArrayOf(2f,0f,0f,2f,0f),floatArrayOf(0f,2f,0f,0f,2f)))for(f in v)b.putFloat(f)
        b.putInt(0);b.putInt(3);for(f in floatArrayOf(0f,1f,0f,1f))b.putFloat(f)
        b.putInt(-1);b.putInt(0);b.putFloat(.5f)
        b.putInt(0)
        for(f in floatArrayOf(1f,0f,0f,0f,0f,1f,0f,0f,0f,0f,1f,0f,0f,0f,0f,1f))b.putFloat(f)
        b.putInt(3);b.put(byteArrayOf(1,2,3))
        return b.array()
    }
    @Test fun instancedMeshPreservesStaticAndPlacedTriangles() {
        val mesh=read(fixtureV2())
        assertEquals(2,mesh.triangles)
        assertEquals(2.0,mesh.width,0.0)
        assertEquals(-1f,mesh.data.get(0),0f)
        assertEquals(1,mesh.resources.size)
        val resource=mesh.resources.single()
        assertEquals(3,resource.count)
        assertEquals(1,resource.instances.size)
        // Normalization (center 1,1, span 2) is folded into the instance
        // matrix once, at load: scale 1, translate -1,-1.
        val matrix=resource.instances.single()
        assertEquals(1f,matrix[0],0f);assertEquals(-1f,matrix[12],0f);assertEquals(-1f,matrix[13],0f);assertEquals(0f,matrix[14],0f)
        assertEquals(0,mesh.surfaces.single().texture)
        assertEquals(-1,resource.surfaces.single().texture)
        assertArrayEquals(byteArrayOf(1,2,3),CadMeshParser.textureStream(mesh.textures.single()).readBytes())
        assertNotNull(mesh.resourceData)
        assertEquals(3,mesh.resourceData!!.capacity()/6)
        val uv=FloatArray(2){resource.uvs.get(3+it)}
        assertArrayEquals(floatArrayOf(0f,0f),uv,0f)
    }
    @Test(expected=IOException::class) fun instancedMeshRejectsUnknownResourceReference() {
        val bytes=fixtureV2();ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).putInt(24+60+36+8+60+36,1);read(bytes)
    }
    @Test(expected=IOException::class) fun instancedMeshRejectsTruncatedTexture() {read(fixtureV2().dropLast(1).toByteArray())}
}

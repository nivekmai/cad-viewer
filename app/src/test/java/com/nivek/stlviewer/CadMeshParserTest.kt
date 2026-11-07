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
        val uv=FloatArray(6);mesh.textureCoordinates!!.get(uv)
        assertArrayEquals(floatArrayOf(0f,0f,2f,0f,0f,2f),uv,0f)
        assertArrayEquals(byteArrayOf(1,2,3),mesh.textures.single())
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
}

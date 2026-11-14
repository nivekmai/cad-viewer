package com.nivek.stlviewer

import java.io.File
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import org.junit.Assert.*
import org.junit.Test

class PlyParserTest {
    private fun parse(bytes: ByteArray): StlParser.Mesh {
        val dir=kotlin.io.path.createTempDirectory("ply-test").toFile()
        return try { val f=File(dir,"test.ply"); f.writeBytes(bytes); val mesh=ModelParser.read(f,f.name)
            assertEquals(listOf("test.ply"),dir.list()!!.toList()); mesh
        } finally { dir.deleteRecursively() }
    }
    private val properties="property float x\nproperty float y\nproperty float z\nproperty uchar red\nproperty uchar green\nproperty uchar blue\nproperty uchar reserved\n"
    private fun header(format: String, faces: Boolean=true)="ply\nformat $format 1.0\nelement vertex 3\n$properties"+(if(faces)"element face 1\nproperty list uchar int vertex_index\n" else "")+"end_header\n"
    private val vertices="0 0 0 255 0 0 0\n2 0 0 0 255 0 0\n0 2 0 0 0 255 0\n"
    private fun checkTriangle(mesh: StlParser.Mesh) {
        assertEquals(1,mesh.triangles); assertEquals(2.0,mesh.width,0.0)
        assertEquals(-1f,mesh.data.get(0),0f); assertEquals(1f,mesh.data.get(5),0f)
        val colors=mesh.vertexColors!!
        assertEquals(1f,colors.get(0),0f); assertEquals(1f,colors.get(5),0f); assertEquals(1f,colors.get(10),0f)
        for(i in 0..2)assertEquals(1f,colors.get(i*4+3),0f) // reserved is NOT alpha
        val batch=GeometryBatch(3);batch.append(mesh,0,3,null)
        for(v in 0..2)for(c in 0..3)assertEquals(colors.get(v*4+c),batch.data.get(v*12+8+c),0f)
        assertNotNull(SectionClip.pick(mesh,floatArrayOf(0f,0f,1f),floatArrayOf(0f,0f,-1f)))
    }
    @Test fun asciiColorsAndSection()=checkTriangle(parse((header("ascii")+vertices+"3 0 1 2\n").toByteArray()))
    @Test fun bothBinaryOrders() {
        for(order in listOf(ByteOrder.LITTLE_ENDIAN,ByteOrder.BIG_ENDIAN)) {
            val b=ByteBuffer.allocate(61).order(order)
            for(i in 0..2) { b.putFloat(if(i==1)2f else 0f).putFloat(if(i==2)2f else 0f).putFloat(0f)
                for(c in 0..2)b.put(if(c==i)255.toByte() else 0); b.put(0) }
            b.put(3).putInt(0).putInt(1).putInt(2)
            checkTriangle(parse(header(if(order==ByteOrder.LITTLE_ENDIAN)"binary_little_endian" else "binary_big_endian").toByteArray()+b.array()))
        }
    }
    @Test fun pointCloud() {
        val mesh=parse((header("ascii",false)+vertices).toByteArray())
        assertEquals(3,mesh.pointCount);assertEquals(0,mesh.triangles);assertEquals(18,mesh.data.capacity())
    }
    @Test fun arbitraryElementOrderUnknownListsAndAlpha() {
        val text="""ply
format ascii 1.0
element face 1
property list uchar int vertex_indices
property float confidence
element junk 1
property list uchar double unused
element vertex 3
property uchar blue
property double z
property double x
property uchar alpha
property uchar green
property double y
property uchar red
end_header
3 0 1 2 0.9
2 99 100
0 0 0 128 0 0 255
0 0 2 255 255 0 0
255 0 0 255 0 2 0
"""
        val mesh=parse(text.toByteArray());assertEquals(1,mesh.triangles);assertEquals(128f/255,mesh.vertexColors!!.get(3),0.00001f)
    }
    @Test fun concavePolygon() {
        val text="ply\nformat ascii 1.0\nelement vertex 5\nproperty float x\nproperty float y\nproperty float z\nelement face 1\nproperty list uchar int vertex_indices\nend_header\n0 0 0\n2 0 0\n2 2 0\n1 1 0\n0 2 0\n5 0 1 2 3 4\n"
        val mesh=parse(text.toByteArray());assertEquals(3,mesh.triangles);assertNull(mesh.vertexColors)
    }
    @Test fun rejectsInvalidAndTruncatedData() {
        for(body in listOf("3 0 1 3","3 0 -1 2","3 0 1","3 0 1 1.5","2 0 1")) {
            assertThrows(IOException::class.java) { parse((header("ascii")+vertices+body).toByteArray()) }
        }
        assertThrows(IOException::class.java) { parse((header("ascii")+vertices.replace("2 0 0","NaN 0 0")+"3 0 1 2").toByteArray()) }
    }
    @Test fun privateScansWhenAvailable() {
        val path=System.getenv("CAD_PLY_TEST_DIR");org.junit.Assume.assumeTrue(path!=null)
        for((name,triangles) in listOf("fridge.ply" to 730205,"sink.ply" to 1492172)) {
            val mesh=PlyParser.read(File(path!!,name));assertEquals(triangles,mesh.triangles)
            assertEquals(triangles*18,mesh.data.capacity());assertEquals(triangles*12,mesh.vertexColors!!.capacity())
            val batch=GeometryBatch();var offset=0
            while(offset<triangles*3) {
                val n=minOf(batch.capacity,triangles*3-offset);batch.clear();batch.append(mesh,offset,n,null)
                for(v in intArrayOf(0,n-1)) { for(a in 0..5)assertTrue(batch.data.get(v*12+a).isFinite());assertEquals(1f,batch.data.get(v*12+11),0f) }
                offset+=n
            }
        }
    }
}

package com.nivek.stlviewer

import java.nio.FloatBuffer
import org.junit.Assert.*
import org.junit.Test

class GeometryBatchTest {
    private fun mesh(vertices: Int): StlParser.Mesh {
        val mesh=StlParser.Mesh(FloatArray(0),vertices*3,prepared=StlParser.Prepared(FloatBuffer.wrap(FloatArray(vertices*6){it.toFloat()}),doubleArrayOf(1.0,1.0,1.0)))
        mesh.textureCoordinates=FloatBuffer.wrap(FloatArray(vertices*5){it.toFloat()})
        mesh.textureStride=20; mesh.textureOffset=3
        return mesh
    }
    @Test fun rebasesHighVertexOffsetsAndPreservesInterleavedUvs() {
        val mesh=mesh(60000); val batch=GeometryBatch(12)
        val surface=CadMeshParser.Surface(59994,6,floatArrayOf(1f,1f,1f,1f),0,0,0f)
        batch.append(mesh,surface.first,3,surface)
        batch.append(mesh,surface.first+3,3,surface)
        assertEquals(6,batch.size); assertEquals(listOf(0,3),batch.draws.map { it.first })
        for(v in 0..5) {
            for(a in 0..5)assertEquals(mesh.data.get((59994+v)*6+a),batch.data.get(v*8+a),0f)
            for(a in 0..1)assertEquals(mesh.textureCoordinates!!.get((59994+v)*5+3+a),batch.data.get(v*8+6+a),0f)
        }
        assertEquals(0,mesh.data.position()); assertEquals(0,mesh.textureCoordinates!!.position())
    }
    @Test fun reusesStorageAcrossMoreThanOneBatchWithoutDroppingTail() {
        val mesh=mesh(32769); val batch=GeometryBatch()
        batch.append(mesh,0,batch.capacity,null)
        assertEquals(32766,batch.size)
        val storage=batch.data
        batch.clear();batch.append(mesh,32766,3,null)
        assertSame(storage,batch.data);assertEquals(3,batch.size)
        assertEquals(mesh.data.get(32768*6),batch.data.get(16),0f)
        assertEquals(1,batch.draws.size)
    }
    @Test fun linesGetPositionsWithoutTextureOrNormalData() {
        val mesh=StlParser.Mesh(FloatArray(0),0,floatArrayOf(0f,0f,0f,1f,1f,1f),6)
        val batch=GeometryBatch(6);batch.append(mesh,0,2,null,true)
        for(v in 0..1) {
            for(a in 0..2)assertEquals(mesh.lines.get(v*3+a),batch.data.get(v*8+a),0f)
            for(a in 3..7)assertEquals(0f,batch.data.get(v*8+a),0f)
        }
    }
    @Test fun privateModelStreamsAllSurfaceVerticesWhenProvided() {
        val path=System.getenv("CAD_PRIVATE_MESH")
        org.junit.Assume.assumeTrue(path!=null)
        val mesh=CadMeshParser.read(java.io.File(path!!))
        val batch=GeometryBatch();var total=0L
        for(surface in mesh.surfaces) {
            var offset=surface.first;var remaining=surface.count
            while(remaining>0) {
                val n=minOf(remaining,batch.capacity)
                batch.clear();batch.append(mesh,offset,n,surface)
                assertEquals(n,batch.size)
                for(v in intArrayOf(0,n-1)) {
                    for(a in 0..5)assertEquals(mesh.data.get((offset+v)*6+a),batch.data.get(v*8+a),0f)
                    for(a in 0..1)assertEquals(mesh.textureCoordinates!!.get((offset+v)*5+3+a),batch.data.get(v*8+6+a),0f)
                }
                total+=n; offset+=n;remaining-=n
            }
        }
        assertEquals(9034545L,total)
    }
}

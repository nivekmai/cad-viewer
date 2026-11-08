package com.nivek.stlviewer

import android.opengl.Matrix
import java.io.*
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import java.nio.channels.FileChannel
import kotlin.math.sqrt

/** Disk-backed geometry and texture views avoid retaining model-sized heap arrays. */
object CadMeshParser {
    data class Surface(val first: Int, val count: Int, val color: FloatArray, val texture: Int, val flags: Int, val cutoff: Float)
    /** One instanced (CVM2) resource: definition-local soup geometry, drawn
     * once per placement matrix. [first] is the resource's vertex offset in
     * the mesh's concatenated resource render buffer; [uvs] is the mapped
     * 5-float-per-vertex (xyz + uv) source for those vertices. */
    data class Resource(val first: Int, val count: Int, val surfaces: List<Surface>, val instances: List<FloatArray>, val uvs: FloatBuffer)
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
        when (input.readInt()) {
            0x43564d32 -> readV2(input, file)
            0x43564d31 -> readV1(input, file)
            else -> throw IOException("Invalid CAD mesh header.")
        }
    }
    private fun readV1(input: RandomAccessFile, file: File): StlParser.Mesh {
        fun integer() = Integer.reverseBytes(input.readInt())
        fun scalar(): Float = Float.fromBits(integer()).also { if(!it.isFinite())throw IOException("Invalid material/vertex value.") }
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
        return try {
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
    /** Bulk soup renderer: positions are normalized and flat face normals are
     * computed per triangle, reading the source in 1,024-triangle chunks
     * instead of one FloatBuffer.get() per vertex (the V1 loop's cost on
     * multi-million-vertex models). [out] is positioned at the first vertex
     * to write. */
    private fun renderSoup(source: FloatBuffer, vertices: Int, out: FloatBuffer, center: DoubleArray, scale: Double) {
        val chunkVerts=1024*3
        val tri=FloatArray(chunkVerts*5)
        var done=0
        while(done<vertices) {
            if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
            val n=minOf(chunkVerts,vertices-done)
            source.position(done*5); source.get(tri,0,n*5)
            val rendered=FloatArray(n*6)
            var o=0
            var i=0
            while(i<n) {
                val p=DoubleArray(9)
                for(v in 0..2)for(axis in 0..2)p[v*3+axis]=(tri[(i+v)*5+axis]-center[axis])*scale
                val ux=p[3]-p[0];val uy=p[4]-p[1];val uz=p[5]-p[2]
                val vx=p[6]-p[0];val vy=p[7]-p[1];val vz=p[8]-p[2]
                var nx=uy*vz-uz*vy;var ny=uz*vx-ux*vz;var nz=ux*vy-uy*vx
                var length=sqrt(nx*nx+ny*ny+nz*nz)
                if(length==0.0){nx=0.0;ny=0.0;nz=1.0;length=1.0}
                val nxf=(nx/length).toFloat();val nyf=(ny/length).toFloat();val nzf=(nz/length).toFloat()
                for(v in 0..2){for(axis in 0..2)rendered[o++]=p[v*3+axis].toFloat();rendered[o++]=nxf;rendered[o++]=nyf;rendered[o++]=nzf}
                i+=3
            }
            out.put(rendered)
            done+=n
        }
    }
    private fun bounds(source: FloatBuffer, vertices: Int, min: DoubleArray, max: DoubleArray) {
        val chunk=FloatArray(8192*5)
        var done=0
        while(done<vertices) {
            if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
            val n=minOf(8192,vertices-done)
            source.position(done*5); source.get(chunk,0,n*5)
            for(i in 0 until n)for(axis in 0..2) {
                val value=chunk[i*5+axis]
                if(!value.isFinite())throw IOException("Invalid material/vertex value.")
                min[axis]=minOf(min[axis],value.toDouble());max[axis]=maxOf(max[axis],value.toDouble())
            }
            done+=n
        }
    }
    private fun readV2(input: RandomAccessFile, file: File): StlParser.Mesh {
        fun integer() = Integer.reverseBytes(input.readInt())
        fun scalar(): Float = Float.fromBits(integer()).also { if(!it.isFinite())throw IOException("Invalid material/vertex value.") }
        fun surface(images: Int, vertices: Int): Surface {
            val first=integer();val count=integer();val color=FloatArray(4){scalar()};val texture=integer();val flags=integer();val cutoff=scalar()
            if(first<0 || count<=0 || count%3!=0 || first.toLong()+count>vertices || texture < -1 || texture>=images ||
                flags !in 0..7 || color.any { it !in 0f..1f } || cutoff !in 0f..1f)throw IOException("Invalid CAD material batch.")
            return Surface(first,count,color,texture,flags,cutoff)
        }
        val staticVertices=integer();val staticBatches=integer();val resourceCount=integer();val instanceCount=integer();val images=integer()
        if(staticVertices<0 || staticVertices%3!=0 || staticBatches<0 || resourceCount<0 || instanceCount<0 || images<0 ||
            24L+staticVertices.toLong()*20+staticBatches.toLong()*36+instanceCount.toLong()*68+images.toLong()*4>file.length())throw IOException("Invalid CAD mesh lengths.")
        if(staticVertices.toLong()*24>Int.MAX_VALUE)throw IOException("Geometry exceeds the runtime buffer capacity.")
        val min=DoubleArray(3){Double.POSITIVE_INFINITY};val max=DoubleArray(3){Double.NEGATIVE_INFINITY}
        val staticSource=input.channel.map(FileChannel.MapMode.READ_ONLY,24,staticVertices.toLong()*20).order(ByteOrder.LITTLE_ENDIAN).asFloatBuffer()
        bounds(staticSource,staticVertices,min,max)
        input.seek(24L+staticVertices.toLong()*20)
        var next=0
        val staticSurfaces=List(staticBatches) {
            val s=surface(images,staticVertices)
            if(s.first!=next)throw IOException("Invalid CAD material batch.")
            next+=s.count; s
        }
        if(next!=staticVertices)throw IOException("Incomplete CAD material batches.")
        // Resources: definition-local geometry, mapped in place.
        data class RawResource(val source: FloatBuffer, val vertices: Int, val surfaces: List<Surface>, val localMin: DoubleArray, val localMax: DoubleArray)
        val rawResources=ArrayList<RawResource>(resourceCount)
        var totalResourceVertices=0L
        for(r in 0 until resourceCount) {
            val verts=integer();val batches=integer()
            if(verts<=0 || verts%3!=0 || batches<=0 || verts.toLong()*20+batches.toLong()*36>file.length()-input.filePointer)throw IOException("Invalid CAD mesh lengths.")
            totalResourceVertices+=verts
            if(totalResourceVertices*24>Int.MAX_VALUE)throw IOException("Geometry exceeds the runtime buffer capacity.")
            val source=input.channel.map(FileChannel.MapMode.READ_ONLY,input.filePointer,verts.toLong()*20).order(ByteOrder.LITTLE_ENDIAN).asFloatBuffer()
            val localMin=DoubleArray(3){Double.POSITIVE_INFINITY};val localMax=DoubleArray(3){Double.NEGATIVE_INFINITY}
            bounds(source,verts,localMin,localMax)
            input.seek(input.filePointer+verts.toLong()*20)
            var rnext=0
            val surfaces=List(batches) {
                val s=surface(images,verts)
                if(s.first!=rnext)throw IOException("Invalid CAD material batch.")
                rnext+=s.count; s
            }
            if(rnext!=verts)throw IOException("Incomplete CAD material batches.")
            rawResources.add(RawResource(source,verts,surfaces,localMin,localMax))
        }
        // Instances: resource index + column-major world matrix (viewer frame, mm).
        val rawInstances=ArrayList<Pair<Int,FloatArray>>(instanceCount)
        for(i in 0 until instanceCount) {
            val resource=integer()
            if(resource<0 || resource>=resourceCount)throw IOException("Invalid CAD instance reference.")
            val matrix=FloatArray(16)
            for(j in 0 until 16)matrix[j]=scalar()
            rawInstances.add(resource to matrix)
        }
        // Bounds must include placed instances: transform each resource's
        // local corners by its instance matrices (8 corners per instance).
        for((resource,matrix) in rawInstances) {
            val raw=rawResources[resource]
            for(cx in 0..1)for(cy in 0..1)for(cz in 0..1) {
                val x=if(cx==0)raw.localMin[0] else raw.localMax[0]
                val y=if(cy==0)raw.localMin[1] else raw.localMax[1]
                val z=if(cz==0)raw.localMin[2] else raw.localMax[2]
                val wx=matrix[0]*x+matrix[4]*y+matrix[8]*z+matrix[12]
                val wy=matrix[1]*x+matrix[5]*y+matrix[9]*z+matrix[13]
                val wz=matrix[2]*x+matrix[6]*y+matrix[10]*z+matrix[14]
                min[0]=minOf(min[0],wx.toDouble());max[0]=maxOf(max[0],wx.toDouble())
                min[1]=minOf(min[1],wy.toDouble());max[1]=maxOf(max[1],wy.toDouble())
                min[2]=minOf(min[2],wz.toDouble());max[2]=maxOf(max[2],wz.toDouble())
            }
        }
        val textures=List(images) {
            val length=integer();val offset=input.filePointer
            if(length<=0 || length>file.length()-offset)throw IOException("Invalid embedded texture length.")
            input.channel.map(FileChannel.MapMode.READ_ONLY,offset,length.toLong()).also { input.seek(offset+length) }
        }
        if(input.filePointer!=file.length())throw IOException("Unexpected CAD mesh data.")
        val dimensions=DoubleArray(3){max[it]-min[it]};val span=dimensions.max()
        if(span==0.0)throw IOException("This file has no visible geometry.")
        val center=DoubleArray(3){(min[it]+max[it])/2}
        val scale=2.0/span
        // Normalize instance matrices once, at load: normalized = Norm * M,
        // where Norm scales by 2/span and translates by -center.
        val norm=FloatArray(16)
        Matrix.setIdentityM(norm,0)
        norm[0]=scale.toFloat();norm[5]=scale.toFloat();norm[10]=scale.toFloat()
        norm[12]=(-center[0]*scale).toFloat();norm[13]=(-center[1]*scale).toFloat();norm[14]=(-center[2]*scale).toFloat()
        val instancesByResource=Array(resourceCount){ArrayList<FloatArray>()}
        for((resource,matrix) in rawInstances) {
            val normalized=FloatArray(16)
            Matrix.multiplyMM(normalized,0,norm,0,matrix,0)
            instancesByResource[resource].add(normalized)
        }
        val renderedVertices=staticVertices.toLong()+rawInstances.sumOf { rawResources[it.first].vertices.toLong() }
        if(renderedVertices*3>Int.MAX_VALUE)throw IOException("Geometry exceeds the runtime buffer capacity.")
        val staticCache=File.createTempFile("render-",".bin",file.parentFile)
        val resourceCache=if(totalResourceVertices>0)File.createTempFile("render-res-",".bin",file.parentFile) else null
        return try {
            val staticRender=if(staticVertices>0) RandomAccessFile(staticCache,"rw").use { out ->
                out.setLength(staticVertices.toLong()*24)
                out.channel.map(FileChannel.MapMode.READ_WRITE,0,staticVertices.toLong()*24).order(ByteOrder.nativeOrder()).asFloatBuffer()
            } else ByteBuffer.allocateDirect(0).order(ByteOrder.nativeOrder()).asFloatBuffer()
            renderSoup(staticSource,staticVertices,staticRender,center,scale)
            staticRender.position(0)
            val resourceRender=resourceCache?.let {
                RandomAccessFile(it,"rw").use { out ->
                    out.setLength(totalResourceVertices*24)
                    out.channel.map(FileChannel.MapMode.READ_WRITE,0,totalResourceVertices*24).order(ByteOrder.nativeOrder()).asFloatBuffer()
                }
            }
            val resources=ArrayList<Resource>(resourceCount)
            var first=0
            for((index,raw) in rawResources.withIndex()) {
                resourceRender?.let { it.position(first*6); renderSoup(raw.source,raw.vertices,it,center,scale) }
                resources.add(Resource(first,raw.vertices,raw.surfaces,instancesByResource[index],raw.source))
                first+=raw.vertices
            }
            resourceRender?.position(0)
            StlParser.Mesh(FloatArray(0),(renderedVertices*3).toInt(),prepared=StlParser.Prepared(staticRender,dimensions)).also {
                it.textureCoordinates=staticSource;it.textureStride=20;it.textureOffset=3
                it.surfaces=staticSurfaces;it.textures=textures
                it.resources=resources;it.resourceData=resourceRender
            }
        } finally { staticCache.delete(); resourceCache?.delete() } // Mappings remain valid; storage is released when the mesh is collected.
    }
}

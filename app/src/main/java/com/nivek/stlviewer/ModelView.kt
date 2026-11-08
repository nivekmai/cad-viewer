package com.nivek.stlviewer

import android.annotation.SuppressLint
import android.content.Context
import android.opengl.GLUtils
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.opengl.Matrix
import android.view.GestureDetector
import android.view.MotionEvent
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10
import kotlin.math.hypot
import kotlin.math.sqrt

class ModelView(context: Context, private val onRenderError: (String) -> Unit) : GLSurfaceView(context) {
    private val scene=Scene { message -> post { onRenderError(message) } }
    private val taps: GestureDetector
    private var lastX=0f; private var lastY=0f; private var lastSpan=0f
    private var pointers=0
    init {
        setEGLContextClientVersion(2); setEGLConfigChooser(8,8,8,8,16,0)
        preserveEGLContextOnPause=true; setRenderer(scene); renderMode=RENDERMODE_WHEN_DIRTY
        contentDescription="3D model. Drag to rotate. Two fingers to pan and pinch to zoom. Double tap to reset."
        taps=GestureDetector(context,object: GestureDetector.SimpleOnGestureListener() {
            override fun onDown(e: MotionEvent)=true
            override fun onDoubleTap(e: MotionEvent): Boolean { reset(); return true }
            override fun onSingleTapConfirmed(e: MotionEvent): Boolean {
                performClick()
                if(sectionPicking)pickAt(e.x,e.y)
                return true
            }
        })
    }
    fun show(mesh: StlParser.Mesh) { queueEvent { scene.mesh=mesh; scene.clipEnabled=false; scene.clipSign=1f; scene.reset() }; requestRender() }
    fun reset() { queueEvent(scene::reset); requestRender() }
    // Cross-section analysis. Arming makes the next single tap pick a face
    // instead of doing nothing; the picked face places the cut plane, and
    // the slider moves it. Clearing only turns the clip uniforms off, so
    // the model stays uploaded and is never reloaded.
    private var sectionPicking=false
    var onSectionPicked: ((SectionClip.Pick?, Float, Float) -> Unit)?=null
    fun setSectionPicking(enabled: Boolean) { sectionPicking=enabled }
    fun setSectionOffset(offset: Float) {
        queueEvent { synchronized(scene) { if(scene.clipEnabled)scene.clipPlane[3]=-offset } }; requestRender()
    }
    fun flipSection() {
        queueEvent { synchronized(scene) { if(scene.clipEnabled)scene.clipSign=-scene.clipSign } }; requestRender()
    }
    fun clearSection() {
        sectionPicking=false
        queueEvent { synchronized(scene) { scene.clipEnabled=false; scene.clipSign=1f } }; requestRender()
    }
    private fun pickAt(x: Float,y: Float) {
        val w=width.toFloat(); val h=height.toFloat()
        if(w<=0f || h<=0f)return
        queueEvent {
            // A pick failure must never take the GL thread (and the app)
            // down with it; report it as no face picked instead.
            val result=try { synchronized(scene) { scene.pick(x,y,w,h) } } catch(_: RuntimeException) { null }
            post { onSectionPicked?.invoke(result?.first,result?.second ?: 0f,result?.third ?: 0f) }
        }
    }
    fun topView() {
        queueEvent { synchronized(scene) { scene.pitch=0f; scene.yaw=0f; scene.panX=0f; scene.panY=0f; scene.zoom=1f } }; requestRender()
    }
    fun camera(): FloatArray = synchronized(scene) { floatArrayOf(scene.pitch,scene.yaw,scene.panX,scene.panY,scene.zoom) }
    fun restore(camera: FloatArray?) {
        if(camera==null || camera.size!=5)return
        queueEvent { synchronized(scene) { scene.pitch=camera[0]; scene.yaw=camera[1]; scene.panX=camera[2]; scene.panY=camera[3]; scene.zoom=camera[4] } }
        requestRender()
    }
    override fun performClick(): Boolean { super.performClick(); return true }
    @SuppressLint("ClickableViewAccessibility") // GestureDetector calls performClick for taps.
    override fun onTouchEvent(event: MotionEvent): Boolean {
        taps.onTouchEvent(event)
        val action=event.actionMasked; val count=event.pointerCount
        if(action==MotionEvent.ACTION_UP || action==MotionEvent.ACTION_CANCEL || action==MotionEvent.ACTION_POINTER_UP) { pointers=0; return true }
        var x=event.x; var y=event.y; var span=0f
        if(count>=2) {
            x=(x+event.getX(1))/2; y=(y+event.getY(1))/2
            span=hypot(event.getX(1)-event.x,event.getY(1)-event.y)
        }
        if(action==MotionEvent.ACTION_MOVE && pointers==count) {
            val dx=x-lastX; val dy=y-lastY
            val factor=if(lastSpan>10 && span>10)span/lastSpan else 1f
            val viewHeight=maxOf(1,height)
            queueEvent { synchronized(scene) {
                if(count==1) { scene.yaw+=dx*.4f; scene.pitch+=dy*.4f }
                else {
                    val units=scene.verticalExtent()*2/viewHeight
                    scene.panX+=dx*units; scene.panY-=dy*units; scene.zoom=(scene.zoom*factor).coerceIn(.08f,30f)
                }
            } }
            requestRender()
        }
        pointers=count; lastX=x; lastY=y; lastSpan=span
        return true
    }
    private class Scene(val onError: (String) -> Unit) : Renderer {
        var mesh: StlParser.Mesh?=null
        var pitch=-62f; var yaw=-28f; var panX=0f; var panY=0f; var zoom=1f; var aspect=1f
        // Section clip plane, in model space: keep fragments where
        // dot(position, normal) <= offset. clipPlane stores (nx, ny, nz, -offset).
        var clipSign=1f
        var clipEnabled=false
        var clipPlane=FloatArray(4)
        private var program=0; private var position=0; private var normal=0; private var mvpLocation=0; private var normalMatrixLocation=0; private var unlitLocation=0
        private var uvLocation=0; private var colorLocation=0; private var texturedLocation=0; private var samplerLocation=0; private var cutoffLocation=0
        private var localLocation=0; private var clipPlaneLocation=0; private var clipEnabledLocation=0; private var clipSignLocation=0
        private val identity=FloatArray(16).apply { Matrix.setIdentityM(this,0) }
        private var whiteTexture=0
        private var geometryBuffer=0
        private var instancedVbos=IntArray(0)
        private var uploadedInstancedMesh: StlParser.Mesh?=null
        private val batch=GeometryBatch()
        private var uploadedMesh: StlParser.Mesh?=null
        private var textureIds=IntArray(0)
        private val model=FloatArray(16); private val projection=FloatArray(16); private val mvp=FloatArray(16)
        private val tmpModel=FloatArray(16); private val tmpMvp=FloatArray(16)
        @Synchronized fun reset() {
            pitch=if(mesh?.height==0.0)0f else -62f; yaw=if(mesh?.height==0.0)0f else -28f
            panX=0f; panY=0f; zoom=1f
        }
        fun verticalExtent()=1.9f/minOf(1f,aspect)/zoom
        override fun onSurfaceCreated(unused: GL10?,config: EGLConfig?) {
            GLES20.glClearColor(.063f,.09f,.122f,1f); GLES20.glEnable(GLES20.GL_DEPTH_TEST)
            val white=IntArray(1); GLES20.glGenTextures(1,white,0);whiteTexture=white[0]
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,whiteTexture)
            GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_MIN_FILTER,GLES20.GL_LINEAR)
            GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_MAG_FILTER,GLES20.GL_LINEAR)
            GLES20.glTexImage2D(GLES20.GL_TEXTURE_2D,0,GLES20.GL_RGBA,1,1,0,GLES20.GL_RGBA,GLES20.GL_UNSIGNED_BYTE,java.nio.ByteBuffer.allocateDirect(4).apply { putInt(-1);position(0) })
            uploadedMesh=null; textureIds=IntArray(0) // GL names cannot survive context loss.
            uploadedInstancedMesh=null; instancedVbos=IntArray(0)
            val buffers=IntArray(1); GLES20.glGenBuffers(1,buffers,0); geometryBuffer=buffers[0]
            GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER,geometryBuffer)
            GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER,batch.capacity*32,null,GLES20.GL_STREAM_DRAW)
            val vertex="uniform mat4 uMvp; uniform mat4 uLocal; uniform mat3 uNormalMatrix; attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aUv; varying vec3 vNormal; varying vec2 vUv; varying vec3 vModelPos; void main(){ gl_Position=uMvp*vec4(aPosition,1.0); vNormal=uNormalMatrix*aNormal; vUv=aUv; vModelPos=(uLocal*vec4(aPosition,1.0)).xyz; }"
            val fragment="precision mediump float; uniform float uUnlit; uniform vec4 uColor; uniform float uTextured; uniform sampler2D uTexture; uniform float uCutoff; uniform float uClipEnabled; uniform float uClipSign; uniform vec4 uClipPlane; varying vec3 vNormal; varying vec2 vUv; varying vec3 vModelPos; void main(){ if(uClipEnabled>0.5 && (dot(vModelPos,uClipPlane.xyz)+uClipPlane.w)*uClipSign>0.0)discard; if(uUnlit>0.5){gl_FragColor=vec4(0.44,0.90,0.79,1.0);return;} vec4 base=uColor; if(uTextured>0.5){vec4 tex=texture2D(uTexture,vUv); if(tex.a>0.0)tex.rgb/=tex.a; base*=tex;} if(base.a<uCutoff)discard; vec3 n=normalize(vNormal); if(!gl_FrontFacing)n=-n; float light=0.30+0.70*max(dot(n,normalize(vec3(-0.4,0.7,1.0))),0.0); gl_FragColor=vec4(base.rgb*light,base.a); }"
            val vs=shader(GLES20.GL_VERTEX_SHADER,vertex); val fs=shader(GLES20.GL_FRAGMENT_SHADER,fragment)
            program=GLES20.glCreateProgram()
            GLES20.glAttachShader(program,vs); GLES20.glAttachShader(program,fs); GLES20.glLinkProgram(program)
            val ok=IntArray(1); GLES20.glGetProgramiv(program,GLES20.GL_LINK_STATUS,ok,0)
            check(ok[0]!=0) { GLES20.glGetProgramInfoLog(program) }
            GLES20.glDeleteShader(vs); GLES20.glDeleteShader(fs)
            position=GLES20.glGetAttribLocation(program,"aPosition"); normal=GLES20.glGetAttribLocation(program,"aNormal")
            uvLocation=GLES20.glGetAttribLocation(program,"aUv"); colorLocation=GLES20.glGetUniformLocation(program,"uColor")
            texturedLocation=GLES20.glGetUniformLocation(program,"uTextured"); samplerLocation=GLES20.glGetUniformLocation(program,"uTexture"); cutoffLocation=GLES20.glGetUniformLocation(program,"uCutoff")
            mvpLocation=GLES20.glGetUniformLocation(program,"uMvp"); normalMatrixLocation=GLES20.glGetUniformLocation(program,"uNormalMatrix"); unlitLocation=GLES20.glGetUniformLocation(program,"uUnlit")
            localLocation=GLES20.glGetUniformLocation(program,"uLocal"); clipPlaneLocation=GLES20.glGetUniformLocation(program,"uClipPlane"); clipEnabledLocation=GLES20.glGetUniformLocation(program,"uClipEnabled"); clipSignLocation=GLES20.glGetUniformLocation(program,"uClipSign")
        }
        private fun uploadTextures(mesh: StlParser.Mesh) {
            if(uploadedMesh===mesh)return
            if(textureIds.isNotEmpty())GLES20.glDeleteTextures(textureIds.size,textureIds,0)
            textureIds=IntArray(mesh.textures.size)
            CrashDiagnostics.stage("Uploading textures")
            val maxSize=IntArray(1); GLES20.glGetIntegerv(GLES20.GL_MAX_TEXTURE_SIZE,maxSize,0)
            for((index,bytes) in mesh.textures.withIndex()) {
                val bitmap=TextureBitmap.decode(bytes,maxSize[0])
                try {
                GLES20.glGenTextures(1,textureIds,index);GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,textureIds[index])
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_MIN_FILTER,GLES20.GL_LINEAR)
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_MAG_FILTER,GLES20.GL_LINEAR)
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_WRAP_S,GLES20.GL_REPEAT)
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_WRAP_T,GLES20.GL_REPEAT)
                GLUtils.texImage2D(GLES20.GL_TEXTURE_2D,0,bitmap,0)
                // Mipmaps: a house viewed from across the room samples a
                // 1,024 px texture at a few pixels on screen. Without them
                // every fragment fetches the full-resolution texture; with
                // them it fetches the matching mip level. Power-of-two
                // textures (guaranteed by TextureBitmap) cost 33% more
                // memory for far cheaper minification.
                GLES20.glGenerateMipmap(GLES20.GL_TEXTURE_2D)
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_MIN_FILTER,GLES20.GL_LINEAR_MIPMAP_LINEAR)
                check(GLES20.glGetError()==GLES20.GL_NO_ERROR) { "The graphics device could not upload a model texture." }
                } finally { bitmap.recycle() }
            }
            uploadedMesh=mesh
            CrashDiagnostics.stage("Rendering model")
        }
        private fun deleteInstancedVbos() {
            if(instancedVbos.isNotEmpty())GLES20.glDeleteBuffers(instancedVbos.size,instancedVbos,0)
            instancedVbos=IntArray(0); uploadedInstancedMesh=null
        }
        // Upload instanced geometry once and keep it on the GPU. The previous
        // renderer re-streamed the whole model through a 1 MiB buffer on
        // every frame (289 MB per frame for the large house model, with a
        // glFinish after each 32,766-vertex batch), so rotating lagged even
        // though the GPU itself was idle most of the time. Static and
        // resource geometry are uploaded here, once per model; frames then
        // only set a matrix uniform and issue draw calls.
        private fun uploadInstanced(mesh: StlParser.Mesh) {
            if(uploadedInstancedMesh===mesh)return
            deleteInstancedVbos()
            val ids=IntArray(4); GLES20.glGenBuffers(4,ids,0); instancedVbos=ids
            fun upload(buffer: java.nio.FloatBuffer?,target: Int) {
                if(buffer==null)return
                val data=buffer.duplicate(); data.position(0); data.limit(buffer.capacity())
                GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER,target)
                GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER,data.remaining()*4,data,GLES20.GL_STATIC_DRAW)
            }
            upload(mesh.data,ids[0])
            upload(mesh.textureCoordinates,ids[1])
            upload(mesh.resourceData,ids[2])
            var uvBytes=0
            for(resource in mesh.resources)uvBytes+=resource.count*20
            if(uvBytes>0) {
                GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER,ids[3])
                GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER,uvBytes,null,GLES20.GL_STATIC_DRAW)
                var offset=0
                for(resource in mesh.resources) {
                    val data=resource.uvs.duplicate(); data.position(0); data.limit(resource.uvs.capacity())
                    GLES20.glBufferSubData(GLES20.GL_ARRAY_BUFFER,offset,data.remaining()*4,data)
                    offset+=resource.count*20
                }
            }
            uploadedInstancedMesh=mesh
            check(GLES20.glGetError()==GLES20.GL_NO_ERROR) { "The graphics device could not upload model geometry." }
        }
        // Inverse-transpose of the upper 3x3 of a model matrix, for correct
        // normals under non-uniform and mirrored instance scales. Returns
        // false for a singular matrix, whose instance is skipped.
        private fun normalMatrix(matrix: FloatArray,out: FloatArray): Boolean {
            val inv=FloatArray(16)
            if(!Matrix.invertM(inv,0,matrix,0))return false
            out[0]=inv[0];out[1]=inv[4];out[2]=inv[8]
            out[3]=inv[1];out[4]=inv[5];out[5]=inv[9]
            out[6]=inv[2];out[7]=inv[6];out[8]=inv[10]
            return true
        }
        private fun bindGeometry(positionVbo: Int,uvVbo: Int) {
            GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER,positionVbo)
            GLES20.glEnableVertexAttribArray(position); GLES20.glEnableVertexAttribArray(normal)
            GLES20.glVertexAttribPointer(position,3,GLES20.GL_FLOAT,false,24,0)
            GLES20.glVertexAttribPointer(normal,3,GLES20.GL_FLOAT,false,24,12)
            GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER,uvVbo)
            GLES20.glEnableVertexAttribArray(uvLocation)
            GLES20.glVertexAttribPointer(uvLocation,2,GLES20.GL_FLOAT,false,20,12)
        }
        private fun drawInstanced(mesh: StlParser.Mesh) {
            uploadTextures(mesh); uploadInstanced(mesh)
            GLES20.glUniform1f(unlitLocation,0f)
            val normalMat=FloatArray(9)
            // Static geometry: one draw per material surface.
            bindGeometry(instancedVbos[0],instancedVbos[1])
            GLES20.glUniformMatrix4fv(localLocation,1,false,identity,0)
            if(normalMatrix(model,normalMat))GLES20.glUniformMatrix3fv(normalMatrixLocation,1,false,normalMat,0)
            GLES20.glUniformMatrix4fv(mvpLocation,1,false,mvp,0)
            for(surface in mesh.surfaces.filter { it.flags and 2==0 }) {
                drawSurface(surface)
                GLES20.glDrawArrays(GLES20.GL_TRIANGLES,surface.first,surface.count)
            }
            // Instanced resources: one draw per surface per placement.
            bindGeometry(instancedVbos[2],instancedVbos[3])
            for(resource in mesh.resources) {
                for(instance in resource.instances) {
                    Matrix.multiplyMM(tmpModel,0,model,0,instance,0)
                    Matrix.multiplyMM(tmpMvp,0,projection,0,tmpModel,0)
                    if(!normalMatrix(tmpModel,normalMat))continue
                    GLES20.glUniformMatrix4fv(mvpLocation,1,false,tmpMvp,0)
                    GLES20.glUniformMatrix3fv(normalMatrixLocation,1,false,normalMat,0)
                    GLES20.glUniformMatrix4fv(localLocation,1,false,instance,0)
                    for(surface in resource.surfaces.filter { it.flags and 2==0 }) {
                        drawSurface(surface)
                        GLES20.glDrawArrays(GLES20.GL_TRIANGLES,resource.first+surface.first,surface.count)
                    }
                }
            }
            // Transparent surfaces, far to near, without depth writes.
            GLES20.glEnable(GLES20.GL_BLEND); GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA,GLES20.GL_ONE_MINUS_SRC_ALPHA); GLES20.glDepthMask(false)
            bindGeometry(instancedVbos[0],instancedVbos[1])
            GLES20.glUniformMatrix4fv(localLocation,1,false,identity,0)
            if(normalMatrix(model,normalMat))GLES20.glUniformMatrix3fv(normalMatrixLocation,1,false,normalMat,0)
            GLES20.glUniformMatrix4fv(mvpLocation,1,false,mvp,0)
            for(surface in mesh.surfaces.filter { it.flags and 2!=0 }.sortedBy { depth(it,mesh) }) {
                drawSurface(surface)
                GLES20.glDrawArrays(GLES20.GL_TRIANGLES,surface.first,surface.count)
            }
            bindGeometry(instancedVbos[2],instancedVbos[3])
            val transparent=mesh.resources.flatMap { resource -> resource.instances.map { it to resource } }
                .sortedBy { model[2]*it.first[12]+model[6]*it.first[13]+model[10]*it.first[14] }
            for((instance,resource) in transparent) {
                Matrix.multiplyMM(tmpModel,0,model,0,instance,0)
                Matrix.multiplyMM(tmpMvp,0,projection,0,tmpModel,0)
                if(!normalMatrix(tmpModel,normalMat))continue
                GLES20.glUniformMatrix4fv(mvpLocation,1,false,tmpMvp,0)
                GLES20.glUniformMatrix3fv(normalMatrixLocation,1,false,normalMat,0)
                GLES20.glUniformMatrix4fv(localLocation,1,false,instance,0)
                for(surface in resource.surfaces.filter { it.flags and 2!=0 }) {
                    drawSurface(surface)
                    GLES20.glDrawArrays(GLES20.GL_TRIANGLES,resource.first+surface.first,surface.count)
                }
            }
            GLES20.glDepthMask(true); GLES20.glDisable(GLES20.GL_BLEND); GLES20.glDisable(GLES20.GL_CULL_FACE)
        }
        private fun drawSurface(surface: CadMeshParser.Surface) {
            GLES20.glUniform4fv(colorLocation,1,surface.color,0)
            val texture=textureIds.getOrElse(surface.texture){0}
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,if(texture!=0)texture else whiteTexture)
            GLES20.glUniform1f(texturedLocation,if(texture!=0)1f else 0f)
            GLES20.glUniform1f(cutoffLocation,if(surface.flags and 4!=0)surface.cutoff else 0f)
            if(surface.flags and 1!=0)GLES20.glDisable(GLES20.GL_CULL_FACE) else GLES20.glEnable(GLES20.GL_CULL_FACE)

        }
        private fun depth(surface: CadMeshParser.Surface,mesh: StlParser.Mesh): Float {
            val i=surface.first*6
            return model[2]*mesh.data.get(i)+model[6]*mesh.data.get(i+1)+model[10]*mesh.data.get(i+2)
        }
        // Ray-cast a tap into model space (orthographic camera: the ray
        // direction is constant, only its origin moves with the tap) and
        // place the clip plane on the nearest face. Returns the pick plus
        // the slider range (min/max offset along the face normal over the
        // model), or null when no model is loaded. Runs on the GL thread,
        // where the camera and mesh buffers live.
        fun pick(x: Float,y: Float,w: Float,h: Float): Triple<SectionClip.Pick?,Float,Float>? {
            val mesh=mesh ?: return null
            val ndcX=2f*x/w-1f; val ndcY=1f-2f*y/h
            val extent=verticalExtent()
            val viewModel=FloatArray(16)
            Matrix.setIdentityM(viewModel,0); Matrix.translateM(viewModel,0,panX,panY,0f)
            Matrix.rotateM(viewModel,0,pitch,1f,0f,0f); Matrix.rotateM(viewModel,0,yaw,0f,0f,1f)
            val inv=FloatArray(16)
            if(!Matrix.invertM(inv,0,viewModel,0))return Triple(null,0f,0f)
            val eye=FloatArray(4); val dirEye=FloatArray(4)
            Matrix.multiplyMV(eye,0,inv,0,floatArrayOf(ndcX*extent*aspect,ndcY*extent,0f,1f),0)
            Matrix.multiplyMV(dirEye,0,inv,0,floatArrayOf(0f,0f,-1f,0f),0)
            val dir=floatArrayOf(dirEye[0],dirEye[1],dirEye[2])
            val length=sqrt(dir[0]*dir[0]+dir[1]*dir[1]+dir[2]*dir[2])
            if(length==0f)return Triple(null,0f,0f)
            dir[0]/=length; dir[1]/=length; dir[2]/=length
            val hit=SectionClip.pick(mesh,floatArrayOf(eye[0],eye[1],eye[2]),dir) ?: return Triple(null,0f,0f)
            val n=hit.normal
            val offset=n[0]*hit.point[0]+n[1]*hit.point[1]+n[2]*hit.point[2]
            clipSign=1f
            clipPlane[0]=n[0]; clipPlane[1]=n[1]; clipPlane[2]=n[2]; clipPlane[3]=-offset
            clipEnabled=true
            val range=SectionClip.planeRange(SectionClip.modelHalfExtents(mesh),n)
            return Triple(hit,range.first,range.second)
        }
        private fun shader(type: Int,source: String): Int {
            val shader=GLES20.glCreateShader(type); GLES20.glShaderSource(shader,source); GLES20.glCompileShader(shader)
            val ok=IntArray(1); GLES20.glGetShaderiv(shader,GLES20.GL_COMPILE_STATUS,ok,0)
            check(ok[0]!=0) { GLES20.glGetShaderInfoLog(shader) }
            return shader
        }
        override fun onSurfaceChanged(unused: GL10?,width: Int,height: Int) {
            GLES20.glViewport(0,0,width,height); aspect=width.toFloat()/maxOf(1,height)
        }
        @Synchronized override fun onDrawFrame(unused: GL10?) {
            try { drawFrame() }
            catch(error: RuntimeException) { CrashDiagnostics.failure("Render failure",error); failed(error.message ?: "Could not render this model.") }
            catch(error: OutOfMemoryError) { failed("There is not enough available memory to render this model.") }
        }
        private fun failed(message: String) {
            mesh=null; uploadedMesh=null
            deleteInstancedVbos()
            if(textureIds.isNotEmpty())GLES20.glDeleteTextures(textureIds.size,textureIds,0)
            textureIds=IntArray(0)
            GLES20.glDepthMask(true); GLES20.glDisable(GLES20.GL_BLEND); GLES20.glDisable(GLES20.GL_CULL_FACE)
            onError(message)
        }
        private fun drawFrame() {
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT or GLES20.GL_DEPTH_BUFFER_BIT)
            val mesh=mesh ?: return
            val extent=verticalExtent()
            Matrix.orthoM(projection,0,-extent*aspect,extent*aspect,-extent,extent,-20f,20f)
            Matrix.setIdentityM(model,0); Matrix.translateM(model,0,panX,panY,0f)
            Matrix.rotateM(model,0,pitch,1f,0f,0f); Matrix.rotateM(model,0,yaw,0f,0f,1f)
            Matrix.multiplyMM(mvp,0,projection,0,model,0)
            GLES20.glUseProgram(program)
            GLES20.glUniformMatrix4fv(mvpLocation,1,false,mvp,0)
            GLES20.glUniform1f(clipEnabledLocation,if(clipEnabled)1f else 0f)
            GLES20.glUniform1f(clipSignLocation,clipSign)
            GLES20.glUniform4fv(clipPlaneLocation,1,clipPlane,0)
            GLES20.glUniformMatrix4fv(localLocation,1,false,identity,0)
            GLES20.glActiveTexture(GLES20.GL_TEXTURE0); GLES20.glUniform1i(samplerLocation,0)
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,whiteTexture)
            GLES20.glDisableVertexAttribArray(uvLocation); GLES20.glVertexAttrib2f(uvLocation,0f,0f)
            GLES20.glUniform1f(texturedLocation,0f); GLES20.glUniform1f(cutoffLocation,0f)
            GLES20.glUniform4f(colorLocation,.36f,.82f,.71f,1f)
            if(mesh.resources.isNotEmpty()) { drawInstanced(mesh); CrashDiagnostics.stage("Frame complete"); return }
            uploadTextures(mesh)
            CrashDiagnostics.stage("Streaming geometry to GPU")
            val normalMat=FloatArray(9)
            if(normalMatrix(model,normalMat))GLES20.glUniformMatrix3fv(normalMatrixLocation,1,false,normalMat,0)
            if(mesh.triangles>0) {
                GLES20.glUniform1f(unlitLocation,0f)
                if(mesh.surfaces.isEmpty())stream(mesh,null,mesh.triangles*3)
                else {
                    stream(mesh,mesh.surfaces.filter { it.flags and 2==0 })
                    GLES20.glEnable(GLES20.GL_BLEND); GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA,GLES20.GL_ONE_MINUS_SRC_ALPHA); GLES20.glDepthMask(false)
                    stream(mesh,mesh.surfaces.filter { it.flags and 2!=0 }.sortedBy { depth(it,mesh) })
                    GLES20.glDepthMask(true); GLES20.glDisable(GLES20.GL_BLEND); GLES20.glDisable(GLES20.GL_CULL_FACE)
                }
            }
            if(mesh.segments>0) {
                GLES20.glUniform1f(unlitLocation,1f)
                stream(mesh,null,mesh.segments*2,true)
            }
            CrashDiagnostics.stage("Frame complete")
        }
        private fun stream(mesh: StlParser.Mesh,surfaces: List<CadMeshParser.Surface>?,count: Int=0,lines: Boolean=false) {
            batch.clear()
            GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER,geometryBuffer)
            GLES20.glEnableVertexAttribArray(position); GLES20.glEnableVertexAttribArray(normal); GLES20.glEnableVertexAttribArray(uvLocation)
            GLES20.glVertexAttribPointer(position,3,GLES20.GL_FLOAT,false,32,0)
            GLES20.glVertexAttribPointer(normal,3,GLES20.GL_FLOAT,false,32,12)
            GLES20.glVertexAttribPointer(uvLocation,2,GLES20.GL_FLOAT,false,32,24)
            fun flush() {
                if(batch.size==0)return
                val bytes=batch.size*32
                batch.data.flip()
                GLES20.glBufferSubData(GLES20.GL_ARRAY_BUFFER,0,bytes,batch.data)
                for(draw in batch.draws) {
                    draw.surface?.let { drawSurface(it) }
                    GLES20.glDrawArrays(if(lines)GLES20.GL_LINES else GLES20.GL_TRIANGLES,draw.first,draw.count)
                }
                // Finish before reusing storage: drivers cannot accumulate model-sized
                // copies or renamed buffers behind thousands of asynchronous draws.
                GLES20.glFinish()
                check(GLES20.glGetError()==GLES20.GL_NO_ERROR) { "The graphics device could not render this geometry batch." }
                batch.clear()
            }
            fun append(first: Int,total: Int,surface: CadMeshParser.Surface?) {
                var offset=first; var remaining=total
                while(remaining>0) {
                    val n=minOf(remaining,batch.capacity-batch.size)
                    batch.append(mesh,offset,n,surface,lines)
                    offset+=n; remaining-=n
                    if(batch.size==batch.capacity)flush()
                }
            }
            if(surfaces==null)append(0,count,null)
            else for(surface in surfaces)append(surface.first,surface.count,surface)
            flush()

        }
    }
}

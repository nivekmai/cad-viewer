package com.nivek.stlviewer

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.opengl.GLUtils
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.opengl.Matrix
import android.view.GestureDetector
import android.view.MotionEvent
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10
import kotlin.math.hypot

class ModelView(context: Context) : GLSurfaceView(context) {
    private val scene=Scene()
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
            override fun onSingleTapConfirmed(e: MotionEvent): Boolean { performClick(); return true }
        })
    }
    fun show(mesh: StlParser.Mesh) { queueEvent { scene.mesh=mesh; scene.reset() }; requestRender() }
    fun reset() { queueEvent(scene::reset); requestRender() }
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
    private class Scene : Renderer {
        var mesh: StlParser.Mesh?=null
        var pitch=-62f; var yaw=-28f; var panX=0f; var panY=0f; var zoom=1f; var aspect=1f
        private var program=0; private var position=0; private var normal=0; private var mvpLocation=0; private var modelLocation=0; private var unlitLocation=0
        private var uvLocation=0; private var colorLocation=0; private var texturedLocation=0; private var samplerLocation=0; private var cutoffLocation=0
        private var whiteTexture=0
        private var uploadedMesh: StlParser.Mesh?=null
        private var textureIds=IntArray(0)
        private val model=FloatArray(16); private val projection=FloatArray(16); private val mvp=FloatArray(16)
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
            val vertex="uniform mat4 uMvp; uniform mat4 uModel; attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aUv; varying vec3 vNormal; varying vec2 vUv; void main(){ gl_Position=uMvp*vec4(aPosition,1.0); vNormal=mat3(uModel)*aNormal; vUv=aUv; }"
            val fragment="precision mediump float; uniform float uUnlit; uniform vec4 uColor; uniform float uTextured; uniform sampler2D uTexture; uniform float uCutoff; varying vec3 vNormal; varying vec2 vUv; void main(){ if(uUnlit>0.5){gl_FragColor=vec4(0.44,0.90,0.79,1.0);return;} vec4 base=uColor; if(uTextured>0.5)base*=texture2D(uTexture,vUv); if(base.a<uCutoff)discard; vec3 n=normalize(vNormal); if(!gl_FrontFacing)n=-n; float light=0.30+0.70*max(dot(n,normalize(vec3(-0.4,0.7,1.0))),0.0); gl_FragColor=vec4(base.rgb*light,base.a); }"
            val vs=shader(GLES20.GL_VERTEX_SHADER,vertex); val fs=shader(GLES20.GL_FRAGMENT_SHADER,fragment)
            program=GLES20.glCreateProgram()
            GLES20.glAttachShader(program,vs); GLES20.glAttachShader(program,fs); GLES20.glLinkProgram(program)
            val ok=IntArray(1); GLES20.glGetProgramiv(program,GLES20.GL_LINK_STATUS,ok,0)
            check(ok[0]!=0) { GLES20.glGetProgramInfoLog(program) }
            GLES20.glDeleteShader(vs); GLES20.glDeleteShader(fs)
            position=GLES20.glGetAttribLocation(program,"aPosition"); normal=GLES20.glGetAttribLocation(program,"aNormal")
            uvLocation=GLES20.glGetAttribLocation(program,"aUv"); colorLocation=GLES20.glGetUniformLocation(program,"uColor")
            texturedLocation=GLES20.glGetUniformLocation(program,"uTextured"); samplerLocation=GLES20.glGetUniformLocation(program,"uTexture"); cutoffLocation=GLES20.glGetUniformLocation(program,"uCutoff")
            mvpLocation=GLES20.glGetUniformLocation(program,"uMvp"); modelLocation=GLES20.glGetUniformLocation(program,"uModel"); unlitLocation=GLES20.glGetUniformLocation(program,"uUnlit")
        }
        private fun uploadTextures(mesh: StlParser.Mesh) {
            if(uploadedMesh===mesh)return
            if(textureIds.isNotEmpty())GLES20.glDeleteTextures(textureIds.size,textureIds,0)
            textureIds=IntArray(mesh.textures.size)
            val maxSize=IntArray(1); GLES20.glGetIntegerv(GLES20.GL_MAX_TEXTURE_SIZE,maxSize,0)
            for((index,bytes) in mesh.textures.withIndex()) {
                val options=BitmapFactory.Options().apply { inJustDecodeBounds=true }
                BitmapFactory.decodeByteArray(bytes,0,bytes.size,options)
                options.inSampleSize=1
                while(options.outWidth/options.inSampleSize>maxSize[0] || options.outHeight/options.inSampleSize>maxSize[0])options.inSampleSize*=2
                options.inJustDecodeBounds=false; options.inScaled=false; options.inPremultiplied=false
                val decoded=BitmapFactory.decodeByteArray(bytes,0,bytes.size,options) ?: continue
                // GLES 2 requires power-of-two dimensions for seamless repeating textures.
                fun supportedSize(size: Int): Int {
                    var value=1
                    while(value<size && value<maxSize[0])value*=2
                    return minOf(value,maxSize[0])
                }
                val width=supportedSize(decoded.width);val height=supportedSize(decoded.height)
                val bitmap=if(width!=decoded.width || height!=decoded.height)
                    Bitmap.createScaledBitmap(decoded,width,height,true).also { if(it!==decoded)decoded.recycle() }
                else decoded
                GLES20.glGenTextures(1,textureIds,index);GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,textureIds[index])
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_MIN_FILTER,GLES20.GL_LINEAR)
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_MAG_FILTER,GLES20.GL_LINEAR)
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_WRAP_S,GLES20.GL_REPEAT)
                GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D,GLES20.GL_TEXTURE_WRAP_T,GLES20.GL_REPEAT)
                GLUtils.texImage2D(GLES20.GL_TEXTURE_2D,0,bitmap,0);bitmap.recycle()
            }
            uploadedMesh=mesh
        }
        private fun drawSurface(surface: CadMeshParser.Surface) {
            GLES20.glUniform4fv(colorLocation,1,surface.color,0)
            val texture=textureIds.getOrElse(surface.texture){0}
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,if(texture!=0)texture else whiteTexture)
            GLES20.glUniform1f(texturedLocation,if(texture!=0)1f else 0f)
            GLES20.glUniform1f(cutoffLocation,if(surface.flags and 4!=0)surface.cutoff else 0f)
            if(surface.flags and 1!=0)GLES20.glDisable(GLES20.GL_CULL_FACE) else GLES20.glEnable(GLES20.GL_CULL_FACE)
            GLES20.glDrawArrays(GLES20.GL_TRIANGLES,surface.first,surface.count)
        }
        private fun depth(surface: CadMeshParser.Surface,mesh: StlParser.Mesh): Float {
            val i=surface.first*6
            return model[2]*mesh.data.get(i)+model[6]*mesh.data.get(i+1)+model[10]*mesh.data.get(i+2)
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
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT or GLES20.GL_DEPTH_BUFFER_BIT)
            val mesh=mesh ?: return
            uploadTextures(mesh)
            val extent=verticalExtent()
            Matrix.orthoM(projection,0,-extent*aspect,extent*aspect,-extent,extent,-20f,20f)
            Matrix.setIdentityM(model,0); Matrix.translateM(model,0,panX,panY,0f)
            Matrix.rotateM(model,0,pitch,1f,0f,0f); Matrix.rotateM(model,0,yaw,0f,0f,1f)
            Matrix.multiplyMM(mvp,0,projection,0,model,0)
            GLES20.glUseProgram(program)
            GLES20.glUniformMatrix4fv(mvpLocation,1,false,mvp,0); GLES20.glUniformMatrix4fv(modelLocation,1,false,model,0)
            GLES20.glActiveTexture(GLES20.GL_TEXTURE0); GLES20.glUniform1i(samplerLocation,0)
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,whiteTexture)
            GLES20.glDisableVertexAttribArray(uvLocation); GLES20.glVertexAttrib2f(uvLocation,0f,0f)
            GLES20.glUniform1f(texturedLocation,0f); GLES20.glUniform1f(cutoffLocation,0f)
            GLES20.glUniform4f(colorLocation,.36f,.82f,.71f,1f)
            if(mesh.triangles>0) {
                GLES20.glUniform1f(unlitLocation,0f)
                mesh.data.position(0); GLES20.glVertexAttribPointer(position,3,GLES20.GL_FLOAT,false,24,mesh.data)
                mesh.data.position(3); GLES20.glVertexAttribPointer(normal,3,GLES20.GL_FLOAT,false,24,mesh.data)
                GLES20.glEnableVertexAttribArray(position); GLES20.glEnableVertexAttribArray(normal)
                if(mesh.surfaces.isEmpty())GLES20.glDrawArrays(GLES20.GL_TRIANGLES,0,mesh.triangles*3)
                else {
                    mesh.textureCoordinates?.let { uv ->
                        uv.position(0); GLES20.glVertexAttribPointer(uvLocation,2,GLES20.GL_FLOAT,false,8,uv); GLES20.glEnableVertexAttribArray(uvLocation)
                    }
                    for(surface in mesh.surfaces)if(surface.flags and 2==0)drawSurface(surface)
                    GLES20.glEnable(GLES20.GL_BLEND); GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA,GLES20.GL_ONE_MINUS_SRC_ALPHA); GLES20.glDepthMask(false)
                    for(surface in mesh.surfaces.filter { it.flags and 2!=0 }.sortedBy { depth(it,mesh) })drawSurface(surface)
                    GLES20.glDepthMask(true); GLES20.glDisable(GLES20.GL_BLEND); GLES20.glDisable(GLES20.GL_CULL_FACE)
                    GLES20.glDisableVertexAttribArray(uvLocation)
                }
            }
            if(mesh.segments>0) {
                GLES20.glUniform1f(unlitLocation,1f); GLES20.glDisableVertexAttribArray(normal)
                GLES20.glVertexAttrib3f(normal,0f,0f,1f); mesh.lines.position(0)
                GLES20.glVertexAttribPointer(position,3,GLES20.GL_FLOAT,false,12,mesh.lines)
                GLES20.glEnableVertexAttribArray(position); GLES20.glDrawArrays(GLES20.GL_LINES,0,mesh.segments*2)
            }
        }
    }
}

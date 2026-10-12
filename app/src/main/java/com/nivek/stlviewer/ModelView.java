package com.nivek.stlviewer;

import android.content.Context;
import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.opengl.Matrix;
import android.view.GestureDetector;
import android.view.MotionEvent;
import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

public final class ModelView extends GLSurfaceView {
    private final Scene scene = new Scene();
    private final GestureDetector taps;
    private float lastX, lastY, lastSpan;
    private int pointers;

    public ModelView(Context context) {
        super(context);
        setEGLContextClientVersion(2);
        setEGLConfigChooser(8, 8, 8, 8, 16, 0);
        setPreserveEGLContextOnPause(true);
        setRenderer(scene);
        setRenderMode(RENDERMODE_WHEN_DIRTY);
        setContentDescription("3D model. Drag to rotate. Two fingers to pan and pinch to zoom. Double tap to reset.");
        taps = new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {
            @Override public boolean onDown(MotionEvent e) { return true; }
            @Override public boolean onDoubleTap(MotionEvent e) { reset(); return true; }
            @Override public boolean onSingleTapConfirmed(MotionEvent e) { performClick(); return true; }
        });
    }

    public void show(StlParser.Mesh mesh) { queueEvent(() -> { scene.mesh = mesh; scene.reset(); }); requestRender(); }
    public void reset() { queueEvent(scene::reset); requestRender(); }
    public void topView() {
        queueEvent(() -> { synchronized(scene) { scene.pitch=scene.yaw=scene.panX=scene.panY=0;scene.zoom=1; } });requestRender();
    }
    public float[] camera() { synchronized (scene) { return new float[]{scene.pitch, scene.yaw, scene.panX, scene.panY, scene.zoom}; } }
    public void restore(float[] camera) {
        if (camera == null || camera.length != 5) return;
        queueEvent(() -> { synchronized(scene) {
            scene.pitch = camera[0]; scene.yaw = camera[1]; scene.panX = camera[2]; scene.panY = camera[3]; scene.zoom = camera[4];
        }}); requestRender();
    }
    @Override public boolean performClick() { super.performClick(); return true; }

    @android.annotation.SuppressLint("ClickableViewAccessibility") // GestureDetector calls performClick for confirmed taps.
    @Override public boolean onTouchEvent(MotionEvent event) {
        taps.onTouchEvent(event);
        int action = event.getActionMasked(), count = event.getPointerCount();
        if (action == MotionEvent.ACTION_UP || action == MotionEvent.ACTION_CANCEL) { pointers = 0; return true; }
        if (action == MotionEvent.ACTION_POINTER_UP) { pointers = 0; return true; }
        float x = event.getX(), y = event.getY(), span = 0;
        if (count >= 2) {
            x = (x + event.getX(1)) / 2; y = (y + event.getY(1)) / 2;
            span = (float)Math.hypot(event.getX(1) - event.getX(), event.getY(1) - event.getY());
        }
        if (action == MotionEvent.ACTION_MOVE && pointers == count) {
            float dx = x - lastX, dy = y - lastY;
            float factor = lastSpan > 10 && span > 10 ? span / lastSpan : 1;
            int height = Math.max(1, getHeight());
            queueEvent(() -> { synchronized(scene) {
                if (count == 1) { scene.yaw += dx * 0.4f; scene.pitch += dy * 0.4f; }
                else {
                    float units = scene.verticalExtent() * 2 / height;
                    scene.panX += dx * units; scene.panY -= dy * units;
                    scene.zoom = Math.max(0.08f, Math.min(30f, scene.zoom * factor));
                }
            }});
            requestRender();
        }
        pointers = count; lastX = x; lastY = y; lastSpan = span;
        return true;
    }

    private static final class Scene implements Renderer {
        StlParser.Mesh mesh;
        float pitch = -62, yaw = -28, panX, panY, zoom = 1, aspect = 1;
        int program, position, normal, mvpLocation, modelLocation, unlitLocation;
        final float[] model = new float[16], projection = new float[16], mvp = new float[16];
        synchronized void reset() { pitch = mesh != null && mesh.height == 0 ? 0 : -62; yaw = mesh != null && mesh.height == 0 ? 0 : -28; panX = panY = 0; zoom = 1; }
        float verticalExtent() { return 1.9f / Math.min(1, aspect) / zoom; }

        @Override public void onSurfaceCreated(GL10 unused, EGLConfig config) {
            GLES20.glClearColor(0.063f, 0.09f, 0.122f, 1);
            GLES20.glEnable(GLES20.GL_DEPTH_TEST);
            // Two-sided rendering also displays open surfaces and inconsistent STL winding.
            String vertex = "uniform mat4 uMvp; uniform mat4 uModel; attribute vec3 aPosition; attribute vec3 aNormal; varying vec3 vNormal; void main(){ gl_Position=uMvp*vec4(aPosition,1.0); vNormal=mat3(uModel)*aNormal; }";
            String fragment = "precision mediump float; uniform float uUnlit; varying vec3 vNormal; void main(){ if(uUnlit>0.5){gl_FragColor=vec4(0.44,0.90,0.79,1.0);return;} vec3 n=normalize(vNormal); if(!gl_FrontFacing)n=-n; float light=0.30+0.70*max(dot(n,normalize(vec3(-0.4,0.7,1.0))),0.0); float rim=pow(1.0-abs(n.z),3.0)*0.12; gl_FragColor=vec4(vec3(0.36,0.82,0.71)*light+rim,1.0); }";
            int vs = shader(GLES20.GL_VERTEX_SHADER, vertex), fs = shader(GLES20.GL_FRAGMENT_SHADER, fragment);
            program = GLES20.glCreateProgram();
            GLES20.glAttachShader(program, vs); GLES20.glAttachShader(program, fs); GLES20.glLinkProgram(program);
            int[] ok = new int[1]; GLES20.glGetProgramiv(program, GLES20.GL_LINK_STATUS, ok, 0);
            if (ok[0] == 0) throw new IllegalStateException(GLES20.glGetProgramInfoLog(program));
            GLES20.glDeleteShader(vs); GLES20.glDeleteShader(fs);
            position = GLES20.glGetAttribLocation(program, "aPosition"); normal = GLES20.glGetAttribLocation(program, "aNormal");
            mvpLocation = GLES20.glGetUniformLocation(program, "uMvp"); modelLocation = GLES20.glGetUniformLocation(program, "uModel"); unlitLocation = GLES20.glGetUniformLocation(program, "uUnlit");
        }
        private int shader(int type, String source) {
            int shader = GLES20.glCreateShader(type); GLES20.glShaderSource(shader, source); GLES20.glCompileShader(shader);
            int[] ok = new int[1]; GLES20.glGetShaderiv(shader, GLES20.GL_COMPILE_STATUS, ok, 0);
            if (ok[0] == 0) throw new IllegalStateException(GLES20.glGetShaderInfoLog(shader));
            return shader;
        }
        @Override public void onSurfaceChanged(GL10 unused, int width, int height) {
            GLES20.glViewport(0, 0, width, height); aspect = (float)width / Math.max(1, height);
        }
        @Override public synchronized void onDrawFrame(GL10 unused) {
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);
            if (mesh == null) return;
            float extent = verticalExtent();
            Matrix.orthoM(projection, 0, -extent*aspect, extent*aspect, -extent, extent, -20, 20);
            Matrix.setIdentityM(model, 0);
            Matrix.translateM(model, 0, panX, panY, 0);
            Matrix.rotateM(model, 0, pitch, 1, 0, 0);
            Matrix.rotateM(model, 0, yaw, 0, 0, 1);
            Matrix.multiplyMM(mvp, 0, projection, 0, model, 0);
            GLES20.glUseProgram(program);
            GLES20.glUniformMatrix4fv(mvpLocation, 1, false, mvp, 0);
            GLES20.glUniformMatrix4fv(modelLocation, 1, false, model, 0);
            if (mesh.triangles > 0) {
            GLES20.glUniform1f(unlitLocation, 0);
            mesh.data.position(0); GLES20.glVertexAttribPointer(position, 3, GLES20.GL_FLOAT, false, 24, mesh.data);
            mesh.data.position(3); GLES20.glVertexAttribPointer(normal, 3, GLES20.GL_FLOAT, false, 24, mesh.data);
            GLES20.glEnableVertexAttribArray(position); GLES20.glEnableVertexAttribArray(normal);
            GLES20.glDrawArrays(GLES20.GL_TRIANGLES, 0, mesh.triangles * 3);
            }
            if (mesh.segments > 0) {
                GLES20.glUniform1f(unlitLocation, 1);
                GLES20.glDisableVertexAttribArray(normal);
                GLES20.glVertexAttrib3f(normal, 0, 0, 1);
                mesh.lines.position(0);
                GLES20.glVertexAttribPointer(position, 3, GLES20.GL_FLOAT, false, 12, mesh.lines);
                GLES20.glEnableVertexAttribArray(position);
                GLES20.glDrawArrays(GLES20.GL_LINES, 0, mesh.segments * 2);
            }
        }
    }
}

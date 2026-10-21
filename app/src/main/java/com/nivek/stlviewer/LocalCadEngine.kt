package com.nivek.stlviewer

import android.annotation.SuppressLint
import android.app.Activity
import android.util.Base64
import android.view.ViewGroup
import android.webkit.*
import java.io.*
import java.util.Locale
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ExecutionException
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

/** Bundled CAD readers run in isolated local workers without network permission. */
class LocalCadEngine(private val activity: Activity) {
    data class Compiled(val file: File,val format: String,val units: String,val notice: String)
    @SuppressLint("SetJavaScriptEnabled") // Only intercepted, bundled assets can execute.
    fun convert(source: File,requestedType: String): Compiled {
        val type=if(requestedType=="stp")"step" else requestedType
        if(type !in setOf("scad","step","dwg"))throw IOException("Unsupported CAD format.")
        val label=type.uppercase(Locale.ROOT); val folder=if(type=="scad")"scad" else "cad"
        val prefix="/$folder/"; val inputName=if(type=="scad")"input.scad" else "input.model"
        val result=CompletableFuture<Compiled>()
        val output=File.createTempFile("compiled-",".stl",activity.cacheDir)
        val bridge=Bridge(output,result)
        var web: WebView?=null // Accessed only from the main thread.
        activity.runOnUiThread {
            if(result.isDone || activity.isDestroyed)return@runOnUiThread
            try {
                val view=WebView(activity); web=view
                view.settings.apply {
                    javaScriptEnabled=true; allowFileAccess=false; allowContentAccess=false; cacheMode=WebSettings.LOAD_NO_CACHE
                }
                view.addJavascriptInterface(bridge,"Compiler")
                view.webViewClient=object: WebViewClient() {
                    private var started=false
                    override fun shouldInterceptRequest(v: WebView,request: WebResourceRequest): WebResourceResponse {
                        val uri=request.url; val path=uri.path
                        return try {
                            if(uri.scheme!="https" || uri.host!="model.local" || path==null || !path.startsWith(prefix) || path.contains(".."))return denied()
                            val name=path.substring(prefix.length)
                            val input=if(name==inputName)source.inputStream() else activity.assets.open("$folder/$name")
                            val mime=when { name.endsWith(".wasm")->"application/wasm"; name.endsWith(".js")->"text/javascript"; name.endsWith(".html")->"text/html"; else->"text/plain" }
                            WebResourceResponse(mime,"UTF-8",200,"OK",mapOf("Cache-Control" to "no-store"),input)
                        } catch(_: IOException) { denied() }
                    }
                    override fun shouldOverrideUrlLoading(view: WebView,request: WebResourceRequest)=true
                    override fun onPageFinished(view: WebView,url: String) {
                        if(!started && !result.isDone) { started=true; view.evaluateJavascript(if(type=="scad")"start()" else "start('$type')",null) }
                    }
                    override fun onReceivedError(view: WebView,request: WebResourceRequest,error: WebResourceError) {
                        bridge.failed("Local $label reader could not load: ${error.description}")
                    }
                    override fun onRenderProcessGone(view: WebView,detail: RenderProcessGoneDetail): Boolean {
                        bridge.failed("The $label reader ran out of resources. Try a smaller model."); return true
                    }
                }
                activity.findViewById<ViewGroup>(android.R.id.content).addView(view,ViewGroup.LayoutParams(1,1))
                view.loadUrl("https://model.local/$folder/index.html")
            } catch(e: RuntimeException) { bridge.failed("$label needs an up-to-date Android System WebView: ${e.message}") }
        }
        var success=false
        try {
            return result.get(120,TimeUnit.SECONDS).also { success=true }
        } catch(_: InterruptedException) {
            Thread.currentThread().interrupt(); throw InterruptedIOException("$label loading cancelled.")
        } catch(_: TimeoutException) { throw IOException("$label processing exceeded two minutes. Try a smaller model.") }
          catch(e: ExecutionException) { throw IOException(e.cause?.message,e.cause) }
        finally {
            result.cancel(false); bridge.close()
            activity.runOnUiThread {
                web?.let { view ->
                    view.removeJavascriptInterface("Compiler"); (view.parent as? ViewGroup)?.removeView(view); view.destroy()
                }
            }
            if(!success)output.delete()
        }
    }
    class Bridge(private val output: File,private val result: CompletableFuture<Compiled>) {
        private var stream: OutputStream?=output.outputStream()
        private var size=0L
        @JavascriptInterface @Synchronized fun chunk(base64: String) {
            if(result.isDone)return
            try {
                val bytes=Base64.decode(base64,Base64.DEFAULT); size+=bytes.size
                if(size>StlParser.MAX_BYTES)throw IOException("Compiled model exceeds 64 MB.")
                stream?.write(bytes)
            } catch(e: IOException) { failed(e.message) }
              catch(e: IllegalArgumentException) { failed(e.message) }
        }
        @JavascriptInterface @Synchronized fun finished(format: String?,units: String?,notice: String?) {
            if(result.isDone)return
            if(format!="stl" && format!="dxf") { failed("Invalid output from CAD reader."); return }
            close(); result.complete(Compiled(output,format,units.orEmpty(),notice.orEmpty()))
        }
        @JavascriptInterface @Synchronized fun failed(message: String?) { close(); result.completeExceptionally(IOException(message)) }
        @Synchronized fun close() {
            try { stream?.close() } catch(_: IOException) { } finally { stream=null }
        }
    }
    private fun denied()=WebResourceResponse("text/plain","UTF-8",404,"Not found",emptyMap(),ByteArrayInputStream(ByteArray(0)))
}

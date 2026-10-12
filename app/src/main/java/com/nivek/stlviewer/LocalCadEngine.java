package com.nivek.stlviewer;

import android.app.Activity;
import android.net.Uri;
import android.util.Base64;
import android.view.ViewGroup;
import android.webkit.*;
import java.io.*;
import java.util.*;
import java.util.concurrent.*;

/** Executes bundled CAD readers in isolated Web Workers; no server or network permission. */
public final class LocalCadEngine {
    private final Activity activity;
    static final class Compiled {
        final File file; final String format, units, notice;
        Compiled(File file,String format,String units,String notice){this.file=file;this.format=format;this.units=units;this.notice=notice;}
    }
    LocalCadEngine(Activity activity){this.activity=activity;}
    Compiled convert(File source,String requestedType)throws IOException {
        String type=requestedType.equals("stp")?"step":requestedType;
        if(!Arrays.asList("scad","step","dwg").contains(type))throw new IOException("Unsupported CAD format.");
        String label=type.toUpperCase(Locale.ROOT);
        String folder=type.equals("scad")?"scad":"cad";
        String prefix="/"+folder+"/";
        String inputName=type.equals("scad")?"input.scad":"input.model";
        CompletableFuture<Compiled> result=new CompletableFuture<>();
        File output=File.createTempFile("compiled-", ".stl",activity.getCacheDir());
        Bridge bridge=new Bridge(output,result);
        WebView[] web={null};
        activity.runOnUiThread(() -> {
            if(result.isDone() || activity.isDestroyed())return;
            try {
                WebView view=new WebView(activity);web[0]=view;
                view.getSettings().setJavaScriptEnabled(true);
                view.getSettings().setAllowFileAccess(false);view.getSettings().setAllowContentAccess(false);
                view.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
                view.addJavascriptInterface(bridge,"Compiler");
                view.setWebViewClient(new WebViewClient(){
                    private boolean started;
                    @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest request) {
                        Uri uri=request.getUrl();String path=uri.getPath();
                        try {
                            if(!"https".equals(uri.getScheme()) || !"model.local".equals(uri.getHost()) || path==null || !path.startsWith(prefix) || path.contains(".."))return denied();
                            String name=path.substring(prefix.length());
                            InputStream input=name.equals(inputName)?new FileInputStream(source):activity.getAssets().open(folder+"/"+name);
                            String mime=name.endsWith(".wasm")?"application/wasm":name.endsWith(".js")?"text/javascript":name.endsWith(".html")?"text/html":"text/plain";
                            Map<String,String> headers=new HashMap<>();headers.put("Cache-Control","no-store");
                            return new WebResourceResponse(mime,"UTF-8",200,"OK",headers,input);
                        }catch(IOException e){return denied();}
                    }
                    @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return true;}
                    @Override public void onPageFinished(WebView view,String url){if(!started && !result.isDone()){started=true;view.evaluateJavascript(type.equals("scad")?"start()":"start('"+type+"')",null);}}
                    @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error){bridge.failed("Local "+label+" reader could not load: "+error.getDescription());}
                    @Override public boolean onRenderProcessGone(WebView view,RenderProcessGoneDetail detail){bridge.failed("The "+label+" reader ran out of resources. Try a smaller model.");return true;}
                });
                ((ViewGroup)activity.findViewById(android.R.id.content)).addView(view,new ViewGroup.LayoutParams(1,1));
                view.loadUrl("https://model.local/"+folder+"/index.html");
            }catch(RuntimeException e){bridge.failed(label+" needs an up-to-date Android System WebView: "+e.getMessage());}
        });
        boolean success=false;
        try {
            Compiled file=result.get(120,TimeUnit.SECONDS);success=true;return file;
        }catch(InterruptedException e){Thread.currentThread().interrupt();throw new InterruptedIOException(label+" loading cancelled.");}
        catch(TimeoutException e){throw new IOException(label+" processing exceeded two minutes. Try a smaller model.");}
        catch(ExecutionException e){throw new IOException(e.getCause().getMessage(),e.getCause());}
        finally {
            result.cancel(false);bridge.close();
            activity.runOnUiThread(() -> {if(web[0]!=null){WebView view=web[0];view.removeJavascriptInterface("Compiler");if(view.getParent() instanceof ViewGroup)((ViewGroup)view.getParent()).removeView(view);view.destroy();}});
            if(!success)output.delete();
        }
    }
    private static WebResourceResponse denied(){return new WebResourceResponse("text/plain","UTF-8",404,"Not found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
    public static final class Bridge {
        final File output;final CompletableFuture<Compiled> result;OutputStream stream;long size;
        Bridge(File output,CompletableFuture<Compiled> result)throws IOException{this.output=output;this.result=result;stream=new FileOutputStream(output);}
        @JavascriptInterface public synchronized void chunk(String base64) {
            if(result.isDone())return;
            try {byte[] bytes=Base64.decode(base64,Base64.DEFAULT);size+=bytes.length;if(size>StlParser.MAX_BYTES)throw new IOException("Compiled model exceeds 64 MB.");stream.write(bytes);}
            catch(IOException|IllegalArgumentException e){failed(e.getMessage());}
        }
        @JavascriptInterface public synchronized void finished(String format,String units,String notice){
            if(result.isDone())return;
            if(!"stl".equals(format) && !"dxf".equals(format)){failed("Invalid output from CAD reader.");return;}
            close();result.complete(new Compiled(output,format,units==null?"":units,notice==null?"":notice));
        }
        @JavascriptInterface public synchronized void failed(String message){close();result.completeExceptionally(new IOException(message));}
        synchronized void close(){if(stream!=null){try{stream.close();}catch(IOException ignored){}stream=null;}}
    }
}

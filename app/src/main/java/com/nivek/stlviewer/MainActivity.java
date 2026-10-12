package com.nivek.stlviewer;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.res.Configuration;
import android.database.Cursor;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.provider.DocumentsContract;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.widget.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public final class MainActivity extends Activity {
    private static final int OPEN_STL = 1, OPEN_FOLDER = 2, INK = 0xff10171f, MUTED = 0xff97a8b9, MINT = 0xff71e4c5;
    private final ExecutorService loader = Executors.newSingleThreadExecutor();
    private Future<?> pending;
    private ModelView model;
    private TextView name, detail, loadingText, notice;
    private TextView gestureHelp;
    private LinearLayout headerLayout, footerLayout;
    private Button browseButton;
    private LinearLayout empty, loading;
    private Button reset;
    private String loadedName;
    private int generation;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL); root.setBackgroundColor(INK);
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            }
            else v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        LinearLayout header = column();headerLayout=header; header.setPadding(dp(24), dp(20), dp(24), dp(14));
        LinearLayout titleRow=new LinearLayout(this);titleRow.setGravity(Gravity.CENTER_VERTICAL);
        TextView title = text("CAD Viewer", 24, Color.WHITE); title.setTypeface(null, Typeface.BOLD); titleRow.addView(title,new LinearLayout.LayoutParams(0,-2,1));
        Button more=button("⋮",false);more.setContentDescription("More options");titleRow.addView(more,new LinearLayout.LayoutParams(dp(48),dp(48)));
        more.setOnClickListener(v->{
            PopupMenu menu=new PopupMenu(this,more);
            menu.getMenu().add(0,1,0,"Show all files");
            menu.getMenu().add(0,3,1,"Browse folder");
            menu.getMenu().add(0,2,1,"Supported formats");
            menu.getMenu().add(0,4,2,"Top view").setEnabled(reset!=null && reset.isEnabled());
            menu.setOnMenuItemClickListener(item->{
                if(item.getItemId()==1)openFile(true);
                else if(item.getItemId()==3)openFolder();
                else if(item.getItemId()==4)model.topView();
                else new AlertDialog.Builder(this).setTitle("Supported formats").setMessage("STL, OBJ, 3MF, ASCII DXF, SCAD, STEP/STP, and DWG.\n\nSTEP solids and surfaces are converted to a shaded preview. DWG shows supported drawing geometry; proprietary 3D solids, proxy objects, external references, and hatches are not rendered.\n\nDXF/DWG text, multiline notes, visible block attributes, and dimensions with saved drawing blocks are displayed. Text uses a substitute outline font; rich styling, background masks, and exact spacing may differ. Use Top view to read plans.\n\nSCAD scripts run offline and must be self-contained or use the bundled MCAD library.\n\nModels use a single surface color. Viewing notes identify omitted content.\n\nIf a file is missing from the picker, try Show all files or Browse folder.").setPositiveButton("OK",null).show();
                return true;
            });menu.show();
        });
        header.addView(titleRow);
        name = text("A simple space for your 3D models", 14, MUTED); name.setSingleLine(true); name.setEllipsize(android.text.TextUtils.TruncateAt.END);
        header.addView(name); root.addView(header);

        FrameLayout viewport = new FrameLayout(this);
        model = new ModelView(this); viewport.addView(model);
        empty = column(); empty.setGravity(Gravity.CENTER); empty.setPadding(dp(28), 0, dp(28), 0);
        ImageView icon = new ImageView(this); icon.setImageResource(com.nivek.stlviewer.R.drawable.ic_app);
        empty.addView(icon, new LinearLayout.LayoutParams(dp(108), dp(108)));
        TextView prompt = text("Your model, in 3D", 24, Color.WHITE); prompt.setTypeface(null, Typeface.BOLD); prompt.setGravity(Gravity.CENTER); empty.addView(prompt);
        TextView description = text("Open a model to explore it from every angle.", 15, MUTED);
        description.setGravity(Gravity.CENTER); description.setPadding(0, dp(12), 0, 0); empty.addView(description);
        viewport.addView(empty, new FrameLayout.LayoutParams(-1, -1));
        loading = column(); loading.setGravity(Gravity.CENTER); loading.setBackgroundColor(0xee10171f); loading.setVisibility(View.GONE);
        loading.addView(new ProgressBar(this), new LinearLayout.LayoutParams(dp(40), dp(40)));
        loadingText = text("Opening model…", 16, Color.WHITE); loadingText.setPadding(0, dp(16), 0, 0); loading.addView(loadingText);
        Button cancel = button("Cancel", false); cancel.setOnClickListener(v -> {generation++;if(pending!=null)pending.cancel(true);loading.setVisibility(View.GONE);});
        LinearLayout.LayoutParams cancelParams=new LinearLayout.LayoutParams(dp(140),dp(48));cancelParams.topMargin=dp(20);loading.addView(cancel,cancelParams);
        viewport.addView(loading, new FrameLayout.LayoutParams(-1, -1));
        root.addView(viewport, new LinearLayout.LayoutParams(-1, 0, 1));

        LinearLayout footer = column();footerLayout=footer; footer.setPadding(dp(20), dp(12), dp(20), dp(16));
        detail = text("STL · OBJ · 3MF · DXF · SCAD · STEP · DWG", 12, MUTED); detail.setGravity(Gravity.CENTER); footer.addView(detail);
        notice = text("", 12, 0xffffd28a);notice.setGravity(Gravity.CENTER);notice.setVisibility(View.GONE);footer.addView(notice);
        TextView gestures = text("Drag to rotate · Two fingers to pan\nPinch to zoom · Double tap to reset", 13, MUTED);
        gestureHelp=gestures;
        gestures.setGravity(Gravity.CENTER); gestures.setPadding(0, dp(10), 0, dp(16)); footer.addView(gestures);
        LinearLayout actions = new LinearLayout(this); actions.setGravity(Gravity.CENTER_VERTICAL);
        Button open = button("Open model", true); open.setOnClickListener(v -> openFile(false));
        actions.addView(open, new LinearLayout.LayoutParams(0, dp(52), 1));
        reset = button("Reset view", false); reset.setEnabled(false); reset.setOnClickListener(v -> model.reset());
        LinearLayout.LayoutParams resetParams = new LinearLayout.LayoutParams(0, dp(52), 1); resetParams.setMarginStart(dp(12)); actions.addView(reset, resetParams);
        footer.addView(actions);
        Button browse=button("Browse folder",false);browse.setOnClickListener(v -> openFolder());
        browseButton=browse;
        LinearLayout.LayoutParams browseParams=new LinearLayout.LayoutParams(-1,dp(48));browseParams.topMargin=dp(8);footer.addView(browse,browseParams);
        root.addView(footer); setContentView(root); root.requestApplyInsets();adaptLayout(getResources().getConfiguration());
        Uri initial = intentUri(getIntent());
        if (state != null && state.getString("name") != null && cachedModel().isFile())
            load(null, state.getString("name"), state.getFloatArray("camera"));
        else if (initial != null) load(initial, null, null);
    }

    @Override public void onConfigurationChanged(Configuration configuration) {
        super.onConfigurationChanged(configuration);adaptLayout(configuration);
    }
    private void adaptLayout(Configuration configuration) {
        boolean compact=configuration.screenHeightDp<500;
        name.setVisibility(compact?View.GONE:View.VISIBLE);
        gestureHelp.setVisibility(compact?View.GONE:View.VISIBLE);
        browseButton.setVisibility(compact?View.GONE:View.VISIBLE);
        headerLayout.setPadding(dp(24),dp(compact?4:20),dp(24),dp(compact?4:14));
        footerLayout.setPadding(dp(20),dp(compact?4:12),dp(20),dp(compact?4:16));
    }

    private void openFile(boolean showAll) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
        if(!showAll)intent.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{
            "model/stl","application/sla","application/vnd.ms-pki.stl","application/x-stl","application/stl","application/x-navistyle",
            "model/obj","application/x-wavefront-obj","application/x-tgif","text/x-obj",
            "model/3mf","application/vnd.ms-package.3dmanufacturing-3dmodel+xml","application/3mf",
            "application/x-openscad","application/x-scad","text/x-scad",
            "application/dxf","application/x-dxf","image/vnd.dxf","image/x-dxf","drawing/x-dxf",
            "model/step","application/step","application/x-step","application/x-stp","text/x-step",
            "image/vnd.dwg","image/x-dwg","application/acad","application/x-acad","application/dwg","application/x-dwg",
            // Common provider labels for STL/OBJ/SCAD and ZIP-packaged 3MF files.
            "application/octet-stream","text/plain","application/zip","application/x-zip-compressed"
        });
        // Use the actual storage folder, not DownloadsProvider's incomplete indexed shortcut.
        String location=getPreferences(MODE_PRIVATE).getString("pickerLocation","content://com.android.externalstorage.documents/document/primary%3ADownload");
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI,Uri.parse(location));
        startActivityForResult(intent, OPEN_STL);
    }
    private void openFolder() {
        Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI,Uri.parse("content://com.android.externalstorage.documents/document/primary%3ADocuments"));
        startActivityForResult(intent,OPEN_FOLDER);
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == OPEN_STL && result == RESULT_OK && data != null && data.getData() != null) {
            Uri selected=data.getData();
            String previous=getPreferences(MODE_PRIVATE).getString("pickerLocation",null);
            try {
                getContentResolver().takePersistableUriPermission(selected,Intent.FLAG_GRANT_READ_URI_PERMISSION);
                if(previous!=null && !previous.equals(selected.toString())) {
                    try {getContentResolver().releasePersistableUriPermission(Uri.parse(previous),Intent.FLAG_GRANT_READ_URI_PERMISSION);}catch(SecurityException ignored){}
                }
            }catch(SecurityException ignored){ /* Some providers only offer temporary grants. */ }
            getPreferences(MODE_PRIVATE).edit().putString("pickerLocation",data.getData().toString()).apply();
            load(data.getData(), null, null);
        }
        if (request == OPEN_FOLDER && result == RESULT_OK && data != null && data.getData() != null) {
            Uri tree=data.getData();browseFolder(tree,DocumentsContract.getTreeDocumentId(tree),new ArrayList<>());
        }
    }
    private void browseFolder(Uri tree,String documentId,List<String> parents) {
        int job=++generation;if(pending!=null)pending.cancel(true);
        loadingText.setText("Reading folder…");loading.setVisibility(View.VISIBLE);
        pending=loader.submit(() -> {
            try {
                List<String[]> entries=new ArrayList<>();
                Uri children=DocumentsContract.buildChildDocumentsUriUsingTree(tree,documentId);
                try(Cursor cursor=getContentResolver().query(children,new String[]{DocumentsContract.Document.COLUMN_DOCUMENT_ID,DocumentsContract.Document.COLUMN_DISPLAY_NAME,DocumentsContract.Document.COLUMN_MIME_TYPE},null,null,null)) {
                    if(cursor==null)throw new IOException("This folder could not be read.");
                    while(cursor.moveToNext()) {
                        if(Thread.currentThread().isInterrupted())return;
                        String title=cursor.getString(1);boolean directory=DocumentsContract.Document.MIME_TYPE_DIR.equals(cursor.getString(2));
                        if(directory || title!=null && ModelParser.supported(title))entries.add(new String[]{cursor.getString(0),title,directory?"1":"0"});
                        if(entries.size()>10000)throw new IOException("This folder is too large. Choose a smaller subfolder.");
                    }
                }
                entries.sort((a,b)->a[2].equals(b[2])?a[1].compareToIgnoreCase(b[1]):b[2].compareTo(a[2]));
                runOnUiThread(() -> {
                    if(job!=generation || isDestroyed())return;loading.setVisibility(View.GONE);
                    List<String> labels=new ArrayList<>();if(!parents.isEmpty())labels.add("↑ Parent folder");
                    for(String[] e:entries)labels.add(e[2].equals("1")?"▸ "+e[1]:e[1]);
                    AlertDialog.Builder dialog=new AlertDialog.Builder(this).setTitle("Choose a model").setNegativeButton("Cancel",null);
                    if(labels.isEmpty())dialog.setMessage("No STL, OBJ, 3MF, DXF, SCAD, STEP/STP, or DWG files in this folder.");
                    else dialog.setItems(labels.toArray(new String[0]),(d,index)->{
                        if(!parents.isEmpty() && index==0){List<String> up=new ArrayList<>(parents);String parent=up.remove(up.size()-1);browseFolder(tree,parent,up);return;}
                        String[] entry=entries.get(index-(parents.isEmpty()?0:1));
                        if(entry[2].equals("1")){List<String> next=new ArrayList<>(parents);next.add(documentId);browseFolder(tree,entry[0],next);}
                        else load(DocumentsContract.buildDocumentUriUsingTree(tree,entry[0]),entry[1],null);
                    });
                    dialog.show();
                });
            }catch(IOException|RuntimeException e){runOnUiThread(()->{if(job==generation && !isDestroyed())showError("Could not browse folder: "+e.getMessage());});}
        });
    }
    private Uri intentUri(Intent intent) {
        if (Intent.ACTION_VIEW.equals(intent.getAction())) return intent.getData();
        if (Intent.ACTION_SEND.equals(intent.getAction())) return intent.getParcelableExtra(Intent.EXTRA_STREAM);
        return null;
    }
    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent); setIntent(intent);
        Uri uri = intentUri(intent); if (uri != null) load(uri, null, null);
    }
    private File cachedModel() { return new File(getFilesDir(), "model.stl"); }

    private void load(Uri uri, String restoreName, float[] camera) {
        int job = ++generation;
        if (pending != null) pending.cancel(true);
        loadingText.setText("Opening model…");
        loading.setVisibility(View.VISIBLE);
        pending = loader.submit(() -> {
            File temporary = null;
            try {
                String displayName = restoreName;
                File source = cachedModel();
                if (uri != null) {
                    displayName = restoreName!=null?restoreName:uri.getLastPathSegment();
                    if(displayName==null)displayName="Model.stl";
                    try (Cursor cursor = getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
                        if (cursor != null && cursor.moveToFirst() && !cursor.isNull(0)) displayName = cursor.getString(0);
                    } catch (RuntimeException ignored) { /* The stream can still be readable without metadata. */ }
                    temporary = File.createTempFile("stl-", ".tmp", getCacheDir()); source = temporary;
                    try (InputStream input = getContentResolver().openInputStream(uri); OutputStream output = new FileOutputStream(source)) {
                        if (input == null) throw new IOException("This file could not be opened.");
                        byte[] buffer = new byte[32768]; long total = 0; int read;
                        while ((read = input.read(buffer)) != -1) {
                            if (Thread.currentThread().isInterrupted()) throw new InterruptedIOException();
                            total += read;
                            if (total > StlParser.MAX_BYTES) throw new IOException("Please choose a model smaller than 64 MB.");
                            output.write(buffer, 0, read);
                        }
                    }
                }
                StlParser.Mesh mesh;
                if(ModelParser.needsEngine(displayName)) {
                    String type=ModelParser.extension(displayName);
                    String status=type.equals("scad")?"Compiling SCAD on your phone…":type.equals("dwg")?"Reading DWG on your phone…":"Preparing STEP surfaces…";
                    runOnUiThread(()->{if(job==generation)loadingText.setText(status);});
                    LocalCadEngine.Compiled compiled=new LocalCadEngine(this).convert(source,type);
                    try {
                        mesh=ModelParser.read(compiled.file,"compiled."+compiled.format);
                        if(!compiled.units.isEmpty())mesh.units=compiled.units;
                        if(type.equals("dwg"))mesh.notice=mesh.notice.replace("DXF","DWG");
                        if(!compiled.notice.isEmpty())mesh.notice+=(mesh.notice.isEmpty()?"":"\n\n")+compiled.notice;
                    }catch(IOException error){
                        if(type.equals("dwg") && error.getMessage()!=null)throw new IOException(error.getMessage().replace("DXF","DWG"),error);
                        throw error;
                    }finally{compiled.file.delete();}
                } else mesh=ModelParser.read(source,displayName);
                if (Thread.currentThread().isInterrupted()) return;
                String finalName = displayName;
                File finalSource = source;
                // Commit on the UI thread only if this request is still current.
                runOnUiThread(() -> {
                    if (job != generation || isDestroyed()) { if (uri != null) finalSource.delete(); return; }
                    try {
                        if (uri != null) Files.move(finalSource.toPath(), cachedModel().toPath(), StandardCopyOption.REPLACE_EXISTING);
                        loadedName = finalName; name.setText(finalName);
                        String primitives=mesh.segments>0?String.format(Locale.getDefault(),"%,d triangles · %,d lines",mesh.triangles,mesh.segments):String.format(Locale.getDefault(),"%,d triangles",mesh.triangles);
                        detail.setText(String.format(Locale.getDefault(), "%s · %s × %s × %s %s", primitives, dimension(mesh.width), dimension(mesh.depth), dimension(mesh.height),mesh.units));
                        notice.setText(mesh.notice.isEmpty()?"":"Viewing notes · Details");notice.setVisibility(mesh.notice.isEmpty()?View.GONE:View.VISIBLE);
                        notice.setOnClickListener(v->new AlertDialog.Builder(this).setTitle("Viewing notes").setMessage(mesh.notice).setPositiveButton("OK",null).show());
                        model.show(mesh); model.restore(camera);
                        empty.setVisibility(View.GONE); loading.setVisibility(View.GONE); reset.setEnabled(true);
                    } catch (IOException e) { showError("Could not save a local copy of this model."); }
                });
                temporary = null; // UI callback owns this file now.
            } catch (OutOfMemoryError e) {
                runOnUiThread(() -> {
                    if (job == generation && !isDestroyed()) showError("This model is too large for the available memory. Please try a smaller file.");
                });
            } catch (IOException | RuntimeException e) {
                if (!Thread.currentThread().isInterrupted()) runOnUiThread(() -> {
                    if (job == generation && !isDestroyed()) showError(e.getMessage() == null ? "This model could not be opened." : e.getMessage());
                });
            } finally { if (temporary != null) temporary.delete(); }
        });
    }
    private String dimension(double value) { return String.format(Locale.getDefault(), "%.3g", value); }
    private void showError(String message) {
        loading.setVisibility(View.GONE);
        new AlertDialog.Builder(this).setTitle("Couldn't open model").setMessage(message).setPositiveButton("OK", null).show();
    }
    @Override protected void onSaveInstanceState(Bundle state) {
        super.onSaveInstanceState(state);
        if (loadedName != null) { state.putString("name", loadedName); state.putFloatArray("camera", model.camera()); }
    }
    @Override protected void onResume() { super.onResume(); model.onResume(); }
    @Override protected void onPause() { model.onPause(); super.onPause(); }
    @Override protected void onDestroy() { generation++; if (pending != null) pending.cancel(true); loader.shutdownNow(); super.onDestroy(); }
    private int dp(float value) { return Math.round(value * getResources().getDisplayMetrics().density); }
    private LinearLayout column() { LinearLayout layout = new LinearLayout(this); layout.setOrientation(LinearLayout.VERTICAL); return layout; }
    private TextView text(String value, int size, int color) {
        TextView view = new TextView(this); view.setText(value); view.setTextSize(size); view.setTextColor(color); return view;
    }
    private Button button(String label, boolean primary) {
        Button button = new Button(this); button.setText(label); button.setAllCaps(false); button.setTextSize(15);
        button.setTextColor(primary ? INK : MINT); button.setTypeface(null, Typeface.BOLD);
        GradientDrawable background = new GradientDrawable(); background.setColor(primary ? MINT : 0xff1d2a35); background.setCornerRadius(dp(14));
        button.setBackground(new android.graphics.drawable.RippleDrawable(android.content.res.ColorStateList.valueOf(0x3371e4c5), background, null));
        return button;
    }
}

package com.nivek.stlviewer

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.RippleDrawable
import android.content.res.ColorStateList
import android.net.Uri
import android.os.Bundle
import android.os.Build
import android.provider.OpenableColumns
import android.provider.DocumentsContract
import android.view.Gravity
import android.view.View
import android.view.WindowInsets
import android.widget.*
import java.io.*
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.util.Locale
import java.util.concurrent.Executors
import java.util.concurrent.Future
import kotlin.math.roundToInt

class MainActivity : Activity() {
    private val loader=Executors.newSingleThreadExecutor()
    private var pending: Future<*>?=null
    private lateinit var model: ModelView
    private lateinit var name: TextView
    private lateinit var detail: TextView
    private lateinit var loadingText: TextView
    private lateinit var notice: TextView
    private lateinit var gestureHelp: TextView
    private lateinit var headerLayout: LinearLayout
    private lateinit var footerLayout: LinearLayout
    private lateinit var browseButton: Button
    private lateinit var empty: LinearLayout
    private lateinit var loading: LinearLayout
    private lateinit var reset: Button
    private var loadedName: String?=null
    private var generation=0

    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        val root=column().apply { setBackgroundColor(INK) }
        root.setOnApplyWindowInsetsListener { view,insets ->
            if(Build.VERSION.SDK_INT>=30) {
                val bars=insets.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
                view.setPadding(bars.left,bars.top,bars.right,bars.bottom)
            } else view.setPadding(insets.systemWindowInsetLeft,insets.systemWindowInsetTop,insets.systemWindowInsetRight,insets.systemWindowInsetBottom)
            insets
        }
        headerLayout=column().apply { setPadding(dp(24),dp(20),dp(24),dp(14)) }
        val titleRow=LinearLayout(this).apply { gravity=Gravity.CENTER_VERTICAL }
        val title=text("CAD Viewer",24,Color.WHITE).apply { setTypeface(null,Typeface.BOLD) }
        titleRow.addView(title,LinearLayout.LayoutParams(0,-2,1f))
        val more=button("⋮",false).apply { contentDescription="More options" }
        titleRow.addView(more,LinearLayout.LayoutParams(dp(48),dp(48)))
        more.setOnClickListener {
            val menu=PopupMenu(this,more)
            menu.menu.add(0,1,0,"Show all files")
            menu.menu.add(0,3,1,"Browse folder")
            menu.menu.add(0,2,1,"Supported formats")
            menu.menu.add(0,4,2,"Top view").isEnabled=reset.isEnabled
            menu.setOnMenuItemClickListener { item ->
                when(item.itemId) {
                    1 -> openFile(true)
                    3 -> openFolder()
                    4 -> model.topView()
                    else -> AlertDialog.Builder(this).setTitle("Supported formats").setMessage(SUPPORTED_FORMATS).setPositiveButton("OK",null).show()
                }
                true
            }
            menu.show()
        }
        headerLayout.addView(titleRow)
        name=text("A simple space for your 3D models",14,MUTED).apply { setSingleLine(true); ellipsize=android.text.TextUtils.TruncateAt.END }
        headerLayout.addView(name); root.addView(headerLayout)
        val viewport=FrameLayout(this)
        model=ModelView(this); viewport.addView(model)
        empty=column().apply { gravity=Gravity.CENTER; setPadding(dp(28),0,dp(28),0) }
        empty.addView(ImageView(this).apply { setImageResource(R.drawable.ic_app) },LinearLayout.LayoutParams(dp(108),dp(108)))
        empty.addView(text("Your model, in 3D",24,Color.WHITE).apply { setTypeface(null,Typeface.BOLD); gravity=Gravity.CENTER })
        empty.addView(text("Open a model to explore it from every angle.",15,MUTED).apply { gravity=Gravity.CENTER; setPadding(0,dp(12),0,0) })
        viewport.addView(empty,FrameLayout.LayoutParams(-1,-1))
        loading=column().apply { gravity=Gravity.CENTER; setBackgroundColor(0xee10171f.toInt()); visibility=View.GONE }
        loading.addView(ProgressBar(this),LinearLayout.LayoutParams(dp(40),dp(40)))
        loadingText=text("Opening model…",16,Color.WHITE).apply { setPadding(0,dp(16),0,0) }; loading.addView(loadingText)
        val cancel=button("Cancel",false).apply { setOnClickListener { generation++; pending?.cancel(true); loading.visibility=View.GONE } }
        loading.addView(cancel,LinearLayout.LayoutParams(dp(140),dp(48)).apply { topMargin=dp(20) })
        viewport.addView(loading,FrameLayout.LayoutParams(-1,-1)); root.addView(viewport,LinearLayout.LayoutParams(-1,0,1f))
        footerLayout=column().apply { setPadding(dp(20),dp(12),dp(20),dp(16)) }
        detail=text("STL · OBJ · 3MF · DXF · SCAD · STEP · DWG",12,MUTED).apply { gravity=Gravity.CENTER }; footerLayout.addView(detail)
        notice=text("",12,0xffffd28a.toInt()).apply { gravity=Gravity.CENTER; visibility=View.GONE }; footerLayout.addView(notice)
        gestureHelp=text("Drag to rotate · Two fingers to pan\nPinch to zoom · Double tap to reset",13,MUTED).apply { gravity=Gravity.CENTER; setPadding(0,dp(10),0,dp(16)) }; footerLayout.addView(gestureHelp)
        val actions=LinearLayout(this).apply { gravity=Gravity.CENTER_VERTICAL }
        actions.addView(button("Open model",true).apply { setOnClickListener { openFile(false) } },LinearLayout.LayoutParams(0,dp(52),1f))
        reset=button("Reset view",false).apply { isEnabled=false; setOnClickListener { model.reset() } }
        actions.addView(reset,LinearLayout.LayoutParams(0,dp(52),1f).apply { marginStart=dp(12) }); footerLayout.addView(actions)
        browseButton=button("Browse folder",false).apply { setOnClickListener { openFolder() } }
        footerLayout.addView(browseButton,LinearLayout.LayoutParams(-1,dp(48)).apply { topMargin=dp(8) })
        root.addView(footerLayout); setContentView(root); root.requestApplyInsets(); adaptLayout(resources.configuration)
        val savedName=state?.getString("name")
        val initial=intentUri(intent)
        if(savedName!=null && cachedModel().isFile)load(null,savedName,state.getFloatArray("camera"))
        else if(initial!=null)load(initial,null,null)
    }
    override fun onConfigurationChanged(configuration: Configuration) { super.onConfigurationChanged(configuration); adaptLayout(configuration) }
    private fun adaptLayout(configuration: Configuration) {
        val compact=configuration.screenHeightDp<500
        val visibility=if(compact)View.GONE else View.VISIBLE
        name.visibility=visibility; gestureHelp.visibility=visibility; browseButton.visibility=visibility
        headerLayout.setPadding(dp(24),dp(if(compact)4 else 20),dp(24),dp(if(compact)4 else 14))
        footerLayout.setPadding(dp(20),dp(if(compact)4 else 12),dp(20),dp(if(compact)4 else 16))
    }
    private fun openFile(showAll: Boolean) {
        val picker=Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*")
        if(!showAll)picker.putExtra(Intent.EXTRA_MIME_TYPES,SUPPORTED_MIMES)
        val location=getPreferences(MODE_PRIVATE).getString("pickerLocation","content://com.android.externalstorage.documents/document/primary%3ADownload")
        picker.putExtra(DocumentsContract.EXTRA_INITIAL_URI,Uri.parse(location))
        startActivityForResult(picker,OPEN_STL)
    }
    private fun openFolder() {
        val picker=Intent(Intent.ACTION_OPEN_DOCUMENT_TREE)
        picker.putExtra(DocumentsContract.EXTRA_INITIAL_URI,Uri.parse("content://com.android.externalstorage.documents/document/primary%3ADocuments"))
        startActivityForResult(picker,OPEN_FOLDER)
    }
    override fun onActivityResult(request: Int,result: Int,data: Intent?) {
        super.onActivityResult(request,result,data)
        if(result!=RESULT_OK)return
        val selected=data?.data ?: return
        if(request==OPEN_STL) {
            val previous=getPreferences(MODE_PRIVATE).getString("pickerLocation",null)
            try {
                contentResolver.takePersistableUriPermission(selected,Intent.FLAG_GRANT_READ_URI_PERMISSION)
                if(previous!=null && previous!=selected.toString()) {
                    try { contentResolver.releasePersistableUriPermission(Uri.parse(previous),Intent.FLAG_GRANT_READ_URI_PERMISSION) } catch(_: SecurityException) { }
                }
            } catch(_: SecurityException) { /* Some providers only offer temporary grants. */ }
            getPreferences(MODE_PRIVATE).edit().putString("pickerLocation",selected.toString()).apply()
            load(selected,null,null)
        } else if(request==OPEN_FOLDER)browseFolder(selected,DocumentsContract.getTreeDocumentId(selected),emptyList())
    }
    private data class FolderEntry(val id: String,val title: String,val directory: Boolean)
    private fun browseFolder(tree: Uri,documentId: String,parents: List<String>) {
        val job=++generation; pending?.cancel(true)
        loadingText.text="Reading folder…"; loading.visibility=View.VISIBLE
        pending=loader.submit {
            try {
                val entries=mutableListOf<FolderEntry>()
                val children=DocumentsContract.buildChildDocumentsUriUsingTree(tree,documentId)
                val columns=arrayOf(DocumentsContract.Document.COLUMN_DOCUMENT_ID,DocumentsContract.Document.COLUMN_DISPLAY_NAME,DocumentsContract.Document.COLUMN_MIME_TYPE)
                contentResolver.query(children,columns,null,null,null).use { cursor ->
                    if(cursor==null)throw IOException("This folder could not be read.")
                    while(cursor.moveToNext()) {
                        if(Thread.currentThread().isInterrupted)return@submit
                        val title=cursor.getString(1); val directory=cursor.getString(2)==DocumentsContract.Document.MIME_TYPE_DIR
                        if(directory || title!=null && ModelParser.supported(title))entries.add(FolderEntry(cursor.getString(0),title ?: "Folder",directory))
                        if(entries.size>10000)throw IOException("This folder is too large. Choose a smaller subfolder.")
                    }
                }
                entries.sortWith(compareByDescending<FolderEntry> { it.directory }.thenComparator { a,b -> a.title.compareTo(b.title,ignoreCase=true) })
                runOnUiThread {
                    if(job!=generation || isDestroyed)return@runOnUiThread
                    loading.visibility=View.GONE
                    val labels=mutableListOf<String>()
                    if(parents.isNotEmpty())labels.add("↑ Parent folder")
                    entries.forEach { labels.add(if(it.directory)"▸ ${it.title}" else it.title) }
                    val dialog=AlertDialog.Builder(this).setTitle("Choose a model").setNegativeButton("Cancel",null)
                    if(labels.isEmpty())dialog.setMessage("No STL, OBJ, 3MF, DXF, SCAD, STEP/STP, or DWG files in this folder.")
                    else dialog.setItems(labels.toTypedArray()) { _,index ->
                        if(parents.isNotEmpty() && index==0)browseFolder(tree,parents.last(),parents.dropLast(1))
                        else {
                            val entry=entries[index-if(parents.isEmpty())0 else 1]
                            if(entry.directory)browseFolder(tree,entry.id,parents+documentId)
                            else load(DocumentsContract.buildDocumentUriUsingTree(tree,entry.id),entry.title,null)
                        }
                    }
                    dialog.show()
                }
            } catch(e: Exception) {
                runOnUiThread { if(job==generation && !isDestroyed)showError("Could not browse folder: ${e.message}") }
            }
        }
    }
    private fun intentUri(intent: Intent): Uri? = when(intent.action) {
        Intent.ACTION_VIEW -> intent.data
        Intent.ACTION_SEND -> intent.getParcelableExtra(Intent.EXTRA_STREAM)
        else -> null
    }
    override fun onNewIntent(intent: Intent) { super.onNewIntent(intent); setIntent(intent); intentUri(intent)?.let { load(it,null,null) } }
    private fun cachedModel()=File(filesDir,"model.stl")
    private fun load(uri: Uri?,restoreName: String?,camera: FloatArray?) {
        val job=++generation; pending?.cancel(true)
        loadingText.text="Opening model…"; loading.visibility=View.VISIBLE
        pending=loader.submit {
            var temporary: File?=null
            try {
                var displayName=restoreName ?: "Model.stl"
                var source=cachedModel()
                if(uri!=null) {
                    displayName=restoreName ?: uri.lastPathSegment ?: "Model.stl"
                    try {
                        contentResolver.query(uri,arrayOf(OpenableColumns.DISPLAY_NAME),null,null,null).use { cursor ->
                            if(cursor!=null && cursor.moveToFirst() && !cursor.isNull(0))displayName=cursor.getString(0)
                        }
                    } catch(_: RuntimeException) { /* Metadata is optional if the stream can be read. */ }
                    source=File.createTempFile("stl-",".tmp",cacheDir); temporary=source
                    contentResolver.openInputStream(uri).use { input ->
                        if(input==null)throw IOException("This file could not be opened.")
                        source.outputStream().use { output ->
                            val buffer=ByteArray(32768); var total=0L
                            while(true) {
                                val read=input.read(buffer); if(read == -1)break
                                if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
                                total+=read
                                if(total>StlParser.MAX_BYTES)throw IOException("Please choose a model smaller than 64 MB.")
                                output.write(buffer,0,read)
                            }
                        }
                    }
                }
                val mesh=if(ModelParser.needsEngine(displayName)) {
                    val type=ModelParser.extension(displayName)
                    val status=when(type) { "scad"->"Compiling SCAD on your phone…"; "dwg"->"Reading DWG on your phone…"; else->"Preparing STEP surfaces…" }
                    runOnUiThread { if(job==generation)loadingText.text=status }
                    val compiled=LocalCadEngine(this).convert(source,type)
                    try {
                        ModelParser.read(compiled.file,"compiled.${compiled.format}").also { mesh ->
                            if(compiled.units.isNotEmpty())mesh.units=compiled.units
                            if(type=="dwg")mesh.notice=mesh.notice.replace("DXF","DWG")
                            if(compiled.notice.isNotEmpty())mesh.notice+=(if(mesh.notice.isEmpty())"" else "\n\n")+compiled.notice
                        }
                    } catch(e: IOException) {
                        if(type=="dwg" && e.message!=null)throw IOException(e.message!!.replace("DXF","DWG"),e)
                        throw e
                    } finally { compiled.file.delete() }
                } else ModelParser.read(source,displayName)
                if(Thread.currentThread().isInterrupted)return@submit
                val finalName=displayName; val finalSource=source
                runOnUiThread {
                    if(job!=generation || isDestroyed) { if(uri!=null)finalSource.delete(); return@runOnUiThread }
                    try {
                        if(uri!=null)Files.move(finalSource.toPath(),cachedModel().toPath(),StandardCopyOption.REPLACE_EXISTING)
                        loadedName=finalName; name.text=finalName
                        val primitives=if(mesh.segments>0)String.format(Locale.getDefault(),"%,d triangles · %,d lines",mesh.triangles,mesh.segments) else String.format(Locale.getDefault(),"%,d triangles",mesh.triangles)
                        detail.text=String.format(Locale.getDefault(),"%s · %s × %s × %s %s",primitives,dimension(mesh.width),dimension(mesh.depth),dimension(mesh.height),mesh.units)
                        notice.text=if(mesh.notice.isEmpty())"" else "Viewing notes · Details"
                        notice.visibility=if(mesh.notice.isEmpty())View.GONE else View.VISIBLE
                        notice.setOnClickListener { AlertDialog.Builder(this).setTitle("Viewing notes").setMessage(mesh.notice).setPositiveButton("OK",null).show() }
                        model.show(mesh); model.restore(camera)
                        empty.visibility=View.GONE; loading.visibility=View.GONE; reset.isEnabled=true
                    } catch(_: IOException) { showError("Could not save a local copy of this model.") }
                }
                temporary=null // UI callback now owns the temporary file.
            } catch(_: OutOfMemoryError) {
                runOnUiThread { if(job==generation && !isDestroyed)showError("This model is too large for the available memory. Please try a smaller file.") }
            } catch(e: Exception) {
                if(!Thread.currentThread().isInterrupted)runOnUiThread { if(job==generation && !isDestroyed)showError(e.message ?: "This model could not be opened.") }
            } finally { temporary?.delete() }
        }
    }
    private fun dimension(value: Double)=String.format(Locale.getDefault(),"%.3g",value)
    private fun showError(message: String) {
        loading.visibility=View.GONE
        AlertDialog.Builder(this).setTitle("Couldn't open model").setMessage(message).setPositiveButton("OK",null).show()
    }
    override fun onSaveInstanceState(state: Bundle) {
        super.onSaveInstanceState(state)
        loadedName?.let { state.putString("name",it); state.putFloatArray("camera",model.camera()) }
    }
    override fun onResume() { super.onResume(); model.onResume() }
    override fun onPause() { model.onPause(); super.onPause() }
    override fun onDestroy() { generation++; pending?.cancel(true); loader.shutdownNow(); super.onDestroy() }
    private fun dp(value: Int)=(value*resources.displayMetrics.density).roundToInt()
    private fun column()=LinearLayout(this).apply { orientation=LinearLayout.VERTICAL }
    private fun text(value: String,size: Int,color: Int)=TextView(this).apply { text=value; textSize=size.toFloat(); setTextColor(color) }
    private fun button(label: String,primary: Boolean)=Button(this).apply {
        text=label; isAllCaps=false; textSize=15f; setTextColor(if(primary)INK else MINT); setTypeface(null,Typeface.BOLD)
        val shape=GradientDrawable().apply { setColor(if(primary)MINT else 0xff1d2a35.toInt()); cornerRadius=dp(14).toFloat() }
        background=RippleDrawable(ColorStateList.valueOf(0x3371e4c5),shape,null)
    }
    companion object {
        private const val OPEN_STL=1
        private const val OPEN_FOLDER=2
        private val INK=0xff10171f.toInt()
        private val MUTED=0xff97a8b9.toInt()
        private val MINT=0xff71e4c5.toInt()
        private const val SUPPORTED_FORMATS="STL, OBJ, 3MF, ASCII DXF, SCAD, STEP/STP, and DWG.\n\nSTEP solids and surfaces are converted to a shaded preview. DWG shows supported drawing geometry; proprietary 3D solids, proxy objects, external references, and hatches are not rendered.\n\nDXF/DWG text, multiline notes, visible block attributes, and dimensions with saved drawing blocks are displayed. Text uses a substitute outline font; rich styling, background masks, and exact spacing may differ. Use Top view to read plans.\n\nSCAD scripts run offline and must be self-contained or use the bundled MCAD library.\n\nModels use a single surface color. Viewing notes identify omitted content.\n\nIf a file is missing from the picker, try Show all files or Browse folder."
        private val SUPPORTED_MIMES=arrayOf(
            "model/stl","application/sla","application/vnd.ms-pki.stl","application/x-stl","application/stl","application/x-navistyle",
            "model/obj","application/x-wavefront-obj","application/x-tgif","text/x-obj",
            "model/3mf","application/vnd.ms-package.3dmanufacturing-3dmodel+xml","application/3mf",
            "application/x-openscad","application/x-scad","text/x-scad",
            "application/dxf","application/x-dxf","image/vnd.dxf","image/x-dxf","drawing/x-dxf",
            "model/step","application/step","application/x-step","application/x-stp","text/x-step",
            "image/vnd.dwg","image/x-dwg","application/acad","application/x-acad","application/dwg","application/x-dwg",
            
            "application/octet-stream","text/plain","application/zip","application/x-zip-compressed"
        )
    }
}

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
import java.util.Locale
import java.util.concurrent.Executors
import java.util.concurrent.Future
import kotlin.math.roundToInt

class MainActivity : Activity() {
    private val loader=Executors.newSingleThreadExecutor()
    private var pending: Future<*>?=null
    private lateinit var model: ModelView
    private lateinit var name: TextView
    private var modelDetails=""
    private var modelNotice=""
    private var hasModel=false
    private var hasFaces=false
    private var fullScreen=false
    private lateinit var rootLayout: LinearLayout
    private lateinit var exitFullScreen: Button
    private var backCallback: android.window.OnBackInvokedCallback?=null
    private lateinit var loadingText: TextView
    private lateinit var headerLayout: LinearLayout
    private lateinit var empty: LinearLayout
    private lateinit var loading: LinearLayout
    private lateinit var pickHint: TextView
    private lateinit var sectionPanel: LinearLayout
    private lateinit var sectionActions: LinearLayout
    private lateinit var sectionSlider: SectionSlider
    private lateinit var sectionSeek: SeekBar
    private var sectionState=SectionState.IDLE
    private var sectionMin=0f
    private var sectionMax=0f
    private enum class SectionState { IDLE, PICKING, ACTIVE }
    private var loadedName: String?=null
    private var loadedId: String?=null
    private val recentModels by lazy { RecentModels(File(filesDir,"models")) }
    private var generation=0

    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        val root=column().apply { setBackgroundColor(INK) };rootLayout=root
        root.setOnApplyWindowInsetsListener { view,insets ->
            if(Build.VERSION.SDK_INT>=30) {
                val bars=insets.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
                if(fullScreen)view.setPadding(0,0,0,0) else view.setPadding(bars.left,bars.top,bars.right,bars.bottom)
                if(::exitFullScreen.isInitialized) {
                    val safe=insets.getInsetsIgnoringVisibility(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
                    (exitFullScreen.layoutParams as FrameLayout.LayoutParams).apply { topMargin=dp(8)+safe.top; marginEnd=dp(8)+safe.right }.also { exitFullScreen.layoutParams=it }
                }
            } else if(fullScreen)view.setPadding(0,0,0,0) else view.setPadding(insets.systemWindowInsetLeft,insets.systemWindowInsetTop,insets.systemWindowInsetRight,insets.systemWindowInsetBottom)
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
            menu.menu.add(0,7,0,"Open model")
            menu.menu.add(0,6,1,"Recent models")
            menu.menu.add(0,3,2,"Browse folder")
            menu.menu.add(0,1,3,"Show all files")
            menu.menu.add(0,8,4,"Reset view").isEnabled=hasModel
            menu.menu.add(0,4,5,"Top view").isEnabled=hasModel
            menu.menu.add(0,9,6,"Section analysis").isEnabled=hasModel
            menu.menu.add(0,10,7,"Full screen").isEnabled=hasModel
            menu.menu.add(0,11,8,"Model details").isEnabled=hasModel
            menu.menu.add(0,12,9,"Gesture help")
            menu.menu.add(0,2,10,"Supported formats")
            menu.menu.add(0,5,11,"Crash diagnostics")
            menu.setOnMenuItemClickListener { item ->
                when(item.itemId) {
                    7 -> openFile(false)
                    1 -> openFile(true)
                    3 -> openFolder()
                    4 -> model.topView()
                    5 -> showDiagnostics()
                    6 -> showRecentModels()
                    8 -> model.reset()
                    9 -> chooseSectionPlane()
                    10 -> setFullScreen(true)
                    11 -> AlertDialog.Builder(this).setTitle(loadedName ?: "Model details").setMessage(modelDetails+if(modelNotice.isEmpty())"" else "\n\nViewing notes\n$modelNotice").setPositiveButton("OK",null).show()
                    12 -> AlertDialog.Builder(this).setTitle("Gesture help").setMessage("Drag to rotate. Use two fingers to pan or pinch to zoom. Double tap to reset the view.").setPositiveButton("OK",null).show()
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
        model=ModelView(this) { message -> if(!isDestroyed)showError(message) }; viewport.addView(model)
        model.onSectionPicked={ pick,min,max -> onSectionPicked(pick,min,max) }
        pickHint=text("Tap a face to place the cut plane",13,Color.WHITE).apply {
            gravity=Gravity.CENTER; visibility=View.GONE
            background=GradientDrawable().apply { setColor(0xcc10171f.toInt()); cornerRadius=dp(18).toFloat() }
            setPadding(dp(16),dp(10),dp(16),dp(10))
        }
        viewport.addView(pickHint,FrameLayout.LayoutParams(-2,-2,Gravity.TOP or Gravity.CENTER_HORIZONTAL).apply { topMargin=dp(12) })
        sectionPanel=column().apply {
            gravity=Gravity.CENTER_VERTICAL; visibility=View.GONE
            background=GradientDrawable().apply { setColor(0xff1d2a35.toInt()); cornerRadius=dp(14).toFloat() }
            setPadding(dp(14),dp(8),dp(14),dp(8))
        }
        sectionActions=LinearLayout(this).apply { gravity=Gravity.CENTER_VERTICAL }
        sectionActions.addView(text("Section",14,Color.WHITE).apply { setTypeface(null,Typeface.BOLD) },LinearLayout.LayoutParams(0,-2,1f))
        sectionActions.addView(button("Plane",false).apply { setOnClickListener { chooseSectionPlane() } },LinearLayout.LayoutParams(-2,dp(48)))
        sectionPanel.addView(sectionActions)
        sectionSeek=SeekBar(this).apply {
            max=1000
            contentDescription="Section position"
            thumb=GradientDrawable().apply { shape=GradientDrawable.OVAL;setColor(MINT);setSize(dp(28),dp(28)) }
            setPadding(dp(20),0,dp(20),0)
            progressTintList=ColorStateList.valueOf(MINT)
            thumbTintList=ColorStateList.valueOf(MINT)
            setOnSeekBarChangeListener(object: SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(seek: SeekBar?,progress: Int,fromUser: Boolean) {
                    if(!fromUser || sectionState!=SectionState.ACTIVE)return
                    model.setSectionOffset(sectionMin+progress/1000f*(sectionMax-sectionMin))
                }
                override fun onStartTrackingTouch(seek: SeekBar?) {}
                override fun onStopTrackingTouch(seek: SeekBar?) {}
            })
        }
        sectionSlider=SectionSlider(this,sectionSeek)
        sectionPanel.addView(sectionSlider,LinearLayout.LayoutParams(-1,dp(64)))
        sectionActions.addView(button("Flip",false).apply {
            contentDescription="Flip visible side of section"
            setOnClickListener { if(sectionState==SectionState.ACTIVE)model.flipSection() }
        },LinearLayout.LayoutParams(-2,dp(48)))
        sectionActions.addView(button("Done",false).apply { setOnClickListener { endSection() } },LinearLayout.LayoutParams(-2,dp(48)))
        viewport.addView(sectionPanel,FrameLayout.LayoutParams(-1,-2,Gravity.TOP).apply { marginStart=dp(12); marginEnd=dp(12); topMargin=dp(12) })
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
        exitFullScreen=button("✕",false).apply { contentDescription="Exit full screen";visibility=View.GONE;setOnClickListener { setFullScreen(false) } }
        viewport.addView(exitFullScreen,FrameLayout.LayoutParams(dp(48),dp(48),Gravity.TOP or Gravity.END).apply { topMargin=dp(8);marginEnd=dp(8) })
        setContentView(root);root.requestApplyInsets();adaptLayout(resources.configuration)
        val savedName=state?.getString("name")
        val initial=intentUri(intent)
        val savedId=state?.getString("modelId")
        if(savedId!=null)load(null,savedName,state.getFloatArray("camera"),savedId)
        else if(savedName!=null && cachedModel().isFile)load(null,savedName,state.getFloatArray("camera"))
        else if(initial!=null)load(initial,null,null)
        else showRecentModels(false)
    }
    override fun onConfigurationChanged(configuration: Configuration) { super.onConfigurationChanged(configuration); adaptLayout(configuration) }
    private fun adaptLayout(configuration: Configuration) {
        val landscape=configuration.orientation==Configuration.ORIENTATION_LANDSCAPE
        sectionSlider.vertical=landscape
        sectionPanel.orientation=if(landscape)LinearLayout.HORIZONTAL else LinearLayout.VERTICAL
        sectionActions.orientation=if(landscape)LinearLayout.VERTICAL else LinearLayout.HORIZONTAL
        sectionPanel.setPadding(dp(if(landscape)8 else 14),dp(8),dp(if(landscape)8 else 14),dp(8))
        sectionPanel.removeView(sectionSlider)
        sectionPanel.addView(sectionSlider,if(landscape)0 else 1,
            LinearLayout.LayoutParams(if(landscape)dp(64) else -1,if(landscape)-1 else dp(64)))
        sectionActions.layoutParams=LinearLayout.LayoutParams(if(landscape)dp(80) else -1,-2)
        for(i in 0 until sectionActions.childCount) {
            sectionActions.getChildAt(i).layoutParams=if(i==0)
                LinearLayout.LayoutParams(if(landscape)-1 else 0,-2,if(landscape)0f else 1f)
            else LinearLayout.LayoutParams(if(landscape)-1 else -2,dp(48))
        }
        sectionPanel.layoutParams=FrameLayout.LayoutParams(if(landscape)dp(160) else -1,if(landscape)-1 else -2,
            if(landscape)Gravity.LEFT or Gravity.TOP else Gravity.TOP).apply {
            leftMargin=dp(12);rightMargin=dp(12);topMargin=dp(12);bottomMargin=dp(12)
        }
        val compact=configuration.screenHeightDp<500
        val visibility=if(compact)View.GONE else View.VISIBLE
        name.visibility=visibility
        headerLayout.setPadding(dp(24),dp(if(compact)4 else 20),dp(24),dp(if(compact)4 else 14))
    }
    private fun setFullScreen(enabled: Boolean) {
        fullScreen=enabled
        headerLayout.visibility=if(enabled)View.GONE else View.VISIBLE
        sectionPanel.visibility=if(!enabled && sectionState==SectionState.ACTIVE)View.VISIBLE else View.GONE
        pickHint.visibility=if(!enabled && sectionState==SectionState.PICKING)View.VISIBLE else View.GONE
        model.setSectionPicking(!enabled && sectionState==SectionState.PICKING)
        exitFullScreen.visibility=if(enabled)View.VISIBLE else View.GONE
        if(Build.VERSION.SDK_INT>=30) {
            window.insetsController?.apply {
                systemBarsBehavior=android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                if(enabled)hide(WindowInsets.Type.systemBars()) else show(WindowInsets.Type.systemBars())
            }
        } else {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility=if(enabled)View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_LAYOUT_STABLE else View.SYSTEM_UI_FLAG_VISIBLE
        }
        if(Build.VERSION.SDK_INT>=33) {
            if(enabled && backCallback==null) {
                val callback=android.window.OnBackInvokedCallback { setFullScreen(false) };backCallback=callback
                onBackInvokedDispatcher.registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,callback)
            } else if(!enabled) { backCallback?.let { onBackInvokedDispatcher.unregisterOnBackInvokedCallback(it) };backCallback=null }
        }
        rootLayout.requestApplyInsets()
    }
    @android.annotation.SuppressLint("GestureBackNavigation") // API 33+ uses the registered OnBackInvokedCallback; this handles API 26–32.
    @Deprecated("Legacy Android back handling")
    override fun onBackPressed() { if(fullScreen)setFullScreen(false) else super.onBackPressed() }
    private fun chooseSectionPlane() {
        val labels=mutableListOf("XY · horizontal", "XZ · front/back", "YZ · left/right")
        if(hasFaces)labels.add("Pick a face")
        if(sectionState!=SectionState.IDLE)labels.add("Remove section")
        AlertDialog.Builder(this).setTitle("Section plane").setItems(labels.toTypedArray()) { _,index ->
            if(index<3) {
                sectionState=SectionState.PICKING;pickHint.visibility=View.GONE
                model.setSectionPicking(false);model.setAxisSection(intArrayOf(2,1,0)[index])
            } else if(labels[index]=="Pick a face") {
                sectionState=SectionState.PICKING;sectionPanel.visibility=View.GONE;pickHint.visibility=View.VISIBLE
                model.setSectionPicking(true)
            } else endSection()
        }.setNegativeButton("Cancel",null).show()
    }
    private fun onSectionPicked(pick: SectionClip.Pick?,min: Float,max: Float) {
        if(sectionState==SectionState.IDLE)return
        if(pick==null) {
            Toast.makeText(this,"No face there. Tap a face on the model.",Toast.LENGTH_SHORT).show()
            return
        }
        sectionMin=min; sectionMax=max
        sectionState=SectionState.ACTIVE
        pickHint.visibility=View.GONE
        sectionPanel.visibility=if(fullScreen)View.GONE else View.VISIBLE
        model.setSectionPicking(false)
        val offset=pick.normal[0]*pick.point[0]+pick.normal[1]*pick.point[1]+pick.normal[2]*pick.point[2]
        sectionSeek.progress=if(sectionMax>sectionMin)((offset-sectionMin)/(sectionMax-sectionMin)*1000f).roundToInt().coerceIn(0,1000) else 500
    }
    private fun endSection() {
        sectionState=SectionState.IDLE
        model.clearSection()
        pickHint.visibility=View.GONE
        sectionPanel.visibility=View.GONE
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
                    if(labels.isEmpty())dialog.setMessage("No PLY, STL, OBJ, 3MF, DXF, SCAD, STEP/STP, DWG, SKP, or USDZ files in this folder.")
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
    private fun showRecentModels(showEmpty: Boolean=true) {
        val requestedGeneration=generation
        loader.submit {
            val entries=recentModels.list()
            val total=entries.sumOf { it.bytes }
            runOnUiThread {
                if(isDestroyed || requestedGeneration!=generation || (!showEmpty && entries.isEmpty()))return@runOnUiThread
                val labels=entries.map { entry ->
                    val status=if(entry.converted)"Conversion saved" else "Saved on device"
                    "${entry.name}\n$status · ${android.text.format.Formatter.formatFileSize(this,entry.bytes)}"
                }.toTypedArray()
                val dialog=AlertDialog.Builder(this).setTitle("Recent models")
                if(entries.isEmpty())dialog.setMessage("Models you open are saved here for quick access, even without the original file.")
                else dialog.setItems(labels) { _,index -> load(null,null,null,entries[index].id) }
                dialog.setPositiveButton("Open file") { _,_ -> openFile(false) }
                dialog.setNegativeButton("Close",null)
                if(entries.isNotEmpty())dialog.setNeutralButton("Manage · ${android.text.format.Formatter.formatFileSize(this,total)}") { _,_ ->
                    AlertDialog.Builder(this).setTitle("Remove saved model").setItems(labels) { _,index ->
                        val entry=entries[index]
                        AlertDialog.Builder(this).setTitle("Remove ${entry.name}?")
                            .setMessage("Removes the local copy and cached conversion. The original file is unaffected.")
                            .setNegativeButton("Cancel",null).setPositiveButton("Remove") { _,_ ->
                                loader.submit {
                                    try { recentModels.remove(entry.id)
                                        runOnUiThread { if(!isDestroyed) { if(loadedId==entry.id) { loadedId=null;loadedName=null };showRecentModels() } }
                                    } catch(e: IOException) { runOnUiThread { if(!isDestroyed)showError(e.message ?: "Could not remove saved model.") } }
                                }
                            }.show()
                    }.setNegativeButton("Close",null).show()
                }
                dialog.show()
            }
        }
    }
    private fun cachedModel()=File(filesDir,"model.stl")
    private fun load(uri: Uri?,restoreName: String?,camera: FloatArray?,recentId: String?=null) {
        val job=++generation; pending?.cancel(true)
        loadingText.text="Opening model…"; loading.visibility=View.VISIBLE
        pending=loader.submit {
            var temporary: File?=null
            var entry: RecentModels.Entry?=null
            var published=false
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
                            val buffer=ByteArray(32768)
                            while(true) {
                                val read=input.read(buffer); if(read == -1)break
                                if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
                                output.write(buffer,0,read)
                            }
                        }
                    }
                }
                val saved=if(recentId!=null)recentModels.get(recentId) ?: throw IOException("This saved model is no longer available.") else recentModels.prepare(source,displayName)
                entry=saved;source=saved.source;displayName=saved.name
                // Migrate the previous single-entry conversion cache when it matches.
                if(!saved.converted && recentId==null) {
                    CompiledModelCache.lookup(filesDir,source,displayName)?.let { old ->
                        CompiledModelCache.store(saved.directory,old.file,source,displayName,old.format,old.units,old.notice)
                    }
                }
                val mesh=if(ModelParser.needsEngine(displayName)) {
                    loadConverted(ModelParser.extension(displayName),source,displayName,job,saved.directory)
                } else ModelParser.read(source,displayName)
                if(Thread.currentThread().isInterrupted)return@submit
                val finalName=displayName
                recentModels.touch(saved);published=true
                runOnUiThread {
                    if(job!=generation || isDestroyed)return@runOnUiThread
                    try {
                        loadedId=saved.id;loadedName=finalName; name.text=finalName
                        val primitives=if(mesh.pointCount>0)String.format(Locale.getDefault(),"%,d points",mesh.pointCount) else if(mesh.segments>0)String.format(Locale.getDefault(),"%,d triangles · %,d lines",mesh.triangles,mesh.segments) else String.format(Locale.getDefault(),"%,d triangles",mesh.triangles)
                        modelDetails=String.format(Locale.getDefault(),"%s · %s × %s × %s %s",primitives,dimension(mesh.width),dimension(mesh.depth),dimension(mesh.height),mesh.units)
                        modelNotice=mesh.notice
                        CrashDiagnostics.stage("Uploading model to renderer")
                        model.show(mesh); model.restore(camera)
                        empty.visibility=View.GONE; loading.visibility=View.GONE; hasModel=true
                        hasFaces=mesh.triangles>0 || mesh.resources.isNotEmpty(); endSection()
                    } catch(_: IOException) { showError("Could not save a local copy of this model.") }
                }
            } catch(_: OutOfMemoryError) {
                runOnUiThread { if(job==generation && !isDestroyed)showError("This model is too large for the available memory. Please try a smaller file.") }
            } catch(e: Exception) {
                if(!Thread.currentThread().isInterrupted)runOnUiThread { if(job==generation && !isDestroyed)showError(e.message ?: "This model could not be opened.") }
            } finally { temporary?.delete();if(!published)entry?.let { recentModels.discardUnpublished(it) } }
        }
    }
    // Loads a model that needs the CAD engine (SKP, STEP, DWG, SCAD).
    // The converted output for a source is kept on disk, because
    // converting a large SketchUp file costs minutes in the WebView
    // reader while the output is deterministic for a given source. A
    // repeat load of the same source reads the saved conversion instead
    // of converting again. A corrupt cache entry falls back to a full
    // conversion instead of blocking the model.
    private fun loadConverted(type: String,source: File,displayName: String,job: Int,cacheDirectory: File): StlParser.Mesh {
        val cached=CompiledModelCache.lookup(cacheDirectory,source,displayName)
        if(cached!=null) {
            try {
                CrashDiagnostics.stage("Loading saved $type conversion")
                runOnUiThread { if(job==generation)loadingText.text="Opening saved model…" }
                return ModelParser.read(cached.file,"cached.${cached.format}").also { mesh ->
                    if(cached.units.isNotEmpty())mesh.units=cached.units
                    mesh.notice=cached.notice
                }
            } catch(e: IOException) {
                CompiledModelCache.invalidate(cacheDirectory)
            }
        }
        CrashDiagnostics.stage("Converting $type")
        val status=when(type) { "scad"->"Compiling SCAD on your phone…"; "usdz"->"Reading USDZ on your phone…"; "skp"->"Reading SketchUp on your phone…"; "dwg"->"Reading DWG on your phone…"; else->"Preparing STEP surfaces…" }
        runOnUiThread { if(job==generation)loadingText.text=status }
        val compiled=LocalCadEngine(this).convert(source,type)
        CrashDiagnostics.stage("Preparing $type render geometry")
        var parsed=false
        try {
            return ModelParser.read(compiled.file,"compiled.${compiled.format}").also { mesh ->
                if(compiled.units.isNotEmpty())mesh.units=compiled.units
                if(type=="dwg")mesh.notice=mesh.notice.replace("DXF","DWG")
                if(compiled.notice.isNotEmpty())mesh.notice+=(if(mesh.notice.isEmpty())"" else "\n\n")+compiled.notice
                parsed=true
                // Keep the converted file as the disk cache for the next
                // load of this source. The parsed mesh memory-maps it,
                // so it is moved (rename) rather than copied.
                if(!CompiledModelCache.store(cacheDirectory,compiled.file,source,displayName,compiled.format,compiled.units,mesh.notice))compiled.file.delete()
            }
        } catch(e: IOException) {
            if(type=="dwg" && e.message!=null)throw IOException(e.message!!.replace("DXF","DWG"),e)
            throw e
        } finally { if(!parsed)compiled.file.delete() }
    }
    private fun dimension(value: Double)=String.format(Locale.getDefault(),"%.3g",value)
    private fun showDiagnostics() {
        val report=CrashDiagnostics.report()
        val text=TextView(this).apply { this.text=report; setTextIsSelectable(true); setPadding(dp(20),dp(12),dp(20),dp(12)) }
        AlertDialog.Builder(this).setTitle("Crash diagnostics")
            .setView(ScrollView(this).apply { addView(text) })
            .setPositiveButton("Copy") { _,_ ->
                getSystemService(android.content.ClipboardManager::class.java).setPrimaryClip(android.content.ClipData.newPlainText("CAD Viewer diagnostics",report))
                Toast.makeText(this,"Diagnostics copied",Toast.LENGTH_SHORT).show()
            }.setNeutralButton("Share") { _,_ ->
                startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT,report),"Share diagnostics"))
            }.setNegativeButton("Close",null).show()
    }
    private fun showError(message: String) {
        CrashDiagnostics.failure(message)
        loading.visibility=View.GONE
        AlertDialog.Builder(this).setTitle("Couldn't open model").setMessage(message).setPositiveButton("OK",null).show()
    }
    override fun onSaveInstanceState(state: Bundle) {
        super.onSaveInstanceState(state)
        loadedId?.let { state.putString("modelId",it) }
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
        private const val SUPPORTED_FORMATS="PLY, STL, OBJ, 3MF, ASCII DXF, SCAD, STEP/STP, DWG, SketchUp (SKP), and USDZ.\n\nSketchUp shows triangulated surfaces with component placements. Material colors and embedded PNG/JPEG textures are displayed. Projected texture mapping and overlapping transparency may be approximate. Loose edges, text, dimensions, and scene styles are not displayed. Some SketchUp versions or features may not import correctly.\n\nSTEP solids and surfaces are converted to a shaded preview. DWG shows supported drawing geometry; proprietary 3D solids, proxy objects, external references, and hatches are not rendered.\n\nDXF/DWG text, multiline notes, visible block attributes, and dimensions with saved drawing blocks are displayed. Text uses a substitute outline font; rich styling, background masks, and exact spacing may differ. Use Top view to read plans.\n\nSCAD scripts run offline and must be self-contained or use the bundled MCAD library.\n\nPLY supports ASCII and binary meshes and point clouds, including vertex RGB/alpha colors. USDZ displays static meshes, transforms, material colors and embedded textures. Animation and advanced USD features may differ or be omitted.\n\nFormats other than USDZ, SketchUp and PLY use a single surface color. Viewing notes identify omitted content.\n\nIf a file is missing from the picker, try Show all files or Browse folder."
        private val SUPPORTED_MIMES=arrayOf(
            "model/stl","application/sla","application/vnd.ms-pki.stl","application/x-stl","application/stl","application/x-navistyle",
            "model/obj","application/x-wavefront-obj","application/x-tgif","text/x-obj",
            "model/3mf","application/vnd.ms-package.3dmanufacturing-3dmodel+xml","application/3mf",
            "application/x-openscad","application/x-scad","text/x-scad",
            "application/dxf","application/x-dxf","image/vnd.dxf","image/x-dxf","drawing/x-dxf",
            // Android providers also label .skp using historical Koan MIME types.
            "application/vnd.koan","application/x-koan",
            "model/vnd.usdz+zip","model/usdz","application/usdz",
            "model/ply","application/ply","application/x-ply",
            "application/vnd.sketchup.skp","application/x-sketchup","application/x-skp",
            "model/step","application/step","application/x-step","application/x-stp","text/x-step",
            "image/vnd.dwg","image/x-dwg","application/acad","application/x-acad","application/dwg","application/x-dwg",
            
            "application/octet-stream","text/plain","application/zip","application/x-zip-compressed"
        )
    }
}

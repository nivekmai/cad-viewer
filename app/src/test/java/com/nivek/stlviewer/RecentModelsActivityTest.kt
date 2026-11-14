package com.nivek.stlviewer

import android.os.Looper
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.TimeUnit
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import org.robolectric.shadows.ShadowAlertDialog

@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35])
class RecentModelsActivityTest {
    @Test fun opensSavedModelFromStartupListWithoutOriginalFile() = exercise("Kitchen.obj",false)
    @Test fun opensSavedConversionWithoutReadingSketchUpAgain() = exercise("Kitchen.skp",true)
    private fun exercise(name: String,converted: Boolean) {
        val root=RuntimeEnvironment.getApplication().filesDir
        val library=RecentModels(File(root,"models"))
        val source=File(root,"original.obj").apply { writeText("v 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3\n") }
        val entry=library.touch(library.prepare(source,name));source.delete()
        if(converted) {
            // Deliberately not a valid SKP: success proves the saved conversion is used.
            val output=File(root,"converted.stl").apply { writeText("solid test\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 1 0 0\nvertex 0 1 0\nendloop\nendfacet\nendsolid test\n") }
            assertTrue(CompiledModelCache.store(entry.directory,output,entry.source,name,"stl","mm","cached"))
        }
        val controller=Robolectric.buildActivity(MainActivity::class.java).create()
        val activity=controller.get()
        fun settle() {
            val field=MainActivity::class.java.getDeclaredField("loader").apply { isAccessible=true }
            (field.get(activity) as ExecutorService).submit {}.get(20,TimeUnit.SECONDS)
            shadowOf(Looper.getMainLooper()).idle()
        }
        try {
            settle()
            val dialog=ShadowAlertDialog.getLatestAlertDialog()
            assertNotNull(dialog);assertEquals(1,dialog.listView.adapter.count)
            assertTrue(dialog.listView.adapter.getItem(0).toString().contains(name))
            dialog.listView.performItemClick(null,0,0)
            settle()
            val id=MainActivity::class.java.getDeclaredField("loadedId").apply { isAccessible=true }.get(activity)
            assertEquals(entry.id,id)
            assertFalse(source.exists())
        } finally { controller.destroy();File(root,"models").deleteRecursively() }
    }
}

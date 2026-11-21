package com.nivek.stlviewer

import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.SeekBar
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.shadows.ShadowAlertDialog
import org.robolectric.shadows.ShadowPopupMenu

@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35])
class ViewerUiTest {
    private fun field(activity: MainActivity,name: String)=MainActivity::class.java.getDeclaredField(name).apply { isAccessible=true }.get(activity)
    private fun call(activity: MainActivity,name: String,vararg args: Any) {
        val method=MainActivity::class.java.declaredMethods.single { it.name==name }
        method.isAccessible=true;method.invoke(activity,*args)
    }
    private fun buttons(view: View): List<Button> = if(view is ViewGroup)(0 until view.childCount).flatMap { buttons(view.getChildAt(it)) } else if(view is Button)listOf(view) else emptyList()
    @Test fun formerFooterActionsAreOnlyInMenuAndSliderHasRoomyTarget() {
        val controller=Robolectric.buildActivity(MainActivity::class.java).create();val activity=controller.get()
        try {
            val root=field(activity,"rootLayout") as LinearLayout
            assertEquals(2,root.childCount) // Header and expanding viewport; no footer.
            val menuButton=buttons(root).single { it.text=="⋮" };menuButton.performClick()
            val menu=ShadowPopupMenu.getLatestPopupMenu().menu
            val labels=(0 until menu.size()).map { menu.getItem(it).title.toString() }
            for(label in listOf("Open model","Recent models","Browse folder","Reset view","Section analysis","Model details","Gesture help","Full screen"))assertTrue(labels.contains(label))
            val slider=field(activity,"sectionSeek") as SeekBar
            assertTrue(slider.layoutParams.height>=64*activity.resources.displayMetrics.density)
            call(activity,"chooseSectionPlane")
            val dialog=ShadowAlertDialog.getLatestAlertDialog()
            assertEquals(listOf("XY · horizontal","XZ · front/back","YZ · left/right"),(0 until dialog.listView.adapter.count).map { dialog.listView.adapter.getItem(it).toString() })
        } finally { controller.destroy() }
    }
    @Test fun axisPlanesStartAtCenterAndFullscreenKeepsActualClipPlane() {
        val controller=Robolectric.buildActivity(MainActivity::class.java).create();val activity=controller.get()
        try {
            val view=field(activity,"model") as ModelView
            val scene=ModelView::class.java.getDeclaredField("scene").apply { isAccessible=true }.get(view)!!
            fun sceneField(name: String)=scene.javaClass.getDeclaredField(name).apply { isAccessible=true }
            sceneField("mesh").set(scene,StlParser.Mesh(floatArrayOf(-2f,-1f,-.5f,2f,-1f,.5f,0f,1f,0f),9))
            for(axis in 0..2) {
                view.setAxisSection(axis)
                val barrier=java.util.concurrent.CountDownLatch(1)
                view.queueEvent { barrier.countDown() }
                assertTrue(barrier.await(5,java.util.concurrent.TimeUnit.SECONDS))
                val expected=FloatArray(4).apply { this[axis]=1f }
                assertArrayEquals(expected,sceneField("clipPlane").get(scene) as FloatArray,0f)
                assertEquals(true,sceneField("clipEnabled").get(scene))
                call(activity,"setFullScreen",true);call(activity,"setFullScreen",false)
                assertArrayEquals(expected,sceneField("clipPlane").get(scene) as FloatArray,0f)
                assertEquals(true,sceneField("clipEnabled").get(scene))
            }
        } finally { controller.destroy() }
    }
    @Test fun fullscreenPreservesSectionAndRestoresEditorOnExit() {
        val controller=Robolectric.buildActivity(MainActivity::class.java).create();val activity=controller.get()
        try {
            val state=MainActivity::class.java.getDeclaredField("sectionState").apply { isAccessible=true }
            state.set(activity,requireNotNull(state.type.enumConstants).first { it.toString()=="PICKING" })
            call(activity,"onSectionPicked",SectionClip.Pick(floatArrayOf(0f,0f,.25f),floatArrayOf(0f,0f,1f),0f),-1f,1f)
            val slider=field(activity,"sectionSeek") as SeekBar
            val progress=slider.progress
            val panel=field(activity,"sectionPanel") as View
            assertEquals(View.VISIBLE,panel.visibility)
            call(activity,"setFullScreen",true)
            assertEquals(View.GONE,(field(activity,"headerLayout") as View).visibility)
            assertEquals(View.GONE,panel.visibility)
            assertEquals("ACTIVE",state.get(activity)?.toString())
            assertEquals(progress,slider.progress)
            val exit=field(activity,"exitFullScreen") as Button
            assertEquals(View.VISIBLE,exit.visibility);assertEquals("Exit full screen",exit.contentDescription)
            exit.performClick()
            assertEquals(View.VISIBLE,(field(activity,"headerLayout") as View).visibility)
            assertEquals(View.VISIBLE,panel.visibility);assertEquals(progress,slider.progress)
            assertEquals(View.GONE,exit.visibility)
        } finally { controller.destroy() }
    }
}

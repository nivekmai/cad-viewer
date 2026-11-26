package com.nivek.stlviewer

import android.view.MotionEvent
import android.view.View
import android.widget.SeekBar
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35])
class SectionSliderTest {
    @Test fun verticalTouchesIncreaseUpwardsAndKeepNativeUserCallbacks() {
        val context=RuntimeEnvironment.getApplication()
        val seek=SeekBar(context).apply { max=1000;setPadding(20,0,20,0) }
        var userChanges=0
        seek.setOnSeekBarChangeListener(object: SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(bar: SeekBar?,value: Int,user: Boolean) { if(user)userChanges++ }
            override fun onStartTrackingTouch(bar: SeekBar?) {}
            override fun onStopTrackingTouch(bar: SeekBar?) {}
        })
        val slider=SectionSlider(context,seek).apply { vertical=true }
        fun layout(w: Int,h: Int) {
            slider.measure(View.MeasureSpec.makeMeasureSpec(w,View.MeasureSpec.EXACTLY),View.MeasureSpec.makeMeasureSpec(h,View.MeasureSpec.EXACTLY))
            slider.layout(0,0,w,h)
        }
        fun tap(x: Float,y: Float) {
            for(action in listOf(MotionEvent.ACTION_DOWN,MotionEvent.ACTION_UP)) {
                val event=MotionEvent.obtain(0,1,action,x,y,0)
                assertTrue(slider.dispatchTouchEvent(event));event.recycle()
            }
        }
        layout(64,300)
        tap(32f,250f);val low=seek.progress
        tap(32f,50f);val high=seek.progress
        assertTrue("Up must increase section position: $low -> $high",high>low)
        assertTrue(userChanges>=2)
        slider.vertical=false;layout(300,64)
        assertEquals(high,seek.progress);assertEquals(0f,seek.rotation,0f)
        tap(50f,32f);val left=seek.progress
        tap(250f,32f);assertTrue(seek.progress>left)
    }
}

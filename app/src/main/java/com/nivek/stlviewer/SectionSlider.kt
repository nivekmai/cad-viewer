package com.nivek.stlviewer

import android.content.Context
import android.widget.FrameLayout
import android.widget.SeekBar

/** Rotate the native SeekBar inside its measured hit area, preserving native
 * touch handling, accessibility range actions, and fromUser callbacks. */
internal class SectionSlider(context: Context,val seekBar: SeekBar): FrameLayout(context) {
    var vertical=false
        set(value) { if(field!=value) { field=value;requestLayout() } }
    init { addView(seekBar) }
    override fun onMeasure(widthSpec: Int,heightSpec: Int) {
        val w=MeasureSpec.getSize(widthSpec);val h=MeasureSpec.getSize(heightSpec)
        setMeasuredDimension(w,h)
        seekBar.measure(MeasureSpec.makeMeasureSpec(if(vertical)h else w,MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(if(vertical)w else h,MeasureSpec.EXACTLY))
    }
    override fun onLayout(changed: Boolean,left: Int,top: Int,right: Int,bottom: Int) {
        val w=right-left;val h=bottom-top
        val childW=seekBar.measuredWidth;val childH=seekBar.measuredHeight
        val x=(w-childW)/2;val y=(h-childH)/2
        seekBar.layout(x,y,x+childW,y+childH)
        seekBar.pivotX=childW/2f;seekBar.pivotY=childH/2f
        seekBar.rotation=if(vertical)-90f else 0f
    }
}

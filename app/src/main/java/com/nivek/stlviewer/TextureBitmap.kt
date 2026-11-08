package com.nivek.stlviewer

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import java.nio.ByteBuffer

internal object TextureBitmap {
    fun decode(bytes: ByteBuffer, maxSize: Int): Bitmap {
        require(maxSize > 0) { "The graphics device does not support textures." }
        val options=BitmapFactory.Options().apply { inJustDecodeBounds=true }
        CadMeshParser.textureStream(bytes).use { BitmapFactory.decodeStream(it,null,options) }
        require(options.outWidth>0 && options.outHeight>0) { "Could not decode a model texture." }
        options.inSampleSize=1
        while(options.outWidth/options.inSampleSize>maxSize || options.outHeight/options.inSampleSize>maxSize)options.inSampleSize*=2
        // Android's filtered bitmap scaling requires premultiplied alpha. The shader
        // converts sampled colors back to straight alpha for material blending.
        options.inJustDecodeBounds=false; options.inScaled=false; options.inPremultiplied=true
        val decoded=CadMeshParser.textureStream(bytes).use { BitmapFactory.decodeStream(it,null,options) }
            ?: error("Could not decode a model texture.")
        fun supportedSize(size: Int): Int {
            var value=1
            while(value<size && value<maxSize)value*=2
            return minOf(value,maxSize)
        }
        try {
            // Cap the longest side at 1024 px before power-of-two rounding:
            // a 7,306 px strip texture costs 67 MB of GPU memory after
            // rounding up, for a surface rarely seen closer than a metre
            // away. The private model's textures fall from about 500 MB to
            // about 280 MB of GPU memory at this cap (before mipmaps), with
            // no visible change at normal viewing distance.
            val scale=minOf(1f,1024f/maxOf(decoded.width,decoded.height))
            val cappedWidth=maxOf(1,(decoded.width*scale).toInt()); val cappedHeight=maxOf(1,(decoded.height*scale).toInt())
            val width=supportedSize(cappedWidth); val height=supportedSize(cappedHeight)
            if(width==decoded.width && height==decoded.height)return decoded
            val scaled=Bitmap.createScaledBitmap(decoded,width,height,true)
            if(scaled!==decoded)decoded.recycle()
            return scaled
        } catch(error: Throwable) { decoded.recycle(); throw error }
    }
}

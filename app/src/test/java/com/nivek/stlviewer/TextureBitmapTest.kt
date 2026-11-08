package com.nivek.stlviewer

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35])
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class TextureBitmapTest {
    private fun png(): ByteArray {
        val source=Bitmap.createBitmap(443,591,Bitmap.Config.ARGB_8888)
        source.eraseColor(Color.argb(128,240,80,40))
        return ByteArrayOutputStream().use { stream ->
            source.compress(Bitmap.CompressFormat.PNG,100,stream); source.recycle(); stream.toByteArray()
        }
    }
    @Test fun privateModelTexturesWhenProvided() {
        val path=System.getenv("CAD_PRIVATE_MESH")
        org.junit.Assume.assumeTrue("Optional private model is not present",path!=null)
        // Parse through the real mesh reader so this covers both the baked
        // CVM1 and instanced CVM2 layouts.
        val mesh=ModelParser.read(java.io.File(path!!),"private.cadmesh")
        assertEquals(129,mesh.textures.size)
        for(bytes in mesh.textures) {
            val bitmap=TextureBitmap.decode(bytes,4096)
            try {
                assertTrue(bitmap.width>0 && bitmap.height>0)
                if(bitmap.hasAlpha())assertTrue(bitmap.isPremultiplied)
            } finally { bitmap.recycle() }
        }
    }
    @Test fun unpremultipliedAlphaCannotBeScaled() {
        val bytes=png()
        val bitmap=BitmapFactory.decodeByteArray(bytes,0,bytes.size,BitmapFactory.Options().apply { inPremultiplied=false })
        try { assertThrows(RuntimeException::class.java) { Bitmap.createScaledBitmap(bitmap,512,1024,true) } }
        finally { bitmap.recycle() }
    }
    @Test fun transparentNonPowerOfTwoTextureScalesAndPreservesColor() {
        val bitmap=TextureBitmap.decode(ByteBuffer.wrap(png()),4096)
        try {
            assertEquals(512,bitmap.width); assertEquals(1024,bitmap.height)
            assertTrue(bitmap.isPremultiplied)
            val pixel=bitmap.getPixel(200,200)
            assertEquals(128,Color.alpha(pixel))
            assertEquals(240.0,Color.red(pixel).toDouble(),2.0)
            assertEquals(80.0,Color.green(pixel).toDouble(),2.0)
        } finally { bitmap.recycle() }
    }
}

package com.nivek.stlviewer

import java.io.File
import org.junit.Assert.*
import org.junit.Test

class RecentModelsTest {
    private fun fixture(block: (File,RecentModels)->Unit) {
        val dir=kotlin.io.path.createTempDirectory("recent-models").toFile()
        try { block(dir,RecentModels(File(dir,"library"))) } finally { dir.deleteRecursively() }
    }
    @Test fun keepsIndependentSourcesAndConversionsAfterOriginalsAreRemoved()=fixture { dir,library ->
        val entries=(1..2).map { n ->
            val original=File(dir,"house$n.skp").apply { writeBytes(ByteArray(100){n.toByte()}) }
            val entry=library.prepare(original,original.name)
            assertTrue(library.list().none { it.id==entry.id })
            val compiled=File(dir,"compiled$n").apply { writeBytes(ByteArray(100){(n+10).toByte()}) }
            assertTrue(CompiledModelCache.store(entry.directory,compiled,entry.source,entry.name,"cadmesh","mm","notice$n"))
            library.touch(entry);original.delete();entry
        }
        val restarted=RecentModels(File(dir,"library"))
        assertEquals(2,restarted.list().size)
        for(entry in entries.reversed()+entries) {
            val saved=restarted.get(entry.id)!!
            val hit=CompiledModelCache.lookup(saved.directory,saved.source,saved.name)!!
            assertEquals("mm",hit.units);assertEquals(100L,hit.file.length())
            restarted.touch(saved)
        }
        restarted.remove(entries[0].id)
        assertNull(restarted.get(entries[0].id));assertNotNull(restarted.get(entries[1].id))
        assertNotNull(CompiledModelCache.lookup(entries[1].directory,entries[1].source,entries[1].name))
    }
    @Test fun deduplicatesContentButRetainsChangedVersionsAndFormats()=fixture { dir,library ->
        val original=File(dir,"file").apply { writeText("original") }
        val a=library.touch(library.prepare(original,"model.obj"))
        val b=library.touch(library.prepare(original,"model.obj"))
        assertEquals(a.id,b.id);assertEquals(1,library.list().size)
        val other=library.touch(library.prepare(original,"model.ply"));assertNotEquals(a.id,other.id)
        original.writeText("modified")
        val changed=library.touch(library.prepare(original,"model.obj"));assertNotEquals(a.id,changed.id)
        assertEquals("original",a.source.readText());assertEquals("modified",changed.source.readText())
        assertEquals(3,library.list().size)
    }
    @Test fun cancelledImportsAndCorruptEntriesDoNotDamageExistingModels()=fixture { dir,library ->
        val source=File(dir,"file").apply { writeText("source") }
        val pending=library.prepare(source,"part.stl");library.discardUnpublished(pending)
        assertFalse(pending.directory.exists());assertTrue(library.list().isEmpty())
        val saved=library.touch(library.prepare(source,"part.stl"))
        library.discardUnpublished(saved);assertNotNull(library.get(saved.id))
        File(saved.directory,"entry.properties").writeText("broken")
        assertTrue(library.list().isEmpty())
        library.touch(saved);assertEquals(1,library.list().size)
        assertThrows(IllegalArgumentException::class.java) { library.remove("../file") }
        assertTrue(source.exists())
    }
    @Test fun cacheInvalidationPreservesSourceForReconversion()=fixture { dir,library ->
        val source=File(dir,"file").apply { writeText("source") }
        val saved=library.touch(library.prepare(source,"part.skp"))
        val output=File(dir,"output").apply { writeBytes(ByteArray(50)) }
        CompiledModelCache.store(saved.directory,output,saved.source,saved.name,"cadmesh","mm","")
        CompiledModelCache.metaFile(saved.directory).writeText("invalid")
        assertNull(CompiledModelCache.lookup(saved.directory,saved.source,saved.name))
        CompiledModelCache.invalidate(saved.directory)
        assertEquals("source",saved.source.readText());assertNotNull(library.get(saved.id))
    }
}

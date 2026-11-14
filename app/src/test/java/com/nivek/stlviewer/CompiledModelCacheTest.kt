package com.nivek.stlviewer

import java.io.File
import org.junit.Assert.*
import org.junit.Test

class CompiledModelCacheTest {
    private fun dir(): File = createTempDir("compiled-cache-test").also { it.deleteOnExit() }

    private fun source(dir: File, name: String, bytes: ByteArray): File {
        val f = File(dir, name)
        f.writeBytes(bytes)
        f.setLastModified(1_700_000_000_000L)
        return f
    }

    @Test fun storeThenLookupRoundTrip() {
        val d = dir()
        val src = source(d, "house.skp", ByteArray(100) { 7 })
        val compiled = File(d, "compiled.tmp").apply { writeBytes(ByteArray(200) { 3 }) }
        assertTrue(CompiledModelCache.store(d, compiled, src, "house.skp", "cadmesh", "millimeter", "notes"))
        assertFalse(compiled.exists())
        val hit = CompiledModelCache.lookup(d, src, "house.skp")
        assertNotNull(hit)
        assertEquals("cadmesh", hit!!.format)
        assertEquals("millimeter", hit.units)
        assertEquals("notes", hit.notice)
        assertEquals(200, hit.file.length())
        assertTrue(hit.file.name.startsWith("model.compiled."))
    }

    @Test fun lookupMissesWhenSourceChanged() {
        val d = dir()
        val src = source(d, "house.skp", ByteArray(100) { 7 })
        val compiled = File(d, "compiled.tmp").apply { writeBytes(ByteArray(200) { 3 }) }
        assertTrue(CompiledModelCache.store(d, compiled, src, "house.skp", "cadmesh", "", ""))
        // Different size.
        src.writeBytes(ByteArray(101) { 7 })
        assertNull(CompiledModelCache.lookup(d, src, "house.skp"))
        // Same content copied by the picker with a different timestamp still hits.
        src.writeBytes(ByteArray(100) { 7 })
        src.setLastModified(1_700_000_000_001L)
        assertNotNull(CompiledModelCache.lookup(d, src, "house.skp"))
        // Same size and timestamp but different content must miss.
        src.writeBytes(ByteArray(100) { 8 })
        src.setLastModified(1_700_000_000_000L)
        assertNull(CompiledModelCache.lookup(d, src, "house.skp"))
        src.writeBytes(ByteArray(100) { 7 })
        // Restored content, different name.
        src.setLastModified(1_700_000_000_000L)
        assertNull(CompiledModelCache.lookup(d, src, "other.skp"))
        // Everything restored: hit again.
        assertNotNull(CompiledModelCache.lookup(d, src, "house.skp"))
    }

    @Test fun lookupMissesWithoutMetaOrFile() {
        val d = dir()
        val src = source(d, "house.skp", ByteArray(10))
        assertNull(CompiledModelCache.lookup(d, src, "house.skp"))
        val compiled = File(d, "compiled.tmp").apply { writeBytes(ByteArray(200) { 3 }) }
        assertTrue(CompiledModelCache.store(d, compiled, src, "house.skp", "cadmesh", "", ""))
        assertNotNull(CompiledModelCache.lookup(d, src, "house.skp"))
        CompiledModelCache.metaFile(d).delete()
        assertNull(CompiledModelCache.lookup(d, src, "house.skp"))
    }

    @Test fun lookupMissesOnCorruptMeta() {
        val d = dir()
        val src = source(d, "house.skp", ByteArray(10))
        val compiled = File(d, "compiled.tmp").apply { writeBytes(ByteArray(200) { 3 }) }
        assertTrue(CompiledModelCache.store(d, compiled, src, "house.skp", "cadmesh", "", ""))
        CompiledModelCache.metaFile(d).writeText("not a properties file {{{")
        assertNull(CompiledModelCache.lookup(d, src, "house.skp"))
    }

    @Test fun storeRejectsUnknownFormat() {
        val d = dir()
        val src = source(d, "house.skp", ByteArray(10))
        val compiled = File(d, "compiled.tmp").apply { writeBytes(ByteArray(200) { 3 }) }
        assertFalse(CompiledModelCache.store(d, compiled, src, "house.skp", "exe", "", ""))
        assertTrue(compiled.exists())
        assertFalse(CompiledModelCache.cacheFile(d, "exe").exists())
    }

    @Test fun invalidateDropsCacheAndMeta() {
        val d = dir()
        val src = source(d, "house.skp", ByteArray(10))
        val compiled = File(d, "compiled.tmp").apply { writeBytes(ByteArray(200) { 3 }) }
        assertTrue(CompiledModelCache.store(d, compiled, src, "house.skp", "cadmesh", "", ""))
        assertNotNull(CompiledModelCache.lookup(d, src, "house.skp"))
        CompiledModelCache.invalidate(d)
        assertNull(CompiledModelCache.lookup(d, src, "house.skp"))
        assertFalse(CompiledModelCache.cacheFile(d, "cadmesh").exists())
        assertFalse(CompiledModelCache.metaFile(d).exists())
    }

    @Test fun restoresOtherFormatEntry() {
        val d = dir()
        val src = source(d, "part.stl", ByteArray(10))
        val compiled = File(d, "compiled.tmp").apply { writeBytes(ByteArray(200) { 3 }) }
        assertTrue(CompiledModelCache.store(d, compiled, src, "part.stl", "stl", "", ""))
        assertTrue(CompiledModelCache.cacheFile(d, "stl").exists())
        val compiled2 = File(d, "compiled2.tmp").apply { writeBytes(ByteArray(300) { 4 }) }
        assertTrue(CompiledModelCache.store(d, compiled2, src, "part.stl", "cadmesh", "", ""))
        assertFalse(CompiledModelCache.cacheFile(d, "stl").exists())
        assertTrue(CompiledModelCache.cacheFile(d, "cadmesh").exists())
    }
}

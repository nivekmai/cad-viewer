package com.nivek.stlviewer

import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.util.Properties

/** One conversion cache per saved-model directory.
 *
 * Converting a large SketchUp file on the phone costs minutes (the reader
 * parses the whole file in a WebView worker), but the converted output is
 * deterministic for a given source file, so repeat loads should not pay
 * that cost again. After a successful conversion the compiled file is
 * kept here; the next load of the same source reads it straight through
 * [ModelParser] instead of running the converter.
 *
 * RecentModels gives each source its own directory, so opening another
 * model does not evict this conversion. The entry
 * is keyed on the source file's display name, size and SHA-256 content
 * fingerprint, plus a [VERSION] that is bumped whenever the converted format or
 * the cache semantics change, so a stale or foreign entry is never used.
 * A corrupt or unreadable entry falls back to a full conversion.
 *
 * The cached file is memory-mapped by the parsed mesh, so it is moved
 * into place with a rename (same filesystem) rather than copied; the
 * mapping follows the inode. */
object CompiledModelCache {
    const val VERSION = 3
    private const val META_NAME = "model.compiled.meta"
    private const val CACHE_PREFIX = "model.compiled."

    data class Hit(val file: File, val format: String, val units: String, val notice: String)

    fun cacheFile(dir: File, format: String) = File(dir, CACHE_PREFIX + format)
    fun metaFile(dir: File) = File(dir, META_NAME)

    /** Returns the cached conversion for [source], or null when there is
     * no entry, the entry does not match the source, or it is unusable. */
    fun lookup(dir: File, source: File, displayName: String): Hit? {
        val meta = readMeta(metaFile(dir)) ?: return null
        if (meta.version != VERSION) return null
        if (meta.sourceName != displayName || meta.sourceSize != source.length() ||
            meta.sourceHash != fingerprint(source)) return null
        if (meta.format !in setOf("cadmesh", "stl", "dxf")) return null
        val file = cacheFile(dir, meta.format)
        if (!file.isFile || file.length() <= 24) return null
        return Hit(file, meta.format, meta.units, meta.notice)
    }

    /** Moves [compiledFile] into the cache and records the source it was
     * built from. Returns false (leaving no partial entry) when anything
     * fails; the caller then deletes the compiled file as before. */
    fun store(dir: File, compiledFile: File, source: File, displayName: String,
              format: String, units: String, notice: String): Boolean {
        if (format !in setOf("cadmesh", "stl", "dxf")) return false
        val target = cacheFile(dir, format)
        val meta = metaFile(dir)
        val tmpMeta = File(dir, "$META_NAME.tmp")
        return try {
            Files.move(compiledFile.toPath(), target.toPath(), StandardCopyOption.REPLACE_EXISTING)
            val props = Properties().apply {
                setProperty("version", VERSION.toString())
                setProperty("sourceName", displayName)
                setProperty("sourceSize", source.length().toString())
                setProperty("sourceHash", fingerprint(source))
                setProperty("format", format)
                setProperty("units", units)
                setProperty("notice", notice)
            }
            tmpMeta.outputStream().use { props.store(it, null) }
            Files.move(tmpMeta.toPath(), meta.toPath(), StandardCopyOption.REPLACE_EXISTING)
            // A previous entry in another format is now stale; drop it so
            // a later lookup cannot mistake it for this model. The
            // metadata file shares the prefix, so it is never deleted here.
            dir.listFiles()?.forEach { f ->
                if (f.name.startsWith(CACHE_PREFIX) && f.name != META_NAME && f != target) f.delete()
            }
            true
        } catch (_: IOException) {
            tmpMeta.delete()
            target.delete()
            false
        } catch (_: RuntimeException) {
            tmpMeta.delete()
            target.delete()
            false
        }
    }

    /** Drops the cached conversion and its metadata. */
    fun invalidate(dir: File) {
        dir.listFiles()?.forEach { f ->
            if (f.name.startsWith(CACHE_PREFIX) || f.name == META_NAME || f.name == "$META_NAME.tmp") f.delete()
        }
    }

    private fun fingerprint(source: File): String {
        val digest=java.security.MessageDigest.getInstance("SHA-256")
        source.inputStream().use { input ->
            val buffer=ByteArray(65536)
            while(true) {
                if(Thread.currentThread().isInterrupted)throw java.io.InterruptedIOException()
                val n=input.read(buffer); if(n<0)break; digest.update(buffer,0,n)
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }

    private data class Meta(val version: Int, val sourceName: String, val sourceSize: Long,
                            val sourceHash: String, val format: String, val units: String, val notice: String)

    private fun readMeta(file: File): Meta? {
        if (!file.isFile) return null
        return try {
            val props = Properties()
            file.inputStream().use { props.load(it) }
            Meta(
                version = props.getProperty("version")?.toIntOrNull() ?: return null,
                sourceName = props.getProperty("sourceName") ?: return null,
                sourceSize = props.getProperty("sourceSize")?.toLongOrNull() ?: return null,
                sourceHash = props.getProperty("sourceHash") ?: return null,
                format = props.getProperty("format") ?: return null,
                units = props.getProperty("units") ?: "",
                notice = props.getProperty("notice") ?: ""
            )
        } catch (_: IOException) {
            null
        } catch (_: IllegalArgumentException) {
            null
        }
    }
}

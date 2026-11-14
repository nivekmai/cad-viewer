package com.nivek.stlviewer

import java.io.File
import java.io.IOException
import java.io.InterruptedIOException
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.security.MessageDigest
import java.util.Properties

/** App-owned snapshots: reopening does not depend on a provider URI or permission. */
class RecentModels(private val root: File) {
    data class Entry(val id: String,val name: String,val directory: File,val opened: Long) {
        val source get()=File(directory,"source")
        val converted get()=CompiledModelCache.metaFile(directory).isFile
        val bytes get()=directory.listFiles()?.sumOf { it.length() } ?: 0L
    }
    private fun directory(id: String): File {
        require(id.matches(Regex("[0-9a-f]{64}"))) { "Invalid saved model identifier." }
        return File(root,id)
    }
    fun get(id: String): Entry? {
        val dir=directory(id);val metadata=File(dir,"entry.properties")
        return try {
            val p=Properties();metadata.inputStream().use(p::load)
            val name=p.getProperty("name") ?: return null
            if(!File(dir,"source").isFile)return null
            Entry(id,name,dir,p.getProperty("opened")?.toLongOrNull() ?: 0)
        } catch(_: IOException) { null } catch(_: IllegalArgumentException) { null }
    }
    fun list(): List<Entry> = root.listFiles().orEmpty().filter { it.name.matches(Regex("[0-9a-f]{64}")) }
        .mapNotNull { get(it.name) }.sortedByDescending { it.opened }

    /** Prepare a private snapshot; publish it in recents only after successful parsing. */
    fun prepare(source: File,name: String): Entry {
        val digest=MessageDigest.getInstance("SHA-256")
        digest.update(ModelParser.extension(name).toByteArray(Charsets.UTF_8));digest.update(0.toByte())
        source.inputStream().use { input ->
            val bytes=ByteArray(65536)
            while(true) { if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
                val n=input.read(bytes);if(n<0)break;digest.update(bytes,0,n) }
        }
        val id=digest.digest().joinToString("") { "%02x".format(it) }
        val dir=directory(id);if(!dir.isDirectory && !dir.mkdirs())throw IOException("Could not create saved model storage.")
        val entry=Entry(id,name,dir,0)
        if(!entry.source.isFile) {
            val temporary=File(dir,"source.tmp")
            try {
                source.inputStream().use { input -> temporary.outputStream().use { output ->
                    val bytes=ByteArray(65536)
                    while(true) { if(Thread.currentThread().isInterrupted)throw InterruptedIOException()
                        val n=input.read(bytes);if(n<0)break;output.write(bytes,0,n) }
                } }
                Files.move(temporary.toPath(),entry.source.toPath(),StandardCopyOption.REPLACE_EXISTING)
            } finally { temporary.delete() }
        }
        return entry
    }
    fun touch(entry: Entry): Entry {
        val updated=entry.copy(opened=System.currentTimeMillis())
        val p=Properties().apply { setProperty("name",updated.name);setProperty("opened",updated.opened.toString()) }
        val temporary=File(entry.directory,"entry.tmp")
        try {
            temporary.outputStream().use { p.store(it,null) }
            Files.move(temporary.toPath(),File(entry.directory,"entry.properties").toPath(),StandardCopyOption.REPLACE_EXISTING,StandardCopyOption.ATOMIC_MOVE)
        } finally { temporary.delete() }
        return updated
    }
    fun remove(id: String) { if(!directory(id).deleteRecursively())throw IOException("Could not remove this saved model.") }
    fun discardUnpublished(entry: Entry) { if(!File(entry.directory,"entry.properties").isFile)remove(entry.id) }
}

package com.nivek.stlviewer

import android.app.ActivityManager
import android.app.Application
import android.app.ApplicationExitInfo
import android.content.Context
import android.os.Build
import java.io.File
import java.util.Date

class CadApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        CrashDiagnostics.initialize(this)
        val previous=Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread,error ->
            CrashDiagnostics.failure("Uncaught exception on ${thread.name}",error)
            previous?.uncaughtException(thread,error)
        }
    }
}

/** Local diagnostics only. Reports leave the device only via an explicit Copy/Share action. */
internal object CrashDiagnostics {
    private lateinit var context: Context
    private var stage="Starting app"
    private var version="unknown"
    fun initialize(context: Context) {
        this.context=context.applicationContext
        version=context.packageManager.getPackageInfo(context.packageName,0).versionName ?: "unknown"
    }
    @Synchronized fun stage(value: String) {
        stage=value
        if(Build.VERSION.SDK_INT>=30)try {
            context.getSystemService(ActivityManager::class.java).setProcessStateSummary("v$version: $value".toByteArray().take(128).toByteArray())
        } catch(_: RuntimeException) { }
    }
    @Synchronized fun failure(message: String,error: Throwable?=null) {
        try {
            val file=File(context.filesDir,"last-error.txt")
            val previous=if(file.exists())file.readText().takeLast(16000) else ""
            file.writeText("$previous\n${Date()} · v$version · $stage\n$message\n${error?.stackTraceToString().orEmpty()}")
        }
        catch(_: Exception) { }
    }
    fun report(): String = buildString {
        append("CAD Viewer $version\n${Build.MANUFACTURER} ${Build.MODEL} · Android ${Build.VERSION.RELEASE}\n")
        append("Current stage: $stage\n\n")
        try {
            val file=File(context.filesDir,"last-error.txt")
            if(file.exists())append("Last recorded error:\n${file.readText()}\n\n")
            if(Build.VERSION.SDK_INT>=30) {
                val exits=context.getSystemService(ActivityManager::class.java).getHistoricalProcessExitReasons(null,0,8)
                if(exits.isEmpty())append("Android has no recorded process exits.\n")
                for(exit in exits) {
                    append("${Date(exit.timestamp)} · ${exit.processName}\n")
                    append("${reason(exit.reason)} (code ${exit.reason}, status ${exit.status})\n")
                    append("Last sampled memory: RSS ${exit.rss/1024} MiB, PSS ${exit.pss/1024} MiB\n")
                    exit.processStateSummary?.let { append("Stage: ${it.toString(Charsets.UTF_8)}\n") }
                    append("${exit.description.orEmpty()}\n\n")
                }
            } else append("Android process-exit history requires Android 11 or later.\n")
        } catch(error: Exception) { append("Could not read diagnostic history: ${error.message}\n") }
    }
    internal fun reason(reason: Int): String = when(reason) {
        ApplicationExitInfo.REASON_LOW_MEMORY -> "Stopped by Android: low memory"
        ApplicationExitInfo.REASON_CRASH -> "Unhandled app exception"
        ApplicationExitInfo.REASON_CRASH_NATIVE -> "Native code crash"
        ApplicationExitInfo.REASON_ANR -> "App stopped responding"
        ApplicationExitInfo.REASON_SIGNALED -> "Process terminated by signal"
        ApplicationExitInfo.REASON_USER_REQUESTED -> "Stopped by user or system request"
        else -> "Process exited"
    }
}

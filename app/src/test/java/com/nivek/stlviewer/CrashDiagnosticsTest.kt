package com.nivek.stlviewer

import android.app.ApplicationExitInfo
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35])
class CrashDiagnosticsTest {
    @Test fun retainsFailureStageAndExceptionLocally() {
        CrashDiagnostics.initialize(RuntimeEnvironment.getApplication())
        CrashDiagnostics.stage("Converting skp")
        CrashDiagnostics.failure("Reader failed",IllegalStateException("Synthetic test error"))
        val report=CrashDiagnostics.report()
        assertTrue(report.contains("Converting skp"))
        assertTrue(report.contains("Synthetic test error"))
        assertTrue(report.contains("IllegalStateException"))
        assertTrue(report.startsWith("CAD Viewer "))
    }
    @Test fun distinguishesMemoryKillsFromCrashes() {
        assertEquals("Stopped by Android: low memory",CrashDiagnostics.reason(ApplicationExitInfo.REASON_LOW_MEMORY))
        assertEquals("Native code crash",CrashDiagnostics.reason(ApplicationExitInfo.REASON_CRASH_NATIVE))
        assertEquals("Unhandled app exception",CrashDiagnostics.reason(ApplicationExitInfo.REASON_CRASH))
        assertEquals("Process terminated by signal",CrashDiagnostics.reason(ApplicationExitInfo.REASON_SIGNALED))
    }
}

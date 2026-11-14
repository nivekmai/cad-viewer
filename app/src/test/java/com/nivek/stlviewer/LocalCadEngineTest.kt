package com.nivek.stlviewer

import org.junit.Assert.*
import org.junit.Test

class LocalCadEngineTest {
    @Test fun usdzIsSupportedByTheEngine() {
        assertTrue(LocalCadEngine.supportsType("usdz"))
    }

    @Test fun engineCoversEveryTypeNeedsEngineRoutes() {
        for (name in listOf("model.scad", "model.step", "model.stp", "model.dwg", "model.skp", "model.usdz")) {
            assertTrue(name, ModelParser.needsEngine(name))
            assertTrue(name, LocalCadEngine.supportsType(ModelParser.extension(name)))
        }
    }

    @Test fun nativeFormatsDoNotNeedTheEngine() {
        for (name in listOf("model.ply", "model.stl", "model.obj", "model.3mf", "model.dxf")) {
            assertFalse(name, LocalCadEngine.supportsType(ModelParser.extension(name)))
        }
    }
}

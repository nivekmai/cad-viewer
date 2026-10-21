package com.nivek.stlviewer

import java.io.File
import org.junit.Assert.assertTrue
import org.junit.Assume.assumeTrue
import org.junit.Test

/** Runs after the browser engines produce their real integration outputs. */
class CadIntegrationTest {
    @Test fun convertedModelsLoadThroughKotlinParsers() {
        assumeTrue(System.getProperty("cad.integration") == "true")
        val directory=File(requireNotNull(System.getProperty("cad.outputDir")))
        val names=listOf("DWG_2000_mixed.dxf","DWG_2007_mixed.dxf","DWG_2018_mixed.dxf","DWG_2018_small.dxf",
            "STEP_curved_surfaces.stl","STEP_inches.stl","STEP_millimeters.stl","STEP_placement.stl","STP_assembly.stl")
        for(name in names) {
            val file=File(directory,name)
            assertTrue("Missing browser output: $name",file.isFile)
            val mesh=ModelParser.read(file,name)
            assertTrue("Empty converted model: $name",mesh.triangles+mesh.segments>0)
        }
    }
}

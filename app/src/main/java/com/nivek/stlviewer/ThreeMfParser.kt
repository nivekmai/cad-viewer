package com.nivek.stlviewer

import java.io.*
import java.net.URI
import java.util.zip.ZipFile
import javax.xml.parsers.ParserConfigurationException
import javax.xml.parsers.SAXParserFactory
import org.xml.sax.*
import org.xml.sax.ext.DefaultHandler2

/** Core meshes, assembly transforms and production-extension part references. */
class ThreeMfParser private constructor(file: File) : Closeable {
    private val zip=ZipFile(file)
    private val parts=mutableMapOf<String, Part>()
    private val geometry=Geometry()
    private var expanded=0L
    private var nodes=0
    private class Object3d {
        val vertices=Geometry.Floats()
        val faces=mutableListOf<IntArray>()
        val components=mutableListOf<Ref>()
    }
    private data class Ref(val id: String, val path: String?, val matrix: DoubleArray)
    private class Part {
        val objects=mutableMapOf<String,Object3d>()
        val build=mutableListOf<Ref>()
        var unit="millimeter"
    }
    init {
        val names=hashSetOf<String>()
        try {
            for (entry in zip.entries()) if (!names.add(entry.name) || names.size>4096)
                throw IOException("Invalid or overly complex 3MF archive.")
        } catch (e: IOException) { zip.close(); throw e }
    }
    override fun close() = zip.close()
    private fun read(): StlParser.Mesh {
        var start: String?=null
        xml("_rels/.rels",object: Handler() {
            override fun element(name: String, a: Attributes) {
                if (name=="Relationship" && value(a,"Type","")!!.endsWith("/3dmodel")) {
                    if (value(a,"TargetMode","")=="External") throw IOException("External 3MF models are not supported.")
                    start=resolve("",required(a,"Target"))
                }
            }
        })
        val path=start ?: throw IOException("The 3MF archive has no model relationship.")
        val root=part(path)
        if (root.build.isEmpty()) throw IOException("The 3MF build contains no objects.")
        for (ref in root.build) visit(path,ref,Geometry.identity(),hashSetOf(),0)
        return geometry.mesh().also { it.units=root.unit }
    }
    private fun part(path: String): Part {
        parts[path]?.let { return it }
        val part=Part(); parts[path]=part
        xml(path,object: Handler() {
            var current: Object3d?=null
            override fun element(name: String,a: Attributes) {
                when(name) {
                    "model" -> {
                        part.unit=value(a,"unit","millimeter")!!; unitScale(part.unit)
                        for (prefix in value(a,"requiredextensions","")!!.split(Regex("\\s+"))) if (prefix.isNotEmpty()) {
                            val ns=namespaces[prefix]
                            if (ns==null || !ns.contains("/production/") && !ns.contains("/material/"))
                                throw IOException("This 3MF requires an unsupported extension: $prefix")
                        }
                    }
                    "object" -> {
                        val obj=Object3d(); current=obj
                        if (part.objects.put(required(a,"id"),obj)!=null) throw IOException("Duplicate 3MF object ID.")
                    }
                    "vertex" -> {
                        val obj=current ?: throw IOException("Invalid 3MF vertex.")
                        for (axis in listOf("x","y","z")) obj.vertices.add(Geometry.number(required(a,axis)))
                    }
                    "triangle" -> {
                        val obj=current
                        if (obj==null || obj.faces.size>=StlParser.MAX_TRIANGLES) throw IOException("3MF mesh exceeds 500,000 triangles.")
                        obj.faces.add(intArrayOf(Geometry.integer(required(a,"v1")),Geometry.integer(required(a,"v2")),Geometry.integer(required(a,"v3"))))
                    }
                    "component" -> (current ?: throw IOException("Invalid 3MF component.")).components.add(reference(a))
                    "item" -> part.build.add(reference(a))
                    "basematerials","colorgroup","texture2d","texture2dgroup","multiproperties" -> geometry.skipped.add("3MF colors/materials/textures")
                }
            }
            override fun endElement(uri: String,local: String,q: String) { if(local=="object") current=null }
        })
        return part
    }
    private fun visit(parentPath: String,ref: Ref,parent: DoubleArray,active: MutableSet<String>,depth: Int) {
        geometry.check()
        if (depth>64) throw IOException("3MF components are nested too deeply.")
        val path=ref.path?.let { resolve(parentPath,it) } ?: parentPath
        val source=part(path)
        val obj=source.objects[ref.id] ?: throw IOException("A 3MF component refers to a missing object.")
        val key="$path#${ref.id}"
        if (!active.add(key)) throw IOException("Circular 3MF component reference.")
        var matrix=Geometry.multiply(parent,ref.matrix)
        if (path!=parentPath) {
            val scale=Geometry.identity(); val factor=unitScale(source.unit)/unitScale(part(parentPath).unit)
            scale[0]=factor; scale[5]=factor; scale[10]=factor
            matrix=Geometry.multiply(matrix,scale)
        }
        val determinant=matrix[0]*(matrix[5]*matrix[10]-matrix[6]*matrix[9])-matrix[1]*(matrix[4]*matrix[10]-matrix[6]*matrix[8])+matrix[2]*(matrix[4]*matrix[9]-matrix[5]*matrix[8])
        for (face in obj.faces) {
            val a=Geometry.transform(matrix,obj.vertices.point(face[0])); val b=Geometry.transform(matrix,obj.vertices.point(face[1])); val c=Geometry.transform(matrix,obj.vertices.point(face[2]))
            geometry.triangle(a,if(determinant<0)c else b,if(determinant<0)b else c)
        }
        for (child in obj.components) visit(path,child,matrix,active,depth+1)
        active.remove(key)
    }
    private abstract inner class Handler : DefaultHandler2() {
        val namespaces=mutableMapOf<String,String>()
        abstract fun element(name: String,a: Attributes)
        override fun startPrefixMapping(prefix: String,uri: String) { namespaces[prefix]=uri }
        override fun startElement(uri: String,local: String,q: String,a: Attributes) {
            try {
                if (++nodes>2_000_000) throw IOException("3MF XML is too complex.")
                geometry.check(); element(local,a)
            } catch (e: IOException) { throw SAXException(e) }
        }
        override fun startDTD(name: String?,publicId: String?,systemId: String?): Unit = throw SAXException("DTDs are not allowed in 3MF files.")
        override fun resolveEntity(publicId: String?,systemId: String?): InputSource = throw SAXException("External XML entities are not allowed.")
    }
    private fun xml(path: String,handler: Handler) {
        val entry=zip.getEntry(path) ?: throw IOException("Missing 3MF part: $path")
        if (entry.size>StlParser.MAX_BYTES) throw IOException("Expanded 3MF model is too large.")
        try {
            object: FilterInputStream(zip.getInputStream(entry)) {
                private fun count(n: Int) {
                    if(n>0) { expanded+=n; if(expanded>StlParser.MAX_BYTES) throw IOException("Expanded 3MF data exceeds 64 MB.") }
                }
                override fun read(): Int = `in`.read().also { if(it>=0)count(1) }
                override fun read(b: ByteArray,off: Int,len: Int): Int = `in`.read(b,off,len).also(::count)
            }.use { stream ->
                val factory=SAXParserFactory.newInstance().apply { isNamespaceAware=true }
                val reader=factory.newSAXParser().xmlReader
                reader.contentHandler=handler; reader.entityResolver=handler; reader.errorHandler=handler
                reader.setProperty("http://xml.org/sax/properties/lexical-handler",handler)
                reader.parse(InputSource(stream))
            }
        } catch(e: ParserConfigurationException) { throw IOException("Invalid 3MF: ${e.message}",e) }
          catch(e: SAXException) { throw IOException("Invalid 3MF: ${e.message}",e) }
    }
    companion object {
        @JvmStatic @Throws(IOException::class) fun read(file: File): StlParser.Mesh = ThreeMfParser(file).use { it.read() }
        private fun reference(a: Attributes): Ref {
            val matrix=Geometry.identity()
            value(a,"transform",null)?.let {
                val v=it.trim().split(Regex("\\s+"))
                if(v.size!=12) throw IOException("Invalid 3MF transform.")
                for(i in 0..11)matrix[(i%3)*4+i/3]=Geometry.number(v[i])
            }
            return Ref(required(a,"objectid"),value(a,"path",null),matrix)
        }
        private fun unitScale(unit: String): Double = when(unit) {
            "micron"->.001; "millimeter"->1.0; "centimeter"->10.0; "inch"->25.4; "foot"->304.8; "meter"->1000.0
            else->throw IOException("Unknown 3MF unit: $unit")
        }
        private fun resolve(source: String,target: String): String {
            try {
                val uri=URI.create("/$source").resolve(target).normalize()
                if(uri.scheme!=null || uri.authority!=null || uri.query!=null || uri.fragment!=null || uri.path.contains("..")) throw IllegalArgumentException()
                return uri.path.removePrefix("/")
            } catch(_: IllegalArgumentException) { throw IOException("Invalid 3MF part path.") }
        }
        private fun value(a: Attributes,name: String,fallback: String?): String? {
            for(i in 0 until a.length)if(a.getLocalName(i)==name)return a.getValue(i)
            return fallback
        }
        private fun required(a: Attributes,name: String) = value(a,name,null) ?: throw IOException("Missing 3MF attribute: $name")
    }
}

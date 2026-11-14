# CAD Viewer for Android

[Download releases](https://github.com/nivekmai/cad-viewer/releases) · [Build status](https://github.com/nivekmai/cad-viewer/actions/workflows/android.yml) · [Changelog](CHANGELOG.md)

Offline model viewer written in Kotlin for Android 8.0+ with one-finger rotation, two-finger panning, pinch zoom, and a reset button/double tap. Flat drawings open from above. No account, ads, network access, or broad storage permission.

## Install the update

Download a signed APK from GitHub Releases and open it on your phone. An APK named `-unsigned.apk` must first be signed with the existing app certificate; it cannot be installed directly. It uses the same package and signing key as previous versions, so install it over the existing app. For unreleased builds, the signed APK is attached to the draft release; ordinary CI debug artifacts use a temporary certificate.

## Opening files

**Open model** starts at the actual internal-storage `Download` folder, then remembers the last selected location. It filters for supported CAD MIME types by default. Generic binary, plain-text, and ZIP types remain included because providers commonly use them for STL/OBJ/SCAD/3MF; this may also show some unrelated files with those generic labels. PNG/JPEG image MIME types are excluded. SketchUp also accepts Android’s historical `application/vnd.koan` and `application/x-koan` labels in the picker and Open with/Share.

Use **⋮ → Show all files** if a provider mislabels your model. The Android **Downloads shortcut** can omit files that are visible under **Pixel 9 Pro Fold → Download**; navigating to the actual folder avoids that provider discrepancy.

**Browse folder** is a fallback: grant access to a model folder and the app lists matching filenames itself, including subfolders. Android may prevent selecting the entire Downloads root; choose the subfolder containing your models. PLY (`.ply`), STEP (`.step`/`.stp`), DWG, and SketchUp (`.skp`) are included in both the picker filters and folder browser. This browser filters by filename extension, not MIME type. Files can also be opened/shared from another app.

## Recent models

Tap **Recent models** to reopen saved models directly. The list appears on a fresh launch when saved models exist. **Conversion saved** means a reusable CAD conversion is available; **Saved on device** means the local source can be opened without the original provider or file permissions. Conversion caches belong to individual entries, so switching between models does not evict them.

Use **Manage** to see storage usage and remove local snapshots and conversions. Original files are unaffected. Saved entries are snapshots: use **Open file** again to import external edits; changed content creates another entry. No fixed file-count or geometry limits are imposed; saved models use device storage until removed.

## Section analysis

Tap **Section**, then tap a face to place a cut. Move the slider to position it. **Flip** switches which side remains visible while keeping the cut in place; tap it again to switch back. **Done** restores the whole model.

## Supported content

| Format | What is displayed |
| --- | --- |
| USDZ | Offline packages containing ASCII USD or binary USDC. Static mesh surfaces, transforms, stage units/up axis, diffuse material colors, embedded textures, and per-vertex display colors shown as a palette of up to 256 flat colors. Uses the same native renderer and conversion cache. Animation, lights, cameras, advanced material channels and some composition features are omitted or approximate. External assets are unavailable. |
| PLY | ASCII, little-endian and big-endian binary meshes and point clouds. Concave faces are triangulated; vertex RGB/alpha colors are preserved. Extra properties are skipped; face colors, embedded/external textures and stored vertex normals are not used. Transparency is approximate. Point clouds support rotation/pan/zoom; section picking requires faces. |
| STL | Binary and ASCII triangle geometry. |
| OBJ | Polygon meshes, concave faces, relative/negative indices, and polylines. Materials, colors, and textures are not rendered. |
| 3MF | Core meshes, build instances, nested component transforms, units, and production-extension references to other model parts inside the archive. Colors, materials, textures, and slicer settings are not rendered. Unknown required extensions are rejected. |
| DXF | ASCII DXF model-space LINE, LWPOLYLINE (including bulges), 2D/3D POLYLINE, polyfaces, polygon meshes, CIRCLE, ARC, ELLIPSE, 3DFACE, SOLID, TRACE, INSERT/block arrays, and control-point NURBS SPLINE entities. Curves are tessellated into line segments. TEXT, MTEXT, visible ATTRIB/constant ATTDEF, LEADER lines, and DIMENSION saved drawing blocks are also rendered. Binary DXF, hatches, mesh smoothing, thickness, line weights, and some spline forms are not supported. Skipped entities are reported in the viewing notes. |
| STEP / STP | Solids, surfaces, assemblies, placements, and curved geometry tessellated offline using OpenCascade. Model dimensions are converted to millimeters. Colors/materials, wire-only STEP files, compressed STEP, and external part files are not displayed. |
| DWG | Offline LibreDWG conversion into the supported drawing geometry: lines, polylines, arcs, circles, ellipses, supported splines, blocks, polyfaces, and polygon meshes, plus the text and dimension support listed for DXF. Tested with DWG 2000, 2007, and 2018 examples. Proprietary ACIS/3DSOLID geometry, proxy objects, external references, hatches, and other unsupported entities are not rendered. Viewing notes identify unsupported content; drawings with no supported geometry report an error. |
| SketchUp / SKP | Offline triangulated surfaces with nested component placements, converted to millimeters. Tested with legacy 2017 and modern 2021 containers. Material colors, embedded PNG/JPEG images, UV mapping, and separate front/back materials are displayed. Images are adapted to GPU-supported dimensions for seamless tiling. Projected texture mapping and overlapping transparent surfaces may be approximate. Loose edges, annotations, dimensions, and scene styles are not displayed; some versions/features may be unsupported. |
| SCAD | Self-contained scripts compiled offline by bundled OpenSCAD WASM (2022.03.20), including variables, modules, loops, Boolean operations, extrusion, and bundled MCAD/fonts. 3D results are shaded meshes; 2D results are line drawings. External includes/imports and newer OpenSCAD-only language features are not supported. Missing dependencies/errors are shown instead of displaying an incomplete model. |

No fixed file-size, converted-output byte, or triangle/line-segment count cutoff. Geometry is constrained by available memory and runtime array/buffer capacity. Textured SketchUp geometry, UVs, and image bytes use disk-backed mappings to reduce heap use; conversion output is streamed in acknowledged chunks. Temporary disk space is required. SketchUp models keep repeated components instanced: unique component geometry is uploaded once to persistent GPU buffers and each placement is drawn with its own transform, so rotating a large model does not re-upload the model every frame. All importers now feed retained GPU buffers automatically. Non-instanced meshes, point clouds, and lines share an upload-once path; texture coordinates are included only when needed, and vertex colors use four bytes. Instanced geometry keeps reusable component buffers. Camera and section changes do not re-upload retained geometry. If a non-instanced buffer cannot be allocated, the renderer falls back to bounded streaming based on available GPU resources, not the input format. Textures are capped at 1024 px on the longest side before power-of-two rounding and uploaded with mipmaps. Very large models may still rotate more slowly on low-end devices. The bundled SketchUp reader uses sparse edge-flag pages so gaps in edge IDs do not allocate huge unused tables. CAD conversion/SCAD compilation still has a five-minute timeout. USDZ, STEP, DWG, SKP, and SCAD require a working, current Android System WebView. The bundled DWG runtime reserves a 1 GiB WebAssembly address space and grows as needed, so large drawings may exceed device resources. The Cancel button stops loading/conversion. The current model remains visible after a failed or cancelled load.

The model and camera survive rotation and activity recreation. Recent models keeps private local snapshots for restoration and reopening without the original files; USDZ/SCAD/STEP/DWG/SKP conversions are cached on disk, keyed by filename and SHA-256 source content, and reused when reopening unchanged files. SketchUp preserves material colors and embedded textures; PLY preserves vertex colors; USDZ shows vertex colors as a palette of up to 256 flat colors; other formats use a single surface color. PLY/STL/OBJ dimensions use unspecified model units; 3MF/DXF/DWG use declared units when available; STEP/SKP display millimeters.

## Text and dimensions

Text is rendered as vector outlines that rotate, pan, and zoom with the drawing. Latin/Greek characters, common CAD symbols, Unicode escapes, multiline paragraphs, basic stacked fractions, alignment, rotation, extrusion directions, width factors, and block transforms are supported. Unavailable glyphs appear as `?` and are reported. The bundled font is a DejaVu-derived substitute: original SHX/TTF styles, rich inline styling, masks, columns, vertical flow, and exact spacing are not reproduced.

Dimensions use the drawing's saved anonymous blocks, including their measurement labels, arrows, extension lines, and overrides. This handles linear, aligned, angular, radius, diameter, and ordinate dimensions with saved blocks; dimensions without those blocks are reported as omitted. It does not regenerate missing dimension geometry or recalculate measurements. Paper-space layouts remain excluded.

Use **⋮ → Top view** to read plans from above, including drawings with elevation data. The app is now named CAD Viewer; its package and signing key are unchanged so this is an update to STL Viewer.

If the app closes during loading, reopen it and use **⋮ → Crash diagnostics → Copy**. The local report includes Android process-exit history (Android 11+), sampled memory, load stage, and recent error details. Nothing is uploaded automatically.

## Build and verify

GitHub Actions builds debug/release APKs, runs parser and release-automation tests, checks lint, and exercises the offline CAD/SCAD engines on every pull request and push to `main`. Version bumps automatically prepare draft releases with release APKs; publishing remains a manual step. GitHub signs them when signing is configured; otherwise the filenames and notes explicitly identify unsigned builds. See [RELEASING.md](RELEASING.md).

Use JDK 21 and Android SDK platform 37. Set `sdk.dir` in your own `local.properties`, or set `ANDROID_HOME`:

```sh
./gradlew :app:assembleDebug :app:testDebugUnitTest :app:lintDebug
```

The APK is `app/build/outputs/apk/debug/app-debug.apk`. This is a debug-signed personal build, not a Play Store release.

Parser regression tests cover PLY encodings/colors/point clouds/malformed indices, valid/invalid STL, OBJ concavity/indices, 3MF transforms/assemblies/units/XML safety, and DXF primitives/bulges/blocks/splines/meshes, including real converted DWG output. The exact bundled SCAD worker and output bridge can be checked in Chromium:

```sh
npm install --prefix /tmp/stl-viewer-browser-test playwright@1.58.2
/tmp/stl-viewer-browser-test/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/stl-viewer-browser-test/node_modules node tools/test-scad-browser.cjs
NODE_PATH=/tmp/stl-viewer-browser-test/node_modules node tools/test-cad-browser.cjs
```

The SCAD suite checks 3D solids, Booleans, modules/loops, fonts, MCAD, 2D fallback, missing includes/imports, syntax errors, and empty files. `node tools/test-texture-rendering.cjs` renders an imported SketchUp checker texture with the Android shader sources and checks texture/color pixels. The CAD suite checks STEP inch/mm equivalence, assemblies, placement, curved surfaces, multiple DWG generations, legacy/modern SketchUp nested components and placement/scale, and malformed files. `CadIntegrationTest.kt` loads all fourteen converted results through the Kotlin geometry parsers (`./gradlew :app:testDebugUnitTest -PcadIntegration=true`). Native Android WebView and picker behavior still require a device smoke test.

## Device smoke test

1. Update the existing app; open an STL from the actual Downloads folder and return to the picker to confirm the location is remembered. Check that PNG/JPEG files are excluded by default; **⋮ → Show all files** should reveal them.
2. Use Browse folder to open STL/OBJ/3MF/DXF/SCAD/STEP/STP/DWG/SKP from a subfolder.
3. Rotate, pan, pinch, and reset; check drawing geometry from above.
4. Rotate/fold the phone, background/restore, and verify the camera/model remain usable.
5. Open a bad file and cancel a CAD conversion; the previous model should remain available.
6. Open a STEP assembly and a DWG drawing. Check units, pan/zoom, and viewing notes.
7. Open standalone SCAD using a Boolean operation, then a 2D SCAD drawing. Verify a missing include produces an error.

## Sources and notices

The viewer uses Android platform widgets/OpenGL. CAD conversion runs inside bundled Web Workers served by an intercepted local-only HTTPS origin, with no network permission, no general file/content access, and no uploaded model data.

- [Android Storage Access Framework](https://developer.android.com/training/data-storage/shared/documents-files)
- [3MF Core Specification](https://github.com/3MFConsortium/spec_core/blob/master/3MF%20Core%20Specification.md)
- [Autodesk DXF reference](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-748FC305-F3F2-4F74-825A-61F04D757A50.htm)
- [OpenSCAD WASM release](https://github.com/openscad/openscad-wasm/releases/tag/2022.03.20)

- [STEP reader source](https://github.com/kovacsv/occt-import-js/tree/c2148e54b456b571238d35cac037d304053d64b2)
- [DWG reader source](https://github.com/mlightcad/libredwg-web/tree/v0.7.15)

SketchUp uses [OpenSKP](https://github.com/iamahsanmehmood/openskp) 1.5.0; see `third_party/openskp/NOTICE.md` for bundle reproduction and licenses.

See `third_party/openscad/NOTICE.md`, `third_party/occt/NOTICE.md`, and `third_party/libredwg/NOTICE.md` for compiler provenance, licenses, source/build references, and local changes. Notices are also included in the APK assets.

The outline font is generated by `tools/GenerateCadFont.java` from DejaVu Sans. See `third_party/cad-font/LICENSE.txt`; the notice is also bundled in APK assets. `cad-font.bin` is a Java resource loaded by both Android and the JVM parser tests.

All production Android code under `app/src/main` is Kotlin, compiled using AGP 9.3.1 built-in Kotlin support. Existing Java regression tests are retained unchanged where possible as independent compatibility checks; desktop-only Java font/preview tools are not part of the app.

Private PLY scans can be checked locally with `CAD_PLY_TEST_DIR=/path/to/private-fixtures ./gradlew :app:testDebugUnitTest`; the optional test expects `fridge.ply` and `sink.ply`. Private scans are not stored in this repository.

USDZ uses Three.js 0.187.0; see [importer provenance and limitations](third_party/three/NOTICE.md). Rebuild its offline bundle with `node tools/bundle-usdz.cjs`.

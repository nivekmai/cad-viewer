# CAD Viewer for Android

[Download releases](https://github.com/nivekmai/cad-viewer/releases) · [Build status](https://github.com/nivekmai/cad-viewer/actions/workflows/android.yml) · [Changelog](CHANGELOG.md)

Offline model viewer written in Kotlin for Android 8.0+ with one-finger rotation, two-finger panning, pinch zoom, and a reset button/double tap. Flat drawings open from above. No account, ads, network access, or broad storage permission.

## Install the update

Download a signed APK from GitHub Releases and open it on your phone. An APK named `-unsigned.apk` must first be signed with the existing app certificate; it cannot be installed directly. It uses the same package and signing key as previous versions, so install it over the existing app. For unreleased builds, the signed APK is attached to the draft release; ordinary CI debug artifacts use a temporary certificate.

## Opening files

**Open model** starts at the actual internal-storage `Download` folder, then remembers the last selected location. It filters for supported CAD MIME types by default. Generic binary, plain-text, and ZIP types remain included because providers commonly use them for STL/OBJ/SCAD/3MF; this may also show some unrelated files with those generic labels. PNG/JPEG image MIME types are excluded.

Use **⋮ → Show all files** if a provider mislabels your model. The Android **Downloads shortcut** can omit files that are visible under **Pixel 9 Pro Fold → Download**; navigating to the actual folder avoids that provider discrepancy.

**Browse folder** is a fallback: grant access to a model folder and the app lists matching filenames itself, including subfolders. Android may prevent selecting the entire Downloads root; choose the subfolder containing your models. STEP (`.step`/`.stp`) and DWG are included in both the picker filters and folder browser. This browser filters by filename extension, not MIME type. Files can also be opened/shared from another app.

## Supported content

| Format | What is displayed |
| --- | --- |
| STL | Binary and ASCII triangle geometry. |
| OBJ | Polygon meshes, concave faces, relative/negative indices, and polylines. Materials, colors, and textures are not rendered. |
| 3MF | Core meshes, build instances, nested component transforms, units, and production-extension references to other model parts inside the archive. Colors, materials, textures, and slicer settings are not rendered. Unknown required extensions are rejected. |
| DXF | ASCII DXF model-space LINE, LWPOLYLINE (including bulges), 2D/3D POLYLINE, polyfaces, polygon meshes, CIRCLE, ARC, ELLIPSE, 3DFACE, SOLID, TRACE, INSERT/block arrays, and control-point NURBS SPLINE entities. Curves are tessellated into line segments. TEXT, MTEXT, visible ATTRIB/constant ATTDEF, LEADER lines, and DIMENSION saved drawing blocks are also rendered. Binary DXF, hatches, mesh smoothing, thickness, line weights, and some spline forms are not supported. Skipped entities are reported in the viewing notes. |
| STEP / STP | Solids, surfaces, assemblies, placements, and curved geometry tessellated offline using OpenCascade. Model dimensions are converted to millimeters. Colors/materials, wire-only STEP files, compressed STEP, and external part files are not displayed. |
| DWG | Offline LibreDWG conversion into the supported drawing geometry: lines, polylines, arcs, circles, ellipses, supported splines, blocks, polyfaces, and polygon meshes, plus the text and dimension support listed for DXF. Tested with DWG 2000, 2007, and 2018 examples. Proprietary ACIS/3DSOLID geometry, proxy objects, external references, hatches, and other unsupported entities are not rendered. Viewing notes identify unsupported content; drawings with no supported geometry report an error. |
| SCAD | Self-contained scripts compiled offline by bundled OpenSCAD WASM (2022.03.20), including variables, modules, loops, Boolean operations, extrusion, and bundled MCAD/fonts. 3D results are shaded meshes; 2D results are line drawings. External includes/imports and newer OpenSCAD-only language features are not supported. Missing dependencies/errors are shown instead of displaying an incomplete model. |

Limits: 64 MiB input/expanded 3MF XML, 500,000 rendered triangles/line segments, and two minutes per CAD conversion/SCAD compilation. STEP, DWG, and SCAD require a working, current Android System WebView. The bundled DWG runtime reserves a 1 GiB WebAssembly address space and grows as needed, so large drawings may exceed device resources. The Cancel button stops loading/conversion. The current model remains visible after a failed or cancelled load.

The model and camera survive rotation and activity recreation. A private local copy supports restoration; SCAD/STEP/DWG is converted again on process recreation. Geometry is shown with a single surface color. STL/OBJ dimensions use unspecified model units; 3MF/DXF/DWG use declared units when available; STEP displays millimeters.

## Text and dimensions

Text is rendered as vector outlines that rotate, pan, and zoom with the drawing. Latin/Greek characters, common CAD symbols, Unicode escapes, multiline paragraphs, basic stacked fractions, alignment, rotation, extrusion directions, width factors, and block transforms are supported. Unavailable glyphs appear as `?` and are reported. The bundled font is a DejaVu-derived substitute: original SHX/TTF styles, rich inline styling, masks, columns, vertical flow, and exact spacing are not reproduced.

Dimensions use the drawing's saved anonymous blocks, including their measurement labels, arrows, extension lines, and overrides. This handles linear, aligned, angular, radius, diameter, and ordinate dimensions with saved blocks; dimensions without those blocks are reported as omitted. It does not regenerate missing dimension geometry or recalculate measurements. Paper-space layouts remain excluded.

Use **⋮ → Top view** to read plans from above, including drawings with elevation data. The app is now named CAD Viewer; its package and signing key are unchanged so this is an update to STL Viewer.

## Build and verify

GitHub Actions builds debug/release APKs, runs parser and release-automation tests, checks lint, and exercises the offline CAD/SCAD engines on every pull request and push to `main`. Version bumps automatically prepare draft releases with release APKs; publishing remains a manual step. GitHub signs them when signing is configured; otherwise the filenames and notes explicitly identify unsigned builds. See [RELEASING.md](RELEASING.md).

Use JDK 21 and Android SDK platform 37. Set `sdk.dir` in your own `local.properties`, or set `ANDROID_HOME`:

```sh
./gradlew :app:assembleDebug :app:testDebugUnitTest :app:lintDebug
```

The APK is `app/build/outputs/apk/debug/app-debug.apk`. This is a debug-signed personal build, not a Play Store release.

Parser regression tests cover valid/invalid STL, OBJ concavity/indices, 3MF transforms/assemblies/units/XML safety, and DXF primitives/bulges/blocks/splines/meshes, including real converted DWG output. The exact bundled SCAD worker and output bridge can be checked in Chromium:

```sh
npm install --prefix /tmp/stl-viewer-browser-test playwright@1.58.2
/tmp/stl-viewer-browser-test/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/stl-viewer-browser-test/node_modules node tools/test-scad-browser.cjs
NODE_PATH=/tmp/stl-viewer-browser-test/node_modules node tools/test-cad-browser.cjs
```

The SCAD suite checks 3D solids, Booleans, modules/loops, fonts, MCAD, 2D fallback, missing includes/imports, syntax errors, and empty files. The CAD suite checks STEP inch/mm equivalence, assemblies, placement, curved surfaces, multiple DWG generations, and malformed files. `CadIntegrationTest.kt` loads all nine converted results through the Kotlin geometry parsers (`./gradlew :app:testDebugUnitTest -PcadIntegration=true`). Native Android WebView and picker behavior still require a device smoke test.

## Device smoke test

1. Update the existing app; open an STL from the actual Downloads folder and return to the picker to confirm the location is remembered. Check that PNG/JPEG files are excluded by default; **⋮ → Show all files** should reveal them.
2. Use Browse folder to open STL/OBJ/3MF/DXF/SCAD/STEP/STP/DWG from a subfolder.
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

See `third_party/openscad/NOTICE.md`, `third_party/occt/NOTICE.md`, and `third_party/libredwg/NOTICE.md` for compiler provenance, licenses, source/build references, and local changes. Notices are also included in the APK assets.

The outline font is generated by `tools/GenerateCadFont.java` from DejaVu Sans. See `third_party/cad-font/LICENSE.txt`; the notice is also bundled in APK assets. `cad-font.bin` is a Java resource loaded by both Android and the JVM parser tests.

All production Android code under `app/src/main` is Kotlin, compiled using AGP 9.3.1 built-in Kotlin support. Existing Java regression tests are retained unchanged where possible as independent compatibility checks; desktop-only Java font/preview tools are not part of the app.

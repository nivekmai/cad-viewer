# Changelog

## 1.6.2

- Fixed a crash when resizing transparent SketchUp textures by using Android-compatible premultiplied bitmaps and compensating in the texture shader.
- Report texture upload/render exceptions and memory failures in the app instead of leaving them unhandled on the render thread.
- Added native Android bitmap regression tests and a translucent shader blending check. No file or triangle limits were added.

## 1.6.1

- Fixed high peak memory use for large textured SketchUp models by memory-mapping geometry/UVs/encoded images and generating render buffers on disk.
- Decode textures from mapped streams and send CAD output in acknowledged chunks, avoiding model-sized transfer copies.
- Preserved all geometry and texture content; no file-size or triangle cutoff was reintroduced.

## 1.6.0

- Preserved SketchUp material colors, embedded PNG/JPEG textures, UV coordinates, and front/back materials through import and OpenGL rendering.
- Added texture tiling, alpha cutouts, and basic transparency; textures reload after GL context recreation and old model textures are released.
- Projected mapping and overlapping transparency may be approximate; other formats still use the existing single-color renderer.

## 1.5.3

- Removed the 500,000-triangle/segment cutoff from STL, shared geometry, 3MF, STEP, and SketchUp importing.
- Geometry arrays grow as needed; integer-overflow checks retain runtime array/buffer capacity validation.

## 1.5.2

- Removed fixed file-size limits from file copying, model parsers, CAD workers, expanded 3MF XML, and converted-output transfer. Large files are attempted regardless of their byte size.
- Fixed STL header reading for files larger than 2 GiB. Geometry-count and conversion-time limits remain.

## 1.5.1

- Fixed SketchUp files being disabled in Android’s file picker and CAD Viewer missing from Open with/Share by accepting Android’s historical `application/vnd.koan` and `application/x-koan` MIME labels for `.skp`.

## 1.5.0

- Added offline SketchUp (.skp) surface previews with nested component placements and millimeter dimensions.
- Added SKP picker filters, folder browsing, and open/share handling.
- Materials, textures, standalone edges, annotations, dimensions, and scene styles are not displayed; some SketchUp versions/features may be unsupported.
- Added browser regression tests for legacy/modern SKP files, component scale/placement, empty models, and invalid/truncated files.

## 1.4.0

- Migrated the Android UI, OpenGL renderer, CAD bridge, and all model/text parsers from Java to Kotlin.
- Preserved file formats, gestures, drawing annotations, and update compatibility.
- Version bumps now automatically prepare release APKs, source archives, checksums, and draft release notes after Android and CAD-engine tests pass.
- When GitHub signing is not enabled, the workflow explicitly labels the APK as unsigned; signing with the existing certificate is required before installation.

## 1.3.1

- First GitHub release of CAD Viewer, with automated Android builds, parser and CAD-engine tests, and lint checks.
- Signed, non-debuggable release APKs update the existing CAD Viewer / STL Viewer installation.
- Version bumps prepare draft releases with APKs, source, checksums, and release notes.

## 1.3

- Renamed STL Viewer to CAD Viewer.
- Added DXF/DWG text, multiline notes, visible block attributes, and saved dimension labels, arrows, and extension lines.
- Added Top view for reading plans and improved precision for lettering at large survey coordinates.

## 1.2.1

- Fixed a DWG import failure caused by malformed, unused material metadata.

## 1.2

- Added offline STEP/STP and DWG geometry previews.

## 1.1

- Added OBJ, 3MF, DXF, and offline SCAD support.
- Improved supported-file filters and added a folder-browser fallback.

## 1.0

- Initial offline STL viewer with rotation, pan, and zoom.

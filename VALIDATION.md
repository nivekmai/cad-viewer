# CAD Viewer 1.5.2 validation

- Removed fixed input, expanded XML, and conversion-output byte limits throughout Android and workers.
- Replaced the old oversized-file rejection test with successful parsing of a valid 65 MiB ASCII STL through ModelParser. Fixed STL header length narrowing above 2 GiB.
- 64 JVM tests (including converted CAD integration), 20 CAD browser cases, and 10 SCAD cases pass. Release build and lint pass.
- Verified non-debuggable 1.5.2 release, versionCode 10, signed with the existing update certificate.
- Geometry-count and conversion-time limits remain. No device smoke test or test of the user's large SKP file was possible.

## Previous CAD Viewer 1.5.1 validation

- Added Android’s historical `.skp` MIME labels to the picker and VIEW/SEND intent filters.
- Release build and lint pass. Verified both labels in the merged and packaged manifests for both actions.
- Signed APK has versionCode 9/versionName 1.5.1, is non-debuggable, and uses the existing update certificate.
- File-provider behavior needs confirmation on the user's phone; their SKP file has not been tested. The 64 MiB input limit remains.

## Previous CAD Viewer 1.5.0 validation

- Added offline SketchUp importing with OpenSKP 1.5.0; reproducible browser bundle and dependency integrity hashes are pinned.
- 20 CAD browser cases pass, including legacy 2017 and modern 2021 SketchUp containers, nested components, exact placement/scale and Z-up bounds, a chair/table model, and empty/invalid/truncated SKP rejection.
- 64 JVM tests pass, including all thirteen converted browser models loaded through the Kotlin parsers.
- Signed release APK verified with the existing update certificate; non-debuggable, 11,488,810 bytes.
- 10 SCAD browser cases and nine release-automation tests pass.
- Debug/release builds and lint pass; package versionCode 8/versionName 1.5.0. Native Android picker/WebView and gestures still require a device smoke test.
- SketchUp previews contain surfaces only; materials, textures, loose edges, text, dimensions, and scene styles are not shown. No claim of compatibility with every SketchUp version or feature.

## Previous CAD Viewer 1.4.0 validation

- All ten production Android classes migrated from Java to Kotlin using AGP's built-in Kotlin support; no production `.java` files remain. Existing Java tests and desktop-only utilities remain as compatibility checks.
- 63 original parser tests plus the Kotlin CAD integration test pass, covering all nine converted browser fixtures. Nine release-automation tests pass.
- Compared complete vertex/normal/line buffers against the pre-migration Java implementation: all nine public CAD fixtures and the private user-provided DWG are byte-for-byte identical.
- Debug and release APKs build; debug/release lint pass. Package ID is unchanged, versionCode 7/versionName 1.4.0. Native Android touch/picker/WebView smoke testing remains necessary.
- CI checks that production source remains Kotlin, builds both APK variants, runs browser engine tests and Kotlin integration validation, and prepares a versioned draft release. Unsigned APKs are explicitly named and documented when signing is not enabled.

## Previous CAD Viewer 1.3 validation

- Renamed launcher/activity title to CAD Viewer; verified packaged label, versionCode 5/versionName 1.3, unchanged application ID and signing certificate.
- Added bundled vector text for TEXT/MTEXT/visible ATTRIB/constant ATTDEF; saved DIMENSION pictures include arrows, extension lines, text, and measurement overrides. LEADER polylines render; omitted styling remains reported.
- 63 JVM tests pass, including 14 annotation tests for rotation, scaling, block transforms, Unicode escapes, fractions, multiline wrapping, attributes, all seven standard saved dimension types, missing/circular dimension blocks, and survey coordinate precision.
- The attached private DWG loads with 130,259 line segments and two triangles. Top-view geometry preview inspected locally; drawing and preview excluded from source distributions.
- Nine existing converted CAD fixtures still parse, including their newly rendered annotations. Android build and lint pass (zero errors, six advisory warnings).
- Bundled font and license verified inside the APK. Added Top view menu action. Actual Android device smoke testing remains necessary.

## Previous version 1.2.1 validation

- Fixed the reproduced "Invalid index in model" failure caused by raw newlines in unused DWG material metadata. Unused DXF sections are skipped with bounded reads; geometry sections remain strictly parsed.
- User-provided DWG converted through the bundled browser worker and parsed successfully: 34,423 line segments. The private drawing is not included in fixtures or distributions.
- All nine existing converted CAD fixtures still load through the native parser.
- 49 JVM tests passed, including metadata before/after geometry and unterminated-section regressions. Android build and lint passed; APK signature verified.
- Package versionCode 4, versionName 1.2.1. Device smoke testing remains necessary.

## Previous version 1.2 validation

- Android debug build succeeded; package com.nivek.stlviewer, versionCode 3, versionName 1.2.
- 47 JVM parser tests passed, including real converted DWG output and polyface/polygon-mesh regressions.
- 13 STEP/DWG Chromium integration tests passed using the exact bundled workers and bridge scripts.
- 10 existing SCAD Chromium integration tests passed after the shared Java bridge changes.
- All nine valid CAD integration outputs loaded successfully through the native Java parsers (tools/ModelProbe.java).
- STEP inch/mm equivalence, assembly surfaces, placement, and curved surface conversion verified.
- DWG 2000, 2007, and 2018 example drawings decoded and loaded as supported drawing geometry.
- Malformed STEP, invalid/truncated/corrupt DWG inputs rejected.
- Android lint completed with zero errors; advisory warnings remain.
- APK signature verified and matches version 1.1, allowing installation as an update.
- No Android phone/emulator was available. Native WebView/picker integration, fold/rotation layout, and touch controls still need a device smoke test.

DWG limitations are documented in the app and README: proprietary ACIS/3DSOLID geometry, proxy objects, external references, annotations, hatches, and unsupported entities are not rendered.

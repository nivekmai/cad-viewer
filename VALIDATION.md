# CAD Viewer 1.6.4 validation

- User-provided Android exit history confirmed low-memory termination in v1.6.3 at the Rendering model stage, with a WebView renderer low-memory exit two seconds earlier. Sampled RSS values are not peak memory measurements.
- Replaced full-model GLES client arrays with a reusable 32,766-vertex interleaved VBO (1,048,512 bytes) and matching CPU staging buffer. Each batch preserves material draw ranges, UVs, normals, opaque/blended ordering, and lines; glFinish completes the batch before storage reuse. GPU/CPU staging sizes do not bound total model size, textures, mapped pages, or driver overhead.
- Ran every surface in the private model through the production staging helper: all 9,034,545 expanded vertices / 3,011,515 triangles preserved, checking positions/normals/UVs at each chunk boundary. Added tests for high source offsets, multiple material ranges, full-batch/tail reuse, and lines.
- Exact application shaders passed WebGL checker/material/transparency pixel tests using a deliberately tiny reusable interleaved GPU buffer to force multiple uploads. This is not a physical Android GPU validation.
- CAD workers terminate before native completion/error callbacks. Native loading waits for converter WebView destruction before creating render geometry; this confirms disposal ordering, not immediate OS renderer-process reclamation. Worker lifecycle tests cover streamed and monolithic results, acknowledgments and error paths.
- 80 Android/JVM tests passed including private model/texture tests, all 21 public CAD browser cases passed, and release build/lint passed. Signed versionCode 16 / versionName 1.6.4 uses the existing update certificate.
- Phone-specific total memory and interaction performance remain unverified. Synchronous bounded uploads may trade frame rate for lower transient GPU memory. No file/triangle cutoff or content reduction was introduced.

## Previous CAD Viewer 1.6.3 validation

- Traced large allocations in OpenSKP 1.5.0 to dense edge-flag arrays spanning unused IDs. The private model repeatedly allocated arrays of 20–110 MB for these ranges.
- Replaced that table at bundle time with sparse 256-entry Uint16 pages, with zero reserved for absent entries. Tests compare old/new flags, membership and size over 20,000 writes and cover descending IDs, zero flags, byte masking, and widely separated IDs up to 0xffffffff. A hash guard rejects unexpected upstream source changes.
- The final browser worker converted the private model successfully: 3,011,515 triangles, 129 textures, 9,821 textured batches. The 191,589,812-byte converted model is byte-for-byte identical to the pre-change output (SHA-256 comparison).
- Desktop Node profiling: typed-array storage at completion fell from about 2.84 GB to 0.63 GB; completion RSS fell from about 3.72 GB to 2.90 GB. Final run peak RSS was about 2.93 GiB. These are desktop measurements, not Android memory guarantees.
- A deliberately constrained 512 MiB JavaScript heap test still runs out of memory. The loader retains substantial parsing overhead; no arbitrary input/triangle limits were added. Android crash/exit history is required to establish the remaining phone failure if it persists.
- 75 Android/JVM tests passed, with one optional private-texture test skipped. All 21 public CAD browser cases, the sparse table regression, and texture/alpha shader checks passed. Release build/lint and existing APK signing certificate verified (versionCode 15 / 1.6.3).
- Added local crash diagnostics tests for persisted stage/exception details and exit reason labels. Diagnostics include OS exit history and sampled memory on Android 11+, with explicit Copy/Share; no automatic upload. Physical-device exit-history/UI behavior remains unverified.
- Private inputs, profiles and converted outputs remain outside Git and release sources.

## Previous CAD Viewer 1.6.2 validation

- Reproduced the transparent non-power-of-two bitmap scaling crash with Robolectric 4.17 native Android graphics (API 35). The original non-premultiplied decode throws; the fixed decoder scales successfully and preserves color/alpha.
- All 129 embedded textures in the private user model passed the same native decode/resize helper used by the renderer. The optional private-model test is skipped when CAD_PRIVATE_MESH is absent; no private content is committed.
- Exact application shaders passed the checker texture/material-color WebGL test and a new premultiplied transparent-red blending check (108 red versus 215 opaque).
- 74 tests passed with the private model supplied; release build and lint passed. Signed versionCode 14/versionName 1.6.2 verified with the existing installation certificate.
- Render-thread runtime and memory exceptions now report an error and release model textures. Native driver crashes or OS process termination cannot be caught by this handler.
- Full Android WebView/GPU loading on the user's phone remains unverified; no phone crash log was available to establish whether this was its only failure.

## Previous CAD Viewer 1.6.1 validation

- Tested the user-provided private SketchUp model: 66,701,742-byte input, 3,011,515 rendered triangles, 129 embedded textures. Private input/output are excluded from Git and release sources.
- Reproduced the old native parser failure under a 128 MiB heap/direct-buffer test configuration: failed to reserve a 216,829,080-byte render buffer after allocating 72,276,360 UV bytes.
- The revised disk-backed parser loaded the same complete converted model successfully under the identical JVM memory configuration. This does not imply total process RSS is below 128 MiB; mapped pages and GPU textures use memory outside that budget.
- Removed the coordinate heap array and copied UV/image buffers from the textured parser. Mapped file storage remains valid after source unlinking and is released with the model.
- Worker output uses acknowledged chunks to avoid a model-sized output allocation and unbounded queued messages; removed an unnecessary copy of the SKP input.
- The actual private SKP also passed the browser worker/bridge import: all 3,011,515 triangles, 129 images, and 9,821 textured batches transferred successfully.
- 71 JVM tests, 21 public CAD browser cases, and the texture shader check pass. Release build/lint pass; signed 1.6.1 APK verified with the existing certificate.
- Actual Android WebView/GPU memory behavior still requires device confirmation.

## Previous CAD Viewer 1.6.0 validation

- Replaced SketchUp-to-STL transfer with an internal binary mesh carrying UVs, material batches, alpha modes, front/back sides, and embedded PNG/JPEG images.
- 71 JVM tests pass, including six new mesh-transfer validation tests and fourteen real converted CAD inputs.
- 21 CAD browser cases pass, including a real textured SketchUp fixture with preserved embedded image, UV coordinates, and material associations.
- Rendered that fixture with the exact Android GLSL shader sources in Chromium WebGL; verified checker texture pixels and material-color pixels, and inspected the screenshot. CI runs this check.
- Release build/lint pass. Phone-specific BitmapFactory/GLUtils uploads, gestures, and GL context recreation require a device smoke test.
- Projected texture mapping and overlapping transparency are approximate; loose SketchUp edges, text, dimensions, and scene styles remain omitted. Other formats retain single-color rendering.

## Previous CAD Viewer 1.5.3 validation

- Removed the fixed triangle/segment cutoff from STL, shared geometry, 3MF, and STEP/SKP workers. Dynamic array growth retains integer-index and buffer-capacity validation.
- 65 JVM tests pass, including binary STL and shared geometry meshes with 500,001 triangles, and all thirteen CAD conversion outputs.
- 20 CAD browser cases pass. Release build and lint pass; signed non-debuggable versionCode 11/versionName 1.5.3 verified against the existing update certificate.
- Actual large-model performance on the phone remains untested. Conversion timeout remains two minutes.

## Previous CAD Viewer 1.5.2 validation

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

# CAD Viewer 1.3 validation

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

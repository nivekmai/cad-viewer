# Changelog

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

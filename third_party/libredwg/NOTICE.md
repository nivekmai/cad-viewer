# DWG reader: LibreDWG Web

Bundled `libredwg-web.js` and `libredwg-web.wasm` are unmodified files from npm package `@mlightcad/libredwg-web` version `0.7.15` (GNU GPL version 3). The app-specific worker runs the reader's file conversion API in its own Web Worker and sends the resulting DXF geometry to the native viewer.

- Package: https://www.npmjs.com/package/@mlightcad/libredwg-web/v/0.7.15
- Release: https://github.com/mlightcad/libredwg-web/tree/v0.7.15
- Pinned source commit: `18588818df66d4258b83fda19aa40fd892cdf49d`

The complete release source snapshot, including the C/C++ library, JavaScript bindings, and build scripts, is included as `source-v0.7.15.tar.gz`. See `COPYING` for the license. Build instructions are under `bindings/javascript` in that source tree. Replace the two files under `app/src/main/assets/cad/` with a compatible rebuilt module and rebuild the APK with Gradle.

The release reserves 1 GiB initial WASM memory, with growth enabled. DWG conversion is bounded by the app's input/output size, rendering complexity, and timeout limits, and each conversion's worker is destroyed afterwards. This is a geometry preview, not an Autodesk-compatible full drawing editor; custom/proxy entities, ACIS solids, external references, annotations, and unsupported entities may not be displayed.

DWG fixtures under `tools/fixtures/dwg/` and the converted DXF regression fixture originate from the GNU LibreDWG test data:
https://github.com/LibreDWG/libredwg/tree/master/test/test-data
Their SHA-256 hashes are recorded in `tools/fixtures/SHA256SUMS`.

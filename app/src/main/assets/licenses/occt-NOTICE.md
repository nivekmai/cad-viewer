# STEP reader: occt-import-js / OpenCascade

Bundled `occt-import-js.js` and `occt-import-js.wasm` are unmodified files from npm package `occt-import-js` version `0.0.23` (LGPL-2.1). The app-specific worker invokes the reader and writes a binary STL preview. It does not modify the library binaries.

- Package: https://www.npmjs.com/package/occt-import-js/v/0.0.23
- Wrapper source: https://github.com/kovacsv/occt-import-js/tree/c2148e54b456b571238d35cac037d304053d64b2
- OpenCascade submodule commit: `d2abb6d844231cb8f29be6894440874a4700e4a5`
- OpenCascade source mirror: https://github.com/Open-Cascade-SAS/OCCT/tree/d2abb6d844231cb8f29be6894440874a4700e4a5

See `license.occt-import-js.txt` and `license.occt.txt` for the upstream license texts. Exact source snapshots accompany this notice. To rebuild, unpack the wrapper source and put the OpenCascade snapshot in its `occt` directory, then follow the upstream README and Emscripten build scripts. Replace the two files under `app/src/main/assets/cad/` with the rebuilt files, then rebuild the APK with Gradle. This permits replacing/modifying the library independently of the app-specific bridge.

The STEP integration fixtures under `tools/fixtures/step/` come from the wrapper's test suite; their original paths are recorded in `tools/fixtures/README.md`.

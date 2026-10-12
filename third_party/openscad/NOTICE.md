# OpenSCAD WASM component

Bundled from the official OpenSCAD WASM release `2022.03.20`:
https://github.com/openscad/openscad-wasm/releases/tag/2022.03.20

The `openscad.wasm`, `openscad.wasm.js`, and wrapper `openscad.js` assets are unmodified upstream release files. For `openscad.fonts.js` and `openscad.mcad.js`, the final ES-module export statement was replaced by a comment so they can be loaded by `importScripts()` in a classic worker. No font, library, or compiler content was otherwise changed. `SHA256SUMS` records the shipped files.

OpenSCAD/OpenSCAD WASM is free software under GNU GPL version 2 or later; see `COPYING`. OpenSCAD copyright remains with its contributors. The upstream release source/build scripts/patches are included in `openscad-wasm-2022.03.20-source.tar.gz` and are available at:
https://github.com/openscad/openscad-wasm/tree/2022.03.20

The upstream Makefile identifies the OpenSCAD source fork/branch and dependencies used for this release:
https://github.com/ochafik/openscad/tree/filtered-number

`Makefile.upstream` is included for the complete dependency/source URLs and upstream rebuild steps. The release's build scripts fetch dependency branches; they are not a bit-reproducible lockfile. The bundled compiler is run as a separate program with file input/output; this viewer does not modify or link its native code.

Bundled Liberation fonts retain their upstream SIL Open Font License; see `fonts-LICENSE`. MCAD sources are included in the generated asset and retain their embedded per-file notices; see `MCAD-LGPL-2.1.txt`. Those original sources can be recovered from the hex-encoded `mcad` object in `openscad.mcad.js` without loss.

The app-specific `worker.js`, `host.js`, `index.html`, and Java bridge implement local execution and are provided with the viewer's source archive.

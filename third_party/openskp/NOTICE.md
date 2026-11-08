OpenSKP 1.5.0 (MIT), https://github.com/iamahsanmehmood/openskp
Browser bundle contains its parser/scene baker and earcut/fflate dependencies.
Versions and npm integrity hashes are pinned in tools/package-lock.json.
Rebuild: npm ci --prefix tools && node tools/bundle-skp.cjs
The application restores Z-up coordinates and converts metres to millimetres.
OpenSKP is independent of Trimble/SketchUp. Some versions/features are unsupported.

Local memory patch: tools/skp-memory-patch.cjs replaces the 1.5.0 dense edge-flag table with sparse 256-entry pages allocated only for occupied edge-ID ranges. This avoids allocating through gaps in SketchUp IDs and preserves get/has/size and byte-masked set semantics. The build checks the original implementation hash and fails if the upstream target changes. Run node tools/test-skp-memory.cjs to verify equivalence and sparse-ID behavior.

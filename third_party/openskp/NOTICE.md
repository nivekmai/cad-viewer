OpenSKP 1.5.0 (MIT), https://github.com/iamahsanmehmood/openskp
Browser bundle contains its parser/scene baker and earcut/fflate dependencies.
Versions and npm integrity hashes are pinned in tools/package-lock.json.
Rebuild: npm ci --prefix tools && node tools/bundle-skp.cjs
The application restores Z-up coordinates and converts metres to millimetres.
OpenSKP is independent of Trimble/SketchUp. Some versions/features are unsupported.

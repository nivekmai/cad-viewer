# CAD integration fixtures

STEP fixtures are from `occt-import-js` 0.0.23's `test/testfiles`:

- `step/cube-mm.step`: `cube-units/cube-mm.step`
- `step/cube-in.step`: `cube-units/cube-in.step`
- `step/assembly.step`: `cube-fcstd/cube3.step`
- `step/assembly.stp`: `cax-if/as1_pe_203.stp`
- `step/rounded-cube.step`: `rounded-cube/rounded-cube.step`

DWG fixtures are original, unmodified GNU LibreDWG test files fetched from:
https://github.com/LibreDWG/libredwg/tree/master/test/test-data

- `dwg/sample_2018.dwg`
- `dwg/example_2000.dwg`
- `dwg/example_2007.dwg`
- `dwg/example_2018.dwg`

`app/src/test/resources/dwg-sample-2018.dxf` is generated from `sample_2018.dwg` by the bundled reader. Upstream licenses/source archives are in `third_party/occt` and `third_party/libredwg`. SHA256SUMS identifies the exact test inputs.

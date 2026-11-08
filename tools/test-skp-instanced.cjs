// CVM2 (instanced SketchUp) encoder checks. Runs in Node, no browser needed:
// the same openskp buildInstancedScene the worker uses, plus the viewer's
// own skp-mesh.js. Usage:
//   node tools/test-skp-instanced.cjs [file.skp ...]
// With no arguments it checks every SKP fixture; with CAD_TEST_FILE set (or
// a file argument) it also checks that file and reports its size/timing.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..');
const meshSrc = fs.readFileSync(path.join(root, 'app/src/main/assets/cad/skp-mesh.js'), 'utf8');
const meshCtx = { console };
vm.createContext(meshCtx);
vm.runInContext(meshSrc, meshCtx);
const { encodeSkpInstancedScene, encodeSkpScene, mat4Multiply, viewerMatrix } = meshCtx;

function matVec(m, x, y, z) {
  return [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]];
}
function close(a, b, tol = 1e-3) { assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} != ${b}`); }

// Frame conversion itself: A * Ainv is identity, and a point transformed
// through a glTF matrix then converted equals the converted point
// transformed through the viewer matrix.
{
  const id = viewerMatrix(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
  for (let i = 0; i < 16; i++) close(id[i], i % 5 === 0 ? 1 : 0, 1e-6);
  // A non-trivial glTF matrix: rotate 30deg about Y, scale (2, 0.5, 3), translate.
  const c = Math.cos(0.5), s = Math.sin(0.5);
  const g = new Float32Array([2 * c, 0, -2 * s, 0, 0, 0.5, 0, 0, 3 * s, 0, 3 * c, 0, 100, 200, 300, 1]);
  const vmx = viewerMatrix(g);
  for (const p of [[0, 0, 0], [1, 2, 3], [-4, 0.5, 7]]) {
    const viaGltf = matVec(g, p[0], p[1], p[2]);
    const converted = [viaGltf[0] * 1000, -viaGltf[2] * 1000, viaGltf[1] * 1000];
    const viaViewer = matVec(vmx, p[0] * 1000, -p[2] * 1000, p[1] * 1000);
    for (let i = 0; i < 3; i++) close(viaViewer[i], converted[i], 1e-4);
  }
}

function decodeCvm2(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  assert.equal(Buffer.from(bytes.subarray(0, 4)).toString('ascii'), 'CVM2');
  const header = {
    staticVertices: v.getInt32(4, true), staticBatches: v.getInt32(8, true),
    resources: v.getInt32(12, true), instances: v.getInt32(16, true), textures: v.getInt32(20, true),
  };
  let offset = 24;
  const verts = [];
  for (let i = 0; i < header.staticVertices; i++) {
    verts.push([v.getFloat32(offset, true), v.getFloat32(offset + 4, true), v.getFloat32(offset + 8, true)]);
    offset += 20;
  }
  const batches = [];
  for (let i = 0; i < header.staticBatches; i++) {
    batches.push({ first: v.getInt32(offset, true), count: v.getInt32(offset + 4, true) });
    offset += 36;
  }
  let next = 0;
  for (const b of batches) { assert.equal(b.first, next); next += b.count; }
  assert.equal(next, header.staticVertices);
  const res = [];
  for (let r = 0; r < header.resources; r++) {
    const rv = v.getInt32(offset, true), rb = v.getInt32(offset + 4, true); offset += 8;
    const rverts = [];
    for (let i = 0; i < rv; i++) {
      rverts.push([v.getFloat32(offset, true), v.getFloat32(offset + 4, true), v.getFloat32(offset + 8, true)]);
      offset += 20;
    }
    const rbatches = [];
    for (let i = 0; i < rb; i++) { rbatches.push({ first: v.getInt32(offset, true), count: v.getInt32(offset + 4, true) }); offset += 36; }
    let rn = 0;
    for (const b of rbatches) { assert.equal(b.first, rn); rn += b.count; }
    assert.equal(rn, rv);
    res.push({ verts: rverts, batches: rbatches });
  }
  const instances = [];
  for (let i = 0; i < header.instances; i++) {
    const resource = v.getInt32(offset, true); offset += 4;
    assert.ok(resource >= 0 && resource < header.resources);
    const m = new Float32Array(16);
    for (let j = 0; j < 16; j++) { m[j] = v.getFloat32(offset, true); offset += 4; }
    instances.push({ resource, matrix: m });
  }
  const textures = [];
  for (let i = 0; i < header.textures; i++) {
    const n = v.getInt32(offset, true); offset += 4 + n;
    assert.ok(n > 0);
    textures.push(n);
  }
  assert.equal(offset, bytes.length, 'trailing bytes in CVM2 output');
  return { header, verts, batches, res, instances, textures };
}

async function check(file, openskp) {
  const bytes = fs.readFileSync(file);
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const t0 = performance.now();
  const baked = openskp.buildScene(buf, { frontSideOnly: false, respectEdgeVisibility: true, onLog() {} });
  const tBaked = performance.now() - t0;
  const t1 = performance.now();
  const inst = openskp.buildInstancedScene(buf, { frontSideOnly: false, respectEdgeVisibility: true, onLog() {} });
  const tInst = performance.now() - t1;
  const t2 = performance.now();
  const cvm2 = encodeSkpInstancedScene(inst);
  const tEncode = performance.now() - t2;
  const t3 = performance.now();
  const cvm1 = encodeSkpScene(baked);
  const tEncode1 = performance.now() - t3;
  const bakedTris = baked.glbPrimitives.reduce((n, m) => n + m.indices.length / 3, 0);
  const d = decodeCvm2(cvm2);
  // Triangle conservation: static + every instance's resource triangles.
  const staticTris = d.header.staticVertices / 3;
  let renderedTris = staticTris;
  for (const inst2 of d.instances) renderedTris += d.res[inst2.resource].verts.length / 3;
  assert.equal(renderedTris, bakedTris, `${file}: CVM2 rendered triangles != baked triangles`);
  assert.equal(d.textures.length, baked.textures.length, `${file}: texture count changed`);
  // Bounds: CVM2 world bounds (static + transformed resource verts) match
  // the baked scene bounds converted to the viewer frame.
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  const take = p => { for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], p[i]); max[i] = Math.max(max[i], p[i]); } };
  for (const p of d.verts) take(p);
  for (const inst2 of d.instances) for (const p of d.res[inst2.resource].verts) take(matVec(inst2.matrix, p[0], p[1], p[2]));
  const b = baked.bounds;
  const expect = {
    min: [b.min[0] * 1000, -b.max[2] * 1000, b.min[1] * 1000],
    max: [b.max[0] * 1000, -b.min[2] * 1000, b.max[1] * 1000],
  };
  for (let i = 0; i < 3; i++) { close(min[i], expect.min[i], 1e-3); close(max[i], expect.max[i], 1e-3); }
  console.log(`PASS ${path.basename(file)} tris=${bakedTris.toLocaleString()} ` +
    `batches ${baked.glbPrimitives.length} -> static ${d.header.staticBatches} + ${d.header.resources} resources x ${d.header.instances} instances ` +
    `CVM1 ${(cvm1.length / 1e6).toFixed(1)}MB -> CVM2 ${(cvm2.length / 1e6).toFixed(1)}MB ` +
    `build ${tBaked.toFixed(0)}ms baked / ${tInst.toFixed(0)}ms instanced, encode ${tEncode.toFixed(0)}ms`);
  return { bakedTris, cvm1: cvm1.length, cvm2: cvm2.length, tBaked, tInst };
}

(async () => {
  const openskp = await import('openskp');
  const files = process.argv.slice(2);
  const list = files.length ? files : fs.readdirSync(path.join(root, 'tools/fixtures/skp'))
    // blank_v17.skp is the empty-model case: the worker must reject it, and
    // test-cad-browser.cjs already covers that rejection.
    .filter(n => n.endsWith('.skp') && n !== 'blank_v17.skp').map(n => path.join(root, 'tools/fixtures/skp', n));
  if (process.env.CAD_TEST_FILE && !files.length) list.push(process.env.CAD_TEST_FILE);
  for (const f of list) await check(f, openskp);
  console.log('PASS CVM2 instanced encoding: triangle conservation, bounds, and frame conversion');
})().catch(e => { console.error(e); process.exitCode = 1; });

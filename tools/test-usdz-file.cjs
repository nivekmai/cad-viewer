// Focused USDZ runner: feed one USDZ file through the same page/worker path
// the app uses (start('usdz') in worker.js + bundled usdz.js) and report the
// converter output. Usage: node test-usdz-file.cjs <path-to.usdz> [out-stem]
// Writes <stem>.cadmesh + <stem>.json into ../build/cad-test/ on success.
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const assets = path.join(__dirname, '../app/src/main/assets/cad');
const outputDir = path.join(__dirname, '../build/cad-test');
const inputPath = process.argv[2] || path.join(__dirname, 'fixtures/usdz/kitchen-sink-range.usdz');
const stem = process.argv[3] || path.basename(inputPath, path.extname(inputPath));
const source = fs.readFileSync(inputPath);
console.log('input:', inputPath, source.length, 'bytes');
const server = http.createServer((request, response) => {
  const name = new URL(request.url, 'http://localhost').pathname.slice(1);
  if (name === 'input.model') { response.end(source); return; }
  if (!/^[a-zA-Z0-9.-]+$/.test(name)) { response.writeHead(404); response.end(); return; }
  try {
    response.setHeader('Content-Type', name.endsWith('.wasm') ? 'application/wasm' : name.endsWith('.js') ? 'text/javascript' : 'text/html');
    response.end(fs.readFileSync(path.join(assets, name)));
  } catch { response.writeHead(404); response.end(); }
});
function cadMeshBounds(bytes) {
  const magic = bytes.toString('ascii', 0, 4);
  if (magic === 'CVM2') return cadMesh2Bounds(bytes);
  assert.equal(magic, 'CVM1');
  const vertices = bytes.readInt32LE(4), batches = bytes.readInt32LE(8), images = bytes.readInt32LE(12);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < vertices; i++) for (let axis = 0; axis < 3; axis++) {
    const value = bytes.readFloatLE(16 + i * 20 + axis * 4); assert.ok(Number.isFinite(value));
    min[axis] = Math.min(min[axis], value); max[axis] = Math.max(max[axis], value);
  }
  let offset = 16 + vertices * 20, next = 0, textured = 0;
  for (let i = 0; i < batches; i++, offset += 36) {
    assert.equal(bytes.readInt32LE(offset), next); next += bytes.readInt32LE(offset + 4);
    const texture = bytes.readInt32LE(offset + 24); assert.ok(texture >= -1 && texture < images); if (texture >= 0) textured++;
  }
  assert.equal(next, vertices);
  for (let i = 0; i < images; i++) { const n = bytes.readInt32LE(offset); assert.ok(n > 0); offset += 4 + n; }
  assert.equal(offset, bytes.length);
  return { triangles: vertices / 3, min, max, dimensions: max.map((n, i) => n - min[i]), images, textured };
}
function cadMesh2Bounds(bytes) {
  const staticVertices = bytes.readInt32LE(4), staticBatches = bytes.readInt32LE(8),
    resources = bytes.readInt32LE(12), instances = bytes.readInt32LE(16), images = bytes.readInt32LE(20);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  const take = (x, y, z) => { min[0] = Math.min(min[0], x); max[0] = Math.max(max[0], x); min[1] = Math.min(min[1], y); max[1] = Math.max(max[1], y); min[2] = Math.min(min[2], z); max[2] = Math.max(max[2], z); };
  let offset = 24, next = 0, textured = 0, triangles = staticVertices / 3;
  for (let i = 0; i < staticVertices; i++) { take(bytes.readFloatLE(offset, true), bytes.readFloatLE(offset + 4, true), bytes.readFloatLE(offset + 8, true)); offset += 20; }
  for (let i = 0; i < staticBatches; i++, offset += 36) {
    assert.equal(bytes.readInt32LE(offset), next); next += bytes.readInt32LE(offset + 4);
    const texture = bytes.readInt32LE(offset + 24); assert.ok(texture >= -1 && texture < images); if (texture >= 0) textured++;
  }
  assert.equal(next, staticVertices);
  const res = [];
  for (let r = 0; r < resources; r++) {
    const rv = bytes.readInt32LE(offset), rb = bytes.readInt32LE(offset + 4); offset += 8;
    const verts = [];
    for (let i = 0; i < rv; i++) { verts.push([bytes.readFloatLE(offset, true), bytes.readFloatLE(offset + 4, true), bytes.readFloatLE(offset + 8, true)]); offset += 20; }
    let rn = 0;
    for (let i = 0; i < rb; i++, offset += 36) {
      assert.equal(bytes.readInt32LE(offset), rn); rn += bytes.readInt32LE(offset + 4);
      const texture = bytes.readInt32LE(offset + 24); assert.ok(texture >= -1 && texture < images); if (texture >= 0) textured++;
    }
    assert.equal(rn, rv);
    res.push(verts);
  }
  for (let i = 0; i < instances; i++) {
    const resource = bytes.readInt32LE(offset); offset += 4;
    assert.ok(resource >= 0 && resource < resources);
    const m = []; for (let j = 0; j < 16; j++) { m.push(bytes.readFloatLE(offset, true)); offset += 4; }
    triangles += res[resource].length / 3;
    for (const [x, y, z] of res[resource]) take(m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]);
  }
  for (let i = 0; i < images; i++) { const n = bytes.readInt32LE(offset); assert.ok(n > 0); offset += 4 + n; }
  assert.equal(offset, bytes.length);
  return { triangles, min, max, dimensions: max.map((n, i) => n - min[i]), images, textured, resources, instances };
}
(async () => {
  const t0 = Date.now();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) console.log('[page]', m.type(), m.text().slice(0, 500)); });
    page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 1000)));
    await page.addInitScript(() => {
      window.output = { chunks: [], done: false };
      window.Compiler = { chunk(data) { output.chunks.push(data); }, finished(format, units, notice) { Object.assign(output, { format, units, notice, done: true }); }, failed(error) { Object.assign(output, { error, done: true }); } };
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
    await page.evaluate(() => start('usdz'));
    await page.waitForFunction(() => output.done, null, { timeout: 300000 });
    const output = await page.evaluate(() => output);
    console.log('elapsed ms:', Date.now() - t0);
    console.log('error:', output.error);
    console.log('format:', output.format, 'units:', output.units);
    console.log('notice:', output.notice);
    if (!output.error) {
      const bytes = Buffer.concat(output.chunks.map(s => Buffer.from(s, 'base64')));
      console.log('cadmesh bytes:', bytes.length, 'magic:', bytes.toString('ascii', 0, 4));
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(path.join(outputDir, stem + '.cadmesh'), bytes);
      fs.writeFileSync(path.join(outputDir, stem + '.json'), JSON.stringify({ units: output.units, notice: output.notice }, null, 2));
      const bounds = cadMeshBounds(bytes);
      console.log('BOUNDS', JSON.stringify(bounds));
    }
    await page.close();
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error('RUNNER FAILED', error); server.close(); process.exitCode = 1; });

// npm install --prefix /tmp/stl-viewer-browser-test playwright@1.58.2
// NODE_PATH=/tmp/stl-viewer-browser-test/node_modules node tools/test-scad-browser.cjs
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const assets = path.join(__dirname, '../app/src/main/assets/scad');
let source = '';
const server = http.createServer((request, response) => {
  const name = new URL(request.url, 'http://localhost').pathname.slice(1);
  if (name === 'input.scad') { response.end(source); return; }
  if (!/^[a-zA-Z0-9.-]+$/.test(name)) { response.writeHead(404); response.end(); return; }
  try {
    response.setHeader('Content-Type', name.endsWith('.wasm') ? 'application/wasm' : name.endsWith('.js') ? 'text/javascript' : 'text/html');
    response.end(fs.readFileSync(path.join(assets, name)));
  } catch { response.writeHead(404); response.end(); }
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
  try {
    const cases = [
      ['cube', 'cube([10,20,30]);', 'stl'],
      ['Boolean difference', 'difference(){cube(10,center=true);cylinder(h=20,r=2,center=true,$fn=24);}', 'stl'],
      ['variables, modules, loops', 'n=3;module peg(){cylinder(h=5,r=1,$fn=16);} for(i=[0:n-1])translate([i*4,0,0])peg();', 'stl'],
      ['font text', 'linear_extrude(2)text("Hi",size=8);', 'stl'],
      ['MCAD library', 'use <MCAD/boxes.scad>; roundedBox([10,10,10],2,true);', 'stl'],
      ['2D drawing', 'difference(){square([10,10]);translate([5,5])circle(2,$fn=24);}', 'dxf'],
      ['syntax error', 'cube([10,);', 'error'],
      ['missing include', 'include <missing.scad>;cube(10);', 'error'],
      ['missing import', 'cube(10);import("missing.stl");', 'error'],
      ['empty model', '// no geometry', 'error']
    ];
    for (const [name, code, expected] of cases) {
      source = code;
      const page = await browser.newPage();
      await page.addInitScript(() => {
        window.output = {chunks: [], done: false};
        window.Compiler = {
          chunk(base64) { output.chunks.push(base64); },
          finished(format) { output.format = format; output.done = true; },
          failed(error) { output.error = error; output.done = true; }
        };
      });
      await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
      await page.evaluate(() => start());
      await page.waitForFunction(() => output.done, null, {timeout: 120000});
      const output = await page.evaluate(() => output);
      if (expected === 'error') assert.ok(output.error, name + ': expected error');
      else {
        assert.equal(output.error, undefined, name + ': ' + output.error);
        assert.equal(output.format, expected);
        const bytes = Buffer.concat(output.chunks.map(chunk => Buffer.from(chunk, 'base64')));
        if (expected === 'stl') {
          const triangles = bytes.readUInt32LE(80);
          assert.ok(triangles > 0); assert.equal(bytes.length, 84 + triangles * 50);
        } else assert.ok(bytes.toString().includes('SECTION'));
        fs.mkdirSync(path.join(__dirname, '../build/scad-test'), {recursive:true});
        fs.writeFileSync(path.join(__dirname, '../build/scad-test', name.replaceAll(/[^a-z]/gi,'_')+'.'+expected), bytes);
      }
      console.log('PASS', name);
      await page.close();
    }
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });

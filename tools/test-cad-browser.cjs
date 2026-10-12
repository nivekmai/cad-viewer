// Run with the same Playwright setup as test-scad-browser.cjs.
const {chromium} = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const assets = path.join(__dirname, '../app/src/main/assets/cad');
const fixtures = path.join(__dirname, 'fixtures');
const outputDir = path.join(__dirname, '../build/cad-test');
let source;
const server = http.createServer((request,response) => {
  const name = new URL(request.url,'http://localhost').pathname.slice(1);
  if(name === 'input.model') {response.end(source);return;}
  if(!/^[a-zA-Z0-9.-]+$/.test(name)){response.writeHead(404);response.end();return;}
  try {
    response.setHeader('Content-Type',name.endsWith('.wasm')?'application/wasm':name.endsWith('.js')?'text/javascript':'text/html');
    response.end(fs.readFileSync(path.join(assets,name)));
  } catch {response.writeHead(404);response.end();}
});
function stlBounds(bytes) {
  const count=bytes.readUInt32LE(80),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  assert.equal(bytes.length,84+count*50);assert.ok(count>0);
  for(let i=0;i<count;i++)for(let v=0;v<3;v++)for(let axis=0;axis<3;axis++){
    const n=bytes.readFloatLE(84+i*50+12+v*12+axis*4);assert.ok(Number.isFinite(n));min[axis]=Math.min(min[axis],n);max[axis]=Math.max(max[axis],n);
  }
  return {triangles:count,min,max,dimensions:max.map((n,i)=>n-min[i])};
}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try {
    const cases=process.env.CAD_TEST_FILE ? [
      ['Local DWG','dwg',fs.readFileSync(process.env.CAD_TEST_FILE),'dxf']
    ] : [
      ['STEP millimeters','step','step/cube-mm.step','stl'],
      ['STEP inches','step','step/cube-in.step','stl'],
      ['STP assembly','stp','step/assembly.stp','stl'],
      ['STEP placement','step','step/assembly.step','stl'],
      ['STEP curved surfaces','step','step/rounded-cube.step','stl'],
      ['DWG 2018 small','dwg','dwg/sample_2018.dwg','dxf'],
      ['DWG 2000 mixed','dwg','dwg/example_2000.dwg','dxf'],
      ['DWG 2007 mixed','dwg','dwg/example_2007.dwg','dxf'],
      ['DWG 2018 mixed','dwg','dwg/example_2018.dwg','dxf'],
      ['invalid STEP','step',Buffer.from('not a STEP file'),'error'],
      ['invalid DWG','dwg',Buffer.from('not a DWG file'),'error'],
      ['truncated DWG','dwg',Buffer.from('AC1032'),'error'],
      ['corrupted DWG','dwg',Buffer.concat([Buffer.from('AC1032'),Buffer.alloc(512)]),'error']
    ];
    const results={};
    for(const [name,type,input,expected] of cases){
      source=Buffer.isBuffer(input)?input:fs.readFileSync(path.join(fixtures,input));
      const page=await browser.newPage();
      await page.addInitScript(()=>{
        window.output={chunks:[],done:false};
        window.Compiler={chunk(data){output.chunks.push(data);},finished(format,units,notice){Object.assign(output,{format,units,notice,done:true});},failed(error){Object.assign(output,{error,done:true});}};
      });
      await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
      await page.evaluate(type=>start(type),type);
      await page.waitForFunction(()=>output.done,null,{timeout:120000});
      const output=await page.evaluate(()=>output);
      if(expected==='error')assert.ok(output.error,name+': expected error');
      else {
        assert.equal(output.error,undefined,name+': '+output.error);assert.equal(output.format,expected);
        const bytes=Buffer.concat(output.chunks.map(s=>Buffer.from(s,'base64')));
        const stem=name.replaceAll(/[^a-z0-9]/gi,'_');
        fs.mkdirSync(outputDir,{recursive:true});fs.writeFileSync(path.join(outputDir,stem+'.'+expected),bytes);
        if(expected==='stl'){
          assert.equal(output.units,'millimeter');results[name]=stlBounds(bytes);
          if(name.startsWith('STEP millimeters')||name.startsWith('STEP inches'))for(const d of results[name].dimensions)assert.ok(Math.abs(d-1000)<.01);
          if(name==='STP assembly')assert.ok(results[name].triangles>100,'Assembly should contain many faces');
        } else {assert.ok(bytes.toString().includes('SECTION'));assert.ok(output.notice.includes('DWG geometry preview'));results[name]={bytes:bytes.length};}
        fs.writeFileSync(path.join(outputDir,stem+'.json'),JSON.stringify({units:output.units,notice:output.notice},null,2));
      }
      console.log('PASS',name,results[name]||'rejected');await page.close();
    }
    if (!process.env.CAD_TEST_FILE) assert.deepEqual(results['STEP millimeters'],results['STEP inches']);
    fs.writeFileSync(path.join(outputDir,'results.json'),JSON.stringify(results,null,2));
  }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});

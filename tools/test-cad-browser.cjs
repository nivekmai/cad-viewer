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
function cadMeshBounds(bytes) {
  const magic=bytes.toString('ascii',0,4);
  if(magic==='CVM2')return cadMesh2Bounds(bytes);
  assert.equal(magic,'CVM1');
  const vertices=bytes.readInt32LE(4),batches=bytes.readInt32LE(8),images=bytes.readInt32LE(12);
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<vertices;i++)for(let axis=0;axis<3;axis++) {
    const value=bytes.readFloatLE(16+i*20+axis*4);assert.ok(Number.isFinite(value));
    min[axis]=Math.min(min[axis],value);max[axis]=Math.max(max[axis],value);
  }
  for(let i=0;i<vertices;i++)for(const axis of [3,4])assert.ok(Number.isFinite(bytes.readFloatLE(16+i*20+axis*4)));
  let offset=16+vertices*20, next=0, textured=0;
  for(let i=0;i<batches;i++,offset+=36) {
    assert.equal(bytes.readInt32LE(offset),next);next+=bytes.readInt32LE(offset+4);
    const texture=bytes.readInt32LE(offset+24);assert.ok(texture>=-1 && texture<images);if(texture>=0)textured++;
  }
  assert.equal(next,vertices);
  for(let i=0;i<images;i++) {const n=bytes.readInt32LE(offset);assert.ok(n>0);offset+=4+n;}
  assert.equal(offset,bytes.length);
  return {triangles:vertices/3,min,max,dimensions:max.map((n,i)=>n-min[i]),images,textured};
}
function cadMesh2Bounds(bytes) {
  // CVM2: static soup + instanced resources. Total rendered triangles are
  // the static triangles plus each instance's resource triangles; bounds
  // include every placed instance.
  const staticVertices=bytes.readInt32LE(4),staticBatches=bytes.readInt32LE(8),
    resources=bytes.readInt32LE(12),instances=bytes.readInt32LE(16),images=bytes.readInt32LE(20);
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  const take=(x,y,z)=>{min[0]=Math.min(min[0],x);max[0]=Math.max(max[0],x);min[1]=Math.min(min[1],y);max[1]=Math.max(max[1],y);min[2]=Math.min(min[2],z);max[2]=Math.max(max[2],z);};
  let offset=24, next=0, textured=0, triangles=staticVertices/3;
  for(let i=0;i<staticVertices;i++){take(bytes.readFloatLE(offset, true),bytes.readFloatLE(offset+4,true),bytes.readFloatLE(offset+8,true));offset+=20;}
  for(let i=0;i<staticBatches;i++,offset+=36) {
    assert.equal(bytes.readInt32LE(offset),next);next+=bytes.readInt32LE(offset+4);
    const texture=bytes.readInt32LE(offset+24);assert.ok(texture>=-1 && texture<images);if(texture>=0)textured++;
  }
  assert.equal(next,staticVertices);
  const res=[];
  for(let r=0;r<resources;r++) {
    const rv=bytes.readInt32LE(offset),rb=bytes.readInt32LE(offset+4);offset+=8;
    const verts=[];
    for(let i=0;i<rv;i++){verts.push([bytes.readFloatLE(offset,true),bytes.readFloatLE(offset+4,true),bytes.readFloatLE(offset+8,true)]);offset+=20;}
    let rn=0;
    for(let i=0;i<rb;i++,offset+=36) {
      assert.equal(bytes.readInt32LE(offset),rn);rn+=bytes.readInt32LE(offset+4);
      const texture=bytes.readInt32LE(offset+24);assert.ok(texture>=-1 && texture<images);if(texture>=0)textured++;
    }
    assert.equal(rn,rv);
    res.push(verts); triangles+=0; // counted per instance below
  }
  for(let i=0;i<instances;i++) {
    const resource=bytes.readInt32LE(offset);offset+=4;
    assert.ok(resource>=0 && resource<resources);
    const m=[];for(let j=0;j<16;j++){m.push(bytes.readFloatLE(offset,true));offset+=4;}
    triangles+=res[resource].length/3;
    for(const [x,y,z] of res[resource])take(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14]);
  }
  for(let i=0;i<images;i++) {const n=bytes.readInt32LE(offset);assert.ok(n>0);offset+=4+n;}
  assert.equal(offset,bytes.length);
  return {triangles,min,max,dimensions:max.map((n,i)=>n-min[i]),images,textured,resources,instances};
}
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
      [process.env.CAD_TEST_FILE.toLowerCase().endsWith('.skp')?'Local SKP':'Local DWG',
        process.env.CAD_TEST_FILE.toLowerCase().endsWith('.skp')?'skp':'dwg',fs.readFileSync(process.env.CAD_TEST_FILE),
        process.env.CAD_TEST_FILE.toLowerCase().endsWith('.skp')?'cadmesh':'dxf']
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
      ['SKP legacy nested','skp','skp/nesting_2017.skp','cadmesh'],
      ['SKP modern nested','skp','skp/nesting_2021.skp','cadmesh'],
      ['SKP scaled components','skp','skp/instance_scale_term_2021.skp','cadmesh'],
      ['SKP furniture','skp','skp/chair_and_table.skp','cadmesh'],
      ['SKP textured','skp','skp/legacy_v2020_textured.skp','cadmesh'],
      ['empty SKP','skp','skp/blank_v17.skp','error'],
      ['invalid SKP','skp',Buffer.from('not a SketchUp file'),'error'],
      ['truncated SKP','skp',fs.readFileSync(path.join(fixtures,'skp/nesting_2021.skp')).subarray(0,100),'error'],
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
        if(expected==='stl'||expected==='cadmesh'){
          assert.equal(output.units,'millimeter');results[name]=expected==='stl'?stlBounds(bytes):cadMeshBounds(bytes);
          if(name.startsWith('STEP millimeters')||name.startsWith('STEP inches'))for(const d of results[name].dimensions)assert.ok(Math.abs(d-1000)<.01);
          if(name==='SKP legacy nested'||name==='SKP modern nested') {
            assert.ok(results[name].triangles>=6);
            for(const [i,d] of [1270,254,0].entries())assert.ok(Math.abs(results[name].dimensions[i]-d)<.01, 'Nested SKP placement/axis mismatch');
          }
          if(name==='SKP textured') {assert.equal(results[name].images,1);assert.equal(results[name].textured,1);}
          if(name==='SKP furniture')assert.ok(results[name].triangles>100);
          if(name==='SKP scaled components') {
            assert.ok(results[name].triangles>=24);
            for(const [i,d] of [533.4,25.4,25.4].entries())assert.ok(Math.abs(results[name].dimensions[i]-d)<.01, 'SKP placement/scale/axis mismatch');
          }
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

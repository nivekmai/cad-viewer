// Exercise the Android renderer's exact shader sources with real imported SKP data.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'app/src/main/java/com/nivek/stlviewer/ModelView.kt'),'utf8');
const vertex=source.match(/val vertex="([^"]+)"/)[1],fragment=source.match(/val fragment="([^"]+)"/)[1];
const bytes=fs.readFileSync(path.join(root,'build/cad-test/SKP_textured.cadmesh'));
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 const page=await browser.newPage({viewport:{width:256,height:256}});
 const result=await page.evaluate(async({vertex,fragment,bytes})=>{
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;document.body.appendChild(canvas);
  const gl=canvas.getContext('webgl',{preserveDrawingBuffer:true});if(!gl)throw Error('WebGL unavailable');
  const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const data=new Uint8Array(bytes),v=new DataView(data.buffer),magic=String.fromCharCode(...data.subarray(0,4));
  // CVM1 and CVM2 share the vertex (xyz+uv, 20 bytes) and batch (36 bytes)
  // layouts; only the header size differs (16 vs 24 bytes).
  const base=magic==='CVM2'?24:16;
  const vertices=v.getInt32(4,true),batches=v.getInt32(8,true);
  const xyz=[],uv=[];
  for(let i=0;i<vertices;i++){xyz.push(v.getFloat32(base+i*20,true)/254-1,v.getFloat32(base+4+i*20,true)/254-1,0);uv.push(v.getFloat32(base+12+i*20,true),v.getFloat32(base+16+i*20,true));}
  // Same interleaved position/normal/UV layout as GeometryBatch and ModelView.
  // Tiny capacity deliberately forces multiple uploads for the fixture.
  const capacity=3,staging=new Float32Array(capacity*8),buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,capacity*32,gl.STREAM_DRAW);
  for(const [name,size,offset] of [['aPosition',3,0],['aNormal',3,12],['aUv',2,24]]) {
    const loc=gl.getAttribLocation(program,name);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,32,offset);gl.enableVertexAttribArray(loc);
  }
  const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  gl.uniformMatrix4fv(gl.getUniformLocation(program,'uMvp'),false,identity);
  gl.uniformMatrix4fv(gl.getUniformLocation(program,'uLocal'),false,identity);
  gl.uniformMatrix3fv(gl.getUniformLocation(program,'uNormalMatrix'),false,new Float32Array([1,0,0,0,1,0,0,0,1]));
  const uniform=(name,n)=>gl.uniform1f(gl.getUniformLocation(program,name),n);
  uniform('uUnlit',0);uniform('uTextured',1);uniform('uCutoff',.5);gl.uniform4f(gl.getUniformLocation(program,'uColor'),1,1,1,1);
  let offset=base+vertices*20+batches*36;const length=v.getInt32(offset,true);
  const bitmap=await createImageBitmap(new Blob([data.slice(offset+4,offset+4+length)],{type:'image/png'}),{premultiplyAlpha:'premultiply',colorSpaceConversion:'none'});
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,bitmap);
  for(const param of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,param,gl.LINEAR);
  for(const param of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,param,gl.REPEAT);
  const batchOffset=base+vertices*20;
  let first=0,count=0;for(let i=0;i<batches;i++)if(v.getInt32(batchOffset+i*36+24,true)===0){first=v.getInt32(batchOffset+i*36,true);count=v.getInt32(batchOffset+i*36+4,true);}
  function draw(){gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);for(let offset=first;offset<first+count;offset+=capacity) {
    const n=Math.min(capacity,first+count-offset);
    for(let i=0;i<n;i++){const v=offset+i;staging.set([xyz[v*3],xyz[v*3+1],xyz[v*3+2],0,0,1,uv[v*2],uv[v*2+1]],i*8);}
    gl.bufferSubData(gl.ARRAY_BUFFER,0,staging.subarray(0,n*8));gl.drawArrays(gl.TRIANGLES,0,n);gl.finish();
  }if(gl.getError()!==gl.NO_ERROR)throw Error('GL render error');const px=new Uint8Array(256*256*4);gl.readPixels(0,0,256,256,gl.RGBA,gl.UNSIGNED_BYTE,px);return px;}
  const textured=draw();let red=0,white=0;
  for(let i=0;i<textured.length;i+=4){if(textured[i]>textured[i+1]*1.5&&textured[i]>textured[i+2]*1.5)red++;if(textured[i]>180&&Math.abs(textured[i]-textured[i+1])<5&&Math.abs(textured[i]-textured[i+2])<5)white++;}
  uniform('uTextured',0);gl.uniform4f(gl.getUniformLocation(program,'uColor'),1,0,0,1);const solid=draw();
  const center=(128*256+128)*4;const solidColor=Array.from(solid.slice(center,center+4));
  uniform('uTextured',1);gl.uniform4f(gl.getUniformLocation(program,'uColor'),1,1,1,1);draw();
  // GLUtils uploads Android premultiplied pixels. Verify straight-alpha blending
  // doesn't multiply their RGB by alpha a second time.
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([128,0,0,128]));
  uniform('uCutoff',0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  const translucent=draw();const alphaColor=Array.from(translucent.slice(center,center+4));
  // A cut away from the origin must keep the same position when flipped.
  gl.disable(gl.BLEND);uniform('uTextured',0);uniform('uClipEnabled',1);uniform('uClipSign',1);
  gl.uniform4f(gl.getUniformLocation(program,'uColor'),1,0,0,1);
  gl.uniform4f(gl.getUniformLocation(program,'uClipPlane'),1,0,0,-.25);
  const original=draw();uniform('uClipSign',-1);const flipped=draw();
  const sample=(pixels,x)=>pixels[(128*256+x)*4];
  const clipPixels=[sample(original,64),sample(original,192),sample(flipped,64),sample(flipped,192)];
  gl.uniform4f(gl.getUniformLocation(program,'uClipPlane'),1,0,0,-.75);
  const moved=draw();const movedPixels=[sample(moved,192),sample(moved,248)];
  gl.uniform4f(gl.getUniformLocation(program,'uClipPlane'),1,0,0,-.25);uniform('uClipSign',1);
  const restored=draw();const twiceRestores=restored.every((n,i)=>n===original[i]);
  return {red,white,solidColor,alphaColor,clipPixels,movedPixels,twiceRestores};
 },{vertex,fragment,bytes:Array.from(bytes)});
 assert.ok(result.red>100&&result.white>100,JSON.stringify(result));
 assert.ok(result.solidColor[0]>100&&result.solidColor[1]===0&&result.solidColor[2]===0);
 assert.ok(Math.abs(result.alphaColor[0]-result.solidColor[0]*128/255)<3,JSON.stringify(result));
 assert.ok(result.clipPixels[0]>100 && result.clipPixels[1]===0 && result.clipPixels[2]===0 && result.clipPixels[3]>100,JSON.stringify(result));
 assert.ok(result.movedPixels[0]===0 && result.movedPixels[1]>100 && result.twiceRestores,JSON.stringify(result));
 fs.mkdirSync(path.join(root,'build/cad-test'),{recursive:true});await page.screenshot({path:path.join(root,'build/cad-test/textured-skp.png')});
 console.log('PASS SketchUp texture pixels and material-color shader',result);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

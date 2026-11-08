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
  const data=new Uint8Array(bytes),v=new DataView(data.buffer),vertices=v.getInt32(4,true),batches=v.getInt32(8,true);
  const xyz=[],uv=[];
  for(let i=0;i<vertices;i++){xyz.push(v.getFloat32(16+i*20,true)/254-1,v.getFloat32(20+i*20,true)/254-1,0);uv.push(v.getFloat32(28+i*20,true),v.getFloat32(32+i*20,true));}
  // Same interleaved position/normal/UV layout as GeometryBatch and ModelView.
  // Tiny capacity deliberately forces multiple uploads for the fixture.
  const capacity=3,staging=new Float32Array(capacity*8),buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,capacity*32,gl.STREAM_DRAW);
  for(const [name,size,offset] of [['aPosition',3,0],['aNormal',3,12],['aUv',2,24]]) {
    const loc=gl.getAttribLocation(program,name);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,32,offset);gl.enableVertexAttribArray(loc);
  }
  const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  for(const name of ['uMvp','uModel'])gl.uniformMatrix4fv(gl.getUniformLocation(program,name),false,identity);
  const uniform=(name,n)=>gl.uniform1f(gl.getUniformLocation(program,name),n);
  uniform('uUnlit',0);uniform('uTextured',1);uniform('uCutoff',.5);gl.uniform4f(gl.getUniformLocation(program,'uColor'),1,1,1,1);
  let offset=16+vertices*20+batches*36;const length=v.getInt32(offset,true);
  const bitmap=await createImageBitmap(new Blob([data.slice(offset+4,offset+4+length)],{type:'image/png'}),{premultiplyAlpha:'premultiply',colorSpaceConversion:'none'});
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,bitmap);
  for(const param of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,param,gl.LINEAR);
  for(const param of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,param,gl.REPEAT);
  const batchOffset=16+vertices*20;
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
  return {red,white,solidColor,alphaColor};
 },{vertex,fragment,bytes:Array.from(bytes)});
 assert.ok(result.red>100&&result.white>100,JSON.stringify(result));
 assert.ok(result.solidColor[0]>100&&result.solidColor[1]===0&&result.solidColor[2]===0);
 assert.ok(Math.abs(result.alphaColor[0]-result.solidColor[0]*128/255)<3,JSON.stringify(result));
 fs.mkdirSync(path.join(root,'build/cad-test'),{recursive:true});await page.screenshot({path:path.join(root,'build/cad-test/textured-skp.png')});
 console.log('PASS SketchUp texture pixels and material-color shader',result);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const base=path.join(__dirname,'../app/src/main/assets/scad');
async function compile(source){
 let ready;const initialized=new Promise(r=>ready=r);const logs=[];
 const context=vm.createContext({console,WebAssembly,TextDecoder,TextEncoder,URL,setTimeout,clearTimeout,performance,
 OpenSCAD:{noInitialRun:true,wasmBinary:new Uint8Array(fs.readFileSync(path.join(base,'openscad.wasm'))),print:s=>logs.push(s),printErr:s=>logs.push(s),onRuntimeInitialized:()=>ready(),onAbort:s=>{throw Error(s)}}});
 vm.runInContext(fs.readFileSync(path.join(base,'openscad.wasm.js'),'utf8'),context);
 await initialized;
 const instance=context.OpenSCAD;
 instance.FS.writeFile('/input.scad',source);
 let status=instance.callMain(['/input.scad','--export-format','binstl','-o','/output.stl']);
 console.log('status',status,logs.join('\n'));
 let output=instance.FS.readFile('/output.stl');
 console.log('STL bytes',output.length,'triangles',new DataView(output.buffer,output.byteOffset).getUint32(80,true));
}
compile('difference(){ cube([10,10,10], center=true); cylinder(h=20,r=2,center=true,$fn=24); }').catch(e=>{console.error(e);process.exitCode=1;});

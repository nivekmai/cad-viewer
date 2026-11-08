const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app/src/main/assets/cad/host.js'),'utf8');
for(const mode of ['stream','buffer','error','worker-error']) {
 let worker,done=false;const chunks=[];
 const context={Uint8Array,btoa:s=>Buffer.from(s,'binary').toString('base64'),Worker:class {
  constructor(){worker=this;this.terminated=false;this.messages=[];}
  postMessage(message){this.messages.push(message);}
  terminate(){this.terminated=true;}
 },Compiler:{chunk:chunk=>chunks.push(chunk),finished(){assert.ok(worker.terminated);done=true;},failed(){assert.ok(worker.terminated);done=true;}}};
 vm.createContext(context);vm.runInContext(source+'\nstart("skp");',context);
 if(mode==='stream') {
  worker.onmessage({data:{chunk:new Uint8Array([1,2,3])}});
  assert.ok(!worker.terminated);assert.ok(worker.messages[1].ack);
  worker.onmessage({data:{done:true,format:'cadmesh'}});
  assert.equal(chunks[0],'AQID');
 } else if(mode==='buffer')worker.onmessage({data:{bytes:new Uint8Array([1]),format:'stl'}});
 else if(mode==='error')worker.onmessage({data:{error:'bad input'}});
 else worker.onerror({message:'failed'});
 assert.ok(done);
}
console.log('PASS converter terminates worker before native completion/error; chunk acknowledgments preserved');

let worker;
function start(type) {
  try {
    worker = new Worker('worker.js');
    worker.onerror = event => {
      Compiler.failed(event.message || 'The local CAD reader could not start. Update Android System WebView and try again.');
      worker.terminate();
    };
    worker.onmessage = event => {
      const result = event.data;
      if(result.chunk) {
        for(let offset=0;offset<result.chunk.length;offset+=24576) {
          const part=result.chunk.subarray(offset,offset+24576);
          Compiler.chunk(btoa(String.fromCharCode.apply(null,part)));
        }
        worker.postMessage({ack:true});return;
      }
      if (result.error) Compiler.failed(result.error);
      else {
        for (let offset = 0; offset < (result.bytes?.length || 0); offset += 24576) {
          const chunk = result.bytes.subarray(offset, offset + 24576);
          Compiler.chunk(btoa(String.fromCharCode.apply(null, chunk)));
        }
        Compiler.finished(result.format, result.units || '', result.notice || '');
      }
      worker.terminate();
    };
    worker.postMessage({type});
  } catch (error) { Compiler.failed(String(error.message || error)); }
}

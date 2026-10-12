let worker;
function start(format = 'stl') {
  try {
    worker = new Worker('worker.js');
    worker.onerror = event => { Compiler.failed(event.message || 'The local compiler could not start. Update Android System WebView and try again.'); worker.terminate(); };
    worker.onmessage = event => {
      if (event.data.retry2D) { worker.terminate(); start('dxf'); return; }
      if (event.data.error) Compiler.failed(event.data.error);
      else {
        const bytes = event.data.bytes;
        for (let offset = 0; offset < bytes.length; offset += 24576) {
          const chunk = bytes.subarray(offset, offset + 24576);
          Compiler.chunk(btoa(String.fromCharCode.apply(null, chunk)));
        }
        Compiler.finished(event.data.format, '', '');
      }
      worker.terminate();
    };
    worker.postMessage({format});
  } catch (error) { Compiler.failed(String(error.message || error)); }
}

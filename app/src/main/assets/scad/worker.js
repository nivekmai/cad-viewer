/* Offline OpenSCAD 2022.03.20 worker. A fresh compiler is used for each model. */
self.onmessage = async function (event) {
  const log = [];
  const diagnostic = [];
  const record = value => {
    const line = String(value);
    if (log.length >= 150) log.shift();
    log.push(line);
    if (!line.startsWith('ECHO:') && /ERROR:|WARNING:|can't open|cannot open|could not open/i.test(line) && diagnostic.length < 40) diagnostic.push(line);
  };
  try {
    const wasm = await (await fetch('openscad.wasm')).arrayBuffer();
    const ready = new Promise((resolve, reject) => {
      self.OpenSCAD = {
        noInitialRun: true,
        wasmBinary: new Uint8Array(wasm),
        onRuntimeInitialized: resolve,
        onAbort: reason => reject(new Error(String(reason))),
        print: record,
        printErr: record
      };
    });
    importScripts('openscad.wasm.js');
    await ready;
    const compiler = self.OpenSCAD;
    importScripts('openscad.fonts.js', 'openscad.mcad.js');
    addFonts(compiler); addMCAD(compiler);
    const source = await (await fetch('input.scad')).text();
    compiler.FS.writeFile('/input.scad', source);
    const format = event.data.format === 'dxf' ? 'dxf' : 'stl';
    const output = '/output.' + format;
    const args = format === 'stl' ? ['/input.scad', '--export-format', 'binstl', '-o', output] : ['/input.scad', '-o', output];
    const status = compiler.callMain(args);
    if (format === 'stl' && log.some(line => /not a 3D object/i.test(line))) {
      self.postMessage({retry2D: true}); return;
    }
    // OpenSCAD can exit successfully after skipping missing includes/imports. Reject such partial geometry.
    if (status !== 0 || diagnostic.length) throw new Error(diagnostic.join('\n') || log.slice(-12).join('\n') || 'OpenSCAD could not compile this file.');
    const result = compiler.FS.readFile(output);
    if (result.length > 64 * 1024 * 1024) throw new Error('The compiled model exceeds 64 MB.');
    if (result.length < 84) throw new Error('SCAD did not produce any viewable geometry.');
    self.postMessage({bytes: result, format}, [result.buffer]);
  } catch (error) {
    self.postMessage({error: String(error.message || error) + '\n\nSCAD files must be self-contained or use the bundled MCAD library. External project files are not available.'});
  }
};

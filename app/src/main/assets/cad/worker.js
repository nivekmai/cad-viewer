/* Offline STEP tessellation and DWG decoding. Each import owns a disposable worker. */
const MAX_TRIANGLES = 500000;

async function readBytes(name) {
  const response = await fetch(name);
  if (!response.ok) throw new Error('Could not load the local CAD reader.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  return bytes;
}

async function readStep(input) {
  importScripts('occt-import-js.js');
  const diagnostics = [];
  const record = value => { if (diagnostics.length < 40 && /error|fail|cannot|not found/i.test(String(value))) diagnostics.push(String(value)); };
  const occt = await occtimportjs({
    wasmBinary: await readBytes('occt-import-js.wasm'), print: record, printErr: record
  });
  const result = occt.ReadStepFile(input, {
    linearUnit: 'millimeter',
    linearDeflectionType: 'bounding_box_ratio', linearDeflection: 0.001, angularDeflection: 0.25
  });
  if (!result.success || !Array.isArray(result.meshes)) throw new Error('This STEP file could not be read. It may be damaged or require external part files.');
  let count = 0, colored = false;
  for (const mesh of result.meshes) {
    const positions = mesh.attributes && mesh.attributes.position && mesh.attributes.position.array;
    const indices = mesh.index && mesh.index.array;
    if (!positions || !indices || positions.length % 3 || indices.length % 3) throw new Error('Invalid tessellation returned for this STEP file.');
    count += indices.length / 3;
    if (count > MAX_TRIANGLES) throw new Error('This STEP model exceeds 500,000 triangles. Try a smaller assembly.');
    colored ||= !!mesh.color || (mesh.brep_faces || []).some(face => !!face.color);
  }
  if (!count) throw new Error('This STEP file has no viewable surfaces or solids. Wire-only STEP models are not supported.');
  const bytes = new Uint8Array(84 + count * 50);
  const output = new DataView(bytes.buffer);
  bytes.set(new TextEncoder().encode('STEP preview; millimeters; OCCT'));
  output.setUint32(80, count, true);
  let offset = 84;
  // OCCT has already applied assembly placements and face orientation to each mesh.
  for (const mesh of result.meshes) {
    const positions = mesh.attributes.position.array, indices = mesh.index.array;
    for (let i = 0; i < indices.length; i += 3) {
      offset += 12; // Renderer calculates face normals from the triangulated positions.
      for (let vertex = 0; vertex < 3; vertex++) {
        const index = indices[i + vertex];
        if (!Number.isInteger(index) || index < 0 || index * 3 + 2 >= positions.length) throw new Error('Invalid STEP vertex index.');
        for (let axis = 0; axis < 3; axis++) {
          const coordinate = positions[index * 3 + axis];
          if (!Number.isFinite(coordinate) || Math.abs(coordinate) > 3.402823466e38) throw new Error('Invalid STEP coordinate.');
          output.setFloat32(offset, coordinate, true); offset += 4;
        }
      }
      offset += 2;
    }
  }
  const notes = [];
  if (colored) notes.push('STEP colors and materials are not displayed.');
  if (diagnostics.length) notes.push('The STEP reader reported issues; some geometry may be missing.\n' + diagnostics.join('\n'));
  return {bytes, format: 'stl', units: 'millimeter', notice: notes.join('\n')};
}

async function readDwg(input) {
  const signature = new TextDecoder('ascii').decode(input.subarray(0, 6));
  if (!/^AC10[0-9]{2}$/.test(signature) || input.length < 128) throw new Error('This is not a supported DWG file, or the file is incomplete.');
  const {default: createModule} = await import('./libredwg-web.js');
  const diagnostics = [];
  const record = value => { if (diagnostics.length < 40 && /error|warn|unsupported|unhandled|skip|unknown/i.test(String(value))) diagnostics.push(String(value)); };
  const dwg = await createModule({
    wasmBinary: await readBytes('libredwg-web.wasm'), print: record, printErr: record
  });
  dwg.FS.writeFile('/input.dwg', input);
  const status = dwg.dwg_write_dxf('/input.dwg', '/output.dxf');
  if (status !== 0) throw new Error('The DWG reader could not decode this drawing (code ' + status + '). Try exporting it as ASCII DXF.');
  let bytes;
  try { bytes = dwg.FS.readFile('/output.dxf'); }
  catch { throw new Error('The DWG reader did not produce viewable drawing data.'); }
  if (!bytes.length) throw new Error('The DWG file contains no drawing data.');
  return {
    bytes, format: 'dxf', units: '',
    notice: 'DWG geometry preview. Proprietary 3D solids, proxy objects, external references, and hatches are not rendered.' +
      (diagnostics.length ? '\nThe DWG reader reported: ' + diagnostics.join('\n') : '')
  };
}

async function readSkp(input) {
  importScripts('openskp.js');
  const warnings = [];
  let scene;
  try {
    scene = OpenSkp.buildScene(input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength), {
      frontSideOnly: true, respectEdgeVisibility: true,
      onLog(level, message) { if (level !== 'debug' && level !== 'info' && warnings.length < 10) warnings.push(String(message)); }
    });
  } catch (error) {
    throw new Error('This SketchUp file could not be read. Its version or features may not be supported, or it may be damaged. ' + String(error.message || error).slice(0, 300));
  }
  const meshes = scene.glbPrimitives;
  let count = 0;
  for (const mesh of meshes) {
    if (mesh.indices.length % 3 || mesh.positions.length % 3) throw new Error('Invalid SketchUp surface data.');
    count += mesh.indices.length / 3;
    if (count > MAX_TRIANGLES) throw new Error('This SketchUp model exceeds 500,000 triangles. Try a smaller model.');
  }
  if (!count) throw new Error('This SketchUp file has no viewable surfaces. Empty and edge-only models are not supported.');
  const bytes = new Uint8Array(84 + count * 50), view = new DataView(bytes.buffer);
  view.setUint32(80, count, true);
  let offset = 84;
  for (const mesh of meshes) {
    for (let i = 0; i < mesh.indices.length; i += 3) {
      offset += 12;
      for (let v = 0; v < 3; v++) {
        const index = mesh.indices[i + v];
        if (!Number.isInteger(index) || index < 0 || index * 3 + 2 >= mesh.positions.length) throw new Error('Invalid SketchUp vertex index.');
        const p = mesh.positions.subarray(index * 3, index * 3 + 3);
        // Baked scene is metres, Y-up. Restore SketchUp's Z-up and use millimetres.
        for (const coordinate of [p[0] * 1000, -p[2] * 1000, p[1] * 1000]) {
          if (!Number.isFinite(coordinate) || Math.abs(coordinate) > 3.402823466e38) throw new Error('Invalid SketchUp coordinate.');
          view.setFloat32(offset, coordinate, true); offset += 4;
        }
      }
      offset += 2;
    }
  }
  return {bytes, format: 'stl', units: 'millimeter',
    notice: 'SketchUp surface preview. Materials, textures, loose edges, text, dimensions, and scene styles are not displayed. Some file versions and features may be unsupported.' +
      (warnings.length ? '\nReader notes: ' + warnings.join('\n') : '')};
}

self.onmessage = async event => {
  try {
    const input = await readBytes('input.model');
    const type = event.data.type;
    if (!['step', 'stp', 'dwg', 'skp'].includes(type)) throw new Error('Unsupported CAD format.');
    const result = type === 'skp' ? await readSkp(input) : type === 'dwg' ? await readDwg(input) : await readStep(input);
    self.postMessage(result, [result.bytes.buffer]);
  } catch (error) { self.postMessage({error: String(error.message || error)}); }
};

/* CVM1: little-endian header (vertices, batches, textures), expanded xyz/uv vertices,
 * batches (first,count,rgba,texture,flags,alphaCutoff), then length-prefixed images. */
function* skpSceneChunks(scene) {
  const meshes=scene.glbPrimitives.filter(m=>m.indices.length);
  const textures=scene.textures || [];
  let vertices=0;
  for(const mesh of meshes) {
    if(mesh.indices.length%3 || mesh.positions.length%3 || mesh.uvs.length!==mesh.positions.length/3*2)throw new Error('Invalid SketchUp surface data.');
    vertices+=mesh.indices.length;
  }
  if(!vertices)throw new Error('This SketchUp file has no viewable surfaces. Empty and edge-only models are not supported.');
  const header=new Uint8Array(16), headerView=new DataView(header.buffer);
  header.set([67,86,77,49]);headerView.setInt32(4,vertices,true);headerView.setInt32(8,meshes.length,true);headerView.setInt32(12,textures.length,true);
  yield header;
  let chunk=new Uint8Array(8192*20),view=new DataView(chunk.buffer),offset=0;
  const float=n=>{if(!Number.isFinite(n)||Math.abs(n)>3.402823466e38)throw new Error('Invalid SketchUp coordinate or material.');view.setFloat32(offset,n,true);offset+=4;};
  const int=n=>{view.setInt32(offset,n,true);offset+=4;};
  for(const mesh of meshes)for(const index of mesh.indices) {
    if(!Number.isInteger(index)||index<0||index*3+2>=mesh.positions.length)throw new Error('Invalid SketchUp vertex index.');
    const p=mesh.positions;
    float(p[index*3]*1000);float(-p[index*3+2]*1000);float(p[index*3+1]*1000);
    float(mesh.uvs[index*2]);float(mesh.uvs[index*2+1]);
    if(offset===chunk.length){yield chunk;chunk=new Uint8Array(8192*20);view=new DataView(chunk.buffer);offset=0;}
  }
  if(offset)yield chunk.slice(0,offset);
  chunk=new Uint8Array(1024*36);view=new DataView(chunk.buffer);offset=0;
  let first=0;
  for(const mesh of meshes) {
    const material=scene.gltfMaterials[mesh.materialIndex] || {}, pbr=material.pbrMetallicRoughness || {};
    int(first);int(mesh.indices.length);first+=mesh.indices.length;
    for(const c of pbr.baseColorFactor || [1,1,1,1])float(c);
    const texture=pbr.baseColorTexture?.index ?? -1;
    if(texture < -1 || texture>=textures.length)throw new Error('Invalid SketchUp texture reference.');
    int(texture);int((material.doubleSided?1:0)|(material.alphaMode==='BLEND'?2:0)|(material.alphaMode==='MASK'?4:0));
    float(material.alphaCutoff ?? .5);
    if(offset===chunk.length){yield chunk;chunk=new Uint8Array(1024*36);view=new DataView(chunk.buffer);offset=0;}
  }
  if(offset)yield chunk.slice(0,offset);
  for(const texture of textures){
    const length=new Uint8Array(4);new DataView(length.buffer).setInt32(0,texture.data.length,true);yield length;
    for(let i=0;i<texture.data.length;i+=131072)yield texture.data.slice(i,i+131072);
  }
}
// Used by desktop validation only; the app consumes chunks with backpressure.
function encodeSkpScene(scene) {
  const chunks=Array.from(skpSceneChunks(scene));const bytes=new Uint8Array(chunks.reduce((n,b)=>n+b.length,0));
  let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return bytes;
}

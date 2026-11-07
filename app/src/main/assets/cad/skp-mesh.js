/* CVM1: little-endian header (vertices, batches, textures), expanded xyz/uv vertices,
 * batches (first,count,rgba,texture,flags,alphaCutoff), then length-prefixed images. */
function encodeSkpScene(scene) {
  const meshes=scene.glbPrimitives.filter(m=>m.indices.length);
  const textures=scene.textures || [];
  let vertices=0;
  for(const mesh of meshes) {
    if(mesh.indices.length%3 || mesh.positions.length%3 || mesh.uvs.length!==mesh.positions.length/3*2)throw new Error('Invalid SketchUp surface data.');
    vertices+=mesh.indices.length;
  }
  if(!vertices)throw new Error('This SketchUp file has no viewable surfaces. Empty and edge-only models are not supported.');
  const size=16+vertices*20+meshes.length*36+textures.reduce((n,t)=>n+4+t.data.length,0);
  const bytes=new Uint8Array(size), view=new DataView(bytes.buffer);
  bytes.set([67,86,77,49]);let offset=4;
  const int=n=>{view.setInt32(offset,n,true);offset+=4;};
  const float=n=>{if(!Number.isFinite(n)||Math.abs(n)>3.402823466e38)throw new Error('Invalid SketchUp coordinate or material.');view.setFloat32(offset,n,true);offset+=4;};
  int(vertices);int(meshes.length);int(textures.length);
  for(const mesh of meshes)for(const index of mesh.indices) {
    if(!Number.isInteger(index)||index<0||index*3+2>=mesh.positions.length)throw new Error('Invalid SketchUp vertex index.');
    const p=mesh.positions;
    float(p[index*3]*1000);float(-p[index*3+2]*1000);float(p[index*3+1]*1000);
    float(mesh.uvs[index*2]);float(mesh.uvs[index*2+1]);
  }
  let first=0;
  for(const mesh of meshes) {
    const material=scene.gltfMaterials[mesh.materialIndex] || {}, pbr=material.pbrMetallicRoughness || {};
    int(first);int(mesh.indices.length);first+=mesh.indices.length;
    for(const c of pbr.baseColorFactor || [1,1,1,1])float(c);
    const texture=pbr.baseColorTexture?.index ?? -1;
    if(texture < -1 || texture>=textures.length)throw new Error('Invalid SketchUp texture reference.');
    int(texture);int((material.doubleSided?1:0)|(material.alphaMode==='BLEND'?2:0)|(material.alphaMode==='MASK'?4:0));
    float(material.alphaCutoff ?? .5);
  }
  for(const texture of textures){int(texture.data.length);bytes.set(texture.data,offset);offset+=texture.data.length;}
  return bytes;
}

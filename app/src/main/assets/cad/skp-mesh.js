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

/* CVM2: the instanced counterpart of CVM1. SketchUp files reuse a handful of
 * definitions across thousands of placements (a leaf used 3,740 times, a stem
 * 1,056 times). CVM1 bakes every placement into its own world-space vertices:
 * scheme2.skp is 3,011,515 triangles but only 898,982 unique ones, so the
 * baked form carries 3.35x the geometry, 16,662 material batches, and a
 * 227 MB transfer for a 125 MB file. CVM2 keeps each definition once and
 * references it from its placements:
 *   header (24B): 'CVM2', staticVertices, staticBatches, resources,
 *     instances, textures
 *   static vertices (20B each, xyz mm + uv) and batches (36B each): geometry
 *     baked once and drawn as-is. This holds single-placement resources
 *     (instancing buys nothing there) and small heavily-repeated resources
 *     (a 122-triangle leaf x 3,740 placements is one merged static mesh
 *     instead of 3,740 draw calls), merged by material so one surface
 *     covers every baked triangle sharing it.
 *   per resource: int32 verts, int32 batches, soup vertices (20B each,
 *     definition-local, viewer frame) and batches (36B each, first/count
 *     relative to the resource).
 *   instances (68B each): int32 resource index + 16 float32 column-major
 *     matrix in the viewer frame (millimetres), already flattened through
 *     the placement hierarchy, so the renderer just multiplies it by its
 *     own camera matrix.
 *   textures: length-prefixed images, as in CVM1.
 * The renderer uploads the static and resource vertices once into GPU
 * buffers and draws from them every frame; nothing is re-streamed per
 * frame. Baking threshold BAKE_MAX_TRIS was measured on scheme2.skp:
 * 1,024 keeps instanced draws at 395 (from 10,306 placements) while the
 * merged static part stays at 972,833 triangles. */
const BAKE_MAX_TRIS=1024;
function mat4Multiply(a,b) {
  const out=new Float32Array(16);
  for(let col=0;col<4;col++)for(let row=0;row<4;row++) {
    let sum=0;for(let k=0;k<4;k++)sum+=a[k*4+row]*b[col*4+k];
    out[col*4+row]=sum;
  }
  return out;
}
// glTF metres Y-up -> viewer millimetres (x, -z, y), column-major.
const FRAME_A=new Float32Array([1000,0,0,0, 0,0,1000,0, 0,-1000,0,0, 0,0,0,1]);
const FRAME_A_INV=new Float32Array([0.001,0,0,0, 0,0,-0.001,0, 0,0.001,0,0, 0,0,0,1]);
function viewerMatrix(gltfMatrix) {
  return mat4Multiply(FRAME_A,mat4Multiply(new Float32Array(gltfMatrix),FRAME_A_INV));
}
function applyMatrix(m,x,y,z) {
  return [m[0]*x+m[4]*y+m[8]*z+m[12], m[1]*x+m[5]*y+m[9]*z+m[13], m[2]*x+m[6]*y+m[10]*z+m[14]];
}
function materialBatch(material,textures) {
  const pbr=(material && material.pbrMetallicRoughness) || {};
  const texture=pbr.baseColorTexture?.index ?? -1;
  if(texture < -1 || texture>=textures.length)throw new Error('Invalid SketchUp texture reference.');
  return {
    color: Array.from(pbr.baseColorFactor || [1,1,1,1]),
    texture,
    flags: ((material && material.doubleSided)?1:0)|((material && material.alphaMode==='BLEND')?2:0)|((material && material.alphaMode==='MASK')?4:0),
    cutoff: (material && material.alphaCutoff) ?? .5,
  };
}
class ChunkWriter {
  constructor(size=131072) { this.buffer=new Uint8Array(size); this.view=new DataView(this.buffer.buffer); this.offset=0; }
  *flush() {
    if(this.offset) { yield this.buffer.slice(0,this.offset); this.offset=0; }
  }
  *putBytes(bytes) {
    let i=0;
    while(i<bytes.length) {
      if(this.offset===this.buffer.length)yield* this.flush();
      const n=Math.min(bytes.length-i,this.buffer.length-this.offset);
      this.buffer.set(bytes.subarray(i,i+n),this.offset); this.offset+=n; i+=n;
    }
  }
  *putInt(n) {
    if(!Number.isInteger(n))throw new Error('Invalid SketchUp value.');
    if(this.offset+4>this.buffer.length)yield* this.flush();
    this.view.setInt32(this.offset,n,true); this.offset+=4;
  }
  *putFloat(n) {
    if(!Number.isFinite(n)||Math.abs(n)>3.402823466e38)throw new Error('Invalid SketchUp coordinate or material.');
    if(this.offset+4>this.buffer.length)yield* this.flush();
    this.view.setFloat32(this.offset,n,true); this.offset+=4;
  }
  *putBatch(first,count,batch) {
    yield* this.putInt(first); yield* this.putInt(count);
    for(const c of batch.color)yield* this.putFloat(c);
    yield* this.putInt(batch.texture); yield* this.putInt(batch.flags); yield* this.putFloat(batch.cutoff);
  }
}
function* skpInstancedSceneChunks(scene) {
  const textures=scene.textures || [];
  const materials=scene.gltfMaterials || [];
  const resources=scene.meshResources || [];
  if(!resources.length)throw new Error('This SketchUp file has no viewable surfaces. Empty and edge-only models are not supported.');
  // Flatten the placement tree: every placed node gets a world matrix.
  const resourceIndex=new Map(resources.map((r,i)=>[r.id,i]));
  const placements=[]; // {resource, matrix (viewer frame, mm)}
  const identity=new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  const stack=[[scene.sceneHierarchy,identity]];
  while(stack.length) {
    const [node,parentWorld]=stack.pop();
    const local=node.matrix ? new Float32Array(node.matrix) : identity;
    const world=mat4Multiply(parentWorld,local);
    if(node.meshResourceId!==undefined) {
      const index=resourceIndex.get(node.meshResourceId);
      if(index===undefined)throw new Error('Invalid SketchUp instance reference.');
      placements.push({resource:index,matrix:viewerMatrix(world)});
    }
    for(let i=node.children.length-1;i>=0;i--)stack.push([node.children[i],world]);
  }
  // Per-resource placement counts decide bake vs. instance.
  const instanceCount=new Array(resources.length).fill(0);
  for(const p of placements)instanceCount[p.resource]++;
  const baked=new Array(resources.length).fill(false);
  const resourceTris=resources.map(r=>{
    let tris=0;
    for(const prim of r.primitives) {
      if(!prim.indices || prim.indices.length%3 || prim.positions.length%3 || prim.uvs.length!==prim.positions.length/3*2)throw new Error('Invalid SketchUp surface data.');
      tris+=prim.indices.length/3;
    }
    return tris;
  });
  for(let i=0;i<resources.length;i++)baked[i]=instanceCount[i]<=1 || resourceTris[i]<=BAKE_MAX_TRIS;
  // Static part: baked resources, merged by material into one surface each.
  // Count triangles per material first so the vertex arrays are exact.
  const staticByMaterial=new Map(); // materialIndex -> {tris, verts:Float32Array, cursor}
  const bakedPlacements=placements.filter(p=>baked[p.resource]);
  for(const p of bakedPlacements) {
    const resource=resources[p.resource];
    for(const prim of resource.primitives) {
      const entry=staticByMaterial.get(prim.materialIndex) || {tris:0};
      entry.tris+=prim.indices.length/3; staticByMaterial.set(prim.materialIndex,entry);
    }
  }
  for(const [materialIndex,entry] of staticByMaterial) {
    entry.verts=new Float32Array(entry.tris*3*5); entry.cursor=0;
  }
  for(const p of bakedPlacements) {
    const resource=resources[p.resource];
    for(const prim of resource.primitives) {
      const entry=staticByMaterial.get(prim.materialIndex);
      const pos=prim.positions, uv=prim.uvs, out=entry.verts;
      for(const index of prim.indices) {
        if(!Number.isInteger(index)||index<0||index*3+2>=pos.length)throw new Error('Invalid SketchUp vertex index.');
        const x=pos[index*3]*1000, y=-pos[index*3+2]*1000, z=pos[index*3+1]*1000;
        const w=applyMatrix(p.matrix,x,y,z);
        out[entry.cursor++]=w[0]; out[entry.cursor++]=w[1]; out[entry.cursor++]=w[2];
        out[entry.cursor++]=uv[index*2]; out[entry.cursor++]=uv[index*2+1];
      }
    }
  }
  let staticVertices=0, staticBatches=0;
  for(const entry of staticByMaterial.values()) { staticVertices+=entry.tris*3; staticBatches++; }
  const instancedResources=[];
  const instancedIndex=new Map(); // old resource index -> new instanced index
  for(let i=0;i<resources.length;i++)if(!baked[i]) { instancedIndex.set(i,instancedResources.length); instancedResources.push(i); }
  const instancedPlacements=placements.filter(p=>!baked[p.resource]);
  const writer=new ChunkWriter();
  const header=new Uint8Array(24), hv=new DataView(header.buffer);
  header.set([67,86,77,50]); hv.setInt32(4,staticVertices,true); hv.setInt32(8,staticBatches,true);
  hv.setInt32(12,instancedResources.length,true); hv.setInt32(16,instancedPlacements.length,true); hv.setInt32(20,textures.length,true);
  yield header;
  // Static vertices, then one batch per material.
  for(const [materialIndex,entry] of staticByMaterial) {
    yield* writer.putBytes(new Uint8Array(entry.verts.buffer,entry.verts.byteOffset,entry.verts.byteLength));
  }
  yield* writer.flush();
  let first=0;
  for(const [materialIndex,entry] of staticByMaterial) {
    const batch=materialBatch(materials[materialIndex] || {},textures);
    yield* writer.putBatch(first,entry.tris*3,batch); first+=entry.tris*3;
  }
  yield* writer.flush();
  // Instanced resources: definition-local soup vertices, one batch per primitive.
  for(const oldIndex of instancedResources) {
    const resource=resources[oldIndex];
    let verts=0, batches=0;
    for(const prim of resource.primitives) { verts+=prim.indices.length; batches++; }
    yield* writer.putInt(verts); yield* writer.putInt(batches);
    for(const prim of resource.primitives) {
      const pos=prim.positions, uv=prim.uvs;
      for(const index of prim.indices) {
        if(!Number.isInteger(index)||index<0||index*3+2>=pos.length)throw new Error('Invalid SketchUp vertex index.');
        yield* writer.putFloat(pos[index*3]*1000); yield* writer.putFloat(-pos[index*3+2]*1000); yield* writer.putFloat(pos[index*3+1]*1000);
        yield* writer.putFloat(uv[index*2]); yield* writer.putFloat(uv[index*2+1]);
      }
    }
    yield* writer.flush();
    let rfirst=0;
    for(const prim of resource.primitives) {
      const batch=materialBatch(materials[prim.materialIndex] || {},textures);
      yield* writer.putBatch(rfirst,prim.indices.length,batch); rfirst+=prim.indices.length;
    }
    yield* writer.flush();
  }
  // Instances: resource index + viewer-frame world matrix.
  for(const p of instancedPlacements) {
    yield* writer.putInt(instancedIndex.get(p.resource));
    for(const v of p.matrix)yield* writer.putFloat(v);
  }
  yield* writer.flush();
  for(const texture of textures) {
    const length=new Uint8Array(4); new DataView(length.buffer).setInt32(0,texture.data.length,true); yield length;
    for(let i=0;i<texture.data.length;i+=131072)yield texture.data.slice(i,i+131072);
  }
}
function encodeSkpInstancedScene(scene) {
  const chunks=Array.from(skpInstancedSceneChunks(scene));const bytes=new Uint8Array(chunks.reduce((n,b)=>n+b.length,0));
  let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return bytes;
}

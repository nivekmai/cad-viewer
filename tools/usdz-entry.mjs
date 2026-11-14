import { USDLoader } from 'three/addons/loaders/USDLoader.js';
import { USDCParser } from 'three/addons/loaders/usd/USDCParser.js';
import { USDComposer } from 'three/addons/loaders/usd/USDComposer.js';
import { ImageLoader, Vector2, Vector3, Matrix4, DoubleSide } from 'three';

// USD's image loader normally requires a DOM. Workers decode embedded images
// without network access and retain their bytes for the native texture decoder.
// r187 omits inline double-vector cases (e.g. a double3 translation of 3,4,5).
// Crate stores these small integral components as signed bytes, like float vectors.
const inlineValue=USDCParser.prototype._readInlinedValue;
USDCParser.prototype._readInlinedValue=function(rep) {
  const size=({19:2,23:3,27:4})[rep.typeEnum];
  if(size){const n=rep.getInlinedValue();return Array.from({length:size},(_,i)=>(n >>> (i*8) & 255)<<24>>24);}
  return inlineValue.call(this,rep);
};
const compose=USDComposer.prototype.compose;
USDComposer.prototype.compose=function(data,...args) {
  const group=compose.call(this,data,...args);
  // USD's unauthored unit is centimeters, not meters.
  if(data.specsByPath['/']?.fields?.metersPerUnit===undefined)group.scale.multiplyScalar(.01);
  return group;
};
const images=new WeakMap();
ImageLoader.prototype.load=function(url,onLoad,onProgress,onError) {
  if(!url.startsWith('blob:')) { onError?.(new Error('External USD assets are unavailable.'));return; }
  fetch(url).then(r=>r.blob()).then(async blob=>{
    const bitmap=await createImageBitmap(blob,{premultiplyAlpha:'none',colorSpaceConversion:'none'});
    let bytes=new Uint8Array(await blob.arrayBuffer());
    if(!(bytes[0]===137 && bytes[1]===80) && !(bytes[0]===255 && bytes[1]===216)) {
      const canvas=new OffscreenCanvas(bitmap.width,bitmap.height);canvas.getContext('2d').drawImage(bitmap,0,0);
      bytes=new Uint8Array(await (await canvas.convertToBlob({type:'image/png'})).arrayBuffer());
    }
    images.set(bitmap,bytes);onLoad?.(bitmap);
  }).catch(error=>onError?.(error));
};
export async function read(input) {
  if(input[0]!==80 || input[1]!==75)throw new Error('This is not a USDZ archive.');
  const warnings=[];const warn=console.warn;
  console.warn=(...args)=>{if(warnings.length<12)warnings.push(args.join(' ').slice(0,250));};
  try {
    const group=await new Promise((resolve,reject)=>new USDLoader().parse(input.buffer,'',resolve,reject));
    group.updateMatrixWorld(true);
    const scene={glbPrimitives:[],gltfMaterials:[],textures:[]};const textureIds=new Map();
    const point=new Vector3(),uv=new Vector2();
    group.traverseVisible(mesh=>{
      if(!mesh.isMesh)return;
      const geometry=mesh.geometry,position=geometry.getAttribute('position');
      if(!position)return;
      if(geometry.getAttribute('color') && warnings.length<12)warnings.push('Per-vertex display colors are not displayed; material colors are used.');
      const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
      const total=geometry.index?.count ?? position.count;
      const groups=geometry.groups.length?geometry.groups:[{start:0,count:total,materialIndex:0}];
      for(let instance=0;instance<(mesh.isInstancedMesh?mesh.count:1);instance++) {
        const matrix=mesh.matrixWorld.clone();
        if(mesh.isInstancedMesh){const placement=new Matrix4();mesh.getMatrixAt(instance,placement);matrix.multiply(placement);}
        for(const part of groups) {
          const material=materials[part.materialIndex] || materials[0];if(!material || material.visible===false)continue;
          let texture=-1;const map=material.map;
          if(map?.image && images.has(map.image)) {
            if(!textureIds.has(map.image)){textureIds.set(map.image,scene.textures.length);scene.textures.push({data:images.get(map.image)});}
            texture=textureIds.get(map.image);map.updateMatrix();
          }
          const start=Math.max(part.start,geometry.drawRange.start),end=Math.min(total,part.start+part.count,geometry.drawRange.start+geometry.drawRange.count);
          if(end<=start)continue;
          if((end-start)%3)throw new Error('Invalid USD triangle indices.');
          const positions=new Float64Array(position.count*3),uvs=new Float32Array(position.count*2);
          const sourceUv=geometry.getAttribute(map?.channel?'uv'+map.channel:'uv');
          for(let i=0;i<position.count;i++) {
            mesh.getVertexPosition(i,point);point.applyMatrix4(matrix);point.toArray(positions,i*3);
            if(sourceUv){uv.fromBufferAttribute(sourceUv,i);if(map)map.transformUv(uv);uv.toArray(uvs,i*2);}
          }
          const indices=new Uint32Array(end-start);
          for(let i=start;i<end;i++)indices[i-start]=geometry.index?geometry.index.getX(i):i;
          if(matrix.determinant()<0)for(let i=0;i<indices.length;i+=3){const n=indices[i+1];indices[i+1]=indices[i+2];indices[i+2]=n;}
          const color=material.color.clone().convertLinearToSRGB();
          const index=scene.gltfMaterials.length;
          scene.gltfMaterials.push({pbrMetallicRoughness:{baseColorFactor:[color.r,color.g,color.b,material.opacity],...(texture>=0?{baseColorTexture:{index:texture}}:{})},doubleSided:material.side===DoubleSide,alphaMode:material.transparent?'BLEND':material.alphaTest>0?'MASK':'OPAQUE',alphaCutoff:material.alphaTest});
          scene.glbPrimitives.push({positions,uvs,indices,materialIndex:index});
        }
      }
    });
    if(!scene.glbPrimitives.length)throw new Error('This USDZ has no supported mesh surfaces.');
    return {scene,notice:'USDZ static preview with transforms, material colors and embedded textures. Animation, lighting, advanced material effects and some USD composition features may differ or be omitted.'+(warnings.length?'\nReader notes: '+[...new Set(warnings)].slice(0,12).join('\n'):'')};
  } finally {console.warn=warn;}
}

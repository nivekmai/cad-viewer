import { USDLoader } from 'three/addons/loaders/USDLoader.js';
import { USDCParser } from 'three/addons/loaders/usd/USDCParser.js';
import { USDComposer } from 'three/addons/loaders/usd/USDComposer.js';
import { BufferAttribute, ImageLoader, Vector2, Vector3, Matrix4, DoubleSide } from 'three';

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
// r187 drops per-vertex primvars:displayColor (it only keeps the first color
// as the material color), so LiDAR scans and other vertex-colored meshes
// render as one flat color. Keep the colors as a geometry attribute, in the
// same expanded order as the positions, so read() can show them as a palette.
// Meshes built through GeomSubsets keep the old behavior.
const buildGeometry=USDComposer.prototype._buildGeometry;
USDComposer.prototype._buildGeometry=function(path,fields,hasSkinning) {
  const geometry=buildGeometry.call(this,path,fields,hasSkinning);
  if(geometry.getAttribute('color'))return geometry;
  const displayColor=fields['primvars:displayColor'];
  const points=fields['points'];
  if(!displayColor || displayColor.length<3 || !points || !points.length)return geometry;
  const soupCount=geometry.getAttribute('position')?.count;
  if(!soupCount)return geometry;
  const vertexCount=points.length/3;
  const faceVertexCounts=fields['faceVertexCounts'];
  const faceVertexIndices=fields['faceVertexIndices'];
  const faceVertices=faceVertexCounts ? faceVertexCounts.reduce((n,c)=>n+c,0) : vertexCount;
  const faceCount=faceVertexCounts ? faceVertexCounts.length : 0;
  const count=displayColor.length/3;
  let interpolation=fields['primvars:displayColor:interpolation'];
  if(!interpolation) {
    if(count===vertexCount)interpolation='vertex';
    else if(count===faceVertices)interpolation='faceVarying';
    else if(faceCount && count===faceCount)interpolation='uniform';
    else if(count===1)interpolation='constant';
    else return geometry;
  }
  if(!['vertex','faceVarying','uniform','constant'].includes(interpolation))return geometry;
  // Triangulation reorders face vertices for non-triangle faces, so only
  // trust the mapping when every face is already a triangle.
  const allTriangles=!faceVertexCounts || faceVertexCounts.every(c=>c===3);
  if(!allTriangles)return geometry;
  const colorIndices=fields['primvars:displayColor:indices'];
  if(colorIndices && colorIndices.length) {
    const want=interpolation==='uniform' ? faceCount : faceVertices;
    if(colorIndices.length!==want)return geometry;
  }
  const colors=new Float32Array(soupCount*3);
  for(let i=0;i<soupCount;i++) {
    let ci;
    if(interpolation==='vertex')ci=colorIndices?.length ? colorIndices[i] : (faceVertexIndices?.length ? faceVertexIndices[i] : i);
    else if(interpolation==='faceVarying')ci=colorIndices?.length ? colorIndices[i] : i;
    else if(interpolation==='uniform')ci=colorIndices?.length ? colorIndices[(i/3)|0] : (i/3)|0;
    else ci=0;
    if(!Number.isInteger(ci) || ci<0 || ci>=count)return geometry;
    colors[i*3]=displayColor[ci*3];colors[i*3+1]=displayColor[ci*3+1];colors[i*3+2]=displayColor[ci*3+2];
  }
  geometry.setAttribute('color',new BufferAttribute(colors,3));
  return geometry;
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
// The cadmesh format has one flat color per batch and no per-vertex color
// channel, so vertex colors are shown as a palette: triangles are grouped
// by their average color (median-cut over a sample, at most 256 colors) and
// each group becomes its own batch. That keeps the format, the native
// renderer and the conversion cache unchanged.
const MAX_VERTEX_COLORS=256;
const PALETTE_SAMPLES=20000;
function linearToSrgb(v){v=Math.min(1,Math.max(0,v));return v<=0.0031308?v*12.92:1.055*Math.pow(v,1/2.4)-0.055;}
function medianCutPalette(samples,maxColors) {
  const n=samples.length/3;
  if(!n)return [];
  const order=new Uint32Array(n);for(let i=0;i<n;i++)order[i]=i;
  const boxes=[{lo:0,hi:n}];
  while(boxes.length<maxColors) {
    let best=-1,bestSpread=0,bestChannel=0;
    for(let b=0;b<boxes.length;b++) {
      const box=boxes[b];if(box.hi-box.lo<2)continue;
      for(let c=0;c<3;c++) {
        let lo=Infinity,hi=-Infinity;
        for(let i=box.lo;i<box.hi;i++){const v=samples[order[i]*3+c];if(v<lo)lo=v;if(v>hi)hi=v;}
        if(hi-lo>bestSpread){bestSpread=hi-lo;best=b;bestChannel=c;}
      }
    }
    if(best<0)break;
    const box=boxes[best];
    const slice=Array.from(order.subarray(box.lo,box.hi));
    slice.sort((a,b)=>samples[a*3+bestChannel]-samples[b*3+bestChannel]);
    order.set(slice,box.lo);
    const mid=box.lo+((box.hi-box.lo)>>1);
    boxes[best]={lo:box.lo,hi:mid};
    boxes.push({lo:mid,hi:box.hi});
  }
  return boxes.map(box=>{
    let r=0,g=0,b=0;const count=box.hi-box.lo;
    for(let i=box.lo;i<box.hi;i++){const s=order[i]*3;r+=samples[s];g+=samples[s+1];b+=samples[s+2];}
    return [r/count,g/count,b/count];
  });
}
function paletteLookup(palette) {
  const lut=new Uint16Array(32*32*32);
  for(let r=0;r<32;r++)for(let g=0;g<32;g++)for(let b=0;b<32;b++) {
    const cr=(r+0.5)/32,cg=(g+0.5)/32,cb=(b+0.5)/32;
    let best=0,bestD=Infinity;
    for(let p=0;p<palette.length;p++){
      const d=(palette[p][0]-cr)**2+(palette[p][1]-cg)**2+(palette[p][2]-cb)**2;
      if(d<bestD){bestD=d;best=p;}
    }
    lut[(r<<10)|(g<<5)|b]=best;
  }
  return lut;
}
export async function read(input) {
  if(input[0]!==80 || input[1]!==75)throw new Error('This is not a USDZ archive.');
  const warnings=[];const warn=console.warn;
  console.warn=(...args)=>{if(warnings.length<12)warnings.push(args.join(' ').slice(0,250));};
  try {
    const group=await new Promise((resolve,reject)=>new USDLoader().parse(input.buffer,'',resolve,reject));
    group.updateMatrixWorld(true);
    const scene={glbPrimitives:[],gltfMaterials:[],textures:[]};const textureIds=new Map();
    const point=new Vector3(),uv=new Vector2();
    let vertexColorsShown=false;
    group.traverseVisible(mesh=>{
      if(!mesh.isMesh)return;
      const geometry=mesh.geometry,position=geometry.getAttribute('position');
      if(!position)return;
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
          const soupIndex=i=>geometry.index?geometry.index.getX(i):i;
          const baseMaterial=()=>{
            const color=material.color.clone().convertLinearToSRGB();
            return {pbrMetallicRoughness:{baseColorFactor:[color.r,color.g,color.b,material.opacity],...(texture>=0?{baseColorTexture:{index:texture}}:{})},doubleSided:material.side===DoubleSide,alphaMode:material.transparent?'BLEND':material.alphaTest>0?'MASK':'OPAQUE',alphaCutoff:material.alphaTest};
          };
          const flipIfNeeded=indices=>{if(matrix.determinant()<0)for(let i=0;i<indices.length;i+=3){const n=indices[i+1];indices[i+1]=indices[i+2];indices[i+2]=n;}};
          const colorAttr=geometry.getAttribute('color');
          if(colorAttr && texture<0) {
            // Split this part's triangles into palette buckets, one batch
            // each, sharing the positions/uvs arrays.
            const triCount=(end-start)/3;
            const triAverage=(t,out)=>{
              let r=0,g=0,b=0;
              for(let v=0;v<3;v++){const vi=soupIndex(start+t*3+v);r+=colorAttr.getX(vi);g+=colorAttr.getY(vi);b+=colorAttr.getZ(vi);}
              out[0]=Math.min(1,Math.max(0,r/3));out[1]=Math.min(1,Math.max(0,g/3));out[2]=Math.min(1,Math.max(0,b/3));
            };
            const stride=Math.max(1,Math.ceil(triCount/PALETTE_SAMPLES));
            const sampleCount=Math.ceil(triCount/stride);
            const samples=new Float32Array(sampleCount*3);
            const avg=[0,0,0];
            for(let s=0,t=0;s<sampleCount;s++,t+=stride){triAverage(t,avg);samples[s*3]=avg[0];samples[s*3+1]=avg[1];samples[s*3+2]=avg[2];}
            const palette=medianCutPalette(samples,MAX_VERTEX_COLORS);
            if(!palette.length)throw new Error('Invalid USD vertex colors.');
            const lut=paletteLookup(palette);
            const bucketOf=new Uint16Array(triCount),counts=new Uint32Array(palette.length);
            for(let t=0;t<triCount;t++) {
              triAverage(t,avg);
              const key=((Math.min(31,(avg[0]*32)|0))<<10)|((Math.min(31,(avg[1]*32)|0))<<5)|Math.min(31,(avg[2]*32)|0);
              const b=lut[key];bucketOf[t]=b;counts[b]++;
            }
            const bucketIndices=new Array(palette.length),cursors=new Uint32Array(palette.length);
            for(let p=0;p<palette.length;p++)if(counts[p])bucketIndices[p]=new Uint32Array(counts[p]*3);
            for(let t=0;t<triCount;t++) {
              const b=bucketOf[t],dst=bucketIndices[b],o=cursors[b]*3;
              for(let v=0;v<3;v++)dst[o+v]=soupIndex(start+t*3+v);
              cursors[b]++;
            }
            for(let p=0;p<palette.length;p++) {
              if(!counts[p])continue;
              const indices=bucketIndices[p];
              flipIfNeeded(indices);
              const srgb=palette[p].map(linearToSrgb);
              const mat=baseMaterial();
              mat.pbrMetallicRoughness.baseColorFactor=[srgb[0],srgb[1],srgb[2],material.opacity];
              const index=scene.gltfMaterials.length;
              scene.gltfMaterials.push(mat);
              scene.glbPrimitives.push({positions,uvs,indices,materialIndex:index});
            }
            vertexColorsShown=true;
            continue;
          }
          const indices=new Uint32Array(end-start);
          for(let i=start;i<end;i++)indices[i-start]=soupIndex(i);
          flipIfNeeded(indices);
          const index=scene.gltfMaterials.length;
          scene.gltfMaterials.push(baseMaterial());
          scene.glbPrimitives.push({positions,uvs,indices,materialIndex:index});
        }
      }
    });
    if(!scene.glbPrimitives.length)throw new Error('This USDZ has no supported mesh surfaces.');
    let notice='USDZ static preview with transforms, material colors and embedded textures. Animation, lighting, advanced material effects and some USD composition features may differ or be omitted.';
    if(vertexColorsShown)notice+=' Per-vertex colors are shown as a palette of up to 256 colors; fine color detail may differ from the original.';
    return {scene,notice:notice+(warnings.length?'\nReader notes: '+[...new Set(warnings)].slice(0,12).join('\n'):'')};
  } finally {console.warn=warn;}
}

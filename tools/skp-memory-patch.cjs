const crypto=require('node:crypto');
// OpenSKP 1.5.0's dense edge-flag table allocates through every unused ID
// between the first and last edge. SketchUp IDs can have very large gaps.
// Keep exactly the same flag semantics with storage proportional to live edges.
const replacement=`var EdgeFlagStore = class {
  constructor() { this.pages = new Map(); this.count = 0; }
  get size() { return this.count; }
  set(id, flags) {
    const key=Math.floor(id/256),slot=id-key*256;
    let page=this.pages.get(key);
    if(!page) { page=new Uint16Array(256); this.pages.set(key,page); }
    if(page[slot]===0)this.count++;
    page[slot]=(flags & 255)+1;
  }
  get(id) {
    const key=Math.floor(id/256),value=this.pages.get(key)?.[id-key*256] || 0;
    return value===0 ? undefined : value-1;
  }
  has(id) { return this.get(id)!==undefined; }
};

`;
function patch(source) {
  const start=source.indexOf('var EdgeFlagStore = class {');
  const end=source.indexOf('// src/vertex-store.ts',start);
  if(start<0 || end<0)throw Error('OpenSKP edge-flag patch target missing; review dependency update.');
  const original=source.slice(start,end);
  const hash=crypto.createHash('sha256').update(original).digest('hex');
  if(hash!=='37526fa28bebea0aa578b4e12fd6a547bbc672ff78f1b315ce80e79b2fc9d0d6')throw Error('OpenSKP edge-flag implementation changed; review memory patch.');
  return source.slice(0,start)+replacement+source.slice(end);
}
module.exports={patch,replacement};

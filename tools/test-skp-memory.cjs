const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {patch,replacement}=require('./skp-memory-patch.cjs');
const source=fs.readFileSync(require.resolve('openskp'),'utf8');
const start=source.indexOf('var EdgeFlagStore = class {'),end=source.indexOf('// src/vertex-store.ts',start);
const Original=vm.runInNewContext(source.slice(start,end)+'EdgeFlagStore;');
const Fixed=vm.runInNewContext(replacement+'EdgeFlagStore;');
const before=new Original(),after=new Fixed();
for(let i=0;i<20000;i++) {
 const id=(i*7919)%10007,flags=i*127;
 before.set(id,flags);after.set(id,flags);
 assert.equal(before.size,after.size);assert.equal(before.get(id),after.get(id));
}
for(let id=-2;id<10010;id++){assert.equal(before.has(id),after.has(id));assert.equal(before.get(id),after.get(id));}
const sparse=new Fixed();
for(const id of [0xffffffff,0,47000000,2])sparse.set(id,256);
assert.equal(sparse.size,4);assert.equal(sparse.get(0xffffffff),0);assert.equal(sparse.get(3),undefined);
assert.ok(patch(source).includes(replacement));
assert.throws(()=>patch(source.replace('this.highSlot = 0;','this.highSlot = 1;')),/changed/);
console.log('PASS sparse SketchUp flags: equivalent values, missing/zero flags, descending and widely spaced IDs; patch guard');

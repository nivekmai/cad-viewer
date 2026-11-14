var UsdImport=(()=>{var Pi=Object.defineProperty;var fa=Object.getOwnPropertyDescriptor;var da=Object.getOwnPropertyNames;var pa=Object.prototype.hasOwnProperty;var ma=(h,t)=>{for(var e in t)Pi(h,e,{get:t[e],enumerable:!0})},ga=(h,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of da(t))!pa.call(h,i)&&i!==e&&Pi(h,i,{get:()=>t[i],enumerable:!(n=fa(t,i))||n.enumerable});return h};var _a=h=>ga(Pi({},"__esModule",{value:!0}),h);var Ih={};ma(Ih,{read:()=>Ph});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var Rr=1;var Pr=3,As=0,Ir=1,ws=2;var Lr=1;var Dr=100;var Nr=204,Ur=205;var es=0,ns=1,is=2,ai=3,ss=4,rs=5,as=6,os=7,Ts=0,Fr=1,Or=2;var Es=1,Cs=2,Rs=3,Ps=4,Is=5,Ls=6,Ds=7,ls="attached",Br="detached",Ns=300;var zr=302;var Ye=1e3,Se=1001,dn=1002,cs=1003;var kr=1006;var Vr=1008;var Us=1009;var Fs=1015;var Os=1023;var pn=2300,oi=2301,ii=2302,hs=2303,us=2400,fs=2401,ds=2402,Gr=2500;var Hr=0;var Bt="",ft="srgb",_t="srgb-linear",ps="linear",si="srgb";var ri=7680;var Wr=519;var Xr=35044;var fe=2e3,mn=2001;function xa(h){for(let t=h.length-1;t>=0;--t)if(h[t]>=65535)return!0;return!1}function va(h){return ArrayBuffer.isView(h)&&!(h instanceof DataView)}function li(h){return document.createElementNS("http://www.w3.org/1999/xhtml",h)}var Ks={},ci=null;function qr(h){let t=h[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=h[1];e&&e.isStackTrace?h[0]+=" "+e.getLocation():h[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return h}function J(...h){h=qr(h);let t="THREE."+h.shift();if(ci)ci("warn",t,...h);else{let e=h[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...h)}}function Q(...h){h=qr(h);let t="THREE."+h.shift();if(ci)ci("error",t,...h);else{let e=h[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...h)}}function We(...h){let t=h.join(" ");t in Ks||(Ks[t]=!0,J(...h))}var ya={[es]:es,[is]:as,[ss]:ss,[ai]:rs,[ns]:ns,[as]:is,[os]:os,[rs]:ai},de=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,t);t.target=null}}},pt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Ii=Math.PI/180,hi=180/Math.PI;function Re(){let h=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(pt[h&255]+pt[h>>8&255]+pt[h>>16&255]+pt[h>>24&255]+"-"+pt[t&255]+pt[t>>8&255]+"-"+pt[t>>16&15|64]+pt[t>>24&255]+"-"+pt[e&63|128]+pt[e>>8&255]+"-"+pt[e>>16&255]+pt[e>>24&255]+pt[n&255]+pt[n>>8&255]+pt[n>>16&255]+pt[n>>24&255]).toLowerCase()}function O(h,t,e){return Math.max(t,Math.min(e,h))}function Sa(h,t){return(h%t+t)%t}function Li(h,t,e){return(1-e)*h+e*t}function Bs(h){switch(h.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Ma(h,t){if(t.constructor===Float32Array)return h;let e=Bs(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(h/e,-1)}function ba(h,t){if(t.constructor===Float32Array)return h;let e=Bs(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(h*e)}var V=class{static{this.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=O(this.x,t.x,e.x),this.y=O(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=O(this.x,t,e),this.y=O(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(O(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(O(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,r=this.y-t.y;return this.x=s*n-r*i+t.x,this.y=s*i+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},yt=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,r,a){let o=n[i+0],c=n[i+1],u=n[i+2],l=n[i+3],f=s[r+0],d=s[r+1],p=s[r+2],m=s[r+3];if(l!==m||o!==f||c!==d||u!==p){let g=o*f+c*d+u*p+l*m;g<0&&(f=-f,d=-d,p=-p,m=-m,g=-g);let v=1-a;if(g<.9995){let y=Math.acos(g),_=Math.sin(y);v=Math.sin(v*y)/_,a=Math.sin(a*y)/_,o=o*v+f*a,c=c*v+d*a,u=u*v+p*a,l=l*v+m*a}else{o=o*v+f*a,c=c*v+d*a,u=u*v+p*a,l=l*v+m*a;let y=1/Math.sqrt(o*o+c*c+u*u+l*l);o*=y,c*=y,u*=y,l*=y}}t[e]=o,t[e+1]=c,t[e+2]=u,t[e+3]=l}static multiplyQuaternionsFlat(t,e,n,i,s,r){let a=n[i],o=n[i+1],c=n[i+2],u=n[i+3],l=s[r],f=s[r+1],d=s[r+2],p=s[r+3];return t[e]=a*p+u*l+o*d-c*f,t[e+1]=o*p+u*f+c*l-a*d,t[e+2]=c*p+u*d+a*f-o*l,t[e+3]=u*p-a*l-o*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,s=t._z,r=t._order,a=Math.cos,o=Math.sin,c=a(n/2),u=a(i/2),l=a(s/2),f=o(n/2),d=o(i/2),p=o(s/2);switch(r){case"XYZ":this._x=f*u*l+c*d*p,this._y=c*d*l-f*u*p,this._z=c*u*p+f*d*l,this._w=c*u*l-f*d*p;break;case"YXZ":this._x=f*u*l+c*d*p,this._y=c*d*l-f*u*p,this._z=c*u*p-f*d*l,this._w=c*u*l+f*d*p;break;case"ZXY":this._x=f*u*l-c*d*p,this._y=c*d*l+f*u*p,this._z=c*u*p+f*d*l,this._w=c*u*l-f*d*p;break;case"ZYX":this._x=f*u*l-c*d*p,this._y=c*d*l+f*u*p,this._z=c*u*p-f*d*l,this._w=c*u*l+f*d*p;break;case"YZX":this._x=f*u*l+c*d*p,this._y=c*d*l+f*u*p,this._z=c*u*p-f*d*l,this._w=c*u*l-f*d*p;break;case"XZY":this._x=f*u*l-c*d*p,this._y=c*d*l-f*u*p,this._z=c*u*p+f*d*l,this._w=c*u*l+f*d*p;break;default:J("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],u=e[6],l=e[10],f=n+a+l;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-o)*d,this._y=(s-c)*d,this._z=(r-i)*d}else if(n>a&&n>l){let d=2*Math.sqrt(1+n-a-l);this._w=(u-o)/d,this._x=.25*d,this._y=(i+r)/d,this._z=(s+c)/d}else if(a>l){let d=2*Math.sqrt(1+a-n-l);this._w=(s-c)/d,this._x=(i+r)/d,this._y=.25*d,this._z=(o+u)/d}else{let d=2*Math.sqrt(1+l-n-a);this._w=(r-i)/d,this._x=(s+c)/d,this._y=(o+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(O(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,s=t._z,r=t._w,a=e._x,o=e._y,c=e._z,u=e._w;return this._x=n*u+r*a+i*c-s*o,this._y=i*u+r*o+s*a-n*c,this._z=s*u+r*c+n*o-i*a,this._w=r*u-n*a-i*o-s*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,s=t._z,r=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,s=-s,r=-r,a=-a);let o=1-e;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);o=Math.sin(o*c)/u,e=Math.sin(e*c)/u,this._x=this._x*o+n*e,this._y=this._y*o+i*e,this._z=this._z*o+s*e,this._w=this._w*o+r*e,this._onChangeCallback()}else this._x=this._x*o+n*e,this._y=this._y*o+i*e,this._z=this._z*o+s*e,this._w=this._w*o+r*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},M=class{static{this.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(js.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(js.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=t.elements,r=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,s=t.x,r=t.y,a=t.z,o=t.w,c=2*(r*i-a*n),u=2*(a*e-s*i),l=2*(s*n-r*e);return this.x=e+o*c+r*l-a*u,this.y=n+o*u+a*c-s*l,this.z=i+o*l+s*u-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=O(this.x,t.x,e.x),this.y=O(this.y,t.y,e.y),this.z=O(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=O(this.x,t,e),this.y=O(this.y,t,e),this.z=O(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(O(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,s=t.z,r=e.x,a=e.y,o=e.z;return this.x=i*o-s*a,this.y=s*r-n*o,this.z=n*a-i*r,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Di.copy(this).projectOnVector(t),this.sub(Di)}reflect(t){return this.sub(Di.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(O(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Di=new M,js=new yt,F=class{static{this.prototype.isMatrix3=!0}constructor(t,e,n,i,s,r,a,o,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,r,a,o,c)}set(t,e,n,i,s,r,a,o,c){let u=this.elements;return u[0]=t,u[1]=i,u[2]=a,u[3]=e,u[4]=s,u[5]=o,u[6]=n,u[7]=r,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,r=n[0],a=n[3],o=n[6],c=n[1],u=n[4],l=n[7],f=n[2],d=n[5],p=n[8],m=i[0],g=i[3],v=i[6],y=i[1],_=i[4],x=i[7],S=i[2],b=i[5],w=i[8];return s[0]=r*m+a*y+o*S,s[3]=r*g+a*_+o*b,s[6]=r*v+a*x+o*w,s[1]=c*m+u*y+l*S,s[4]=c*g+u*_+l*b,s[7]=c*v+u*x+l*w,s[2]=f*m+d*y+p*S,s[5]=f*g+d*_+p*b,s[8]=f*v+d*x+p*w,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],r=t[4],a=t[5],o=t[6],c=t[7],u=t[8];return e*r*u-e*a*c-n*s*u+n*a*o+i*s*c-i*r*o}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],r=t[4],a=t[5],o=t[6],c=t[7],u=t[8],l=u*r-a*c,f=a*o-u*s,d=c*s-r*o,p=e*l+n*f+i*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return t[0]=l*m,t[1]=(i*c-u*n)*m,t[2]=(a*n-i*r)*m,t[3]=f*m,t[4]=(u*e-i*o)*m,t[5]=(i*s-a*e)*m,t[6]=d*m,t[7]=(n*o-c*e)*m,t[8]=(r*e-n*s)*m,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,r,a){let o=Math.cos(s),c=Math.sin(s);return this.set(n*o,n*c,-n*(o*r+c*a)+r+t,-i*c,i*o,-i*(-c*r+o*a)+a+e,0,0,1),this}scale(t,e){return We("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ni.makeScale(t,e)),this}rotate(t){return We("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ni.makeRotation(-t)),this}translate(t,e){return We("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ni.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ni=new F,Qs=new F().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tr=new F().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Aa(){let h={enabled:!0,workingColorSpace:_t,spaces:{},convert:function(i,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===si&&(i.r=Qt(i.r),i.g=Qt(i.g),i.b=Qt(i.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===si&&(i.r=Xe(i.r),i.g=Xe(i.g),i.b=Xe(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Bt?ps:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,r){return i.copy(this.spaces[r].fromXYZ).multiply(this.spaces[s].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return h.define({[_t]:{primaries:t,whitePoint:n,transfer:ps,toXYZ:Qs,fromXYZ:tr,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ft},outputColorSpaceConfig:{drawingBufferColorSpace:ft}},[ft]:{primaries:t,whitePoint:n,transfer:si,toXYZ:Qs,fromXYZ:tr,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ft}}}),h}var Ct=Aa();function Qt(h){return h<.04045?h*.0773993808:Math.pow(h*.9478672986+.0521327014,2.4)}function Xe(h){return h<.0031308?h*12.92:1.055*Math.pow(h,.41666)-.055}var De,ui=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{De===void 0&&(De=li("canvas")),De.width=t.width,De.height=t.height;let i=De.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=De}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=li("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Qt(s[r]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Qt(e[n]/255)*255):e[n]=Qt(e[n]);return{data:e,width:t.width,height:t.height}}else return J("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},wa=0,fi=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:wa++}),this.uuid=Re(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,a=i.length;r<a;r++)i[r].isDataTexture?s.push(Ui(i[r].image)):s.push(Ui(i[r]))}else s=Ui(i);n.url=s}return e||(t.images[this.uuid]=n),n}};function Ui(h){return typeof HTMLImageElement<"u"&&h instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&h instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&h instanceof ImageBitmap?ui.getDataURL(h):h.data?{data:Array.from(h.data),width:h.width,height:h.height,type:h.data.constructor.name}:(J("Texture: Unable to serialize Texture."),{})}var Ta=0,Fi=new M,te=class h extends de{constructor(t=h.DEFAULT_IMAGE,e=h.DEFAULT_MAPPING,n=Se,i=Se,s=kr,r=Vr,a=Os,o=Us,c=h.DEFAULT_ANISOTROPY,u=Bt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ta++}),this.uuid=Re(),this.name="",this.source=new fi(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=o,this.offset=new V(0,0),this.repeat=new V(1,1),this.center=new V(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new F,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Fi).x}get height(){return this.source.getSize(Fi).y}get depth(){return this.source.getSize(Fi).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){J(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){J(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ns)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ye:t.x=t.x-Math.floor(t.x);break;case Se:t.x=t.x<0?0:1;break;case dn:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ye:t.y=t.y-Math.floor(t.y);break;case Se:t.y=t.y<0?0:1;break;case dn:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};te.DEFAULT_IMAGE=null;te.DEFAULT_MAPPING=Ns;te.DEFAULT_ANISOTROPY=1;var Rt=class{static{this.prototype.isVector4=!0}constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*e+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*e+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*e+r[7]*n+r[11]*i+r[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s,o=t.elements,c=o[0],u=o[4],l=o[8],f=o[1],d=o[5],p=o[9],m=o[2],g=o[6],v=o[10];if(Math.abs(u-f)<.01&&Math.abs(l-m)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+f)<.1&&Math.abs(l+m)<.1&&Math.abs(p+g)<.1&&Math.abs(c+d+v-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(c+1)/2,x=(d+1)/2,S=(v+1)/2,b=(u+f)/4,w=(l+m)/4,T=(p+g)/4;return _>x&&_>S?_<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(_),i=b/n,s=w/n):x>S?x<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(x),n=b/i,s=T/i):S<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(S),n=w/s,i=T/s),this.set(n,i,s,e),this}let y=Math.sqrt((g-p)*(g-p)+(l-m)*(l-m)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(g-p)/y,this.y=(l-m)/y,this.z=(f-u)/y,this.w=Math.acos((c+d+v-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=O(this.x,t.x,e.x),this.y=O(this.y,t.y,e.y),this.z=O(this.z,t.z,e.z),this.w=O(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=O(this.x,t,e),this.y=O(this.y,t,e),this.z=O(this.z,t,e),this.w=O(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(O(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};var z=class h{static{this.prototype.isMatrix4=!0}constructor(t,e,n,i,s,r,a,o,c,u,l,f,d,p,m,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,r,a,o,c,u,l,f,d,p,m,g)}set(t,e,n,i,s,r,a,o,c,u,l,f,d,p,m,g){let v=this.elements;return v[0]=t,v[4]=e,v[8]=n,v[12]=i,v[1]=s,v[5]=r,v[9]=a,v[13]=o,v[2]=c,v[6]=u,v[10]=l,v[14]=f,v[3]=d,v[7]=p,v[11]=m,v[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new h().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/Ne.setFromMatrixColumn(t,0).length(),s=1/Ne.setFromMatrixColumn(t,1).length(),r=1/Ne.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,s=t.z,r=Math.cos(n),a=Math.sin(n),o=Math.cos(i),c=Math.sin(i),u=Math.cos(s),l=Math.sin(s);if(t.order==="XYZ"){let f=r*u,d=r*l,p=a*u,m=a*l;e[0]=o*u,e[4]=-o*l,e[8]=c,e[1]=d+p*c,e[5]=f-m*c,e[9]=-a*o,e[2]=m-f*c,e[6]=p+d*c,e[10]=r*o}else if(t.order==="YXZ"){let f=o*u,d=o*l,p=c*u,m=c*l;e[0]=f+m*a,e[4]=p*a-d,e[8]=r*c,e[1]=r*l,e[5]=r*u,e[9]=-a,e[2]=d*a-p,e[6]=m+f*a,e[10]=r*o}else if(t.order==="ZXY"){let f=o*u,d=o*l,p=c*u,m=c*l;e[0]=f-m*a,e[4]=-r*l,e[8]=p+d*a,e[1]=d+p*a,e[5]=r*u,e[9]=m-f*a,e[2]=-r*c,e[6]=a,e[10]=r*o}else if(t.order==="ZYX"){let f=r*u,d=r*l,p=a*u,m=a*l;e[0]=o*u,e[4]=p*c-d,e[8]=f*c+m,e[1]=o*l,e[5]=m*c+f,e[9]=d*c-p,e[2]=-c,e[6]=a*o,e[10]=r*o}else if(t.order==="YZX"){let f=r*o,d=r*c,p=a*o,m=a*c;e[0]=o*u,e[4]=m-f*l,e[8]=p*l+d,e[1]=l,e[5]=r*u,e[9]=-a*u,e[2]=-c*u,e[6]=d*l+p,e[10]=f-m*l}else if(t.order==="XZY"){let f=r*o,d=r*c,p=a*o,m=a*c;e[0]=o*u,e[4]=-l,e[8]=c*u,e[1]=f*l+m,e[5]=r*u,e[9]=d*l-p,e[2]=p*l-d,e[6]=a*u,e[10]=m*l+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ea,t,Ca)}lookAt(t,e,n){let i=this.elements;return bt.subVectors(t,e),bt.lengthSq()===0&&(bt.z=1),bt.normalize(),re.crossVectors(n,bt),re.lengthSq()===0&&(Math.abs(n.z)===1?bt.x+=1e-4:bt.z+=1e-4,bt.normalize(),re.crossVectors(n,bt)),re.normalize(),Un.crossVectors(bt,re),i[0]=re.x,i[4]=Un.x,i[8]=bt.x,i[1]=re.y,i[5]=Un.y,i[9]=bt.y,i[2]=re.z,i[6]=Un.z,i[10]=bt.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,r=n[0],a=n[4],o=n[8],c=n[12],u=n[1],l=n[5],f=n[9],d=n[13],p=n[2],m=n[6],g=n[10],v=n[14],y=n[3],_=n[7],x=n[11],S=n[15],b=i[0],w=i[4],T=i[8],A=i[12],E=i[1],P=i[5],C=i[9],D=i[13],N=i[2],L=i[6],k=i[10],$=i[14],nt=i[3],G=i[7],Y=i[11],K=i[15];return s[0]=r*b+a*E+o*N+c*nt,s[4]=r*w+a*P+o*L+c*G,s[8]=r*T+a*C+o*k+c*Y,s[12]=r*A+a*D+o*$+c*K,s[1]=u*b+l*E+f*N+d*nt,s[5]=u*w+l*P+f*L+d*G,s[9]=u*T+l*C+f*k+d*Y,s[13]=u*A+l*D+f*$+d*K,s[2]=p*b+m*E+g*N+v*nt,s[6]=p*w+m*P+g*L+v*G,s[10]=p*T+m*C+g*k+v*Y,s[14]=p*A+m*D+g*$+v*K,s[3]=y*b+_*E+x*N+S*nt,s[7]=y*w+_*P+x*L+S*G,s[11]=y*T+_*C+x*k+S*Y,s[15]=y*A+_*D+x*$+S*K,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],r=t[1],a=t[5],o=t[9],c=t[13],u=t[2],l=t[6],f=t[10],d=t[14],p=t[3],m=t[7],g=t[11],v=t[15],y=o*d-c*f,_=a*d-c*l,x=a*f-o*l,S=r*d-c*u,b=r*f-o*u,w=r*l-a*u;return e*(m*y-g*_+v*x)-n*(p*y-g*S+v*b)+i*(p*_-m*S+v*w)-s*(p*x-m*b+g*w)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],s=t[1],r=t[5],a=t[9],o=t[2],c=t[6],u=t[10];return e*(r*u-a*c)-n*(s*u-a*o)+i*(s*c-r*o)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],r=t[4],a=t[5],o=t[6],c=t[7],u=t[8],l=t[9],f=t[10],d=t[11],p=t[12],m=t[13],g=t[14],v=t[15],y=e*a-n*r,_=e*o-i*r,x=e*c-s*r,S=n*o-i*a,b=n*c-s*a,w=i*c-s*o,T=u*m-l*p,A=u*g-f*p,E=u*v-d*p,P=l*g-f*m,C=l*v-d*m,D=f*v-d*g,N=y*D-_*C+x*P+S*E-b*A+w*T;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let L=1/N;return t[0]=(a*D-o*C+c*P)*L,t[1]=(i*C-n*D-s*P)*L,t[2]=(m*w-g*b+v*S)*L,t[3]=(f*b-l*w-d*S)*L,t[4]=(o*E-r*D-c*A)*L,t[5]=(e*D-i*E+s*A)*L,t[6]=(g*x-p*w-v*_)*L,t[7]=(u*w-f*x+d*_)*L,t[8]=(r*C-a*E+c*T)*L,t[9]=(n*E-e*C-s*T)*L,t[10]=(p*b-m*x+v*y)*L,t[11]=(l*x-u*b-d*y)*L,t[12]=(a*A-r*P-o*T)*L,t[13]=(e*P-n*A+i*T)*L,t[14]=(m*_-p*S-g*y)*L,t[15]=(u*S-l*_+f*y)*L,this}scale(t){let e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),s=1-n,r=t.x,a=t.y,o=t.z,c=s*r,u=s*a;return this.set(c*r+n,c*a-i*o,c*o+i*a,0,c*a+i*o,u*a+n,u*o-i*r,0,c*o-i*a,u*o+i*r,s*o*o+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,r){return this.set(1,n,s,0,t,1,r,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,s=e._x,r=e._y,a=e._z,o=e._w,c=s+s,u=r+r,l=a+a,f=s*c,d=s*u,p=s*l,m=r*u,g=r*l,v=a*l,y=o*c,_=o*u,x=o*l,S=n.x,b=n.y,w=n.z;return i[0]=(1-(m+v))*S,i[1]=(d+x)*S,i[2]=(p-_)*S,i[3]=0,i[4]=(d-x)*b,i[5]=(1-(f+v))*b,i[6]=(g+y)*b,i[7]=0,i[8]=(p+_)*w,i[9]=(g-y)*w,i[10]=(1-(f+m))*w,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),e.identity(),this;let r=Ne.set(i[0],i[1],i[2]).length(),a=Ne.set(i[4],i[5],i[6]).length(),o=Ne.set(i[8],i[9],i[10]).length();s<0&&(r=-r),Dt.copy(this);let c=1/r,u=1/a,l=1/o;return Dt.elements[0]*=c,Dt.elements[1]*=c,Dt.elements[2]*=c,Dt.elements[4]*=u,Dt.elements[5]*=u,Dt.elements[6]*=u,Dt.elements[8]*=l,Dt.elements[9]*=l,Dt.elements[10]*=l,e.setFromRotationMatrix(Dt),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,i,s,r,a=fe,o=!1){let c=this.elements,u=2*s/(e-t),l=2*s/(n-i),f=(e+t)/(e-t),d=(n+i)/(n-i),p,m;if(o)p=s/(r-s),m=r*s/(r-s);else if(a===fe)p=-(r+s)/(r-s),m=-2*r*s/(r-s);else if(a===mn)p=-r/(r-s),m=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=l,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,s,r,a=fe,o=!1){let c=this.elements,u=2/(e-t),l=2/(n-i),f=-(e+t)/(e-t),d=-(n+i)/(n-i),p,m;if(o)p=1/(r-s),m=r/(r-s);else if(a===fe)p=-2/(r-s),m=-(r+s)/(r-s);else if(a===mn)p=-1/(r-s),m=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=l,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Ne=new M,Dt=new z,Ea=new M(0,0,0),Ca=new M(1,1,1),re=new M,Un=new M,bt=new M,er=new z,nr=new yt,Wt=class h{constructor(t=0,e=0,n=0,i=h.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,s=i[0],r=i[4],a=i[8],o=i[1],c=i[5],u=i[9],l=i[2],f=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(O(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-O(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(o,c)):(this._y=Math.atan2(-l,s),this._z=0);break;case"ZXY":this._x=Math.asin(O(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-l,d),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(o,s));break;case"ZYX":this._y=Math.asin(-O(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(o,s)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(O(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-l,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-O(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:J("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return er.makeRotationFromQuaternion(t),this.setFromRotationMatrix(er,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return nr.setFromEuler(this),this.setFromQuaternion(nr,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Wt.DEFAULT_ORDER="XYZ";var di=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Ra=0,ir=new M,Ue=new yt,Yt=new z,Fn=new M,an=new M,Pa=new M,Ia=new yt,sr=new M(1,0,0),rr=new M(0,1,0),ar=new M(0,0,1),or={type:"added"},La={type:"removed"},Fe={type:"childadded",child:null},Oi={type:"childremoved",child:null},rt=class h extends de{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ra++}),this.uuid=Re(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=h.DEFAULT_UP.clone();let t=new M,e=new Wt,n=new yt,i=new M(1,1,1);function s(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new z},normalMatrix:{value:new F}}),this.matrix=new z,this.matrixWorld=new z,this.matrixAutoUpdate=h.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=h.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new di,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ue.setFromAxisAngle(t,e),this.quaternion.multiply(Ue),this}rotateOnWorldAxis(t,e){return Ue.setFromAxisAngle(t,e),this.quaternion.premultiply(Ue),this}rotateX(t){return this.rotateOnAxis(sr,t)}rotateY(t){return this.rotateOnAxis(rr,t)}rotateZ(t){return this.rotateOnAxis(ar,t)}translateOnAxis(t,e){return ir.copy(t).applyQuaternion(this.quaternion),this.position.add(ir.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(sr,t)}translateY(t){return this.translateOnAxis(rr,t)}translateZ(t){return this.translateOnAxis(ar,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Yt.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Fn.copy(t):Fn.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),an.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yt.lookAt(an,Fn,this.up):Yt.lookAt(Fn,an,this.up),this.quaternion.setFromRotationMatrix(Yt),i&&(Yt.extractRotation(i.matrixWorld),Ue.setFromRotationMatrix(Yt),this.quaternion.premultiply(Ue.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Q("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(or),Fe.child=t,this.dispatchEvent(Fe),Fe.child=null):Q("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(La),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Yt.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Yt.multiply(t.parent.matrixWorld)),t.applyMatrix4(Yt),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(or),Fe.child=t,this.dispatchEvent(Fe),Fe.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(an,t,Pa),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(an,Ia,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,s=this.matrix.elements;s[12]+=e-s[0]*e-s[4]*n-s[8]*i,s[13]+=n-s[1]*e-s[5]*n-s[9]*i,s[14]+=i-s[2]*e-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,o){return a[o.uuid]===void 0&&(a[o.uuid]=o.toJSON(t)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let o=a.shapes;if(Array.isArray(o))for(let c=0,u=o.length;c<u;c++){let l=o[c];s(t.shapes,l)}else s(t.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let o=0,c=this.material.length;o<c;o++)a.push(s(t.materials,this.material[o]));i.material=a}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let o=this.animations[a];i.animations.push(s(t.animations,o))}}if(e){let a=r(t.geometries),o=r(t.materials),c=r(t.textures),u=r(t.images),l=r(t.shapes),f=r(t.skeletons),d=r(t.animations),p=r(t.nodes);a.length>0&&(n.geometries=a),o.length>0&&(n.materials=o),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),l.length>0&&(n.shapes=l),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=i,n;function r(a){let o=[];for(let c in a){let u=a[c];delete u.metadata,o.push(u)}return o}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};rt.DEFAULT_UP=new M(0,1,0);rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ze=class extends rt{constructor(){super(),this.isGroup=!0,this.type="Group"}};var Yr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ae={h:0,s:0,l:0},On={h:0,s:0,l:0};function Bi(h,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?h+(t-h)*6*e:e<1/2?t:e<2/3?h+(t-h)*6*(2/3-e):h}var W=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ft){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ct.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Ct.workingColorSpace){return this.r=t,this.g=e,this.b=n,Ct.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Ct.workingColorSpace){if(t=Sa(t,1),e=O(e,0,1),n=O(n,0,1),e===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+e):n+e-n*e,r=2*n-s;this.r=Bi(r,s,t+1/3),this.g=Bi(r,s,t),this.b=Bi(r,s,t-1/3)}return Ct.colorSpaceToWorking(this,i),this}setStyle(t,e=ft){function n(s){s!==void 0&&parseFloat(s)<1&&J("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseFloat(s[1]))/100,Math.min(100,parseFloat(s[2]))/100,Math.min(100,parseFloat(s[3]))/100,e);break;case"hsl":case"hsla":if(s=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:J("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(s,16),e);J("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ft){let n=Yr[t.toLowerCase()];return n!==void 0?this.setHex(n,e):J("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Qt(t.r),this.g=Qt(t.g),this.b=Qt(t.b),this}copyLinearToSRGB(t){return this.r=Xe(t.r),this.g=Xe(t.g),this.b=Xe(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ft){return Ct.workingToColorSpace(mt.copy(this),t),Math.round(O(mt.r*255,0,255))*65536+Math.round(O(mt.g*255,0,255))*256+Math.round(O(mt.b*255,0,255))}getHexString(t=ft){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Ct.workingColorSpace){Ct.workingToColorSpace(mt.copy(this),e);let n=mt.r,i=mt.g,s=mt.b,r=Math.max(n,i,s),a=Math.min(n,i,s),o,c,u=(a+r)/2;if(a===r)o=0,c=0;else{let l=r-a;switch(c=u<=.5?l/(r+a):l/(2-r-a),r){case n:o=(i-s)/l+(i<s?6:0);break;case i:o=(s-n)/l+2;break;case s:o=(n-i)/l+4;break}o/=6}return t.h=o,t.s=c,t.l=u,t}getRGB(t,e=Ct.workingColorSpace){return Ct.workingToColorSpace(mt.copy(this),e),t.r=mt.r,t.g=mt.g,t.b=mt.b,t}getStyle(t=ft){Ct.workingToColorSpace(mt.copy(this),t);let e=mt.r,n=mt.g,i=mt.b;return t!==ft?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(ae),this.setHSL(ae.h+t,ae.s+e,ae.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ae),t.getHSL(On);let n=Li(ae.h,On.h,e),i=Li(ae.s,On.s,e),s=Li(ae.l,On.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},mt=new W;W.NAMES=Yr;var Nt=new M,Zt=new M,zi=new M,Jt=new M,Oe=new M,Be=new M,lr=new M,ki=new M,Vi=new M,Gi=new M,Hi=new Rt,Wi=new Rt,Xi=new Rt,ue=class h{constructor(t=new M,e=new M,n=new M){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Nt.subVectors(t,e),i.cross(Nt);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){Nt.subVectors(i,e),Zt.subVectors(n,e),zi.subVectors(t,e);let r=Nt.dot(Nt),a=Nt.dot(Zt),o=Nt.dot(zi),c=Zt.dot(Zt),u=Zt.dot(zi),l=r*c-a*a;if(l===0)return s.set(0,0,0),null;let f=1/l,d=(c*o-a*u)*f,p=(r*u-a*o)*f;return s.set(1-d-p,p,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Jt)===null?!1:Jt.x>=0&&Jt.y>=0&&Jt.x+Jt.y<=1}static getInterpolation(t,e,n,i,s,r,a,o){return this.getBarycoord(t,e,n,i,Jt)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(s,Jt.x),o.addScaledVector(r,Jt.y),o.addScaledVector(a,Jt.z),o)}static getInterpolatedAttribute(t,e,n,i,s,r){return Hi.setScalar(0),Wi.setScalar(0),Xi.setScalar(0),Hi.fromBufferAttribute(t,e),Wi.fromBufferAttribute(t,n),Xi.fromBufferAttribute(t,i),r.setScalar(0),r.addScaledVector(Hi,s.x),r.addScaledVector(Wi,s.y),r.addScaledVector(Xi,s.z),r}static isFrontFacing(t,e,n,i){return Nt.subVectors(n,e),Zt.subVectors(t,e),Nt.cross(Zt).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Nt.subVectors(this.c,this.b),Zt.subVectors(this.a,this.b),Nt.cross(Zt).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return h.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return h.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return h.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return h.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return h.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,s=this.c,r,a;Oe.subVectors(i,n),Be.subVectors(s,n),ki.subVectors(t,n);let o=Oe.dot(ki),c=Be.dot(ki);if(o<=0&&c<=0)return e.copy(n);Vi.subVectors(t,i);let u=Oe.dot(Vi),l=Be.dot(Vi);if(u>=0&&l<=u)return e.copy(i);let f=o*l-u*c;if(f<=0&&o>=0&&u<=0&&o-u>0)return r=o/(o-u),e.copy(n).addScaledVector(Oe,r);Gi.subVectors(t,s);let d=Oe.dot(Gi),p=Be.dot(Gi);if(p>=0&&d<=p)return e.copy(s);let m=d*c-o*p;if(m<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(Be,a);let g=u*p-d*l;if(g<=0&&l-u>=0&&d-p>=0)return lr.subVectors(s,i),a=(l-u)/(l-u+(d-p)),e.copy(i).addScaledVector(lr,a);let v=1/(g+m+f);return r=m*v,a=f*v,e.copy(n).addScaledVector(Oe,r).addScaledVector(Be,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ee=class{constructor(t=new M(1/0,1/0,1/0),e=new M(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ut.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ut.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Ut.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let r=0,a=s.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,Ut):Ut.fromBufferAttribute(s,r),Ut.applyMatrix4(t.matrixWorld),this.expandByPoint(Ut);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Bn.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Bn.copy(n.boundingBox)),Bn.applyMatrix4(t.matrixWorld),this.union(Bn)}let i=t.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ut),Ut.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(on),zn.subVectors(this.max,on),ze.subVectors(t.a,on),ke.subVectors(t.b,on),Ve.subVectors(t.c,on),oe.subVectors(ke,ze),le.subVectors(Ve,ke),_e.subVectors(ze,Ve);let e=[0,-oe.z,oe.y,0,-le.z,le.y,0,-_e.z,_e.y,oe.z,0,-oe.x,le.z,0,-le.x,_e.z,0,-_e.x,-oe.y,oe.x,0,-le.y,le.x,0,-_e.y,_e.x,0];return!qi(e,ze,ke,Ve,zn)||(e=[1,0,0,0,1,0,0,0,1],!qi(e,ze,ke,Ve,zn))?!1:(kn.crossVectors(oe,le),e=[kn.x,kn.y,kn.z],qi(e,ze,ke,Ve,zn))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ut).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ut).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:($t[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),$t[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),$t[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),$t[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),$t[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),$t[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),$t[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),$t[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints($t),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},$t=[new M,new M,new M,new M,new M,new M,new M,new M],Ut=new M,Bn=new ee,ze=new M,ke=new M,Ve=new M,oe=new M,le=new M,_e=new M,on=new M,zn=new M,kn=new M,xe=new M;function qi(h,t,e,n,i){for(let s=0,r=h.length-3;s<=r;s+=3){xe.fromArray(h,s);let a=i.x*Math.abs(xe.x)+i.y*Math.abs(xe.y)+i.z*Math.abs(xe.z),o=t.dot(xe),c=e.dot(xe),u=n.dot(xe);if(Math.max(-Math.max(o,c,u),Math.min(o,c,u))>a)return!1}return!0}var st=new M,Vn=new V,Da=0,et=class extends de{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Da++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Xr,this.updateRanges=[],this.gpuType=Fs,this.version=0,this._normalizationScale=t!==void 0?Bs(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Vn.fromBufferAttribute(this,e),Vn.applyMatrix3(t),this.setXY(e,Vn.x,Vn.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)st.fromBufferAttribute(this,e),st.applyMatrix3(t),this.setXYZ(e,st.x,st.y,st.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)st.fromBufferAttribute(this,e),st.applyMatrix4(t),this.setXYZ(e,st.x,st.y,st.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)st.fromBufferAttribute(this,e),st.applyNormalMatrix(t),this.setXYZ(e,st.x,st.y,st.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)st.fromBufferAttribute(this,e),st.transformDirection(t),this.setXYZ(e,st.x,st.y,st.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i),s=this._normalize(s)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Ma(t,this.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):ba(t,this.array)}};var pi=class extends et{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var mi=class extends et{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var gt=class extends et{constructor(t,e,n){super(new Float32Array(t),e,n)}},Na=new ee,ln=new M,Yi=new M,pe=class{constructor(t=new M,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Na.setFromPoints(t).getCenter(n);let i=0;for(let s=0,r=t.length;s<r;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ln.subVectors(t,this.center);let e=ln.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(ln,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Yi.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ln.copy(t.center).add(Yi)),this.expandByPoint(ln.copy(t.center).sub(Yi))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Ua=0,Et=new z,Zi=new rt,Ge=new M,At=new ee,cn=new ee,ut=new M,Ft=class h extends de{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ua++}),this.uuid=Re(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(xa(t)?mi:pi)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new F().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Et.makeRotationFromQuaternion(t),this.applyMatrix4(Et),this}rotateX(t){return Et.makeRotationX(t),this.applyMatrix4(Et),this}rotateY(t){return Et.makeRotationY(t),this.applyMatrix4(Et),this}rotateZ(t){return Et.makeRotationZ(t),this.applyMatrix4(Et),this}translate(t,e,n){return Et.makeTranslation(t,e,n),this.applyMatrix4(Et),this}scale(t,e,n){return Et.makeScale(t,e,n),this.applyMatrix4(Et),this}lookAt(t){return Zi.lookAt(t),Zi.updateMatrix(),this.applyMatrix4(Zi.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ge).negate(),this.translate(Ge.x,Ge.y,Ge.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,s=t.length;i<s;i++){let r=t[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new gt(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&J("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ee);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Q("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new M(-1/0,-1/0,-1/0),new M(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let s=e[n];At.setFromBufferAttribute(s),this.morphTargetsRelative?(ut.addVectors(this.boundingBox.min,At.min),this.boundingBox.expandByPoint(ut),ut.addVectors(this.boundingBox.max,At.max),this.boundingBox.expandByPoint(ut)):(this.boundingBox.expandByPoint(At.min),this.boundingBox.expandByPoint(At.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Q('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pe);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Q("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new M,1/0);return}if(t){let n=this.boundingSphere.center;if(At.setFromBufferAttribute(t),e)for(let s=0,r=e.length;s<r;s++){let a=e[s];cn.setFromBufferAttribute(a),this.morphTargetsRelative?(ut.addVectors(At.min,cn.min),At.expandByPoint(ut),ut.addVectors(At.max,cn.max),At.expandByPoint(ut)):(At.expandByPoint(cn.min),At.expandByPoint(cn.max))}At.getCenter(n);let i=0;for(let s=0,r=t.count;s<r;s++)ut.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(ut));if(e)for(let s=0,r=e.length;s<r;s++){let a=e[s],o=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)ut.fromBufferAttribute(a,c),o&&(Ge.fromBufferAttribute(t,c),ut.add(Ge)),i=Math.max(i,n.distanceToSquared(ut))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Q('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Q("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,s=e.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new et(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));let a=[],o=[],c=new Uint8Array(n.count);for(let A=0;A<n.count;A++)a[A]=new M,o[A]=new M;let u=new M,l=new M,f=new M,d=new V,p=new V,m=new V,g=new M,v=new M;function y(A,E,P){c[A]=c[E]=c[P]=1,u.fromBufferAttribute(n,A),l.fromBufferAttribute(n,E),f.fromBufferAttribute(n,P),d.fromBufferAttribute(s,A),p.fromBufferAttribute(s,E),m.fromBufferAttribute(s,P),l.sub(u),f.sub(u),p.sub(d),m.sub(d);let C=1/(p.x*m.y-m.x*p.y);isFinite(C)&&(g.copy(l).multiplyScalar(m.y).addScaledVector(f,-p.y).multiplyScalar(C),v.copy(f).multiplyScalar(p.x).addScaledVector(l,-m.x).multiplyScalar(C),a[A].add(g),a[E].add(g),a[P].add(g),o[A].add(v),o[E].add(v),o[P].add(v))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let A=0,E=_.length;A<E;++A){let P=_[A],C=P.start,D=P.count;for(let N=C,L=C+D;N<L;N+=3)y(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let x=new M,S=new M,b=new M,w=new M;function T(A){b.fromBufferAttribute(i,A),w.copy(b);let E=a[A];x.copy(E),x.sub(b.multiplyScalar(b.dot(E))).normalize(),S.crossVectors(w,E);let C=S.dot(o[A])<0?-1:1;r.setXYZW(A,x.x,x.y,x.z,C)}for(let A=0,E=n.count;A<E;++A)c[A]&&T(A);this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new et(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let i=new M,s=new M,r=new M,a=new M,o=new M,c=new M,u=new M,l=new M;if(t)for(let f=0,d=t.count;f<d;f+=3){let p=t.getX(f+0),m=t.getX(f+1),g=t.getX(f+2);i.fromBufferAttribute(e,p),s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,g),u.subVectors(r,s),l.subVectors(i,s),u.cross(l),a.fromBufferAttribute(n,p),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,g),a.add(u),o.add(u),c.add(u),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)i.fromBufferAttribute(e,f+0),s.fromBufferAttribute(e,f+1),r.fromBufferAttribute(e,f+2),u.subVectors(r,s),l.subVectors(i,s),u.cross(l),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ut.fromBufferAttribute(t,e),ut.normalize(),t.setXYZ(e,ut.x,ut.y,ut.z)}toNonIndexed(){function t(a,o){let c=a.array,u=a.itemSize,l=a.normalized,f=new c.constructor(o.length*u),d=0,p=0;for(let m=0,g=o.length;m<g;m++){a.isInterleavedBufferAttribute?d=o[m]*a.data.stride+a.offset:d=o[m]*u;for(let v=0;v<u;v++)f[p++]=c[d++]}return new et(f,u,l)}if(this.index===null)return J("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new h,n=this.index.array,i=this.attributes;for(let a in i){let o=i[a],c=t(o,n);e.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let o=[],c=s[a];for(let u=0,l=c.length;u<l;u++){let f=c[u],d=t(f,n);o.push(d)}e.morphAttributes[a]=o}e.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let a=0,o=r.length;a<o;a++){let c=r[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let o=this.parameters;for(let c in o)o[c]!==void 0&&(t[c]=o[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let o in n){let c=n[o];t.data.attributes[o]=c.toJSON(t.data)}let i={},s=!1;for(let o in this.morphAttributes){let c=this.morphAttributes[o],u=[];for(let l=0,f=c.length;l<f;l++){let d=c[l];u.push(d.toJSON(t.data))}u.length>0&&(i[o]=u,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let u=i[c];this.setAttribute(c,u.clone(e))}let s=t.morphAttributes;for(let c in s){let u=[],l=s[c];for(let f=0,d=l.length;f<d;f++)u.push(l[f].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let c=0,u=r.length;c<u;c++){let l=r[c];this.addGroup(l.start,l.count,l.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let o=t.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Ji=new M,Fa=new M,Oa=new F,Ht=class{constructor(t=new M(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Ji.subVectors(n,e).cross(Fa.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(Ji),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return n===!0&&(r<0||r>1)?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Oa.getNormalMatrix(t),i=this.coplanarPoint(Ji).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Ba=0,gn=class extends de{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ba++}),this.uuid=Re(),this.name="",this.type="Material",this.blending=Lr,this.side=As,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nr,this.blendDst=Ur,this.blendEquation=Dr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new W(0,0,0),this.blendAlpha=0,this.depthFunc=ai,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wr,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ri,this.stencilZFail=ri,this.stencilZPass=ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){J(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){J(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let r=[];for(let a in s){let o=s[a];delete o.metadata,r.push(o)}return r}if(e){let s=i(t.textures),r=i(t.images);s.length>0&&(n.textures=s),r.length>0&&(n.images=r)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new W().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Ht().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new V().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new V().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Kt=new M,$i=new M,Gn=new M,Hn=new M,_n=class{constructor(t=new M,e=new M(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Kt)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Kt.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Kt.copy(this.origin).addScaledVector(this.direction,e),Kt.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){$i.copy(t).add(e).multiplyScalar(.5),Gn.copy(e).sub(t).normalize(),Hn.copy(this.origin).sub($i);let s=t.distanceTo(e)*.5,r=-this.direction.dot(Gn),a=Hn.dot(this.direction),o=-Hn.dot(Gn),c=Hn.lengthSq(),u=Math.abs(1-r*r),l,f,d,p;if(u>0)if(l=r*o-a,f=r*a-o,p=s*u,l>=0)if(f>=-p)if(f<=p){let m=1/u;l*=m,f*=m,d=l*(l+r*f+2*a)+f*(r*l+f+2*o)+c}else f=s,l=Math.max(0,-(r*f+a)),d=-l*l+f*(f+2*o)+c;else f=-s,l=Math.max(0,-(r*f+a)),d=-l*l+f*(f+2*o)+c;else f<=-p?(l=Math.max(0,-(-r*s+a)),f=l>0?-s:Math.min(Math.max(-s,-o),s),d=-l*l+f*(f+2*o)+c):f<=p?(l=0,f=Math.min(Math.max(-s,-o),s),d=f*(f+2*o)+c):(l=Math.max(0,-(r*s+a)),f=l>0?s:Math.min(Math.max(-s,-o),s),d=-l*l+f*(f+2*o)+c);else f=r>0?-s:s,l=Math.max(0,-(r*f+a)),d=-l*l+f*(f+2*o)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,l),i&&i.copy($i).addScaledVector(Gn,f),d}intersectSphere(t,e){if(t.radius<0)return null;Kt.subVectors(t.center,this.origin);let n=Kt.dot(this.direction),i=Kt.dot(Kt)-n*n,s=t.radius*t.radius;if(i>s)return null;let r=Math.sqrt(s-i),a=n-r,o=n+r;return o<0?null:a<0?this.at(o,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,r,a,o,c=1/this.direction.x,u=1/this.direction.y,l=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),u>=0?(s=(t.min.y-f.y)*u,r=(t.max.y-f.y)*u):(s=(t.max.y-f.y)*u,r=(t.min.y-f.y)*u),n>r||s>i||((s>n||isNaN(n))&&(n=s),(r<i||isNaN(i))&&(i=r),l>=0?(a=(t.min.z-f.z)*l,o=(t.max.z-f.z)*l):(a=(t.max.z-f.z)*l,o=(t.min.z-f.z)*l),n>o||a>i)||((a>n||n!==n)&&(n=a),(o<i||i!==i)&&(i=o),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Kt)!==null}intersectTriangle(t,e,n,i,s){let r=this.origin,a=this.direction,o=a.x,c=a.y,u=a.z,l=t.x-r.x,f=t.y-r.y,d=t.z-r.z,p=e.x-r.x,m=e.y-r.y,g=e.z-r.z,v=n.x-r.x,y=n.y-r.y,_=n.z-r.z,x=Math.abs(o),S=Math.abs(c),b=Math.abs(u),w,T,A,E,P,C,D,N,L,k,$,nt;if(x>=S&&x>=b?(A=o,C=l,L=p,nt=v,o>=0?(w=c,T=u,E=f,P=d,D=m,N=g,k=y,$=_):(w=u,T=c,E=d,P=f,D=g,N=m,k=_,$=y)):S>=b?(A=c,C=f,L=m,nt=y,c>=0?(w=u,T=o,E=d,P=l,D=g,N=p,k=_,$=v):(w=o,T=u,E=l,P=d,D=p,N=g,k=v,$=_)):(A=u,C=d,L=g,nt=_,u>=0?(w=o,T=c,E=l,P=f,D=p,N=m,k=v,$=y):(w=c,T=o,E=f,P=l,D=m,N=p,k=y,$=v)),A===0)return null;let G=w/A,Y=T/A,K=1/A,j=E-G*C,at=P-Y*C,xt=D-G*L,ot=N-Y*L,ct=k-G*nt,Lt=$-Y*nt,Mt=ct*ot-Lt*xt,U=j*Lt-at*ct,q=xt*at-ot*j;if(i){if(Mt<0||U<0||q<0)return null}else if((Mt<0||U<0||q<0)&&(Mt>0||U>0||q>0))return null;let lt=Mt+U+q;if(lt===0)return null;let ht=K*(Mt*C+U*L+q*nt);return(lt>0?ht<0:ht>0)?null:this.at(ht/lt,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},gi=class extends gn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new W(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.combine=Ts,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},cr=new z,ve=new _n,Wn=new pe,hr=new M,Xn=new M,qn=new M,Yn=new M,Ki=new M,Zn=new M,ur=new M,Jn=new M,Me=class extends rt{constructor(t=new Ft,e=new gi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(s&&a){Zn.set(0,0,0);for(let o=0,c=s.length;o<c;o++){let u=a[o],l=s[o];u!==0&&(Ki.fromBufferAttribute(l,t),r?Zn.addScaledVector(Ki,u):Zn.addScaledVector(Ki.sub(e),u))}e.add(Zn)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Wn.copy(n.boundingSphere),Wn.applyMatrix4(s),ve.copy(t.ray).recast(t.near),!(Wn.containsPoint(ve.origin)===!1&&(ve.intersectSphere(Wn,hr)===null||ve.origin.distanceToSquared(hr)>(t.far-t.near)**2))&&(cr.copy(s).invert(),ve.copy(t.ray).applyMatrix4(cr),!(n.boundingBox!==null&&ve.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ve)))}_computeIntersections(t,e,n){let i,s=this.geometry,r=this.material,a=s.index,o=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,l=s.attributes.normal,f=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(r))for(let p=0,m=f.length;p<m;p++){let g=f[p],v=r[g.materialIndex],y=Math.max(g.start,d.start),_=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let x=y,S=_;x<S;x+=3){let b=a.getX(x),w=a.getX(x+1),T=a.getX(x+2);i=$n(this,v,t,n,c,u,l,b,w,T),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let p=Math.max(0,d.start),m=Math.min(a.count,d.start+d.count);for(let g=p,v=m;g<v;g+=3){let y=a.getX(g),_=a.getX(g+1),x=a.getX(g+2);i=$n(this,r,t,n,c,u,l,y,_,x),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}else if(o!==void 0)if(Array.isArray(r))for(let p=0,m=f.length;p<m;p++){let g=f[p],v=r[g.materialIndex],y=Math.max(g.start,d.start),_=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let x=y,S=_;x<S;x+=3){let b=x,w=x+1,T=x+2;i=$n(this,v,t,n,c,u,l,b,w,T),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let p=Math.max(0,d.start),m=Math.min(o.count,d.start+d.count);for(let g=p,v=m;g<v;g+=3){let y=g,_=g+1,x=g+2;i=$n(this,r,t,n,c,u,l,y,_,x),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}}};function za(h,t,e,n,i,s,r,a){let o;if(t.side===Ir?o=n.intersectTriangle(r,s,i,!0,a):o=n.intersectTriangle(i,s,r,t.side===As,a),o===null)return null;Jn.copy(a),Jn.applyMatrix4(h.matrixWorld);let c=e.ray.origin.distanceTo(Jn);return c<e.near||c>e.far?null:{distance:c,point:Jn.clone(),object:h}}function $n(h,t,e,n,i,s,r,a,o,c){h.getVertexPosition(a,Xn),h.getVertexPosition(o,qn),h.getVertexPosition(c,Yn);let u=za(h,t,e,n,Xn,qn,Yn,ur);if(u){let l=new M;ue.getBarycoord(ur,Xn,qn,Yn,l),i&&(u.uv=ue.getInterpolatedAttribute(i,a,o,c,l,new V)),s&&(u.uv1=ue.getInterpolatedAttribute(s,a,o,c,l,new V)),r&&(u.normal=ue.getInterpolatedAttribute(r,a,o,c,l,new M),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a,b:o,c,normal:new M,materialIndex:0};ue.getNormal(Xn,qn,Yn,f.normal),u.face=f,u.barycoord=l}return u}var hn=new Rt,fr=new Rt,dr=new Rt,ka=new Rt,pr=new z,Kn=new M,ji=new pe,mr=new z,Qi=new _n,xn=class extends Me{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=ls,this.bindMatrix=new z,this.bindMatrixInverse=new z,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new ee),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Kn),this.boundingBox.expandByPoint(Kn)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new pe),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Kn),this.boundingSphere.expandByPoint(Kn)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}raycast(t,e){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ji.copy(this.boundingSphere),ji.applyMatrix4(i),t.ray.intersectsSphere(ji)!==!1&&(mr.copy(i).invert(),Qi.copy(t.ray).applyMatrix4(mr),!(this.boundingBox!==null&&Qi.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Qi)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new Rt,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);let s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===ls?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Br?this.bindMatrixInverse.copy(this.bindMatrix).invert():J("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,i=this.geometry;fr.fromBufferAttribute(i.attributes.skinIndex,t),dr.fromBufferAttribute(i.attributes.skinWeight,t),e.isVector4?(hn.copy(e),e.set(0,0,0,0)):(hn.set(e.x,e.y,e.z,1),e.set(0,0,0)),hn.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let r=dr.getComponent(s);if(r!==0){let a=fr.getComponent(s);pr.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(ka.copy(hn).applyMatrix4(pr),r)}}return e.isVector4&&(e.w=hn.w),e.applyMatrix4(this.bindMatrixInverse)}},Je=class extends rt{constructor(){super(),this.isBone=!0,this.type="Bone"}},_i=class extends te{constructor(t=null,e=1,n=1,i,s,r,a,o,c=cs,u=cs,l,f){super(null,r,a,o,c,u,i,s,l,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},gr=new z,Va=new z,vn=class h{constructor(t=[],e=[]){this.uuid=Re(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){J("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new z)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new z;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=t.length;s<r;s++){let a=t[s]?t[s].matrixWorld:Va;gr.multiplyMatrices(a,e[s]),gr.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new h(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new _i(e,t,t,Os,Fs);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){let s=t.bones[n],r=e[s];r===void 0&&(J("Skeleton: No bone found with UUID:",s),r=new Je),this.bones.push(r),this.boneInverses.push(new z().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let i=0,s=e.length;i<s;i++){let r=e[i];t.bones.push(r.uuid);let a=n[i];t.boneInverses.push(a.toArray())}return t}};var ye=new pe,Ga=new V(.5,.5),jn=new M,xi=class{constructor(t=new Ht,e=new Ht,n=new Ht,i=new Ht,s=new Ht,r=new Ht){this.planes=[t,e,n,i,s,r]}set(t,e,n,i,s,r){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(r),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=fe,n=!1){let i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],u=s[4],l=s[5],f=s[6],d=s[7],p=s[8],m=s[9],g=s[10],v=s[11],y=s[12],_=s[13],x=s[14],S=s[15];if(i[0].setComponents(c-r,d-u,v-p,S-y).normalize(),i[1].setComponents(c+r,d+u,v+p,S+y).normalize(),i[2].setComponents(c+a,d+l,v+m,S+_).normalize(),i[3].setComponents(c-a,d-l,v-m,S-_).normalize(),n)i[4].setComponents(o,f,g,x).normalize(),i[5].setComponents(c-o,d-f,v-g,S-x).normalize();else if(i[4].setComponents(c-o,d-f,v-g,S-x).normalize(),e===fe)i[5].setComponents(c+o,d+f,v+g,S+x).normalize();else if(e===mn)i[5].setComponents(o,f,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ye.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ye.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ye)}intersectsSprite(t){ye.center.set(0,0,0);let e=Ga.distanceTo(t.center);return ye.radius=.7071067811865476+e,ye.applyMatrix4(t.matrixWorld),this.intersectsSphere(ye)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(jn.x=i.normal.x>0?t.max.x:t.min.x,jn.y=i.normal.y>0?t.max.y:t.min.y,jn.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(jn)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var yn=class h extends Ft{constructor(t=1,e=1,n=1,i=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let a=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let o=[],c=[],u=[],l=[],f=0,d=0;p("z","y","x",-1,-1,n,e,t,r,s,0),p("z","y","x",1,-1,n,e,-t,r,s,1),p("x","z","y",1,1,t,n,e,i,r,2),p("x","z","y",1,-1,t,n,-e,i,r,3),p("x","y","z",1,-1,t,e,n,i,s,4),p("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(o),this.setAttribute("position",new gt(c,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(l,2));function p(m,g,v,y,_,x,S,b,w,T,A){let E=x/w,P=S/T,C=x/2,D=S/2,N=b/2,L=w+1,k=T+1,$=0,nt=0,G=new M;for(let Y=0;Y<k;Y++){let K=Y*P-D;for(let j=0;j<L;j++){let at=j*E-C;G[m]=at*y,G[g]=K*_,G[v]=N,c.push(G.x,G.y,G.z),G[m]=0,G[g]=0,G[v]=b>0?1:-1,u.push(G.x,G.y,G.z),l.push(j/w),l.push(1-Y/T),$+=1}}for(let Y=0;Y<T;Y++)for(let K=0;K<w;K++){let j=f+K+L*Y,at=f+K+L*(Y+1),xt=f+(K+1)+L*(Y+1),ot=f+(K+1)+L*Y;o.push(j,at,ot),o.push(at,xt,ot),nt+=6}a.addGroup(d,nt,A),d+=nt,f+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new h(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Sn=class h extends Ft{constructor(t=1,e=1,n=4,i=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),s=Math.max(1,Math.floor(s));let r=[],a=[],o=[],c=[],u=e/2,l=Math.PI/2*t,f=e,d=2*l+f,p=n*2+s,m=i+1,g=new M,v=new M;for(let y=0;y<=p;y++){let _=0,x=0,S=0,b=0;if(y<=n){let A=y/n,E=A*Math.PI/2;x=-u-t*Math.cos(E),S=t*Math.sin(E),b=-t*Math.cos(E),_=A*l}else if(y<=n+s){let A=(y-n)/s;x=-u+A*e,S=t,b=0,_=l+A*f}else{let A=(y-n-s)/n,E=A*Math.PI/2;x=u+t*Math.sin(E),S=t*Math.cos(E),b=t*Math.sin(E),_=l+f+A*l}let w=Math.max(0,Math.min(1,_/d)),T=0;y===0?T=.5/i:y===p&&(T=-.5/i);for(let A=0;A<=i;A++){let E=A/i,P=E*Math.PI*2,C=Math.sin(P),D=Math.cos(P);v.x=-S*D,v.y=x,v.z=S*C,a.push(v.x,v.y,v.z),g.set(-S*D,b,S*C),g.normalize(),o.push(g.x,g.y,g.z),c.push(E+T,w)}if(y>0){let A=(y-1)*m;for(let E=0;E<i;E++){let P=A+E,C=A+E+1,D=y*m+E,N=y*m+E+1;r.push(P,C,D),r.push(C,N,D)}}}this.setIndex(r),this.setAttribute("position",new gt(a,3)),this.setAttribute("normal",new gt(o,3)),this.setAttribute("uv",new gt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new h(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}};var $e=class h extends Ft{constructor(t=1,e=1,n=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o};let c=this;i=Math.floor(i),s=Math.floor(s);let u=[],l=[],f=[],d=[],p=0,m=[],g=n/2,v=0;y(),r===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(u),this.setAttribute("position",new gt(l,3)),this.setAttribute("normal",new gt(f,3)),this.setAttribute("uv",new gt(d,2));function y(){let x=new M,S=new M,b=0,w=(e-t)/n;for(let T=0;T<=s;T++){let A=[],E=T/s,P=E*(e-t)+t;for(let C=0;C<=i;C++){let D=C/i,N=D*o+a,L=Math.sin(N),k=Math.cos(N);S.x=P*L,S.y=-E*n+g,S.z=P*k,l.push(S.x,S.y,S.z),x.set(L,w,k).normalize(),f.push(x.x,x.y,x.z),d.push(D,1-E),A.push(p++)}m.push(A)}for(let T=0;T<i;T++)for(let A=0;A<s;A++){let E=m[A][T],P=m[A+1][T],C=m[A+1][T+1],D=m[A][T+1];(t>0||A!==0)&&(u.push(E,P,D),b+=3),(e>0||A!==s-1)&&(u.push(P,C,D),b+=3)}c.addGroup(v,b,0),v+=b}function _(x){let S=p,b=new V,w=new M,T=0,A=x===!0?t:e,E=x===!0?1:-1;for(let C=1;C<=i;C++)l.push(0,g*E,0),f.push(0,E,0),d.push(.5,.5),p++;let P=p;for(let C=0;C<=i;C++){let N=C/i*o+a,L=Math.cos(N),k=Math.sin(N);w.x=A*k,w.y=g*E,w.z=A*L,l.push(w.x,w.y,w.z),f.push(0,E,0),b.x=L*.5+.5,b.y=k*.5*E+.5,d.push(b.x,b.y),p++}for(let C=0;C<i;C++){let D=S+C,N=P+C;x===!0?u.push(N,N+1,D):u.push(N+1,N,D),T+=3}c.addGroup(v,T,x===!0?1:2),v+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new h(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Mn=class h extends $e{constructor(t=1,e=1,n=32,i=1,s=!1,r=0,a=Math.PI*2){super(0,t,e,n,i,s,r,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:r,thetaLength:a}}static fromJSON(t){return new h(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};function Ha(h,t,e=2){let n=t&&t.length,i=n?t[0]*e:h.length,s=Zr(h,0,i,e,!0),r=[];if(!s||s.next===s.prev)return r;let a,o,c;if(n&&(s=Za(h,t,s,e)),h.length>80*e){a=h[0],o=h[1];let u=a,l=o;for(let f=e;f<i;f+=e){let d=h[f],p=h[f+1];d<a&&(a=d),p<o&&(o=p),d>u&&(u=d),p>l&&(l=p)}c=Math.max(u-a,l-o),c=c!==0?32767/c:0}return bn(s,r,e,a,o,c,0),r}function Zr(h,t,e,n,i){let s;if(i===ro(h,t,e,n)>0)for(let r=t;r<e;r+=n)s=_r(r/n|0,h[r],h[r+1],s);else for(let r=e-n;r>=t;r-=n)s=_r(r/n|0,h[r],h[r+1],s);return s&&Ke(s,s.next)&&(wn(s),s=s.next),s}function be(h,t){if(!h)return h;t||(t=h);let e=h,n;do if(n=!1,!e.steiner&&(Ke(e,e.next)||tt(e.prev,e,e.next)===0)){if(wn(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function bn(h,t,e,n,i,s,r){if(!h)return;!r&&s&&Qa(h,n,i,s);let a=h;for(;h.prev!==h.next;){let o=h.prev,c=h.next;if(s?Xa(h,n,i,s):Wa(h)){t.push(o.i,h.i,c.i),wn(h),h=c.next,a=c.next;continue}if(h=c,h===a){r?r===1?(h=qa(be(h),t),bn(h,t,e,n,i,s,2)):r===2&&Ya(h,t,e,n,i,s):bn(be(h),t,e,n,i,s,1);break}}}function Wa(h){let t=h.prev,e=h,n=h.next;if(tt(t,e,n)>=0)return!1;let i=t.x,s=e.x,r=n.x,a=t.y,o=e.y,c=n.y,u=Math.min(i,s,r),l=Math.min(a,o,c),f=Math.max(i,s,r),d=Math.max(a,o,c),p=n.next;for(;p!==t;){if(p.x>=u&&p.x<=f&&p.y>=l&&p.y<=d&&un(i,a,s,o,r,c,p.x,p.y)&&tt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Xa(h,t,e,n){let i=h.prev,s=h,r=h.next;if(tt(i,s,r)>=0)return!1;let a=i.x,o=s.x,c=r.x,u=i.y,l=s.y,f=r.y,d=Math.min(a,o,c),p=Math.min(u,l,f),m=Math.max(a,o,c),g=Math.max(u,l,f),v=ms(d,p,t,e,n),y=ms(m,g,t,e,n),_=h.prevZ,x=h.nextZ;for(;_&&_.z>=v&&x&&x.z<=y;){if(_.x>=d&&_.x<=m&&_.y>=p&&_.y<=g&&_!==i&&_!==r&&un(a,u,o,l,c,f,_.x,_.y)&&tt(_.prev,_,_.next)>=0||(_=_.prevZ,x.x>=d&&x.x<=m&&x.y>=p&&x.y<=g&&x!==i&&x!==r&&un(a,u,o,l,c,f,x.x,x.y)&&tt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;_&&_.z>=v;){if(_.x>=d&&_.x<=m&&_.y>=p&&_.y<=g&&_!==i&&_!==r&&un(a,u,o,l,c,f,_.x,_.y)&&tt(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;x&&x.z<=y;){if(x.x>=d&&x.x<=m&&x.y>=p&&x.y<=g&&x!==i&&x!==r&&un(a,u,o,l,c,f,x.x,x.y)&&tt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function qa(h,t){let e=h;do{let n=e.prev,i=e.next.next;!Ke(n,i)&&$r(n,e,e.next,i)&&An(n,i)&&An(i,n)&&(t.push(n.i,e.i,i.i),wn(e),wn(e.next),e=h=i),e=e.next}while(e!==h);return be(e)}function Ya(h,t,e,n,i,s){let r=h;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&no(r,a)){let o=Kr(r,a);r=be(r,r.next),o=be(o,o.next),bn(r,t,e,n,i,s,0),bn(o,t,e,n,i,s,0);return}a=a.next}r=r.next}while(r!==h)}function Za(h,t,e,n){let i=[];for(let s=0,r=t.length;s<r;s++){let a=t[s]*n,o=s<r-1?t[s+1]*n:h.length,c=Zr(h,a,o,n,!1);c===c.next&&(c.steiner=!0),i.push(eo(c))}i.sort(Ja);for(let s=0;s<i.length;s++)e=$a(i[s],e);return e}function Ja(h,t){let e=h.x-t.x;if(e===0&&(e=h.y-t.y,e===0)){let n=(h.next.y-h.y)/(h.next.x-h.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function $a(h,t){let e=Ka(h,t);if(!e)return t;let n=Kr(e,h);return be(n,n.next),be(e,e.next)}function Ka(h,t){let e=t,n=h.x,i=h.y,s=-1/0,r;if(Ke(h,e))return e;do{if(Ke(h,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let l=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(l<=n&&l>s&&(s=l,r=e.x<e.next.x?e:e.next,l===n))return r}e=e.next}while(e!==t);if(!r)return null;let a=r,o=r.x,c=r.y,u=1/0;e=r;do{if(n>=e.x&&e.x>=o&&n!==e.x&&Jr(i<c?n:s,i,o,c,i<c?s:n,i,e.x,e.y)){let l=Math.abs(i-e.y)/(n-e.x);An(e,h)&&(l<u||l===u&&(e.x>r.x||e.x===r.x&&ja(r,e)))&&(r=e,u=l)}e=e.next}while(e!==a);return r}function ja(h,t){return tt(h.prev,h,t.prev)<0&&tt(t.next,h,h.next)<0}function Qa(h,t,e,n){let i=h;do i.z===0&&(i.z=ms(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==h);i.prevZ.nextZ=null,i.prevZ=null,to(i)}function to(h){let t,e=1;do{let n=h,i;h=null;let s=null;for(t=0;n;){t++;let r=n,a=0;for(let c=0;c<e&&(a++,r=r.nextZ,!!r);c++);let o=e;for(;a>0||o>0&&r;)a!==0&&(o===0||!r||n.z<=r.z)?(i=n,n=n.nextZ,a--):(i=r,r=r.nextZ,o--),s?s.nextZ=i:h=i,i.prevZ=s,s=i;n=r}s.nextZ=null,e*=2}while(t>1);return h}function ms(h,t,e,n,i){return h=(h-e)*i|0,t=(t-n)*i|0,h=(h|h<<8)&16711935,h=(h|h<<4)&252645135,h=(h|h<<2)&858993459,h=(h|h<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,h|t<<1}function eo(h){let t=h,e=h;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==h);return e}function Jr(h,t,e,n,i,s,r,a){return(i-r)*(t-a)>=(h-r)*(s-a)&&(h-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(s-a)>=(i-r)*(n-a)}function un(h,t,e,n,i,s,r,a){return!(h===r&&t===a)&&Jr(h,t,e,n,i,s,r,a)}function no(h,t){return h.next.i!==t.i&&h.prev.i!==t.i&&!io(h,t)&&(An(h,t)&&An(t,h)&&so(h,t)&&(tt(h.prev,h,t.prev)||tt(h,t.prev,t))||Ke(h,t)&&tt(h.prev,h,h.next)>0&&tt(t.prev,t,t.next)>0)}function tt(h,t,e){return(t.y-h.y)*(e.x-t.x)-(t.x-h.x)*(e.y-t.y)}function Ke(h,t){return h.x===t.x&&h.y===t.y}function $r(h,t,e,n){let i=ti(tt(h,t,e)),s=ti(tt(h,t,n)),r=ti(tt(e,n,h)),a=ti(tt(e,n,t));return!!(i!==s&&r!==a||i===0&&Qn(h,e,t)||s===0&&Qn(h,n,t)||r===0&&Qn(e,h,n)||a===0&&Qn(e,t,n))}function Qn(h,t,e){return t.x<=Math.max(h.x,e.x)&&t.x>=Math.min(h.x,e.x)&&t.y<=Math.max(h.y,e.y)&&t.y>=Math.min(h.y,e.y)}function ti(h){return h>0?1:h<0?-1:0}function io(h,t){let e=h;do{if(e.i!==h.i&&e.next.i!==h.i&&e.i!==t.i&&e.next.i!==t.i&&$r(e,e.next,h,t))return!0;e=e.next}while(e!==h);return!1}function An(h,t){return tt(h.prev,h,h.next)<0?tt(h,t,h.next)>=0&&tt(h,h.prev,t)>=0:tt(h,t,h.prev)<0||tt(h,h.next,t)<0}function so(h,t){let e=h,n=!1,i=(h.x+t.x)/2,s=(h.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&i<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==h);return n}function Kr(h,t){let e=gs(h.i,h.x,h.y),n=gs(t.i,t.x,t.y),i=h.next,s=t.prev;return h.next=t,t.prev=h,e.next=i,i.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function _r(h,t,e,n){let i=gs(h,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function wn(h){h.next.prev=h.prev,h.prev.next=h.next,h.prevZ&&(h.prevZ.nextZ=h.nextZ),h.nextZ&&(h.nextZ.prevZ=h.prevZ)}function gs(h,t,e){return{i:h,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ro(h,t,e,n){let i=0;for(let s=t,r=e-n;s<e;s+=n)i+=(h[r]-h[s])*(h[s+1]+h[r+1]),r=s;return i}var _s=class{static triangulate(t,e,n=2){return Ha(t,e,n)}},je=class h{static area(t){let e=t.length,n=0;for(let i=e-1,s=0;s<e;i=s++)n+=t[i].x*t[s].y-t[s].x*t[i].y;return n*.5}static isClockWise(t){return h.area(t)<0}static triangulateShape(t,e){let n=[],i=[],s=[];xr(t),vr(n,t);let r=t.length;e.forEach(xr);for(let o=0;o<e.length;o++)i.push(r),r+=e[o].length,vr(n,e[o]);let a=_s.triangulate(n,i);for(let o=0;o<a.length;o+=3)s.push(a.slice(o,o+3));return s}};function xr(h){let t=h.length;t>2&&h[t-1].equals(h[0])&&h.pop()}function vr(h,t){for(let e=0;e<t.length;e++)h.push(t[e].x),h.push(t[e].y)}var Tn=class h extends Ft{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:r,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let o=Math.min(r+a,Math.PI),c=0,u=[],l=new M,f=new M,d=[],p=[],m=[],g=[];for(let v=0;v<=n;v++){let y=[],_=v/n,x=r+_*a,S=t*Math.cos(x),b=Math.sqrt(t*t-S*S),w=0;v===0&&r===0?w=.5/e:v===n&&o===Math.PI&&(w=-.5/e);for(let T=0;T<=e;T++){let A=T/e,E=i+A*s;l.x=-b*Math.cos(E),l.y=S,l.z=b*Math.sin(E),p.push(l.x,l.y,l.z),f.copy(l).normalize(),m.push(f.x,f.y,f.z),g.push(A+w,1-_),y.push(c++)}u.push(y)}for(let v=0;v<n;v++)for(let y=0;y<e;y++){let _=u[v][y+1],x=u[v][y],S=u[v+1][y],b=u[v+1][y+1];(v!==0||r>0)&&d.push(_,x,b),(v!==n-1||o<Math.PI)&&d.push(x,S,b)}this.setIndex(d),this.setAttribute("position",new gt(p,3)),this.setAttribute("normal",new gt(m,3)),this.setAttribute("uv",new gt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new h(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function jr(h){let t={};for(let e in h){t[e]={};for(let n in h[e]){let i=h[e][n];if(yr(i))i.isRenderTargetTexture?(J("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(yr(i[0])){let s=[];for(let r=0,a=i.length;r<a;r++)s[r]=i[r].clone();t[e][n]=s}else t[e][n]=i.slice();else t[e][n]=i}}return t}function vt(h){let t={};for(let e=0;e<h.length;e++){let n=jr(h[e]);for(let i in n)t[i]=n[i]}return t}function yr(h){return h&&(h.isColor||h.isMatrix3||h.isMatrix4||h.isVector2||h.isVector3||h.isVector4||h.isTexture||h.isQuaternion)}var vi=class extends gn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new W(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new W(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hr,this.normalScale=new V(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Ae=class extends vi{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new V(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return O(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new W(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new W(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new W(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return We('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){We('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};function he(h,t){return!h||h.constructor===t?h:typeof t.BYTES_PER_ELEMENT=="number"?new t(h):Array.prototype.slice.call(h)}function fn(h){return h!==void 0&&h.inTangents!==void 0&&h.outTangents!==void 0}function ao(h){function t(i,s){return h[i]-h[s]}let e=h.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function Sr(h,t,e){let n=h.length,i=new h.constructor(n);for(let s=0,r=0;r!==n;++s){let a=e[s]*t;for(let o=0;o!==t;++o)i[r++]=h[a+o]}return i}function oo(h,t,e,n){let i=1,s=h[0];for(;s!==void 0&&s[n]===void 0;)s=h[i++];if(s===void 0)return;let r=s[n];if(r!==void 0)if(Array.isArray(r))do r=s[n],r!==void 0&&(t.push(s.time),e.push(...r)),s=h[i++];while(s!==void 0);else if(r.toArray!==void 0)do r=s[n],r!==void 0&&(t.push(s.time),r.toArray(e,e.length)),s=h[i++];while(s!==void 0);else do r=s[n],r!==void 0&&(t.push(s.time),e.push(r)),s=h[i++];while(s!==void 0)}var me=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],s=e[n-1];n:{t:{let r;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=e[++n],t<i)break t}r=e.length;break e}if(!(t>=s)){let a=e[1];t<a&&(n=2,s=a);for(let o=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===o)break;if(i=s,s=e[--n-1],t>=s)break t}r=n,n=0;break e}break n}for(;n<r;){let a=n+r>>>1;t<e[a]?r=a:n=a+1}if(i=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=t*i;for(let r=0;r!==i;++r)e[r]=n[s+r];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},yi=class extends me{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:us,endingEnd:us}}intervalChanged_(t,e,n){let i=this.parameterPositions,s=t-2,r=t+1,a=i[s],o=i[r];if(a===void 0)switch(this.getSettings_().endingStart){case fs:s=t,a=2*e-n;break;case ds:s=i.length-2,a=e+i[s]-i[s+1];break;default:s=t,a=n}if(o===void 0)switch(this.getSettings_().endingEnd){case fs:r=t,o=2*n-e;break;case ds:r=1,o=n+i[1]-i[0];break;default:r=t-1,o=e}let c=(n-e)*.5,u=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(o-n),this._offsetPrev=s*u,this._offsetNext=r*u}interpolate_(t,e,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=t*a,c=o-a,u=this._offsetPrev,l=this._offsetNext,f=this._weightPrev,d=this._weightNext,p=(n-e)/(i-e),m=p*p,g=m*p,v=-f*g+2*f*m-f*p,y=(1+f)*g+(-1.5-2*f)*m+(-.5+f)*p+1,_=(-1-d)*g+(1.5+d)*m+.5*p,x=d*g-d*m;for(let S=0;S!==a;++S)s[S]=v*r[u+S]+y*r[c+S]+_*r[o+S]+x*r[l+S];return s}},Si=class extends me{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=t*a,c=o-a,u=(n-e)/(i-e),l=1-u;for(let f=0;f!==a;++f)s[f]=r[c+f]*l+r[o+f]*u;return s}},Mi=class extends me{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},bi=class extends me{interpolate_(t,e,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=t*a,c=o-a,u=this.inTangents,l=this.outTangents;if(!u||!l){let p=(n-e)/(i-e),m=1-p;for(let g=0;g!==a;++g)s[g]=r[c+g]*m+r[o+g]*p;return s}let f=a*2,d=t-1;for(let p=0;p!==a;++p){let m=r[c+p],g=r[o+p],v=d*f+p*2,y=l[v],_=l[v+1],x=t*f+p*2,S=u[x],b=u[x+1],w=co(n,e,y,S,i);s[p]=Qr(w,m,_,b,g)}return s}};function Qr(h,t,e,n,i){let s=1-h;return s*s*s*t+3*s*s*h*e+3*s*h*h*n+h*h*h*i}function lo(h,t,e,n,i){let s=1-h;return 3*s*s*(e-t)+6*s*h*(n-e)+3*h*h*(i-n)}function co(h,t,e,n,i){let s=(h-t)/(i-t);for(let r=0;r<8;r++){let a=Qr(s,t,e,n,i)-h;if(Math.abs(a)<1e-10)break;let o=lo(s,t,e,n,i);if(Math.abs(o)<1e-10)break;s=Math.max(0,Math.min(1,s-a/o))}return s}var St=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=he(e,this.TimeBufferType),this.values=he(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:he(t.times,Array),values:he(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),fn(t.settings)&&(n.settings={inTangents:he(t.settings.inTangents,Array),outTangents:he(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Mi(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Si(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new yi(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new bi(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case pn:e=this.InterpolantFactoryMethodDiscrete;break;case oi:e=this.InterpolantFactoryMethodLinear;break;case ii:e=this.InterpolantFactoryMethodSmooth;break;case hs:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return J("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return pn;case this.InterpolantFactoryMethodLinear:return oi;case this.InterpolantFactoryMethodSmooth:return ii;case this.InterpolantFactoryMethodBezier:return hs}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t;fn(this.settings)&&(Mr(this.settings.inTangents,t),Mr(this.settings.outTangents,t))}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;fn(this.settings)&&(br(this.settings.inTangents,t),br(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,s=0,r=i-1;for(;s!==i&&n[s]<t;)++s;for(;r!==-1&&n[r]>e;)--r;if(++r,s!==0||r!==i){s>=r&&(r=Math.max(r,1),s=r-1);let a=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*a,r*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Q("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,s=n.length;s===0&&(Q("KeyframeTrack: Track is empty.",this),t=!1);let r=null;for(let a=0;a!==s;a++){let o=n[a];if(typeof o=="number"&&isNaN(o)){Q("KeyframeTrack: Time is not a valid number.",this,a,o),t=!1;break}if(r!==null&&r>o){Q("KeyframeTrack: Out of order keys.",this,a,o,r),t=!1;break}r=o}if(i!==void 0&&va(i))for(let a=0,o=i.length;a!==o;++a){let c=i[a];if(isNaN(c)){Q("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===ii,s=t.length-1,r=1;for(let a=1;a<s;++a){let o=!1,c=t[a],u=t[a+1];if(c!==u&&(a!==1||c!==t[0]))if(i)o=!0;else{let l=a*n,f=l-n,d=l+n;for(let p=0;p!==n;++p){let m=e[l+p];if(m!==e[f+p]||m!==e[d+p]){o=!0;break}}}if(o){if(a!==r){t[r]=t[a];let l=a*n,f=r*n;for(let d=0;d!==n;++d)e[f+d]=e[l+d]}++r}}if(s>0){t[r]=t[s];for(let a=s*n,o=r*n,c=0;c!==n;++c)e[o+c]=e[a+c];++r}return r!==t.length?(this.times=t.slice(0,r),this.values=e.slice(0,r*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,fn(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Mr(h,t){for(let e=0,n=h.length;e!==n;e+=2)h[e]+=t}function br(h,t){for(let e=0,n=h.length;e!==n;e+=2)h[e]*=t}St.prototype.ValueTypeName="";St.prototype.TimeBufferType=Float32Array;St.prototype.ValueBufferType=Float32Array;St.prototype.DefaultInterpolation=oi;var ne=class extends St{constructor(t,e,n){super(t,e,n)}};ne.prototype.ValueTypeName="bool";ne.prototype.ValueBufferType=Array;ne.prototype.DefaultInterpolation=pn;ne.prototype.InterpolantFactoryMethodLinear=void 0;ne.prototype.InterpolantFactoryMethodSmooth=void 0;var En=class extends St{constructor(t,e,n,i){super(t,e,n,i)}};En.prototype.ValueTypeName="color";var Qe=class extends St{constructor(t,e,n,i){super(t,e,n,i)}};Qe.prototype.ValueTypeName="number";var Ai=class extends me{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=(n-e)/(i-e),c=t*a;for(let u=c+a;c!==u;c+=4)yt.slerpFlat(s,0,r,c-a,r,c,o);return s}},Ot=class extends St{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new Ai(this.times,this.values,this.getValueSize(),t)}};Ot.prototype.ValueTypeName="quaternion";Ot.prototype.InterpolantFactoryMethodSmooth=void 0;var ie=class extends St{constructor(t,e,n){super(t,e,n)}};ie.prototype.ValueTypeName="string";ie.prototype.ValueBufferType=Array;ie.prototype.DefaultInterpolation=pn;ie.prototype.InterpolantFactoryMethodLinear=void 0;ie.prototype.InterpolantFactoryMethodSmooth=void 0;var Pt=class extends St{constructor(t,e,n,i){super(t,e,n,i)}};Pt.prototype.ValueTypeName="vector";var tn=class{constructor(t="",e=-1,n=[],i=Gr){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=Re(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){let e=[],n=t.tracks,i=1/(t.fps||1);for(let r=0,a=n.length;r!==a;++r)e.push(uo(n[r]).scale(i));let s=new this(t.name,t.duration,e,t.blendMode);return s.uuid=t.uuid,s.userData=JSON.parse(t.userData||"{}"),s}static toJSON(t){let e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let s=0,r=n.length;s!==r;++s)e.push(St.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(t,e,n,i){let s=e.length,r=[];for(let a=0;a<s;a++){let o=[],c=[];o.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);let u=ao(o);o=Sr(o,1,u),c=Sr(c,1,u),!i&&o[0]===0&&(o.push(s),c.push(c[0])),r.push(new Qe(".morphTargetInfluences["+e[a].name+"]",o,c).scale(1/n))}return new this(t,-1,r)}static findByName(t,e){let n=t;if(!Array.isArray(t)){let i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,o=t.length;a<o;a++){let c=t[a],u=c.name.match(s);if(u&&u.length>1){let l=u[1],f=i[l];f||(i[l]=f=[]),f.push(c)}}let r=[];for(let a in i)r.push(this.CreateFromMorphTargetSequence(a,i[a],e,n));return r}resetDuration(){let t=this.tracks,e=0;for(let n=0,i=t.length;n!==i;++n){let s=this.tracks[n];e=Math.max(e,s.times[s.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){let t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());let e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}};function ho(h){switch(h.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Qe;case"vector":case"vector2":case"vector3":case"vector4":return Pt;case"color":return En;case"quaternion":return Ot;case"bool":case"boolean":return ne;case"string":return ie}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+h)}function uo(h){if(h.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=ho(h.type);if(h.times===void 0){let n=[],i=[];oo(h.keys,n,i,"value"),h.times=n,h.values=i}let e;return t.parse!==void 0?e=t.parse(h):e=new t(h.name,h.times,h.values,h.interpolation),fn(h.settings)&&(e.settings={inTangents:he(h.settings.inTangents,Float32Array),outTangents:he(h.settings.outTangents,Float32Array)}),e}var qe={enabled:!1,files:{},add:function(h,t){this.enabled!==!1&&(Ar(h)||(this.files[h]=t))},get:function(h){if(this.enabled!==!1&&!Ar(h))return this.files[h]},remove:function(h){delete this.files[h]},clear:function(){this.files={}}};function Ar(h){try{let t=h.slice(h.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var wi=class{constructor(t,e,n){let i=this,s=!1,r=0,a=0,o,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,s===!1&&i.onStart!==void 0&&i.onStart(u,r,a),s=!0},this.itemEnd=function(u){r++,i.onProgress!==void 0&&i.onProgress(u,r,a),r===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),o?o(u):u},this.setURLModifier=function(u){return o=u,this},this.addHandler=function(u,l){return c.push(u,l),this},this.removeHandler=function(u){let l=c.indexOf(u);return l!==-1&&c.splice(l,2),this},this.getHandler=function(u){for(let l=0,f=c.length;l<f;l+=2){let d=c[l],p=c[l+1];if(d.global&&(d.lastIndex=0),d.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},ta=new wi,ge=class{constructor(t){this.manager=t!==void 0?t:ta,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,s){n.load(t,i,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}};ge.DEFAULT_MATERIAL_NAME="__DEFAULT";var jt={},xs=class extends Error{constructor(t,e){super(t),this.response=e}},Cn=class extends ge{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let s=qe.get(`file:${t}`);if(s!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(s),this.manager.itemEnd(t)},0);return}if(jt[t]!==void 0){jt[t].push({onLoad:e,onProgress:n,onError:i});return}jt[t]=[],jt[t].push({onLoad:e,onProgress:n,onError:i});let r=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,o=this.responseType;fetch(r).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&J("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=jt[t],l=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,p=d!==0,m=0,g=new ReadableStream({start(v){y();function y(){l.read().then(({done:_,value:x})=>{if(_)v.close();else{m+=x.byteLength;let S=new ProgressEvent("progress",{lengthComputable:p,loaded:m,total:d});for(let b=0,w=u.length;b<w;b++){let T=u[b];T.onProgress&&T.onProgress(S)}v.enqueue(x),y()}},_=>{v.error(_)})}}});return new Response(g)}else throw new xs(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(o){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let l=/charset="?([^;"\s]*)"?/i.exec(a),f=l&&l[1]?l[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(p=>d.decode(p))}}}).then(c=>{qe.add(`file:${t}`,c);let u=jt[t];delete jt[t];for(let l=0,f=u.length;l<f;l++){let d=u[l];d.onLoad&&d.onLoad(c)}}).catch(c=>{let u=jt[t];if(u===void 0)throw this.manager.itemError(t),c;delete jt[t];for(let l=0,f=u.length;l<f;l++){let d=u[l];d.onError&&d.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var He=new WeakMap,we=class extends ge{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let s=this,r=qe.get(`image:${t}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(t),setTimeout(function(){e&&e(r),s.manager.itemEnd(t)},0);else{let l=He.get(r);l===void 0&&(l=[],He.set(r,l)),l.push({onLoad:e,onError:i})}return r}let a=li("img");function o(){u(),e&&e(this);let l=He.get(this)||[];for(let f=0;f<l.length;f++){let d=l[f];d.onLoad&&d.onLoad(this)}He.delete(this),s.manager.itemEnd(t)}function c(l){u(),i&&i(l),qe.remove(`image:${t}`);let f=He.get(this)||[];for(let d=0;d<f.length;d++){let p=f[d];p.onError&&p.onError(l)}He.delete(this),s.manager.itemError(t),s.manager.itemEnd(t)}function u(){a.removeEventListener("load",o,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",o,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),qe.add(`image:${t}`,a),s.manager.itemStart(t),a.fetchPriority=this.priority,a.src=t,a}};var Te=class extends rt{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new W(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}};var ts=new z,wr=new M,Tr=new M,en=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new V(512,512),this.mapType=Us,this.map=null,this.mapPass=null,this.matrix=new z,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xi,this._frameExtents=new V(1,1),this._viewportCount=1,this._viewports=[new Rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;wr.setFromMatrixPosition(t.matrixWorld),e.position.copy(wr),Tr.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Tr),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){ts.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(ts,t.coordinateSystem,t.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,a=i?i.w/s.y:1,o=i?i.x/s.x:0,c=i?i.y/s.y:0;t.coordinateSystem===mn||t.reversedDepth?e.set(.5*r,0,0,.5*r+o,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*r,0,0,.5*r+o,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(ts)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},ei=new M,ni=new yt,Gt=new M,Rn=class extends rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new z,this.projectionMatrix=new z,this.projectionMatrixInverse=new z,this.coordinateSystem=fe,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(ei,ni,Gt),Gt.x===1&&Gt.y===1&&Gt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ei,ni,Gt.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(ei,ni,Gt),Gt.x===1&&Gt.y===1&&Gt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ei,ni,Gt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ce=new M,Er=new V,Cr=new V,Ee=class extends Rn{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=hi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ii*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return hi*2*Math.atan(Math.tan(Ii*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ce.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ce.x,ce.y).multiplyScalar(-t/ce.z),ce.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ce.x,ce.y).multiplyScalar(-t/ce.z)}getViewSize(t,e){return this.getViewBounds(t,Er,Cr),e.subVectors(Cr,Er)}setViewOffset(t,e,n,i,s,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ii*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let o=r.fullWidth,c=r.fullHeight;s+=r.offsetX*i/o,e-=r.offsetY*n/c,i*=r.width/o,n*=r.height/c}let a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},vs=class extends en{constructor(){super(new Ee(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){let e=this.camera,n=hi*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=t.distance||e.far;(n!==e.fov||i!==e.aspect||s!==e.far)&&(e.fov=n,e.aspect=i,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){let t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}},Pn=class extends Te{constructor(t,e,n=0,i=Math.PI/3,s=0,r=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.target=new rt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new vs}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}},ys=class extends en{constructor(){super(new Ee(90,1,.5,500)),this.isPointLightShadow=!0}},In=class extends Te{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ys}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},nn=class extends Rn{constructor(t=-1,e=1,n=1,i=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-t,r=n+t,a=i+e,o=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,r=s+c*this.view.width,a-=u*this.view.offsetY,o=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,r,a,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ss=class extends en{constructor(){super(new nn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ln=class extends Te{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(rt.DEFAULT_UP),this.updateMatrix(),this.target=new rt,this.shadow=new Ss}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var sn=class extends Te{constructor(t,e,n=10,i=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(t){this.intensity=t/(this.width*this.height*Math.PI)}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this}toJSON(t){let e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e}};var Ce=class{static extractUrlBase(t){let e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}};var zs="\\[\\]\\.:\\/",fo=new RegExp("["+zs+"]","g"),ks="[^"+zs+"]",po="[^"+zs.replace("\\.","")+"]",mo=/((?:WC+[\/:])*)/.source.replace("WC",ks),go=/(WCOD+)?/.source.replace("WCOD",po),_o=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ks),xo=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ks),vo=new RegExp("^"+mo+go+_o+xo+"$"),yo=["material","materials","bones","map"],Ms=class{constructor(t,e,n){let i=n||Z.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Z=class h{constructor(t,e,n){this.path=e,this.parsedPath=n||h.parseTrackName(e),this.node=h.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new h.Composite(t,e,n):new h(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(fo,"")}static parseTrackName(t){let e=vo.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);yo.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(s){for(let r=0;r<s.length;r++){let a=s[r];if(a.name===e||a.uuid===e)return a;let o=n(a.children);if(o)return o}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,s=e.propertyIndex;if(t||(t=h.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){J("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Q("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Q("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Q("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Q("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Q("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Q("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Q("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let r=t[i];if(r===void 0){let c=e.nodeName;Q("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let o=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Q("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Q("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}o=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(o=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(o=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=i;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Z.Composite=Ms;Z.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Z.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Z.prototype.GetterByBindingType=[Z.prototype._getValue_direct,Z.prototype._getValue_array,Z.prototype._getValue_arrayElement,Z.prototype._getValue_toArray];Z.prototype.SetterByBindingTypeAndVersioning=[[Z.prototype._setValue_direct,Z.prototype._setValue_direct_setNeedsUpdate,Z.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Z.prototype._setValue_array,Z.prototype._setValue_array_setNeedsUpdate,Z.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Z.prototype._setValue_arrayElement,Z.prototype._setValue_arrayElement_setNeedsUpdate,Z.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Z.prototype._setValue_fromArray,Z.prototype._setValue_fromArray_setNeedsUpdate,Z.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Dh=new Float32Array(1);var bs=class{static{this.prototype.isMatrix2=!0}constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let s=this.elements;return s[0]=t,s[2]=e,s[1]=n,s[3]=i,this}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?J("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var So=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mo=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,bo=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ao=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wo=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,To=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Eo=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Co=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ro=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Po=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Io=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lo=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Do=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,No=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Uo=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Fo=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Oo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zo=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ko=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Vo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Go=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ho=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Wo=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Xo=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,qo=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yo=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zo=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jo=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$o="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ko=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jo=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Qo=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,tl=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,el=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nl=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,il=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sl=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rl=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,al=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ol=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ll=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cl=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hl=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ul=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,fl=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,dl=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pl=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ml=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gl=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_l=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,xl=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,vl=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,yl=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Sl=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ml=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,bl=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Al=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wl=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tl=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,El=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cl=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rl=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Pl=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Il=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ll=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dl=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Nl=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ul=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fl=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ol=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bl=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,zl=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,kl=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vl=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gl=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Hl=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Wl=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xl=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ql=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yl=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zl=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Jl=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,$l=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kl=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jl=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ql=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tc=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ec=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,nc=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ic=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,sc=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rc=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ac=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,oc=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,lc=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cc=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,hc=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,uc=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fc=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dc=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,pc=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,mc=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,gc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_c=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,xc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,vc=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,yc=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Sc=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bc=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ac=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wc=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tc=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ec=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Cc=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Rc=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Pc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ic=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lc=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Dc=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Nc=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Uc=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fc=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Oc=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bc=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,zc=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kc=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Vc=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Gc=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hc=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wc=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Xc=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qc=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yc=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zc=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Jc=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$c=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kc=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jc=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Qc=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,B={alphahash_fragment:So,alphahash_pars_fragment:Mo,alphamap_fragment:bo,alphamap_pars_fragment:Ao,alphatest_fragment:wo,alphatest_pars_fragment:To,aomap_fragment:Eo,aomap_pars_fragment:Co,batching_pars_vertex:Ro,batching_vertex:Po,begin_vertex:Io,beginnormal_vertex:Lo,bsdfs:Do,iridescence_fragment:No,bumpmap_pars_fragment:Uo,clipping_planes_fragment:Fo,clipping_planes_pars_fragment:Oo,clipping_planes_pars_vertex:Bo,clipping_planes_vertex:zo,color_fragment:ko,color_pars_fragment:Vo,color_pars_vertex:Go,color_vertex:Ho,common:Wo,defaultnormal_vertex:Xo,displacementmap_pars_vertex:qo,displacementmap_vertex:Yo,emissivemap_fragment:Zo,emissivemap_pars_fragment:Jo,colorspace_fragment:$o,colorspace_pars_fragment:Ko,envmap_fragment:jo,envmap_common_pars_fragment:Qo,envmap_pars_fragment:tl,envmap_pars_vertex:el,envmap_physical_pars_fragment:fl,envmap_vertex:nl,fog_vertex:il,fog_pars_vertex:sl,fog_fragment:rl,fog_pars_fragment:al,gradientmap_pars_fragment:ol,lightmap_pars_fragment:ll,lights_lambert_fragment:cl,lights_lambert_pars_fragment:hl,lights_pars_begin:ul,lights_toon_fragment:dl,lights_toon_pars_fragment:pl,lights_phong_fragment:ml,lights_phong_pars_fragment:gl,lights_physical_fragment:_l,lights_physical_pars_fragment:xl,lights_fragment_begin:vl,lights_fragment_maps:yl,lights_fragment_end:Sl,lightprobes_pars_fragment:Ml,logdepthbuf_fragment:bl,logdepthbuf_pars_fragment:Al,logdepthbuf_pars_vertex:wl,logdepthbuf_vertex:Tl,map_fragment:El,map_pars_fragment:Cl,map_particle_fragment:Rl,map_particle_pars_fragment:Pl,metalnessmap_fragment:Il,metalnessmap_pars_fragment:Ll,morphinstance_vertex:Dl,morphcolor_vertex:Nl,morphnormal_vertex:Ul,morphtarget_pars_vertex:Fl,morphtarget_vertex:Ol,normal_fragment_begin:Bl,normal_fragment_maps:zl,normal_pars_fragment:kl,normal_pars_vertex:Vl,normal_vertex:Gl,normalmap_pars_fragment:Hl,clearcoat_normal_fragment_begin:Wl,clearcoat_normal_fragment_maps:Xl,clearcoat_pars_fragment:ql,iridescence_pars_fragment:Yl,opaque_fragment:Zl,packing:Jl,premultiplied_alpha_fragment:$l,project_vertex:Kl,dithering_fragment:jl,dithering_pars_fragment:Ql,roughnessmap_fragment:tc,roughnessmap_pars_fragment:ec,shadowmap_pars_fragment:nc,shadowmap_pars_vertex:ic,shadowmap_vertex:sc,shadowmask_pars_fragment:rc,skinbase_vertex:ac,skinning_pars_vertex:oc,skinning_vertex:lc,skinnormal_vertex:cc,specularmap_fragment:hc,specularmap_pars_fragment:uc,tonemapping_fragment:fc,tonemapping_pars_fragment:dc,transmission_fragment:pc,transmission_pars_fragment:mc,uv_pars_fragment:gc,uv_pars_vertex:_c,uv_vertex:xc,worldpos_vertex:vc,background_vert:yc,background_frag:Sc,backgroundCube_vert:Mc,backgroundCube_frag:bc,cube_vert:Ac,cube_frag:wc,depth_vert:Tc,depth_frag:Ec,distance_vert:Cc,distance_frag:Rc,equirect_vert:Pc,equirect_frag:Ic,linedashed_vert:Lc,linedashed_frag:Dc,meshbasic_vert:Nc,meshbasic_frag:Uc,meshlambert_vert:Fc,meshlambert_frag:Oc,meshmatcap_vert:Bc,meshmatcap_frag:zc,meshnormal_vert:kc,meshnormal_frag:Vc,meshphong_vert:Gc,meshphong_frag:Hc,meshphysical_vert:Wc,meshphysical_frag:Xc,meshtoon_vert:qc,meshtoon_frag:Yc,points_vert:Zc,points_frag:Jc,shadow_vert:$c,shadow_frag:Kc,sprite_vert:jc,sprite_frag:Qc},I={common:{diffuse:{value:new W(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new F},alphaMap:{value:null},alphaMapTransform:{value:new F},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new F}},envmap:{envMap:{value:null},envMapRotation:{value:new F},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new F}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new F}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new F},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new F},normalScale:{value:new V(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new F},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new F}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new F}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new F}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new W(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new W(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new F},alphaTest:{value:0},uvTransform:{value:new F}},sprite:{diffuse:{value:new W(16777215)},opacity:{value:1},center:{value:new V(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new F},alphaMap:{value:null},alphaMapTransform:{value:new F},alphaTest:{value:0}}},ea={basic:{uniforms:vt([I.common,I.specularmap,I.envmap,I.aomap,I.lightmap,I.fog]),vertexShader:B.meshbasic_vert,fragmentShader:B.meshbasic_frag},lambert:{uniforms:vt([I.common,I.specularmap,I.envmap,I.aomap,I.lightmap,I.emissivemap,I.bumpmap,I.normalmap,I.displacementmap,I.fog,I.lights,{emissive:{value:new W(0)},envMapIntensity:{value:1}}]),vertexShader:B.meshlambert_vert,fragmentShader:B.meshlambert_frag},phong:{uniforms:vt([I.common,I.specularmap,I.envmap,I.aomap,I.lightmap,I.emissivemap,I.bumpmap,I.normalmap,I.displacementmap,I.fog,I.lights,{emissive:{value:new W(0)},specular:{value:new W(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:B.meshphong_vert,fragmentShader:B.meshphong_frag},standard:{uniforms:vt([I.common,I.envmap,I.aomap,I.lightmap,I.emissivemap,I.bumpmap,I.normalmap,I.displacementmap,I.roughnessmap,I.metalnessmap,I.fog,I.lights,{emissive:{value:new W(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:B.meshphysical_vert,fragmentShader:B.meshphysical_frag},toon:{uniforms:vt([I.common,I.aomap,I.lightmap,I.emissivemap,I.bumpmap,I.normalmap,I.displacementmap,I.gradientmap,I.fog,I.lights,{emissive:{value:new W(0)}}]),vertexShader:B.meshtoon_vert,fragmentShader:B.meshtoon_frag},matcap:{uniforms:vt([I.common,I.bumpmap,I.normalmap,I.displacementmap,I.fog,{matcap:{value:null}}]),vertexShader:B.meshmatcap_vert,fragmentShader:B.meshmatcap_frag},points:{uniforms:vt([I.points,I.fog]),vertexShader:B.points_vert,fragmentShader:B.points_frag},dashed:{uniforms:vt([I.common,I.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:B.linedashed_vert,fragmentShader:B.linedashed_frag},depth:{uniforms:vt([I.common,I.displacementmap]),vertexShader:B.depth_vert,fragmentShader:B.depth_frag},normal:{uniforms:vt([I.common,I.bumpmap,I.normalmap,I.displacementmap,{opacity:{value:1}}]),vertexShader:B.meshnormal_vert,fragmentShader:B.meshnormal_frag},sprite:{uniforms:vt([I.sprite,I.fog]),vertexShader:B.sprite_vert,fragmentShader:B.sprite_frag},background:{uniforms:{uvTransform:{value:new F},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:B.background_vert,fragmentShader:B.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new F}},vertexShader:B.backgroundCube_vert,fragmentShader:B.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:B.cube_vert,fragmentShader:B.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:B.equirect_vert,fragmentShader:B.equirect_frag},distance:{uniforms:vt([I.common,I.displacementmap,{referencePosition:{value:new M},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:B.distance_vert,fragmentShader:B.distance_frag},shadow:{uniforms:vt([I.lights,I.fog,{color:{value:new W(0)},opacity:{value:1}}]),vertexShader:B.shadow_vert,fragmentShader:B.shadow_frag}};ea.physical={uniforms:vt([ea.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new F},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new F},clearcoatNormalScale:{value:new V(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new F},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new F},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new F},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new F},sheen:{value:0},sheenColor:{value:new W(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new F},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new F},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new F},transmissionSamplerSize:{value:new V},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new F},attenuationDistance:{value:0},attenuationColor:{value:new W(0)},specularColor:{value:new W(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new F},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new F},anisotropyVector:{value:new V},anisotropyMap:{value:null},anisotropyMapTransform:{value:new F}}]),vertexShader:B.meshphysical_vert,fragmentShader:B.meshphysical_frag};var th=new F;th.set(-1,0,0,0,1,0,0,0,1);var _g={[Es]:"LINEAR_TONE_MAPPING",[Cs]:"REINHARD_TONE_MAPPING",[Rs]:"CINEON_TONE_MAPPING",[Ps]:"ACES_FILMIC_TONE_MAPPING",[Ls]:"AGX_TONE_MAPPING",[Ds]:"NEUTRAL_TONE_MAPPING",[Is]:"CUSTOM_TONE_MAPPING"};var xg=new Float32Array(16),vg=new Float32Array(9),yg=new Float32Array(4);var Sg={[Es]:"Linear",[Cs]:"Reinhard",[Rs]:"Cineon",[Ps]:"ACESFilmic",[Ls]:"AgX",[Ds]:"Neutral",[Is]:"Custom"};var Mg={[Rr]:"SHADOWMAP_TYPE_PCF",[Pr]:"SHADOWMAP_TYPE_VSM"};var bg={[zr]:"ENVMAP_MODE_REFRACTION"};var Ag={[Ts]:"ENVMAP_BLENDING_MULTIPLY",[Fr]:"ENVMAP_BLENDING_MIX",[Or]:"ENVMAP_BLENDING_ADD"};var eh=new F;eh.set(-1,0,0,0,1,0,0,0,1);var wg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.8.3
*/var Tt=Uint8Array,rn=Uint16Array,nh=Int32Array,na=new Tt([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ia=new Tt([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ih=new Tt([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),sa=function(h,t){for(var e=new rn(31),n=0;n<31;++n)e[n]=t+=1<<h[n-1];for(var i=new nh(e[30]),n=1;n<30;++n)for(var s=e[n];s<e[n+1];++s)i[s]=s-e[n]<<5|n;return{b:e,r:i}},ra=sa(na,2),aa=ra.b,sh=ra.r;aa[28]=258,sh[258]=28;var oa=sa(ia,0),rh=oa.b,Cg=oa.r,Ws=new rn(32768);for(H=0;H<32768;++H)se=(H&43690)>>1|(H&21845)<<1,se=(se&52428)>>2|(se&13107)<<2,se=(se&61680)>>4|(se&3855)<<4,Ws[H]=((se&65280)>>8|(se&255)<<8)>>1;var se,H,Dn=(function(h,t,e){for(var n=h.length,i=0,s=new rn(t);i<n;++i)h[i]&&++s[h[i]-1];var r=new rn(t);for(i=1;i<t;++i)r[i]=r[i-1]+s[i-1]<<1;var a;if(e){a=new rn(1<<t);var o=15-t;for(i=0;i<n;++i)if(h[i])for(var c=i<<4|h[i],u=t-h[i],l=r[h[i]-1]++<<u,f=l|(1<<u)-1;l<=f;++l)a[Ws[l]>>o]=c}else for(a=new rn(n),i=0;i<n;++i)h[i]&&(a[i]=Ws[r[h[i]-1]++]>>15-h[i]);return a}),Nn=new Tt(288);for(H=0;H<144;++H)Nn[H]=8;var H;for(H=144;H<256;++H)Nn[H]=9;var H;for(H=256;H<280;++H)Nn[H]=7;var H;for(H=280;H<288;++H)Nn[H]=8;var H,la=new Tt(32);for(H=0;H<32;++H)la[H]=5;var H;var ah=Dn(Nn,9,1);var oh=Dn(la,5,1),Vs=function(h){for(var t=h[0],e=1;e<h.length;++e)h[e]>t&&(t=h[e]);return t},zt=function(h,t,e){var n=t/8|0;return(h[n]|h[n+1]<<8)>>(t&7)&e},Gs=function(h,t){var e=t/8|0;return(h[e]|h[e+1]<<8|h[e+2]<<16)>>(t&7)},lh=function(h){return(h+7)/8|0},qs=function(h,t,e){return(t==null||t<0)&&(t=0),(e==null||e>h.length)&&(e=h.length),new Tt(h.subarray(t,e))};var ch=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],wt=function(h,t,e){var n=new Error(t||ch[h]);if(n.code=h,Error.captureStackTrace&&Error.captureStackTrace(n,wt),!e)throw n;return n},hh=function(h,t,e,n){var i=h.length,s=n?n.length:0;if(!i||t.f&&!t.l)return e||new Tt(0);var r=!e,a=r||t.i!=2,o=t.i;r&&(e=new Tt(i*3));var c=function(lt){var ht=e.length;if(lt>ht){var X=new Tt(Math.max(ht*2,lt));X.set(e),e=X}},u=t.f||0,l=t.p||0,f=t.b||0,d=t.l,p=t.d,m=t.m,g=t.n,v=i*8;do{if(!d){u=zt(h,l,1);var y=zt(h,l+1,3);if(l+=3,y)if(y==1)d=ah,p=oh,m=9,g=5;else if(y==2){var b=zt(h,l,31)+257,w=zt(h,l+10,15)+4,T=b+zt(h,l+5,31)+1;l+=14;for(var A=new Tt(T),E=new Tt(19),P=0;P<w;++P)E[ih[P]]=zt(h,l+P*3,7);l+=w*3;for(var C=Vs(E),D=(1<<C)-1,N=Dn(E,C,1),P=0;P<T;){var L=N[zt(h,l,D)];l+=L&15;var _=L>>4;if(_<16)A[P++]=_;else{var k=0,$=0;for(_==16?($=3+zt(h,l,3),l+=2,k=A[P-1]):_==17?($=3+zt(h,l,7),l+=3):_==18&&($=11+zt(h,l,127),l+=7);$--;)A[P++]=k}}var nt=A.subarray(0,b),G=A.subarray(b);m=Vs(nt),g=Vs(G),d=Dn(nt,m,1),p=Dn(G,g,1)}else wt(1);else{var _=lh(l)+4,x=h[_-4]|h[_-3]<<8,S=_+x;if(S>i){o&&wt(0);break}a&&c(f+x),e.set(h.subarray(_,S),f),t.b=f+=x,t.p=l=S*8,t.f=u;continue}if(l>v){o&&wt(0);break}}a&&c(f+131072);for(var Y=(1<<m)-1,K=(1<<g)-1,j=l;;j=l){var k=d[Gs(h,l)&Y],at=k>>4;if(l+=k&15,l>v){o&&wt(0);break}if(k||wt(2),at<256)e[f++]=at;else if(at==256){j=l,d=null;break}else{var xt=at-254;if(at>264){var P=at-257,ot=na[P];xt=zt(h,l,(1<<ot)-1)+aa[P],l+=ot}var ct=p[Gs(h,l)&K],Lt=ct>>4;ct||wt(3),l+=ct&15;var G=rh[Lt];if(Lt>3){var ot=ia[Lt];G+=Gs(h,l)&(1<<ot)-1,l+=ot}if(l>v){o&&wt(0);break}a&&c(f+131072);var Mt=f+xt;if(f<G){var U=s-G,q=Math.min(G,Mt);for(U+f<0&&wt(3);f<q;++f)e[f]=n[U+f]}for(;f<Mt;++f)e[f]=e[f-G]}}t.l=d,t.p=j,t.b=f,t.f=u,d&&(u=1,t.m=m,t.d=p,t.n=g)}while(!u);return f!=e.length&&r?qs(e,0,f):e.subarray(0,f)};var uh=new Tt(0);var Xt=function(h,t){return h[t]|h[t+1]<<8},It=function(h,t){return(h[t]|h[t+1]<<8|h[t+2]<<16|h[t+3]<<24)>>>0},Hs=function(h,t){return It(h,t)+It(h,t+4)*4294967296};function fh(h,t){return hh(h,{i:2},t&&t.out,t&&t.dictionary)}var Xs=typeof TextDecoder<"u"&&new TextDecoder,dh=0;try{Xs.decode(uh,{stream:!0}),dh=1}catch{}var ph=function(h){for(var t="",e=0;;){var n=h[e++],i=(n>127)+(n>223)+(n>239);if(e+i>h.length)return{s:t,r:qs(h,e-1)};i?i==3?(n=((n&15)<<18|(h[e++]&63)<<12|(h[e++]&63)<<6|h[e++]&63)-65536,t+=String.fromCharCode(55296|n>>10,56320|n&1023)):i&1?t+=String.fromCharCode((n&31)<<6|h[e++]&63):t+=String.fromCharCode((n&15)<<12|(h[e++]&63)<<6|h[e++]&63):t+=String.fromCharCode(n)}};function mh(h,t){if(t){for(var e="",n=0;n<h.length;n+=16384)e+=String.fromCharCode.apply(null,h.subarray(n,n+16384));return e}else{if(Xs)return Xs.decode(h);var i=ph(h),s=i.s,e=i.r;return e.length&&wt(8),s}}var gh=function(h,t){return t+30+Xt(h,t+26)+Xt(h,t+28)},_h=function(h,t,e){var n=Xt(h,t+28),i=Xt(h,t+30),s=mh(h.subarray(t+46,t+46+n),!(Xt(h,t+8)&2048)),r=t+46+n,a=xh(h,r,i,e,It(h,t+20),It(h,t+24),It(h,t+42)),o=a[0],c=a[1],u=a[2];return[Xt(h,t+10),o,c,s,r+i+Xt(h,t+32),u]},xh=function(h,t,e,n,i,s,r){var a=i==4294967295,o=s==4294967295,c=r==4294967295,u=t+e,l=a+o+c;if(n&&l){for(;t+4<u;t+=4+Xt(h,t+2))if(Xt(h,t)==1)return[a?Hs(h,t+4+8*o):i,o?Hs(h,t+4):s,c?Hs(h,t+4+8*(o+a)):r,1];n<2&&wt(13)}return[i,s,r,0]};function ca(h,t){for(var e={},n=h.length-22;It(h,n)!=101010256;--n)(!n||h.length-n>65558)&&wt(13);var i=Xt(h,n+8);if(!i)return{};var s=It(h,n+16),r=It(h,n-20)==117853008;if(r){var a=It(h,n-12);r=It(h,a)==101075792,r&&(i=It(h,a+32),s=It(h,a+48))}for(var o=t&&t.filter,c=0;c<i;++c){var u=_h(h,s,r),l=u[0],f=u[1],d=u[2],p=u[3],m=u[4],g=u[5],v=gh(h,g);s=m,(!o||o({name:p,size:f,originalSize:d,compression:l}))&&(l?l==8?e[p]=fh(h.subarray(v,v+f),{out:new Tt(d)}):wt(14,"unknown compression type "+l):e[p]=qs(h,v,v+f))}return e}var vh=/^def\s+(?:(\w+)\s+)?"?([^"]+)"?$/,yh=/^string\s+(\w+)$/,Sh=/^(?:uniform\s+)?(\w+(?:\[\])?)\s+(.+)$/,Ti=Symbol("valueMetadata"),Ei={Attribute:1,Prim:6,Relationship:8},Ci=class{parseText(t){t=this._preprocess(t);let e={},n=t.split(`
`),i=null,s=e,r=[e];for(let a of n)if(a.includes("=")){let o=this._findAssignmentOperator(a);if(o===-1){i=a.trim();continue}let c=a.slice(0,o).trim(),u=a.slice(o+1).trim();if(u.endsWith("{")){let l={};r.push(l),s[c]=l,s=l}else if(u.endsWith("(")){let l=u.slice(0,-1).trim();s[c]=l;let f={};s[Ti]===void 0&&(s[Ti]={}),s[Ti][c]=f,r.push(f),s=f}else s[c]=u}else if(a.includes(":")&&!a.includes("=")){let o=a.indexOf(":"),c=a.slice(0,o).trim(),u=a.slice(o+1).trim();/^-?[\d.]+$/.test(c)&&(s[c]=u)}else if(a.endsWith("{")){i=a.slice(0,-1).trim()||i;let o=s[i]||{};r.push(o),s[i]=o,s=o}else if(a.endsWith("}")){if(r.pop(),r.length===0)continue;s=r[r.length-1]}else if(a.endsWith("(")){let o={};r.push(o),i=a.split("(")[0].trim()||i,s[i]=o,s=o}else a.endsWith(")")?(r.pop(),s=r[r.length-1]):a.trim()&&(i=a.trim());return e}_preprocess(t){t=this._stripBlockComments(t),t=this._collapseTripleQuotedStrings(t);let e=t.split(`
`),n=[],i=!1,s=0,r=0,a="";for(let o=0;o<e.length;o++){let c=e[o];c=this._stripInlineComment(c);let u=c.trim();if(i){a+=" "+u;for(let l of u)l==="["?s++:l==="]"?s--:l==="("&&s>0?r++:l===")"&&s>0&&r--;s===0&&r===0&&(n.push(a),a="",i=!1)}else{if(u.includes("=")){let l=this._findAssignmentOperator(u);if(l!==-1){let f=u.slice(l+1).trim(),d=0,p=0;for(let m of f)m==="["?d++:m==="]"&&p++;if(d>p){i=!0,s=d-p,r=0,a=u;continue}}}n.push(u)}}return n.join(`
`)}_stripBlockComments(t){let e=/\/\*|"""|'''|["']/g,n="",i=0;for(;i<t.length;){e.lastIndex=i;let s=e.exec(t);if(s===null){n+=t.slice(i);break}let r=s.index,a=s[0];if(a==="/*"){n+=t.slice(i,r);let o=t.indexOf("*/",r+2);i=o===-1?t.length:o+2}else{let o=this._findStringEnd(t,r,a);n+=t.slice(i,o),i=o}}return n}_findStringEnd(t,e,n){if(n.length===3){let i=t.indexOf(n,e+3);return i===-1?t.length:i+3}for(let i=e+1;i<t.length;i++){let s=t[i];if(s==="\\")i++;else{if(s===n)return i+1;if(s===`
`)return i}}return t.length}_collapseTripleQuotedStrings(t){let e=/'''|"""/g,n="",i=0;for(;i<t.length;){e.lastIndex=i;let s=e.exec(t);if(s===null){n+=t.slice(i);break}let r=s.index,a=s[0];n+=t.slice(i,r);let o=t.indexOf(a,r+3),c=t.slice(r+3,o===-1?t.length:o);if(n+=a+c.replace(/\r/g,"").replace(/\n/g,"\\n"),o===-1)break;n+=a,i=o+3}return n}_stripInlineComment(t){if(t.trim().startsWith("#usda"))return t;let e=!1,n=null,i=!1;for(let s=0;s<t.length;s++){let r=t[s];if(i){i=!1;continue}if(r==="\\"){i=!0;continue}if(!e&&(r==='"'||r==="'"))e=!0,n=r;else if(e&&r===n)e=!1,n=null;else if(!e&&r==="#")return t.slice(0,s).trimEnd()}return t}_findAssignmentOperator(t){let e=!1,n=null,i=!1;for(let s=0;s<t.length;s++){let r=t[s];if(i){i=!1;continue}if(r==="\\"){i=!0;continue}if(!e&&(r==='"'||r==="'"))e=!0,n=r;else if(e&&r===n)e=!1,n=null;else if(!e&&r==="=")return s}return-1}parseData(t){let e=this.parseText(t),n={},i={};if("#usda 1.0"in e){let r=e["#usda 1.0"];r.upAxis&&(i.upAxis=r.upAxis.replace(/"/g,"")),r.defaultPrim&&(i.defaultPrim=r.defaultPrim.replace(/"/g,"")),r.metersPerUnit!==void 0&&(i.metersPerUnit=parseFloat(r.metersPerUnit)),r.framesPerSecond!==void 0&&(i.framesPerSecond=parseFloat(r.framesPerSecond)),r.timeCodesPerSecond!==void 0&&(i.timeCodesPerSecond=parseFloat(r.timeCodesPerSecond))}n["/"]={specType:Ei.Prim,fields:i};let s=(r,a)=>{let o=[];for(let c in r){if(c==="#usda 1.0"||c==="variants")continue;let u=c.match(vh);if(u){let l=u[1]||"",f=u[2],d=a==="/"?"/"+f:a+"/"+f;o.push(f);let p={typeName:l},m=r[c];this._extractPrimData(m,d,p,n,Ei),n[d]={specType:Ei.Prim,fields:p},s(m,d)}}o.length>0&&n[a]&&(n[a].fields.primChildren=o)};return s(e,"/"),this._inferSkelElementSize(n),{specsByPath:n}}_inferSkelElementSize(t){for(let e in t){let n=t[e];if(n.specType!==Ei.Prim||n.fields.typeName!=="Mesh")continue;let i=t[e+".points"];if(!i||!i.fields.default)continue;let s=i.fields.default.length/3;s!==0&&(this._inferElementSize(t[e+".primvars:skel:jointIndices"],s),this._inferElementSize(t[e+".primvars:skel:jointWeights"],s))}}_inferElementSize(t,e){if(!t||t.fields.elementSize!==void 0||!t.fields.default)return;let n=t.fields.default.length;n>0&&n%e===0&&(t.fields.elementSize=n/e)}_extractPrimData(t,e,n,i,s){if(!(!t||typeof t!="object"))for(let r in t){if(r.startsWith("def "))continue;if(r==="prepend references"){n.references=[t[r]];continue}if(r==="payload"){n.payload=t[r];continue}if(r==="variants"){let o={},c=t[r];for(let u in c){let l=u.match(yh);if(l){let f=l[1],d=c[u].replace(/"/g,"");o[f]=d}}Object.keys(o).length>0&&(n.variantSelection=o);continue}if(r.startsWith("rel ")){let o=r.slice(4),c=e+"."+o,u=t[r].replace(/[<>]/g,""),l=t[Ti]?.[r],f={targetPaths:[u]};l?.bindMaterialAs!==void 0&&(f.bindMaterialAs=this._parseString(String(l.bindMaterialAs).trim())),i[c]={specType:s.Relationship,fields:f};continue}if(r.includes("xformOpOrder")){let o=t[r].replace(/[\[\]]/g,"").split(",").map(c=>c.trim().replace(/"/g,""));n.xformOpOrder=o;continue}let a=r.match(Sh);if(a){let o=a[1],c=a[2],u=t[r];if(c.endsWith(".connect")){let l=c.slice(0,-8),f=e+"."+l,d=String(u).trim();d.startsWith("<")&&(d=d.slice(1)),d.endsWith(">")&&(d=d.slice(0,-1)),i[f]||(i[f]={specType:s.Attribute,fields:{typeName:o}}),i[f].fields.connectionPaths=[d];continue}if(c.endsWith(".timeSamples")&&typeof u=="object"){let l=c.slice(0,-12),f=e+"."+l,d=[],p=[];for(let g in u){let v=parseFloat(g);isNaN(v)||(d.push(v),p.push(this._parseAttributeValue(o,u[g])))}let m=d.map((g,v)=>({t:g,v:p[v]})).sort((g,v)=>g.t-v.t);i[f]={specType:s.Attribute,fields:{timeSamples:{times:m.map(g=>g.t),values:m.map(g=>g.v)},typeName:o}}}else{let l=this._parseAttributeValue(o,u),f=e+"."+c;i[f]?(i[f].fields.default=l,i[f].fields.typeName=o):i[f]={specType:s.Attribute,fields:{default:l,typeName:o}}}}}}_parseAttributeValue(t,e){if(e==null)return;let n=String(e).trim();if(t.endsWith("[]")){let i;try{let s=n.replace(/\(/g,"[").replace(/\)/g,"]");s.endsWith(",")&&(s=s.slice(0,-1));let r=JSON.parse(s);i=Array.isArray(r)&&Array.isArray(r[0])?r.flat():r}catch{i=n.replace(/[\[\]]/g,"").split(",").map(a=>{let o=a.trim(),c=parseFloat(o);return isNaN(c)?o.replace(/"/g,""):c})}if(t.startsWith("quat"))for(let s=0;s<i.length;s+=4){let r=i[s];i[s]=i[s+1],i[s+1]=i[s+2],i[s+2]=i[s+3],i[s+3]=r}return i}if(t.includes("3")||t.includes("2")||t.includes("4"))return n.replace(/[()]/g,"").split(",").map(r=>parseFloat(r.trim()));if(t.startsWith("quat")){let s=n.replace(/[()]/g,"").split(",").map(r=>parseFloat(r.trim()));return[s[1],s[2],s[3],s[0]]}return t.includes("matrix")?n.replace(/[()]/g,"").split(",").map(r=>parseFloat(r.trim())):t==="float"||t==="double"||t==="int"?parseFloat(n):t==="string"||t==="token"?this._parseString(n):t==="asset"?n.replace(/@/g,"").replace(/"/g,""):this._parseString(n)}_parseString(t){(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1));let e="",n=0;for(;n<t.length;)if(t[n]==="\\"&&n+1<t.length){let i=t[n+1];switch(i){case"n":e+=`
`;break;case"t":e+="	";break;case"r":e+="\r";break;case"\\":e+="\\";break;case'"':e+='"';break;case"'":e+="'";break;default:e+=i;break}n+=2}else e+=t[n],n++;return e}};var Ys=new TextDecoder,ua=new Float32Array(32);for(let h=0;h<32;h++)ua[h]=Math.pow(2,h-15);var Mh=Math.pow(2,-14),R={Invalid:0,Bool:1,UChar:2,Int:3,UInt:4,Int64:5,UInt64:6,Half:7,Float:8,Double:9,String:10,Token:11,AssetPath:12,Matrix2d:13,Matrix3d:14,Matrix4d:15,Quatd:16,Quatf:17,Quath:18,Vec2d:19,Vec2f:20,Vec2h:21,Vec2i:22,Vec3d:23,Vec3f:24,Vec3h:25,Vec3i:26,Vec4d:27,Vec4f:28,Vec4h:29,Vec4i:30,Dictionary:31,TokenListOp:32,StringListOp:33,PathListOp:34,ReferenceListOp:35,IntListOp:36,Int64ListOp:37,UIntListOp:38,UInt64ListOp:39,PathVector:40,TokenVector:41,Specifier:42,Permission:43,Variability:44,VariantSelectionMap:45,TimeSamples:46,Payload:47,DoubleVector:48,LayerOffsetVector:49,StringVector:50,ValueBlock:51,Value:52,UnregisteredValue:53,UnregisteredValueListOp:54,PayloadListOp:55,TimeCode:56,PathExpression:57,Relocates:58,Spline:59,AnimationBlock:60},bh=4294967295,Ah=105,wh=116;function ha(h,t,e,n,i,s){for(;t<e;){let r=h[t++];if(t>e)break;let a=r>>4;if(a===15){let l;do{if(t>=e)break;l=h[t++],a+=l}while(l===255&&t<e)}if(a>0){t+a>e&&(a=e-t);for(let l=0;l<a&&!(i>=s);l++)n[i++]=h[t++]}if(t>=e||t+2>e)break;let o=h[t++]|h[t++]<<8;if(o===0)break;let c=(r&15)+4;if(c===19){let l;do{if(t>=e)break;l=h[t++],c+=l}while(l===255&&t<e)}let u=i-o;if(u<0)break;for(let l=0;l<c&&!(i>=s);l++)n[i++]=n[u+l]}return i}function Zs(h,t){let e=new Uint8Array(t),n=h[0];if(n===0)return ha(h,1,h.length,e,0,t),e;{let s=1,r=[];for(let c=0;c<n;c++){let u=(h[s]|h[s+1]<<8|h[s+2]<<16|h[s+3]<<24)>>>0;r.push(u),s+=4}let a=s,o=0;for(let c=0;c<n;c++){let u=r[c],l=Math.min(65536,t-o);ha(h,a,a+u,e,o,o+l),a+=u,o+=l}return e}}function kt(h,t){let e=t*4+(t*2+7>>3)+4,n=Zs(new Uint8Array(h),e);return Th(n,t)}function Th(h,t){let e=new DataView(h.buffer,h.byteOffset,h.byteLength),n=0,i=e.getInt32(n,!0);n+=4;let s=t*2+7>>3,r=n,a=n+s,o=new Int32Array(t),c=0,u=r,l=a;for(let f=0;f<t;){let d=h[u++];for(let p=0;p<4&&f<t;p++,f++){let m=d>>p*2&3,g=0;switch(m){case 0:g=i;break;case 1:g=e.getInt8(l),l+=1;break;case 2:g=e.getInt16(l,!0),l+=2;break;case 3:g=e.getInt32(l,!0),l+=4;break}c+=g,o[f]=c}}return o}var Js=class{constructor(t){this.buffer=t,this.view=new DataView(t),this.offset=0}seek(t){this.offset=t}tell(){return this.offset}readUint8(){let t=this.view.getUint8(this.offset);return this.offset+=1,t}readInt8(){let t=this.view.getInt8(this.offset);return this.offset+=1,t}readUint16(){let t=this.view.getUint16(this.offset,!0);return this.offset+=2,t}readInt16(){let t=this.view.getInt16(this.offset,!0);return this.offset+=2,t}readUint32(){let t=this.view.getUint32(this.offset,!0);return this.offset+=4,t}readInt32(){let t=this.view.getInt32(this.offset,!0);return this.offset+=4,t}readUint64(){let t=this.view.getUint32(this.offset,!0),e=this.view.getUint32(this.offset+4,!0);return this.offset+=8,e*4294967296+t}readInt64(){let t=this.view.getUint32(this.offset,!0),e=this.view.getInt32(this.offset+4,!0);return this.offset+=8,e*4294967296+t}readFloat32(){let t=this.view.getFloat32(this.offset,!0);return this.offset+=4,t}readFloat64(){let t=this.view.getFloat64(this.offset,!0);return this.offset+=8,t}readBytes(t){let e=new Uint8Array(this.buffer,this.offset,t);return this.offset+=t,e}readString(t){let e=this.readBytes(t),n=0;for(;n<t&&e[n]!==0;)n++;return Ys.decode(e.subarray(0,n))}},Pe=class{constructor(t,e){this.lo=t,this.hi=e}get isArray(){return(this.hi&2147483648)!==0}get isInlined(){return(this.hi&1073741824)!==0}get isCompressed(){return(this.hi&536870912)!==0}get typeEnum(){return this.hi>>16&255}get payload(){return this.lo+(this.hi&65535)*4294967296}getInlinedValue(){return this.lo}},Ie=class{parseData(t){this.buffer=t instanceof ArrayBuffer?t:t.buffer,this.reader=new Js(this.buffer),this.version={major:0,minor:0,patch:0},this._conversionBuffer=new ArrayBuffer(4),this._conversionView=new DataView(this._conversionBuffer),this._readBootstrap(),this._readTOC(),this._readTokens(),this._readStrings(),this._readFields(),this._readFieldSets(),this._readPaths(),this._readSpecs(),this.specsByPath={};for(let e of this.specs){let n=this.paths[e.pathIndex];if(!n)continue;let i=this._getFieldsForSpec(e);this.specsByPath[n]={specType:e.specType,fields:i}}return{specsByPath:this.specsByPath}}_readBootstrap(){let t=this.reader;if(t.seek(0),t.readString(8)!=="PXR-USDC")throw new Error("THREE.USDCParser: Not a valid USDC file.");this.version.major=t.readUint8(),this.version.minor=t.readUint8(),this.version.patch=t.readUint8(),t.readBytes(5),this.tocOffset=t.readUint64()}_readTOC(){let t=this.reader;t.seek(this.tocOffset);let e=t.readUint64();this.sections={};for(let n=0;n<e;n++){let i=t.readString(16),s=t.readUint64(),r=t.readUint64();this.sections[i]={start:s,size:r}}}_readTokens(){let t=this.sections.TOKENS;if(!t)return;let e=this.reader;e.seek(t.start);let n=e.readUint64();if(this.tokens=[],this.version.major===0&&this.version.minor<4){let i=e.readUint64(),s=e.readBytes(i),r=0;for(let a=0;a<n;a++){let o=r;for(;o<s.length&&s[o]!==0;)o++;this.tokens.push(Ys.decode(s.subarray(r,o))),r=o+1}}else{let i=e.readUint64(),s=e.readUint64(),r=e.readBytes(s),a=Zs(r,i),o=0;for(let c=0;c<n;c++){let u=o;for(;u<a.length&&a[u]!==0;)u++;this.tokens.push(Ys.decode(a.subarray(o,u))),o=u+1}}}_readStrings(){let t=this.sections.STRINGS;if(!t){this.strings=[];return}let e=this.reader;e.seek(t.start);let n=e.readUint64();this.strings=[];for(let i=0;i<n;i++)this.strings.push(e.readUint32())}_readFields(){let t=this.sections.FIELDS;if(!t)return;let e=this.reader;if(e.seek(t.start),this.fields=[],this.version.major===0&&this.version.minor<4){let n=Math.floor(t.size/12);for(let i=0;i<n;i++){let s=e.readUint32(),r=e.readUint32(),a=e.readUint32();this.fields.push({tokenIndex:s,valueRep:new Pe(r,a)})}}else{let n=e.readUint64(),i=e.readUint64(),s=e.readBytes(i),r=kt(s.buffer.slice(s.byteOffset,s.byteOffset+i),n),a=e.readUint64(),o=e.readBytes(a),c=Zs(o,n*8),u=new DataView(c.buffer,c.byteOffset,c.byteLength);for(let l=0;l<n;l++){let f=u.getUint32(l*8,!0),d=u.getUint32(l*8+4,!0);this.fields.push({tokenIndex:r[l],valueRep:new Pe(f,d)})}}}_readFieldSets(){let t=this.sections.FIELDSETS;if(!t)return;let e=this.reader;if(e.seek(t.start),this.fieldSets=[],this.version.major===0&&this.version.minor<4){let n=Math.floor(t.size/4);for(let i=0;i<n;i++)this.fieldSets.push(e.readUint32())}else{let n=e.readUint64(),i=e.readUint64(),s=e.readBytes(i),r=kt(s.buffer.slice(s.byteOffset,s.byteOffset+i),n);for(let a=0;a<n;a++)this.fieldSets.push(r[a])}}_readPaths(){let t=this.sections.PATHS;if(!t)return;let e=this.reader;e.seek(t.start);let n=e.readUint64();if(this.paths=new Array(n).fill(""),this.version.major===0&&this.version.minor<4)this._readPathsRecursive("");else{e.readUint64();let i=e.readUint64(),s=e.readBytes(i),r=kt(s.buffer.slice(s.byteOffset,s.byteOffset+i),n),a=e.readUint64(),o=e.readBytes(a),c=kt(o.buffer.slice(o.byteOffset,o.byteOffset+a),n),u=e.readUint64(),l=e.readBytes(u),f=kt(l.buffer.slice(l.byteOffset,l.byteOffset+u),n);this._buildPathsFromCompressed(r,c,f)}}_readPathsRecursive(t,e=0){let n=this.reader;if(e>1e3)return;let i=n.readUint32(),s=n.readUint32(),r=n.readUint8(),a=(r&1)!==0,o=(r&2)!==0,c=(r&4)!==0,u;if(t==="")u="/";else{let l=this.tokens[s]||"";c?u=t+"."+l:u=t==="/"?"/"+l:t+"/"+l}if(this.paths[i]=u,a&&o){let l=n.readUint64();this._readPathsRecursive(u,e+1),n.seek(l),this._readPathsRecursive(t,e+1)}else a?this._readPathsRecursive(u,e+1):o&&this._readPathsRecursive(t,e+1)}_buildPathsFromCompressed(t,e,n){let i=(s,r)=>{let a=s;for(;a<t.length;){let o=a++,c=t[o],u=e[o],l=n[o],f;if(r==="")f="/",r=f;else{let m=this.tokens[Math.abs(u)]||"";u<0?f=r+"."+m:f=r==="/"?"/"+m:r+"/"+m}this.paths[c]=f;let d=l>0||l===-1,p=l>=0;if(d){if(p){let m=o+l;i(m,r)}r=f}else if(!p)break}};i(0,"")}_readSpecs(){let t=this.sections.SPECS;if(!t)return;let e=this.reader;if(e.seek(t.start),this.specs=[],this.version.major===0&&this.version.minor<4){let n=this.version.minor===0&&this.version.patch===1?16:12,i=Math.floor(t.size/n);for(let s=0;s<i;s++){let r=e.readUint32(),a=e.readUint32(),o=e.readUint32();n===16&&e.readUint32(),this.specs.push({pathIndex:r,fieldSetIndex:a,specType:o})}}else{let n=e.readUint64(),i=e.readUint64(),s=e.readBytes(i),r=kt(s.buffer.slice(s.byteOffset,s.byteOffset+i),n),a=e.readUint64(),o=e.readBytes(a),c=kt(o.buffer.slice(o.byteOffset,o.byteOffset+a),n),u=e.readUint64(),l=e.readBytes(u),f=kt(l.buffer.slice(l.byteOffset,l.byteOffset+u),n);for(let d=0;d<n;d++)this.specs.push({pathIndex:r[d],fieldSetIndex:c[d],specType:f[d]})}}_readValue(t){let e=t.typeEnum,n=t.isArray,i=t.isInlined;if(e===R.TimeSamples)return this._readTimeSamples(t);if(i)return this._readInlinedValue(t);let s=t.payload;if(s===0&&n)return[];if(s<0||s>=this.buffer.byteLength)throw new RangeError("USDCParser: Invalid payload offset "+s+" for type "+e+".");let r=this.reader.tell();this.reader.seek(s);let a;return n?a=this._readArrayValue(t):a=this._readScalarValue(e),this.reader.seek(r),a}_readInlinedValue(t){let e=t.typeEnum,n=t.getInlinedValue(),i=this._conversionView;switch(e){case R.Bool:return n!==0;case R.UChar:return n&255;case R.Int:case R.UInt:return n;case R.Float:return i.setUint32(0,n,!0),i.getFloat32(0,!0);case R.Double:return i.setUint32(0,n,!0),i.getFloat32(0,!0);case R.Token:return this.tokens[n]||"";case R.String:return this.tokens[this.strings[n]]||"";case R.AssetPath:return this.tokens[n]||"";case R.Specifier:return n;case R.Permission:case R.Variability:return n;case R.Vec2h:return i.setUint32(0,n,!0),[this._halfToFloat(i.getUint16(0,!0)),this._halfToFloat(i.getUint16(2,!0))];case R.Vec2f:case R.Vec2i:return i.setUint32(0,n,!0),[i.getInt8(0),i.getInt8(1)];case R.Vec3f:case R.Vec3i:return i.setUint32(0,n,!0),[i.getInt8(0),i.getInt8(1),i.getInt8(2)];case R.Vec4f:case R.Vec4i:return i.setUint32(0,n,!0),[i.getInt8(0),i.getInt8(1),i.getInt8(2),i.getInt8(3)];case R.Matrix2d:{i.setUint32(0,n,!0);let s=i.getInt8(0),r=i.getInt8(1);return[s,0,0,r]}case R.Matrix3d:{i.setUint32(0,n,!0);let s=i.getInt8(0),r=i.getInt8(1),a=i.getInt8(2);return[s,0,0,0,r,0,0,0,a]}case R.Matrix4d:{i.setUint32(0,n,!0);let s=i.getInt8(0),r=i.getInt8(1),a=i.getInt8(2),o=i.getInt8(3);return[s,0,0,0,0,r,0,0,0,0,a,0,0,0,0,o]}default:return n}}_readTimeSamples(t){let e=this.reader,n=t.payload,i=e.tell();e.seek(n);let s=e.tell(),r=e.readInt64();e.seek(s+r);let a=e.readUint32(),o=e.readUint32(),c=new Pe(a,o),u=this._readValue(c),l=s+r+8;e.seek(l);let f=e.tell(),d=e.readInt64();e.seek(f+d);let p=e.readUint64(),m=[];for(let y=0;y<p;y++){let _=e.readUint32(),x=e.readUint32();m.push(new Pe(_,x))}let g=[];for(let y=0;y<p;y++)g.push(this._readValue(m[y]));return e.seek(i),{times:u instanceof Float64Array?Array.from(u):Array.isArray(u)?u:[u],values:g}}_readScalarValue(t){let e=this.reader;switch(t){case R.Invalid:return null;case R.Bool:return e.readUint8()!==0;case R.UChar:return e.readUint8();case R.Int:return e.readInt32();case R.UInt:return e.readUint32();case R.Int64:return e.readInt64();case R.UInt64:return e.readUint64();case R.Half:return this._readHalf();case R.Float:return e.readFloat32();case R.Double:return e.readFloat64();case R.String:case R.Token:{let n=e.readUint32();return this.tokens[n]||""}case R.AssetPath:{let n=e.readUint32();return this.tokens[n]||""}case R.Vec2f:return[e.readFloat32(),e.readFloat32()];case R.Vec2d:return[e.readFloat64(),e.readFloat64()];case R.Vec2i:return[e.readInt32(),e.readInt32()];case R.Vec3f:return[e.readFloat32(),e.readFloat32(),e.readFloat32()];case R.Vec3d:return[e.readFloat64(),e.readFloat64(),e.readFloat64()];case R.Vec3i:return[e.readInt32(),e.readInt32(),e.readInt32()];case R.Vec4f:return[e.readFloat32(),e.readFloat32(),e.readFloat32(),e.readFloat32()];case R.Vec4d:return[e.readFloat64(),e.readFloat64(),e.readFloat64(),e.readFloat64()];case R.Quatf:return[e.readFloat32(),e.readFloat32(),e.readFloat32(),e.readFloat32()];case R.Quatd:return[e.readFloat64(),e.readFloat64(),e.readFloat64(),e.readFloat64()];case R.Matrix4d:{let n=[];for(let i=0;i<16;i++)n.push(e.readFloat64());return n}case R.TokenVector:{let n=e.readUint64(),i=[];for(let s=0;s<n;s++){let r=e.readUint32();i.push(this.tokens[r]||"")}return i}case R.PathVector:{let n=e.readUint64(),i=[];for(let s=0;s<n;s++){let r=e.readUint32();i.push(this.paths[r]||"")}return i}case R.DoubleVector:{let n=e.readUint64(),i=new Float64Array(n);for(let s=0;s<n;s++)i[s]=e.readFloat64();return i}case R.Dictionary:{let n=e.readUint64(),i={};for(let s=0;s<n;s++){let r=e.readUint32(),a=this.tokens[r],o=e.position,c=e.readInt64(),u=o+c,l=e.position;e.position=u;let f=e.readUint64(),d=new Pe(f),p=null;d.isInlined?p=this._readInlinedValue(d):d.isArray?(e.position=d.payload,p=this._readArrayValue(d)):(e.position=d.payload,p=this._readScalarValue(d.typeEnum)),e.position=l,a!==void 0&&p!==null&&(i[a]=p)}return i}case R.TokenListOp:case R.StringListOp:case R.IntListOp:case R.Int64ListOp:case R.UIntListOp:case R.UInt64ListOp:return null;case R.PathListOp:{let n=e.readUint8(),i=(n&2)!==0,s=(n&4)!==0,r=(n&8)!==0,a=(n&16)!==0,o=(n&32)!==0,c=(n&64)!==0,u=()=>{let m=e.readUint64(),g=[];for(let v=0;v<m;v++){let y=e.readUint32();g.push(this.paths[y])}return g},l=null,f=null,d=null,p=null;return i&&(l=u()),s&&(f=u()),o&&(d=u()),c&&(p=u()),r&&u(),a&&u(),d&&d.length>0?d:l&&l.length>0?l:p&&p.length>0?p:f&&f.length>0?f:null}case R.VariantSelectionMap:{let n=e.readUint64(),i={};for(let s=0;s<n;s++){let r=e.readUint32(),a=e.readUint32(),o=this.tokens[this.strings[r]],c=this.tokens[this.strings[a]];o&&c&&(i[o]=c)}return i}default:return console.warn("USDCParser: Unsupported scalar type",t),null}}_readArrayValue(t){let e=this.reader,n=t.typeEnum,i=t.isCompressed,s;if(this.version.major===0&&this.version.minor<7?s=e.readUint32():s=e.readUint64(),!Number.isSafeInteger(s)||s<0)throw new RangeError("USDCParser: Invalid array size "+s+" for type "+n+".");if(s>2147483647)throw new RangeError("USDCParser: Array size "+s+" exceeds implementation limits.");if(s===0)return[];if(i)return this._readCompressedArray(n,s);switch(n){case R.Int:{let r=new Int32Array(s);for(let a=0;a<s;a++)r[a]=e.readInt32();return r}case R.UInt:{let r=new Uint32Array(s);for(let a=0;a<s;a++)r[a]=e.readUint32();return r}case R.Float:{let r=new Float32Array(s);for(let a=0;a<s;a++)r[a]=e.readFloat32();return r}case R.Double:{let r=new Float64Array(s);for(let a=0;a<s;a++)r[a]=e.readFloat64();return r}case R.Vec2f:{let r=new Float32Array(s*2);for(let a=0;a<s*2;a++)r[a]=e.readFloat32();return r}case R.Vec3f:{let r=new Float32Array(s*3);for(let a=0;a<s*3;a++)r[a]=e.readFloat32();return r}case R.Vec4f:{let r=new Float32Array(s*4);for(let a=0;a<s*4;a++)r[a]=e.readFloat32();return r}case R.Vec3h:{let r=new Float32Array(s*3);for(let a=0;a<s*3;a++)r[a]=this._readHalf();return r}case R.Quatf:{let r=new Float32Array(s*4);for(let a=0;a<s*4;a++)r[a]=e.readFloat32();return r}case R.Quath:{let r=new Float32Array(s*4);for(let a=0;a<s*4;a++)r[a]=this._readHalf();return r}case R.Matrix4d:{let r=new Float64Array(s*16);for(let a=0;a<s*16;a++)r[a]=e.readFloat64();return r}case R.Token:{let r=[];for(let a=0;a<s;a++){let o=e.readUint32();r.push(this.tokens[o]||"")}return r}case R.Half:{let r=new Float32Array(s);for(let a=0;a<s;a++)r[a]=this._readHalf();return r}default:return console.warn("USDCParser: Unsupported array type",n),[]}}_readCompressedArray(t,e){let n=this.reader;switch(t){case R.Int:case R.UInt:{let i=n.readUint64(),s=n.readBytes(i);return kt(s.buffer.slice(s.byteOffset,s.byteOffset+i),e)}case R.Float:{let i=n.readInt8();if(i===Ah){let s=n.readUint64(),r=n.readBytes(s),a=kt(r.buffer.slice(r.byteOffset,r.byteOffset+s),e),o=new Float32Array(e);for(let c=0;c<e;c++)o[c]=a[c];return o}else if(i===wh){let s=n.readUint32(),r=new Float32Array(s);for(let l=0;l<s;l++)r[l]=n.readFloat32();let a=n.readUint64(),o=n.readBytes(a),c=kt(o.buffer.slice(o.byteOffset,o.byteOffset+a),e),u=new Float32Array(e);for(let l=0;l<e;l++)u[l]=r[c[l]];return u}return console.warn("USDCParser: Unknown float compression code",i),new Float32Array(e)}default:return console.warn("USDCParser: Unsupported compressed array type",t),[]}}_readHalf(){return this._halfToFloat(this.reader.readUint16())}_halfToFloat(t){let e=(t&32768)>>15,n=(t&31744)>>10,i=t&1023;return n===0?i===0?e?-0:0:(e?-1:1)*Mh*(i/1024):n===31?i?NaN:e?-1/0:1/0:(e?-1:1)*ua[n]*(1+i/1024)}_getFieldsForSpec(t){let e={},n=t.fieldSetIndex,i=1e4,s=0;for(;n<this.fieldSets.length&&s<i;){let r=this.fieldSets[n];if(r===bh||r===-1)break;let a=this.fields[r];if(a){let o=this.tokens[a.tokenIndex],c=this._readValue(a.valueRep);e[o]=c}n++,s++}return e}};var Eh=/^(.+?)\/\{(\w+)=(\w+)\}\/(.+)$/,Le={Unknown:0,Attribute:1,Connection:2,Expression:3,Mapper:4,MapperArg:5,Prim:6,PseudoRoot:7,Relationship:8,RelationshipTarget:9,Variant:10,VariantSet:11},Vt={projection:"perspective",clippingRange:[1,1e6],horizontalAperture:20.955,verticalAperture:15.2908,horizontalApertureOffset:0,verticalApertureOffset:0,focalLength:50,focusDistance:0,fStop:0},qt=class h{constructor(t){this.textureCache={},this.skinnedMeshes=[],this.manager=t,this.imageLoader=new we(t),this.texturePromises=[]}compose(t,e={},n={},i=""){this.specsByPath=t.specsByPath,this.assets=e,this.externalVariantSelections=n,this.basePath=i,this.skinnedMeshes=[],this.skeletons={},this.texturePromises=[],this._buildIndexes();let s=this.specsByPath["/"],r=s?s.fields:{};this.fps=r.timeCodesPerSecond||r.framesPerSecond||24;let a=new Ze;this._buildHierarchy(a,"/"),this._bindSkeletons();let o=Object.keys(this.skeletons);o.length===1&&(a.skeleton=this.skeletons[o[0]].skeleton),a.animations=this._buildAnimations();let c=r.metersPerUnit;return c!==void 0&&c!==1&&a.scale.setScalar(c),s&&s.fields&&s.fields.upAxis==="Z"&&(a.rotation.x=-Math.PI/2),a}applyTransform(t,e,n={}){let i={...e,...n},s=i.xformOpOrder;if(s&&s.length>0){let r=new z,a=new z,o=null;for(let c=0;c<s.length;c++){let u=s[c],l=u.startsWith("!invert!"),f=l?u.slice(8):u;if(f==="xformOp:transform"){let d=i["xformOp:transform"];d&&d.length===16&&(a.set(d[0],d[4],d[8],d[12],d[1],d[5],d[9],d[13],d[2],d[6],d[10],d[14],d[3],d[7],d[11],d[15]),l&&a.invert(),r.multiply(a))}else if(f==="xformOp:translate"){let d=i["xformOp:translate"];d&&(a.makeTranslation(d[0],d[1],d[2]),l&&a.invert(),r.multiply(a))}else if(f==="xformOp:translate:pivot"){let d=i["xformOp:translate:pivot"];d&&(a.makeTranslation(d[0],d[1],d[2]),l&&a.invert(),r.multiply(a))}else if(f==="xformOp:scale"){let d=i["xformOp:scale"];d&&(Array.isArray(d)?(a.makeScale(d[0],d[1],d[2]),o=[d[0],d[1],d[2]]):(a.makeScale(d,d,d),o=[d,d,d]),l&&a.invert(),r.multiply(a))}else if(f==="xformOp:rotateXYZ"){let d=i["xformOp:rotateXYZ"];if(d){let p=new Wt(d[0]*Math.PI/180,d[1]*Math.PI/180,d[2]*Math.PI/180,"ZYX");a.makeRotationFromEuler(p),l&&a.invert(),r.multiply(a)}}else if(f==="xformOp:rotateX"){let d=i["xformOp:rotateX"];d!==void 0&&(a.makeRotationX(d*Math.PI/180),l&&a.invert(),r.multiply(a))}else if(f==="xformOp:rotateY"){let d=i["xformOp:rotateY"];d!==void 0&&(a.makeRotationY(d*Math.PI/180),l&&a.invert(),r.multiply(a))}else if(f==="xformOp:rotateZ"){let d=i["xformOp:rotateZ"];d!==void 0&&(a.makeRotationZ(d*Math.PI/180),l&&a.invert(),r.multiply(a))}else if(f==="xformOp:orient"){let d=i["xformOp:orient"];if(d&&d.length===4){let p=new yt(d[0],d[1],d[2],d[3]);a.makeRotationFromQuaternion(p),l&&a.invert(),r.multiply(a)}}}if(t.matrix.copy(r),t.matrix.decompose(t.position,t.quaternion,t.scale),o){let c=o[0]<0,u=o[1]<0,l=o[2]<0;(c?1:0)+(u?1:0)+(l?1:0)===3&&(t.scale.set(o[0],o[1],o[2]),t.quaternion.set(t.quaternion.x,-t.quaternion.y,t.quaternion.z,-t.quaternion.w))}return}if(i["xformOp:translate"]){let r=i["xformOp:translate"];t.position.set(r[0],r[1],r[2])}if(i["xformOp:translate:pivot"]){let r=i["xformOp:translate:pivot"];t.pivot=new M(r[0],r[1],r[2])}if(i["xformOp:scale"]){let r=i["xformOp:scale"];Array.isArray(r)?t.scale.set(r[0],r[1],r[2]):t.scale.set(r,r,r)}if(i["xformOp:rotateXYZ"]){let r=i["xformOp:rotateXYZ"];t.rotation.set(r[0]*Math.PI/180,r[1]*Math.PI/180,r[2]*Math.PI/180)}if(i["xformOp:orient"]){let r=i["xformOp:orient"];r.length===4&&t.quaternion.set(r[0],r[1],r[2],r[3])}}_buildIndexes(){this.childrenByPath=new Map,this.attributesByPrimPath=new Map,this.materialsByRoot=new Map,this.shadersByMaterialPath=new Map,this.geomSubsetsByMeshPath=new Map;for(let t in this.specsByPath){let e=this.specsByPath[t];if(e.specType===Le.Prim){let n=t.lastIndexOf("/");if(n>0){let s=t.slice(0,n),r=t.slice(n+1);this.childrenByPath.has(s)||this.childrenByPath.set(s,[]),this.childrenByPath.get(s).push({name:r,path:t})}else if(n===0&&t.length>1){let s=t.slice(1);this.childrenByPath.has("/")||this.childrenByPath.set("/",[]),this.childrenByPath.get("/").push({name:s,path:t})}let i=e.fields.typeName;if(i==="Material"){let s=t.split("/"),r=s.length>1?"/"+s[1]:"/";this.materialsByRoot.has(r)||this.materialsByRoot.set(r,[]),this.materialsByRoot.get(r).push(t)}if(i==="Shader"&&n>0){let s=t.slice(0,n);for(;s.length>0;){let r=this.specsByPath[s];if(r&&r.specType===Le.Prim&&r.fields.typeName==="Material"){this.shadersByMaterialPath.has(s)||this.shadersByMaterialPath.set(s,[]),this.shadersByMaterialPath.get(s).push(t);break}let a=s.lastIndexOf("/");if(a<=0)break;s=s.slice(0,a)}}if(i==="GeomSubset"&&n>0){let s=t.slice(0,n);this.geomSubsetsByMeshPath.has(s)||this.geomSubsetsByMeshPath.set(s,[]),this.geomSubsetsByMeshPath.get(s).push(t)}}else if(e.specType===Le.Attribute||e.specType===Le.Relationship){let n=t.lastIndexOf(".");if(n>0){let i=t.slice(0,n),s=t.slice(n+1);this.attributesByPrimPath.has(i)||this.attributesByPrimPath.set(i,new Map),this.attributesByPrimPath.get(i).set(s,e)}}}}_isDirectChild(t,e,n){if(!e.startsWith(n))return!1;let i=e.slice(n.length);return i.length===0||i.startsWith("{")?!1:!i.includes("/")}_buildHierarchy(t,e){let n=[],i=new Set,s=this.childrenByPath.get(e);if(s)for(let a of s)i.has(a.path)||(i.add(a.path),n.push(a));let r=this._getVariantPaths(e);for(let a of r){let o=this.childrenByPath.get(a);if(o)for(let c of o)i.has(c.path)||(i.add(c.path),n.push(c))}for(let{name:a,path:o}of n){let c=this.specsByPath[o];if(!c||c.specType!==Le.Prim)continue;let u=c.fields.typeName,l=this._getReferences(c);if(l.length>0){let f=this._getLocalVariantSelections(c.fields),d=[];for(let p of l){let m=this._resolveReference(p,f);m&&d.push(m)}if(d.length>0){let p=this._getAttributes(o);if(d.length===1){let g=this._findSingleMesh(d[0]);if(g&&(u==="Xform"||!u)){g.name=a,this.applyTransform(g,c.fields,p),this._applyMaterialBinding(g,o),t.add(g),this._buildHierarchy(g,o);continue}}let m=new rt;m.name=a,this.applyTransform(m,c.fields,p);for(let g of d)for(;g.children.length>0;)m.add(g.children[0]);t.add(m),this._buildHierarchy(m,o);continue}}if(u==="SkelRoot"){let f=new rt;f.name=a,f.userData.isSkelRoot=!0;let d=this._getAttributes(o);this.applyTransform(f,c.fields,d),t.add(f),this._buildHierarchy(f,o)}else if(u==="Skeleton"){let f=this._buildSkeleton(o);f&&(this.skeletons[o]=f),this._buildHierarchy(t,o)}else if(u!=="SkelAnimation"){if(u==="Mesh"){let f=this._buildMesh(o,c);f&&(t.add(f),this._buildHierarchy(f,o))}else if(u==="Camera"){let f=this._buildCamera(o);f.name=a;let d=this._getAttributes(o);this.applyTransform(f,c.fields,d),t.add(f),this._buildHierarchy(f,o)}else if(u==="DistantLight"||u==="SphereLight"||u==="RectLight"||u==="DiskLight"){let f=this._buildLight(o,u);f.name=a;let d=this._getAttributes(o);this.applyTransform(f,c.fields,d),t.add(f),this._buildHierarchy(f,o)}else if(u==="Cube"||u==="Sphere"||u==="Cylinder"||u==="Cone"||u==="Capsule"){let f=this._buildGeomPrimitive(o,c,u);f&&(t.add(f),this._buildHierarchy(f,o))}else if(!(u==="Material"||u==="Shader"||u==="GeomSubset")){let f=new rt;f.name=a;let d=this._getAttributes(o);this.applyTransform(f,c.fields,d),t.add(f),this._buildHierarchy(f,o)}}}}_getVariantPaths(t){let e=this.specsByPath[t],n=e?.fields?.variantSetChildren,i=[];if(!n||n.length===0)return i;for(let s of n){let r=this.externalVariantSelections[s]||null;if(!r){let a=e.fields.variantSelection;r=a?a[s]:null}if(!r){let a=t+"/{"+s+"=}",o=this.specsByPath[a];o?.fields?.variantChildren&&(r=o.fields.variantChildren[0])}if(r){let a=t+"/{"+s+"="+r+"}";i.push(a)}}return i}_resolveFilePath(t){let e=t;if(e.startsWith("./")&&(e=e.slice(2)),!this.basePath)return e;let n=this.basePath.endsWith("/")?this.basePath:this.basePath+"/";return Ce.resolveURL(e,n)}_resolveReference(t,e={}){if(!t)return null;let n=t.match(/@([^@]+)@(?:<([^>]+)>)?/);if(!n)return null;let i=n[1],s=n[2],r=this._resolveFilePath(i),a={...e,...this.externalVariantSelections},o=this.assets[r];if(!o)return null;if(o.specsByPath){let c=new h(this.manager);c.imageLoader.setCrossOrigin(this.imageLoader.crossOrigin),c.imageLoader.setPriority(this.imageLoader.priority),c.imageLoader.setCache(this.imageLoader.cache);let u=this._getBasePath(r),l=c.compose(o,this.assets,a,u);if(s){let f=s.split("/").pop(),d=null;for(let p of l.children)if(p.name===f){d=p;break}if(d){l.remove(d);let p=new Ze;return p.add(d),p}}return l}return o.isGroup||o.isObject3D?o.clone():null}_findSingleMesh(t){for(let e of t.children)if(e.isMesh)return t.remove(e),e;if(t.children.length===1){let e=t.children[0];if(e.children&&e.children.length===1){let n=e.children[0];if(n.isMesh&&!this._hasNonIdentityTransform(e))return e.remove(n),n}}return null}_hasNonIdentityTransform(t){let e=t.position,n=t.rotation,i=t.scale,s=e.x!==0||e.y!==0||e.z!==0,r=n.x!==0||n.y!==0||n.z!==0,a=i.x!==1||i.y!==1||i.z!==1;return s||r||a}_getBasePath(t){let e=t.lastIndexOf("/");return e>=0?t.slice(0,e):""}_getLocalVariantSelections(t){let e={};if(t.variantSelection)for(let n in t.variantSelection)e[n]=t.variantSelection[n];return e}_getReferences(t){let e=[];if(t.fields.references&&t.fields.references.length>0){let n=t.fields.references[0];if(typeof n=="string"){let i=n.matchAll(/@([^@]+)@(?:<([^>]+)>)?/g);for(let s of i)e.push(s[0])}else n.assetPath&&e.push("@"+n.assetPath+"@")}if(e.length===0&&t.fields.payload){let n=t.fields.payload;typeof n=="string"?e.push(n):n.assetPath&&e.push("@"+n.assetPath+"@")}return e}_resolveAttributeValue(t,e=new Set){let n=String(t).replace(/<|>/g,"");if(e.has(n))return;let i=this.specsByPath[n]?.fields;if(!i)return;let s=new Set(e);if(s.add(n),i.connectionPaths)for(let o of i.connectionPaths){let c=this._resolveAttributeValue(o,s);if(c!==void 0)return c}if(i.default!==void 0)return i.default;let{times:r,values:a}=i.timeSamples||{};if(r&&a&&r.length>0){let o=r.indexOf(0);return a[o>=0?o:0]}}_getAttributes(t){let e={};this._collectAttributesFromPath(t,e);let n=t.match(Eh);if(n){let i=n[1],s=n[4],r=this._getVariantPaths(i);for(let a of r){if(t.startsWith(a))continue;let o=a+"/"+s;this._collectAttributesFromPath(o,e)}}else{let i=t.split("/");for(let s=1;s<i.length-1;s++){let r=i.slice(0,s+1).join("/"),a=i.slice(s+1).join("/"),o=this._getVariantPaths(r);for(let c of o){let u=c+"/"+a;this._collectAttributesFromPath(u,e)}}}return e}_collectAttributesFromPath(t,e){let n=this.attributesByPrimPath.get(t);if(n)for(let[i,s]of n){let r=this._resolveAttributeValue(t+"."+i);r!==void 0&&(e[i]=r),s.fields?.elementSize!==void 0&&(e[i+":elementSize"]=s.fields.elementSize),i.startsWith("primvars:")&&s.fields?.typeName!==void 0&&(e[i+":typeName"]=s.fields.typeName)}}_buildGeomPrimitive(t,e,n){let i=this._getAttributes(t),s=t.split("/").pop(),r;switch(n){case"Cube":{let u=i.size||2;r=new yn(u,u,u);break}case"Sphere":{let u=i.radius||1;r=new Tn(u,32,16);break}case"Cylinder":{let u=i.height||2,l=i.radius||1;r=new $e(l,l,u,32);break}case"Cone":{let u=i.height||2,l=i.radius||1;r=new Mn(l,u,32);break}case"Capsule":{let u=i.height||1,l=i.radius||.5;r=new Sn(l,u,16,32);break}}let a=i.axis||"Z";a==="X"?r.rotateZ(-Math.PI/2):a==="Z"&&r.rotateX(Math.PI/2);let o=this._buildMaterial(t,e.fields),c=new Me(r,o);return c.name=s,this.applyTransform(c,e.fields,i),c}_buildMesh(t,e){let n=this._getAttributes(t),i=n["primvars:skel:jointIndices"],s=n["primvars:skel:jointWeights"],r=i&&s&&i.length>0&&s.length>0,a=this._getGeomSubsets(t),o,c;if(a.length>0){o=this._buildGeometryWithSubsets(n,a,r);let d=this._getMaterialPath(t,e.fields);c=a.map(p=>{let m=p.materialPath||d;return this._buildMaterialForPath(m)})}else o=this._buildGeometry(t,n,r),c=this._buildMaterial(t,e.fields);let u=n["primvars:displayColor"];if(u&&u.length>=3){let d=p=>{p.color&&p.color.r===1&&p.color.g===1&&p.color.b===1&&!p.map&&p.color.setRGB(u[0],u[1],u[2],_t)};Array.isArray(c)?c.forEach(d):d(c)}let l=n["primvars:displayOpacity"];if(l&&l.length===1&&a.length===0){let d=l[0],p=m=>{d<1&&m.opacity===1&&m.transparent===!1&&(m.opacity=d,m.transparent=!0)};Array.isArray(c)?c.forEach(p):p(c)}let f;if(r){f=new xn(o,c);let d=this.specsByPath[t+".skel:skeleton"];d||(d=this.specsByPath[t+".rel skel:skeleton"]);let p=null;d&&(d.fields.targetPaths&&d.fields.targetPaths.length>0?p=d.fields.targetPaths[0]:d.fields.default&&(p=d.fields.default.replace(/<|>/g,"")));let m=n["skel:joints"],g=n["primvars:skel:geomBindTransform"];this.skinnedMeshes.push({mesh:f,skeletonPath:p,path:t,localJoints:m,geomBindTransform:g})}else f=new Me(o,c);return f.name=t.split("/").pop(),this.applyTransform(f,e.fields,n),f}_buildCamera(t){let e=this._getAttributes(t),n=e.projection,i=typeof n=="string"?n.toLowerCase():Vt.projection,s=e.clippingRange||Vt.clippingRange,r=Math.max(Number.EPSILON,this._parseNumber(s[0],Vt.clippingRange[0])),a=Math.max(r+Number.EPSILON,this._parseNumber(s[1],Vt.clippingRange[1])),o=this._parseNumber(e.horizontalAperture,Vt.horizontalAperture),c=this._parseNumber(e.verticalAperture,Vt.verticalAperture),u=this._parseNumber(e.horizontalApertureOffset,Vt.horizontalApertureOffset),l=this._parseNumber(e.verticalApertureOffset,Vt.verticalApertureOffset),f=this._parseNumber(e.focalLength,Vt.focalLength),d=this._parseNumber(e.focusDistance,Vt.focusDistance),p=this._parseNumber(e.fStop,Vt.fStop),m;if(i==="orthographic"){let g=o/10,v=c/10,y=u/10,_=l/10;m=new nn(y-g*.5,y+g*.5,_+v*.5,_-v*.5,r,a)}else{let g=Math.max(Number.EPSILON,c),v=Math.max(Number.EPSILON,f),y=o/g,_=2*Math.atan(g/(2*v))*180/Math.PI;m=new Ee(_,y,r,a),m.filmGauge=Math.max(o,c),m.filmOffset=u,m.focus=d,m.setFocalLength(v),l!==0&&(m.userData.verticalApertureOffset=l)}return m.userData.fStop=p,m.userData.usdProjection=i,m}_buildLight(t,e){let n=this._getAttributes(t),i=this._parseNumber(n["inputs:intensity"],1),s=n["inputs:color"]||[1,1,1],r=n["inputs:enableColorTemperature"]===!0,a=this._parseNumber(n["inputs:colorTemperature"],6500),o=new W(s[0],s[1],s[2]);if(r){let u=this._colorTemperature(a);o.multiply(u)}let c;switch(e){case"DistantLight":c=new Ln(o,i);break;case"SphereLight":{let u=this._parseNumber(n["shaping:cone:angle"],0);if(u>0){let l=u*Math.PI/180,f=this._parseNumber(n["shaping:cone:softness"],0);c=new Pn(o,i,0,l,f)}else c=new In(o,i);break}case"RectLight":{let u=this._parseNumber(n["inputs:width"],1),l=this._parseNumber(n["inputs:height"],1);c=new sn(o,i,u,l);break}case"DiskLight":{let l=this._parseNumber(n["inputs:radius"],.5)*2;c=new sn(o,i,l,l);break}}return c}_colorTemperature(t){let e=t/100,n,i,s;return e<=66?(n=1,i=.3900815787690196*Math.log(e)-.6318414437886275):(n=1.292936186062745*Math.pow(e-60,-.1332047592),i=1.1298908608952942*Math.pow(e-60,-.0755148492)),e>=66?s=1:e<=19?s=0:s=.543206789110196*Math.log(e-10)-1.19625408914,new W(Math.min(Math.max(n,0),1),Math.min(Math.max(i,0),1),Math.min(Math.max(s,0),1))}_parseNumber(t,e){let n=Number(t);return Number.isFinite(n)?n:e}_getGeomSubsets(t){let e=[],n=this.geomSubsetsByMeshPath.get(t);if(!n)return e;for(let i of n){let r=this._getAttributes(i).indices;if(!r||r.length===0)continue;let a=this._getMaterialBindingTarget(i);e.push({name:i.split("/").pop(),indices:r,materialPath:a})}return e}_getMaterialBindingSpec(t){let e="material:binding",n=t+"."+e,i=this.specsByPath[n]||null,s=t.split("/");for(let r=1;r<s.length;r++){let a=s.slice(0,r+1).join("/"),o=s.slice(r+1).join("/"),c=this._getVariantPaths(a);for(let u of c){let l=o?u+"/"+o+"."+e:u+"."+e,f=this.specsByPath[l];f?.fields?.targetPaths?.length>0&&(i=f)}}return i}_getMaterialBindingTarget(t){let e=t.split("/").filter(Boolean),n=null;for(let i=0;i<e.length;i++){let s="/"+e.slice(0,i+1).join("/"),r=this._getMaterialBindingSpec(s);r?.fields?.targetPaths?.length&&(!n||n.fields?.bindMaterialAs!=="strongerThanDescendants")&&(n=r)}return n?.fields.targetPaths[0]||null}_buildGeometry(t,e,n=!1){let i=new Ft,s=e.points;if(!s||s.length===0)return i;let r=e.faceVertexIndices,a=e.faceVertexCounts,o=e["primvars:arnold:polygon_holes"],c=this._buildHoleMap(o),u=r,l=null;if(a&&a.length>0){let x=this._triangulateIndicesWithPattern(r,a,s,c);u=x.indices,l=x.pattern}let f=s;u&&u.length>0&&(f=this._expandAttribute(s,u,3)),i.setAttribute("position",new et(new Float32Array(f),3));let d=e.normals||e["primvars:normals"],p=e["normals:indices"]||e["primvars:normals:indices"];if(d&&d.length>0){let x=d;if(p&&p.length>0&&l){let S=this._applyTriangulationPattern(p,l);x=this._expandAttribute(d,S,3)}else if(d.length===s.length)u&&u.length>0&&(x=this._expandAttribute(d,u,3));else if(l){let S=this._applyTriangulationPattern(Array.from({length:d.length/3},(b,w)=>w),l);x=this._expandAttribute(d,S,3)}i.setAttribute("normal",new et(new Float32Array(x),3))}else{let x=this._computeVertexNormals(s,u);i.setAttribute("normal",new et(new Float32Array(this._expandAttribute(x,u,3)),3))}let{uvs:m,uvIndices:g}=this._findUVPrimvar(e),v=r?r.length:0;if(m&&m.length>0){let x=m;if(g&&g.length>0&&l){let S=this._applyTriangulationPattern(g,l);x=this._expandAttribute(m,S,2)}else if(u&&m.length/2===s.length/3)x=this._expandAttribute(m,u,2);else if(l&&m.length/2===v){let S=this._applyTriangulationPattern(Array.from({length:v},(b,w)=>w),l);x=this._expandAttribute(m,S,2)}i.setAttribute("uv",new et(new Float32Array(x),2))}let{uvs2:y,uv2Indices:_}=this._findUV2Primvar(e);if(y&&y.length>0){let x=y;if(_&&_.length>0&&l){let S=this._applyTriangulationPattern(_,l);x=this._expandAttribute(y,S,2)}else if(u&&y.length/2===s.length/3)x=this._expandAttribute(y,u,2);else if(l&&y.length/2===v){let S=this._applyTriangulationPattern(Array.from({length:v},(b,w)=>w),l);x=this._expandAttribute(y,S,2)}i.setAttribute("uv1",new et(new Float32Array(x),2))}if(n){let x=e["primvars:skel:jointIndices"],S=e["primvars:skel:jointWeights"],b=e["primvars:skel:jointIndices:elementSize"]||4;if(x&&S){let w=f.length/3,T,A;u&&u.length>0?(T=this._expandAttribute(x,u,b),A=this._expandAttribute(S,u,b)):(T=x,A=S);let E=new Uint16Array(w*4),P=new Float32Array(w*4);this._selectTopWeights(T,A,b,w,E,P),i.setAttribute("skinIndex",new et(E,4)),i.setAttribute("skinWeight",new et(P,4))}}return i}_buildGeometryWithSubsets(t,e,n=!1){let i=new Ft,s=t.points;if(!s||s.length===0)return i;let r=t.faceVertexIndices,a=t.faceVertexCounts;if(!a||a.length===0)return i;let o=t["primvars:arnold:polygon_holes"],c=this._buildHoleMap(o),u=c.holeFaces,l=c.parentToHoles,{uvs:f,uvIndices:d}=this._findUVPrimvar(t),{uvs2:p,uv2Indices:m}=this._findUV2Primvar(t),g=t.normals||t["primvars:normals"],v=t["normals:indices"]||t["primvars:normals:indices"],y=n?t["primvars:skel:jointIndices"]:null,_=n?t["primvars:skel:jointWeights"]:null,x=t["primvars:skel:jointIndices:elementSize"]||4,S=[],b=0;for(let U=0;U<a.length;U++){if(S.push(b),u.has(U))continue;let q=a[U],lt=l.get(U);if(lt&&lt.length>0){let ht=q;for(let X of lt)ht+=a[X];b+=ht-2}else q>=3&&(b+=q-2)}let w=new Int32Array(b).fill(-1);for(let U=0;U<e.length;U++){let q=e[U];for(let lt=0;lt<q.indices.length;lt++){let ht=q.indices[lt];if(ht>=a.length)continue;let X=S[ht],dt=a[ht]-2;for(let it=0;it<dt;it++)w[X+it]=U}}let T=[];for(let U=0;U<b;U++)T.push({original:U,subset:w[U]});T.sort((U,q)=>U.subset-q.subset);let A=[],E=T.length>0?T[0].subset:-1,P=0;for(let U=0;U<T.length;U++)T[U].subset!==E&&(E>=0&&A.push({start:P*3,count:(U-P)*3,materialIndex:E}),E=T[U].subset,P=U);E>=0&&T.length>P&&A.push({start:P*3,count:(T.length-P)*3,materialIndex:E});for(let U of A)i.addGroup(U.start,U.count,U.materialIndex);let{indices:C,pattern:D}=this._triangulateIndicesWithPattern(r,a,s,c),N=a.reduce((U,q)=>U+q,0),L=f&&!d&&f.length/2===N||p&&!m&&p.length/2===N?this._applyTriangulationPattern(Array.from({length:N},(U,q)=>q),D):null,k=d?this._applyTriangulationPattern(d,D):f&&f.length/2===N?L:null,$=m?this._applyTriangulationPattern(m,D):p&&p.length/2===N?L:null,nt=g&&v&&v.length>0,G=g&&g.length/3===N,Y=nt?this._applyTriangulationPattern(v,D):G?this._applyTriangulationPattern(Array.from({length:N},(U,q)=>q),D):null,K=!g&&C.length>0?this._computeVertexNormals(s,C):null,j=b*3,at=new Float32Array(j*3),xt=f?new Float32Array(j*2):null,ot=p?new Float32Array(j*2):null,ct=g||K?new Float32Array(j*3):null,Lt=y?new Uint16Array(j*x):null,Mt=_?new Float32Array(j*x):null;for(let U=0;U<T.length;U++){let q=T[U].original;for(let lt=0;lt<3;lt++){let ht=q*3+lt,X=U*3+lt,dt=C[ht];if(at[X*3]=s[dt*3],at[X*3+1]=s[dt*3+1],at[X*3+2]=s[dt*3+2],xt&&f)if(k){let it=k[ht];xt[X*2]=f[it*2],xt[X*2+1]=f[it*2+1]}else f.length/2===s.length/3&&(xt[X*2]=f[dt*2],xt[X*2+1]=f[dt*2+1]);if(ot&&p)if($){let it=$[ht];ot[X*2]=p[it*2],ot[X*2+1]=p[it*2+1]}else p.length/2===s.length/3&&(ot[X*2]=p[dt*2],ot[X*2+1]=p[dt*2+1]);if(ct)if(g&&Y){let it=Y[ht];ct[X*3]=g[it*3],ct[X*3+1]=g[it*3+1],ct[X*3+2]=g[it*3+2]}else g&&g.length===s.length?(ct[X*3]=g[dt*3],ct[X*3+1]=g[dt*3+1],ct[X*3+2]=g[dt*3+2]):K&&(ct[X*3]=K[dt*3],ct[X*3+1]=K[dt*3+1],ct[X*3+2]=K[dt*3+2]);if(Lt&&Mt&&y&&_)for(let it=0;it<x;it++)Lt[X*x+it]=y[dt*x+it]||0,Mt[X*x+it]=_[dt*x+it]||0}}if(i.setAttribute("position",new et(at,3)),xt&&i.setAttribute("uv",new et(xt,2)),ot&&i.setAttribute("uv1",new et(ot,2)),i.setAttribute("normal",new et(ct,3)),Lt&&Mt){let U=new Uint16Array(j*4),q=new Float32Array(j*4);this._selectTopWeights(Lt,Mt,x,j,U,q),i.setAttribute("skinIndex",new et(U,4)),i.setAttribute("skinWeight",new et(q,4))}return i}_selectTopWeights(t,e,n,i,s,r){if(n<=4){for(let o=0;o<i;o++)for(let c=0;c<4;c++)c<n?(s[o*4+c]=t[o*n+c]||0,r[o*4+c]=e[o*n+c]||0):(s[o*4+c]=0,r[o*4+c]=0);return}let a=new Uint32Array(n);for(let o=0;o<i;o++){let c=o*n;for(let l=0;l<n;l++)a[l]=l;for(let l=0;l<4;l++){let f=l,d=e[c+a[l]]||0;for(let p=l+1;p<n;p++){let m=e[c+a[p]]||0;m>d&&(d=m,f=p)}if(f!==l){let p=a[l];a[l]=a[f],a[f]=p}}let u=0;for(let l=0;l<4;l++)u+=e[c+a[l]]||0;for(let l=0;l<4;l++){let f=a[l];u>0?(s[o*4+l]=t[c+f]||0,r[o*4+l]=(e[c+f]||0)/u):(s[o*4+l]=0,r[o*4+l]=0)}}}_findUVPrimvar(t){for(let i in t){if(!i.startsWith("primvars:")||i.endsWith(":typeName")||i.endsWith(":elementSize")||i.endsWith(":indices")||i.includes("skel:"))continue;let s=t[i+":typeName"];if(s&&s.includes("texCoord"))return{uvs:t[i],uvIndices:t[i+":indices"]}}let e=t["primvars:st"]||t["primvars:UVMap"],n=t["primvars:st:indices"];return{uvs:e,uvIndices:n}}_findUV2Primvar(t){let e=t["primvars:st1"],n=t["primvars:st1:indices"];return{uvs2:e,uv2Indices:n}}_buildHoleMap(t){if(!t||t.length===0)return{parentToHoles:new Map,holeFaces:new Set};let e=new Map,n=new Set;for(let i=0;i<t.length;i+=2){let s=t[i],r=t[i+1];n.add(s),e.has(r)||e.set(r,[]),e.get(r).push(s)}return{parentToHoles:e,holeFaces:n}}_triangulateIndicesWithPattern(t,e,n=null,i=null){let s=[],r=[],a=[],o=0;for(let f=0;f<e.length;f++)a.push(o),o+=e[f];let c=i?.parentToHoles||new Map,u=i?.holeFaces||new Set,l=0;for(let f=0;f<e.length;f++){let d=e[f];if(u.has(f)){l+=d;continue}let p=c.get(f);if(p&&p.length>0&&n&&n.length>0){let m=new Map,g=[];for(let _=0;_<d;_++){let x=t[l+_];g.push(x),m.set(x,l+_)}let v=[];for(let _ of p){let x=a[_],S=e[_],b=[];for(let w=0;w<S;w++){let T=t[x+w];b.push(T),m.set(T,x+w)}v.push(b)}let y=this._triangulateNGonWithHoles(g,v,n);for(let _ of y)s.push(_[0],_[1],_[2]),r.push(m.get(_[0]),m.get(_[1]),m.get(_[2]))}else if(d===3)s.push(t[l],t[l+1],t[l+2]),r.push(l,l+1,l+2);else if(d===4)s.push(t[l],t[l+1],t[l+2],t[l],t[l+2],t[l+3]),r.push(l,l+1,l+2,l,l+2,l+3);else if(d>4)if(n&&n.length>0){let m=[];for(let v=0;v<d;v++)m.push(t[l+v]);let g=this._triangulateNGon(m,n);for(let v of g)s.push(v[0],v[1],v[2]),r.push(l+m.indexOf(v[0]),l+m.indexOf(v[1]),l+m.indexOf(v[2]))}else for(let m=1;m<d-1;m++)s.push(t[l],t[l+m],t[l+m+1]),r.push(l,l+m,l+m+1);l+=d}return{indices:s,pattern:r}}_applyTriangulationPattern(t,e){let n=[];for(let i=0;i<e.length;i++)n.push(t[e[i]]);return n}_triangulateNGon(t,e){let n=[],i=[];for(let u of t)i.push(new M(e[u*3],e[u*3+1],e[u*3+2]));let s=new M;for(let u=0;u<i.length;u++){let l=i[u],f=i[(u+1)%i.length];s.x+=(l.y-f.y)*(l.z+f.z),s.y+=(l.z-f.z)*(l.x+f.x),s.z+=(l.x-f.x)*(l.y+f.y)}s.normalize();let r=new M,a=new M;Math.abs(s.y)>.9?r.set(1,0,0):r.set(0,1,0),a.crossVectors(s,r).normalize(),r.crossVectors(a,s).normalize();for(let u of i)n.push(new V(u.dot(r),u.dot(a)));let o=je.triangulateShape(n,[]),c=[];for(let u of o)c.push([t[u[0]],t[u[1]],t[u[2]]]);return c}_triangulateNGonWithHoles(t,e,n){let i=[];for(let d of t)i.push(new M(n[d*3],n[d*3+1],n[d*3+2]));let s=new M;for(let d=0;d<i.length;d++){let p=i[d],m=i[(d+1)%i.length];s.x+=(p.y-m.y)*(p.z+m.z),s.y+=(p.z-m.z)*(p.x+m.x),s.z+=(p.x-m.x)*(p.y+m.y)}s.normalize();let r=new M,a=new M;Math.abs(s.y)>.9?r.set(1,0,0):r.set(0,1,0),a.crossVectors(s,r).normalize(),r.crossVectors(a,s).normalize();let o=[];for(let d of i)o.push(new V(d.dot(r),d.dot(a)));let c=[];for(let d of e){let p=[];for(let m of d){let g=new M(n[m*3],n[m*3+1],n[m*3+2]);p.push(new V(g.dot(r),g.dot(a)))}c.push(p)}let u=[...t];for(let d of e)u.push(...d);let l=je.triangulateShape(o,c),f=[];for(let d of l)f.push([u[d[0]],u[d[1]],u[d[2]]]);return f}_triangulateIndices(t,e){let n=[],i=0;for(let s=0;s<e.length;s++){let r=e[s];if(r===3)n.push(t[i],t[i+1],t[i+2]);else if(r===4)n.push(t[i],t[i+1],t[i+2],t[i],t[i+2],t[i+3]);else if(r>4)for(let a=1;a<r-1;a++)n.push(t[i],t[i+a],t[i+a+1]);i+=r}return n}_expandAttribute(t,e,n){let i=new Array(e.length*n);for(let s=0;s<e.length;s++){let r=e[s];for(let a=0;a<n;a++)i[s*n+a]=t[r*n+a]}return i}_computeVertexNormals(t,e){let n=t.length/3,i=new Float32Array(n*3);for(let s=0;s<e.length;s+=3){let r=e[s],a=e[s+1],o=e[s+2],c=t[r*3],u=t[r*3+1],l=t[r*3+2],f=t[a*3],d=t[a*3+1],p=t[a*3+2],m=t[o*3],g=t[o*3+1],v=t[o*3+2],y=f-c,_=d-u,x=p-l,S=m-c,b=g-u,w=v-l,T=_*w-x*b,A=x*S-y*w,E=y*b-_*S;i[r*3]+=T,i[r*3+1]+=A,i[r*3+2]+=E,i[a*3]+=T,i[a*3+1]+=A,i[a*3+2]+=E,i[o*3]+=T,i[o*3+1]+=A,i[o*3+2]+=E}for(let s=0;s<n;s++){let r=i[s*3],a=i[s*3+1],o=i[s*3+2],c=Math.sqrt(r*r+a*a+o*o);c>0&&(i[s*3]/=c,i[s*3+1]/=c,i[s*3+2]/=c)}return i}_getMaterialPath(t,e){let n=null,i=e["material:binding"];return i&&(n=Array.isArray(i)?i[0]:i),n||(n=this._getMaterialBindingTarget(t)),n}_buildMaterial(t,e){let n=new Ae,i=null,s=e["material:binding"];if(s&&(i=Array.isArray(s)?s[0]:s),i||(i=this._getMaterialBindingTarget(t)),!i){let r=[],a=t+"/";for(let o in this.specsByPath){if(!o.startsWith(a)||!o.endsWith(".material:binding"))continue;let c=this.specsByPath[o];if(!c)continue;let u=c.fields.targetPaths;u&&u.length>0&&r.push(u[0])}r.length>0&&(i=this._pickBestMaterial(r))}if(!i){let a="/"+t.split("/")[1],o=this.materialsByRoot.get(a);if(o){for(let c of o)if(c.startsWith(a+"/Looks/")||c.startsWith(a+"/Materials/")){i=c;break}}}return i&&this._applyMaterial(n,i),n}_buildMaterialForPath(t){let e=new Ae;return t&&this._applyMaterial(e,t),e}_applyMaterialBinding(t,e){let n=this._getMaterialBindingTarget(e);if(!n)return;n=String(n).replace(/^<|>$/g,"");let i=new Ae;this._applyMaterial(i,n),t.material=i}_pickBestMaterial(t){for(let e of t){let n=this.shadersByMaterialPath.get(e);if(n)for(let i of n){let s=this._getAttributes(i);if(s["info:id"]==="UsdUVTexture"&&s["inputs:file"])return e}}return t[0]}_applyMaterial(t,e){if(!this.specsByPath[e])return;let i=this.shadersByMaterialPath.get(e);if(i)for(let s of i){let r=this.specsByPath[s];if(!r)continue;let o=this._getAttributes(s)["info:id"]||r.fields["info:id"];o==="UsdPreviewSurface"||o==="ND_UsdPreviewSurface_surfaceshader"?this._applyPreviewSurface(t,s):o==="arnold:openpbr_surface"&&this._applyOpenPBRSurface(t,s)}}_applyTextureOrValue(t,e,n,i,s,r,a,o){let c=e+"."+i,u=this.specsByPath[c];if(u&&u.fields.connectionPaths&&u.fields.connectionPaths.length>0){let l=o===this._getTextureFromOpenPBRConnection?u.fields.connectionPaths:[u.fields.connectionPaths[0]];for(let f of l){let d=o.call(this,f);if(d)return d.colorSpace=r,t[s]=d,!0}}return n[i]!==void 0&&a&&a(n[i]),!1}_applyPreviewSurface(t,e){let n=this._getAttributes(e),i=(l,f,d,p)=>this._applyTextureOrValue(t,e,n,l,f,d,p,this._getTextureFromConnection),s=l=>{let f=e+"."+l;return this.specsByPath[f]};if(i("inputs:diffuseColor","map",ft,l=>{Array.isArray(l)&&l.length>=3&&t.color.setRGB(l[0],l[1],l[2],_t)}),t.map&&t.map.userData.scale){let l=t.map.userData.scale;Array.isArray(l)&&l.length>=3&&t.color.setRGB(l[0],l[1],l[2],_t)}if(i("inputs:emissiveColor","emissiveMap",ft,l=>{Array.isArray(l)&&l.length>=3&&t.emissive.setRGB(l[0],l[1],l[2],_t)}),t.emissiveMap)if(t.emissiveMap.userData.scale){let l=t.emissiveMap.userData.scale;Array.isArray(l)&&l.length>=3&&t.emissive.setRGB(l[0],l[1],l[2],_t)}else t.emissive.set(16777215);if(i("inputs:normal","normalMap",Bt,null),t.normalMap&&t.normalMap.userData.scale){let l=t.normalMap.userData.scale;t.normalScale=new V(l[0],l[1])}if(i("inputs:roughness","roughnessMap",Bt,l=>{t.roughness=l})&&(t.roughness=1),i("inputs:metallic","metalnessMap",Bt,l=>{t.metalness=l})&&(t.metalness=1),i("inputs:occlusion","aoMap",Bt,null),n["inputs:ior"]!==void 0&&(t.ior=n["inputs:ior"]),i("inputs:specularColor","specularColorMap",ft,l=>{Array.isArray(l)&&l.length>=3&&t.specularColor.setRGB(l[0],l[1],l[2],_t)}),t.specularColorMap&&t.specularColorMap.userData.scale){let l=t.specularColorMap.userData.scale;Array.isArray(l)&&l.length>=3&&t.specularColor.setRGB(l[0],l[1],l[2],_t)}n["inputs:clearcoat"]!==void 0&&(t.clearcoat=n["inputs:clearcoat"]),n["inputs:clearcoatRoughness"]!==void 0&&(t.clearcoatRoughness=n["inputs:clearcoatRoughness"]);let o=n["inputs:opacityThreshold"]!==void 0?n["inputs:opacityThreshold"]:0;if(s("inputs:opacity")?.fields?.connectionPaths?.length>0)o>0?(t.alphaTest=o,t.transparent=!1):t.transparent=!0;else{let l=n["inputs:opacity"]!==void 0?n["inputs:opacity"]:1;l<1&&(t.transparent=!0,t.opacity=l)}}_applyOpenPBRSurface(t,e){let n=this._getAttributes(e),i=(m,g,v,y)=>this._applyTextureOrValue(t,e,n,m,g,v,y,this._getTextureFromOpenPBRConnection);if(i("inputs:base_color","map",ft,m=>{Array.isArray(m)&&m.length>=3&&t.color.setRGB(m[0],m[1],m[2],_t)}),t.map&&t.map.userData.scale){let m=t.map.userData.scale;Array.isArray(m)&&m.length>=3&&t.color.setRGB(m[0],m[1],m[2],_t)}i("inputs:base_metalness","metalnessMap",Bt,m=>{typeof m=="number"&&(t.metalness=m)}),i("inputs:specular_roughness","roughnessMap",Bt,m=>{typeof m=="number"&&(t.roughness=m)});let s=i("inputs:emission_color","emissiveMap",ft,m=>{Array.isArray(m)&&m.length>=3&&t.emissive.setRGB(m[0],m[1],m[2],_t)}),r=n["inputs:emission_luminance"];r!==void 0&&r>0&&(s?t.emissiveIntensity=r:t.emissive.multiplyScalar(r));let a=n["inputs:transmission_weight"];if(a!==void 0&&a>0){t.transmission=a;let m=n["inputs:transmission_depth"];m!==void 0&&(t.thickness=m);let g=n["inputs:transmission_color"];g!==void 0&&Array.isArray(g)&&(t.attenuationColor.setRGB(g[0],g[1],g[2],_t),t.attenuationDistance=m||1)}let o=n["inputs:geometry_opacity"];o!==void 0&&o<1&&(t.opacity=o,t.transparent=!0);let c=n["inputs:specular_ior"];c!==void 0&&(t.ior=c);let u=n["inputs:coat_weight"];if(u!==void 0&&u>0){t.clearcoat=u;let m=n["inputs:coat_roughness"];m!==void 0&&(t.clearcoatRoughness=m)}let l=n["inputs:thin_film_weight"];if(l!==void 0&&l>0){t.iridescence=l;let m=n["inputs:thin_film_ior"];m!==void 0&&(t.iridescenceIOR=m);let g=n["inputs:thin_film_thickness"];if(g!==void 0){let v=g*1e3;t.iridescenceThicknessMinimum=v,t.iridescenceThicknessMaximum=v}}let f=n["inputs:specular_weight"];f!==void 0&&(t.specularIntensity=f);let d=n["inputs:specular_color"];d!==void 0&&Array.isArray(d)&&t.specularColor.setRGB(d[0],d[1],d[2],_t);let p=n["inputs:specular_roughness_anisotropy"];p!==void 0&&p>0&&(t.anisotropy=p),i("inputs:geometry_normal","normalMap",Bt,null)}_getTextureFromOpenPBRConnection(t){let e=t.replace(/<|>/g,""),n=e.split(".")[0],i=this.specsByPath[n];if(!i)return null;let s=this._getAttributes(n),r=s["info:id"]||i.fields["info:id"];if(i.fields.typeName==="NodeGraph"){let c=e.split(".")[1],u=n+"."+c,l=this.specsByPath[u];return l?.fields?.connectionPaths?.length>0?this._getTextureFromOpenPBRConnection(l.fields.connectionPaths[0]):null}if(r==="arnold:image"){let c=s["inputs:filename"];return c?this._loadTextureFromPath(c):null}if(r&&r.startsWith("ND_image_")){let c=s["inputs:file"];return c?this._loadTextureFromPath(c):null}if(r==="MayaND_fileTexture_color4"){let c=n+".inputs:inColor",u=this.specsByPath[c];return u?.fields?.connectionPaths?.length>0?this._getTextureFromOpenPBRConnection(u.fields.connectionPaths[0]):null}if(r&&r.startsWith("ND_convert_")){let c=n+".inputs:in",u=this.specsByPath[c];return u?.fields?.connectionPaths?.length>0?this._getTextureFromOpenPBRConnection(u.fields.connectionPaths[0]):null}if(r==="arnold:bump2d"){let c=n+".inputs:bump_map",u=this.specsByPath[c];return u?.fields?.connectionPaths?.length>0?this._getTextureFromOpenPBRConnection(u.fields.connectionPaths[0]):null}if(r==="arnold:color_correct"){let c=n+".inputs:input",u=this.specsByPath[c];return u?.fields?.connectionPaths?.length>0?this._getTextureFromOpenPBRConnection(u.fields.connectionPaths[0]):null}let o=n.substring(0,n.lastIndexOf("/"));if(o){let c=this.specsByPath[o];if(c){let u=this._getAttributes(o);if((u["info:id"]||c.fields["info:id"])==="arnold:image"){let f=u["inputs:filename"];if(f)return this._loadTextureFromPath(f)}}}return null}_loadTextureFromPath(t){if(!t)return null;if(this.textureCache[t])return this.textureCache[t];let e=this._loadTexture(t,null,null);return e&&(this.textureCache[t]=e),e}_getTextureFromConnection(t){let e=t.split(".")[0],n=this.specsByPath[e];if(!n)return null;let i=this._getAttributes(e);if((i["info:id"]||n.fields["info:id"])!=="UsdUVTexture")return null;let r=i["inputs:file"];if(!r)return null;let a=null,o=0,c=e+".inputs:st",u=this.specsByPath[c];if(u?.fields?.connectionPaths?.length>0){let g=u.fields.connectionPaths[0].replace(/<|>/g,"").split(".")[0],v=this.specsByPath[g];if(v){let y=this._getAttributes(g),_=y["info:id"]||v.fields["info:id"];if(_==="UsdTransform2d"){a=y;let x=g+".inputs:in",S=this.specsByPath[x];if(S?.fields?.connectionPaths?.length>0){let w=S.fields.connectionPaths[0].replace(/<|>/g,"").split(".")[0],A=this._getAttributes(w)["inputs:varname"];A==="st1"?o=1:A==="st2"&&(o=2)}}else if(_==="UsdPrimvarReader_float2"){let x=y["inputs:varname"];x==="st1"?o=1:x==="st2"&&(o=2)}}}let l=i["inputs:scale"],f=i["inputs:bias"],d=r;if(l&&(d+=":s"+l.join(",")),f&&(d+=":b"+f.join(",")),this.textureCache[d])return this.textureCache[d];let p=this._loadTexture(r,i,a);return p&&(l&&(p.userData.scale=l),f&&(p.userData.bias=f),o!==0&&(p.channel=o),this.textureCache[d]=p),p}_applyTextureTransforms(t,e){if(!e)return;let n=e["inputs:scale"];n&&Array.isArray(n)&&n.length>=2&&t.repeat.set(n[0],n[1]);let i=e["inputs:translation"];i&&Array.isArray(i)&&i.length>=2&&t.offset.set(i[0],i[1]);let s=e["inputs:rotation"];typeof s=="number"&&(t.rotation=s*Math.PI/180)}_loadTexture(t,e,n){let i=t;i.startsWith("@")&&(i=i.slice(1)),i.endsWith("@")&&(i=i.slice(0,-1));let s=this._resolveFilePath(i),r=this.assets[s];if(r||(r=this.assets[i]),!r){let a=i.split("/").pop();for(let o in this.assets)if(o.endsWith(a)||o.endsWith("/"+a))return this._createTextureFromData(this.assets[o],e,n);return this.basePath?this._createTextureFromData(s,e,n):this.manager?this._createTextureFromData(a,e,n):(console.warn("USDLoader: Texture not found:",i),null)}return this._createTextureFromData(r,e,n)}_createTextureFromData(t,e,n){if(!t)return null;let i=this,s=new te,r;if(typeof t=="string")r=t;else if(t instanceof Uint8Array||t instanceof ArrayBuffer){let a=new Blob([t]);r=URL.createObjectURL(a)}else return null;return this.texturePromises.push(new Promise(a=>{this.imageLoader.load(r,function(o){s.image=o,e&&(s.wrapS=i._getWrapMode(e["inputs:wrapS"]),s.wrapT=i._getWrapMode(e["inputs:wrapT"])),i._applyTextureTransforms(s,n),s.needsUpdate=!0,typeof t!="string"&&URL.revokeObjectURL(r),a()},void 0,function(){console.warn("USDLoader: Failed to load texture:",r),typeof t!="string"&&URL.revokeObjectURL(r),a()})})),s}_getWrapMode(t){return t==="repeat"?Ye:t==="mirror"?dn:t==="clamp"?Se:Ye}_buildSkeleton(t){let e=this._getAttributes(t),n=e.joints;if(!n||n.length===0)return null;let i=e.bindTransforms,s=e.restTransforms,r=this._flattenMatrixArray(i,n.length),a=this._flattenMatrixArray(s,n.length),o=[],c={},u=[];for(let p=0;p<n.length;p++){let m=n[p],g=m.split("/").pop(),v=new Je;if(v.name=g,o.push(v),c[m]={bone:v,index:p},r&&r.length>=(p+1)*16){let y=new z,_=r.slice(p*16,(p+1)*16);y.set(_[0],_[4],_[8],_[12],_[1],_[5],_[9],_[13],_[2],_[6],_[10],_[14],_[3],_[7],_[11],_[15]);let x=y.clone().invert();u.push(x)}else u.push(new z)}for(let p=0;p<n.length;p++){let g=n[p].split("/");if(g.length>1){let v=g.slice(0,-1).join("/"),y=c[v];y&&y.bone.add(o[p])}}if(a&&a.length>=n.length*16)for(let p=0;p<n.length;p++){let m=new z,g=a.slice(p*16,(p+1)*16);m.set(g[0],g[4],g[8],g[12],g[1],g[5],g[9],g[13],g[2],g[6],g[10],g[14],g[3],g[7],g[11],g[15]),m.decompose(o[p].position,o[p].quaternion,o[p].scale)}let l=o.filter(p=>!p.parent||!p.parent.isBone),f=this.specsByPath[t+".skel:animationSource"],d=null;return f&&f.fields.targetPaths&&f.fields.targetPaths.length>0&&(d=f.fields.targetPaths[0]),{skeleton:new vn(o,u),joints:n,rootBones:l,animationPath:d,path:t}}_bindSkeletons(){for(let t of this.skinnedMeshes){let{mesh:e,skeletonPath:n,localJoints:i,geomBindTransform:s}=t,r=null;if(n&&this.skeletons[n]&&(r=this.skeletons[n]),!r){for(let l in this.skeletons)if(n&&(n.includes(l)||l.includes(n))){r=this.skeletons[l];break}}if(!r){let l=Object.keys(this.skeletons);l.length>0&&(r=this.skeletons[l[0]])}if(!r){console.warn("USDComposer: No skeleton found for skinned mesh",e.name);continue}let{skeleton:a,rootBones:o,joints:c}=r;if(i&&i.length>0){let l=e.geometry.attributes.skinIndex;if(l){let f=[];for(let p=0;p<i.length;p++){let m=i[p],g=c.indexOf(m);f[p]=g>=0?g:0}let d=l.array;for(let p=0;p<d.length;p++){let m=d[p];m<f.length&&(d[p]=f[m])}}}for(let l of o)e.add(l);let u=new z;if(s&&s.length===16){let l=s;u.set(l[0],l[4],l[8],l[12],l[1],l[5],l[9],l[13],l[2],l[6],l[10],l[14],l[3],l[7],l[11],l[15])}e.bind(a,u)}}_buildAnimations(){let t=[];for(let n in this.specsByPath){let i=this.specsByPath[n];if(i.specType!==Le.Prim||i.fields.typeName!=="SkelAnimation")continue;let s=this._buildAnimationClip(n);s&&t.push(s)}let e=this._buildTransformAnimations();return e.length>0&&t.push(new tn("TransformAnimation",-1,e)),t}_buildTransformAnimations(){let t=[];for(let e in this.specsByPath){let n=this.specsByPath[e];if(n.specType!==Le.Prim)continue;let i=n.fields?.typeName;if(i!=="Xform"&&i!=="Scope"&&i!=="Mesh")continue;let s=e.split("/").pop(),r=e+".xformOp:orient",a=this.specsByPath[r];if(a?.fields?.timeSamples){let{times:m,values:g}=a.fields.timeSamples,v=[],y=[];for(let _=0;_<m.length;_++){v.push(m[_]/this.fps);let x=g[_];y.push(x[0],x[1],x[2],x[3])}v.length>0&&t.push(new Ot(s+".quaternion",new Float32Array(v),new Float32Array(y)))}let o=e+".xformOp:rotateXYZ",c=this.specsByPath[o];if(c?.fields?.timeSamples){let{times:m,values:g}=c.fields.timeSamples,v=[],y=[],_=new Wt,x=new yt;for(let S=0;S<m.length;S++){v.push(m[S]/this.fps);let b=g[S];_.set(b[0]*Math.PI/180,b[1]*Math.PI/180,b[2]*Math.PI/180,"ZYX"),x.setFromEuler(_),y.push(x.x,x.y,x.z,x.w)}v.length>0&&t.push(new Ot(s+".quaternion",new Float32Array(v),new Float32Array(y)))}let u=e+".xformOp:translate",l=this.specsByPath[u];if(l?.fields?.timeSamples){let{times:m,values:g}=l.fields.timeSamples,v=[],y=[];for(let _=0;_<m.length;_++){v.push(m[_]/this.fps);let x=g[_];y.push(x[0],x[1],x[2])}v.length>0&&t.push(new Pt(s+".position",new Float32Array(v),new Float32Array(y)))}let f=e+".xformOp:scale",d=this.specsByPath[f];if(d?.fields?.timeSamples){let{times:m,values:g}=d.fields.timeSamples,v=[],y=[];for(let _=0;_<m.length;_++){v.push(m[_]/this.fps);let x=g[_];y.push(x[0],x[1],x[2])}v.length>0&&t.push(new Pt(s+".scale",new Float32Array(v),new Float32Array(y)))}let p=n.fields?.properties||[];for(let m of p){if(!m.startsWith("xformOp:transform"))continue;let g=e+"."+m,v=this.specsByPath[g];if(!v?.fields?.timeSamples)continue;let{times:y,values:_}=v.fields.timeSamples,x=[],S=[],b=[],w=[],T=[],A=[],E=new z,P=new M,C=new yt,D=new M;for(let N=0;N<y.length;N++){let L=_[N];if(!L||L.length<16)continue;let k=y[N]/this.fps;E.set(L[0],L[4],L[8],L[12],L[1],L[5],L[9],L[13],L[2],L[6],L[10],L[14],L[3],L[7],L[11],L[15]),E.decompose(P,C,D),x.push(k),S.push(P.x,P.y,P.z),b.push(k),w.push(C.x,C.y,C.z,C.w),T.push(k),A.push(D.x,D.y,D.z)}x.length>0&&(t.push(new Pt(s+".position",new Float32Array(x),new Float32Array(S))),t.push(new Ot(s+".quaternion",new Float32Array(b),new Float32Array(w))),t.push(new Pt(s+".scale",new Float32Array(T),new Float32Array(A))));break}}return t}_buildAnimationClip(t){let n=this._getAttributes(t).joints;if(!n||n.length===0)return null;let i=[],s=this._getTimeSampledAttribute(t,"rotations");if(s&&s.times&&s.values){let{times:c,values:u}=s;for(let l=0;l<n.length;l++){let f=n[l].split("/").pop(),d=[],p=[];for(let m=0;m<c.length;m++){let g=u[m];if(!g||g.length<(l+1)*4)continue;d.push(c[m]/this.fps);let v=g[l*4+0],y=g[l*4+1],_=g[l*4+2],x=g[l*4+3];p.push(v,y,_,x)}d.length>0&&i.push(new Ot(f+".quaternion",new Float32Array(d),new Float32Array(p)))}}let r=this._getTimeSampledAttribute(t,"translations");if(r&&r.times&&r.values){let{times:c,values:u}=r;for(let l=0;l<n.length;l++){let f=n[l].split("/").pop(),d=[],p=[];for(let m=0;m<c.length;m++){let g=u[m];!g||g.length<(l+1)*3||(d.push(c[m]/this.fps),p.push(g[l*3+0],g[l*3+1],g[l*3+2]))}d.length>0&&i.push(new Pt(f+".position",new Float32Array(d),new Float32Array(p)))}}let a=this._getTimeSampledAttribute(t,"scales");if(a&&a.times&&a.values){let{times:c,values:u}=a;for(let l=0;l<n.length;l++){let f=n[l].split("/").pop(),d=[],p=[];for(let m=0;m<c.length;m++){let g=u[m];!g||g.length<(l+1)*3||(d.push(c[m]/this.fps),p.push(g[l*3+0],g[l*3+1],g[l*3+2]))}d.length>0&&i.push(new Pt(f+".scale",new Float32Array(d),new Float32Array(p)))}}if(i.length===0)return null;let o=t.split("/").pop();return new tn(o,-1,i)}_getTimeSampledAttribute(t,e){let n=t+"."+e,i=this.specsByPath[n];if(i&&i.fields.timeSamples){let s=i.fields.timeSamples;if(s.times&&s.values)return s}return null}_flattenMatrixArray(t,e){if(!t||t.length===0)return null;if(typeof t[0]=="number")return t;let n=[];for(let i=0;i<e;i++)for(let s=0;s<4;s++){let r=t[i*4+s];r&&r.length===4?n.push(r[0],r[1],r[2],r[3]):n.push(s===0?1:0,s===1?1:0,s===2?1:0,s===3?1:0)}return n}};var Ri=class extends ge{constructor(t){super(t)}load(t,e,n,i){let s=this,r=s.path===""?Ce.extractUrlBase(t):s.path,a=new Cn(s.manager);a.setPriority(s.priority),a.setCache(s.cache),a.setPath(s.path),a.setResponseType("arraybuffer"),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(t,function(o){try{s.parse(o,r,e,i)}catch(c){i?i(c):console.error(c),s.manager.itemError(t)}},n,i)}parse(t,e="",n,i){let s=new Ci,r=new Ie,a=new TextDecoder;function o(_){return _ instanceof ArrayBuffer?_:_.byteOffset===0&&_.byteLength===_.buffer.byteLength?_.buffer:_.buffer.slice(_.byteOffset,_.byteOffset+_.byteLength)}function c(_){let x=_.lastIndexOf(".");return x<0||_.lastIndexOf("/")>x?"":_.slice(x+1).toLowerCase()}function u(_){let x={};for(let S in _){let b=_[S],w=c(S);if(w==="png"||w==="jpg"||w==="jpeg"||w==="avif"){x[S]=b;continue}w!=="usd"&&w!=="usda"&&w!=="usdc"||(l(b)?x[S]=r.parseData(o(b)):x[S]=s.parseData(a.decode(b)))}return x}function l(_){let x=new Uint8Array([80,88,82,45,85,83,68,67]),S=_ instanceof Uint8Array?_:new Uint8Array(_);if(S.byteLength<x.length)return!1;for(let b=0;b<x.length;b++)if(S[b]!==x[b])return!1;return!0}function f(_){let x=Object.keys(_);if(x.length<1)return{file:void 0,filename:"",basePath:""};let S=x[0],b=c(S),w=!1,T=S.lastIndexOf("/"),A=T>=0?S.slice(0,T):"";if(b==="usda")return{file:_[S],filename:S,basePath:A};if(b==="usdc")w=!0;else if(b==="usd")if(l(_[S]))w=!0;else return{file:_[S],filename:S,basePath:A};return w?{file:_[S],filename:S,basePath:A}:{file:void 0,filename:"",basePath:""}}let d=this,p=(_,x)=>(n&&Promise.all(_.texturePromises).then(()=>n(x)).catch(S=>i?i(S):console.error(S)),x);if(typeof t=="string"){let _=new qt(d.manager);_.imageLoader.setCrossOrigin(d.crossOrigin),_.imageLoader.setPriority(d.priority),_.imageLoader.setCache(d.cache);let x=s.parseData(t);return p(_,_.compose(x,{},{},e))}if(l(t)){let _=new qt(d.manager);_.imageLoader.setCrossOrigin(d.crossOrigin),_.imageLoader.setPriority(d.priority),_.imageLoader.setCache(d.cache);let x=r.parseData(o(t));return p(_,_.compose(x,{},{},e))}let m=new Uint8Array(t);if(m[0]===80&&m[1]===75){let _=ca(m),x=u(_),{file:S,filename:b,basePath:w}=f(_);if(!S)throw new Error("THREE.USDLoader: Invalid USDZ package. The first ZIP entry must be a USD layer (.usd/.usda/.usdc).");let T=new qt(d.manager);T.imageLoader.setCrossOrigin(d.crossOrigin),T.imageLoader.setPriority(d.priority),T.imageLoader.setCache(d.cache);let A=x[b];if(!A)throw new Error('THREE.USDLoader: Failed to parse root layer "'+b+'".');return p(T,T.compose(A,x,{},w))}let g=new qt(d.manager);g.imageLoader.setCrossOrigin(d.crossOrigin),g.imageLoader.setPriority(d.priority),g.imageLoader.setCache(d.cache);let v=a.decode(m),y=s.parseData(v);return p(g,g.compose(y,{},{},e))}};var Ch=Ie.prototype._readInlinedValue;Ie.prototype._readInlinedValue=function(h){let t={19:2,23:3,27:4}[h.typeEnum];if(t){let e=h.getInlinedValue();return Array.from({length:t},(n,i)=>(e>>>i*8&255)<<24>>24)}return Ch.call(this,h)};var Rh=qt.prototype.compose;qt.prototype.compose=function(h,...t){let e=Rh.call(this,h,...t);return h.specsByPath["/"]?.fields?.metersPerUnit===void 0&&e.scale.multiplyScalar(.01),e};var $s=new WeakMap;we.prototype.load=function(h,t,e,n){if(!h.startsWith("blob:")){n?.(new Error("External USD assets are unavailable."));return}fetch(h).then(i=>i.blob()).then(async i=>{let s=await createImageBitmap(i,{premultiplyAlpha:"none",colorSpaceConversion:"none"}),r=new Uint8Array(await i.arrayBuffer());if(!(r[0]===137&&r[1]===80)&&!(r[0]===255&&r[1]===216)){let a=new OffscreenCanvas(s.width,s.height);a.getContext("2d").drawImage(s,0,0),r=new Uint8Array(await(await a.convertToBlob({type:"image/png"})).arrayBuffer())}$s.set(s,r),t?.(s)}).catch(i=>n?.(i))};async function Ph(h){if(h[0]!==80||h[1]!==75)throw new Error("This is not a USDZ archive.");let t=[],e=console.warn;console.warn=(...n)=>{t.length<12&&t.push(n.join(" ").slice(0,250))};try{let n=await new Promise((o,c)=>new Ri().parse(h.buffer,"",o,c));n.updateMatrixWorld(!0);let i={glbPrimitives:[],gltfMaterials:[],textures:[]},s=new Map,r=new M,a=new V;if(n.traverseVisible(o=>{if(!o.isMesh)return;let c=o.geometry,u=c.getAttribute("position");if(!u)return;c.getAttribute("color")&&t.length<12&&t.push("Per-vertex display colors are not displayed; material colors are used.");let l=Array.isArray(o.material)?o.material:[o.material],f=c.index?.count??u.count,d=c.groups.length?c.groups:[{start:0,count:f,materialIndex:0}];for(let p=0;p<(o.isInstancedMesh?o.count:1);p++){let m=o.matrixWorld.clone();if(o.isInstancedMesh){let g=new z;o.getMatrixAt(p,g),m.multiply(g)}for(let g of d){let v=l[g.materialIndex]||l[0];if(!v||v.visible===!1)continue;let y=-1,_=v.map;_?.image&&$s.has(_.image)&&(s.has(_.image)||(s.set(_.image,i.textures.length),i.textures.push({data:$s.get(_.image)})),y=s.get(_.image),_.updateMatrix());let x=Math.max(g.start,c.drawRange.start),S=Math.min(f,g.start+g.count,c.drawRange.start+c.drawRange.count);if(S<=x)continue;if((S-x)%3)throw new Error("Invalid USD triangle indices.");let b=new Float64Array(u.count*3),w=new Float32Array(u.count*2),T=c.getAttribute(_?.channel?"uv"+_.channel:"uv");for(let C=0;C<u.count;C++)o.getVertexPosition(C,r),r.applyMatrix4(m),r.toArray(b,C*3),T&&(a.fromBufferAttribute(T,C),_&&_.transformUv(a),a.toArray(w,C*2));let A=new Uint32Array(S-x);for(let C=x;C<S;C++)A[C-x]=c.index?c.index.getX(C):C;if(m.determinant()<0)for(let C=0;C<A.length;C+=3){let D=A[C+1];A[C+1]=A[C+2],A[C+2]=D}let E=v.color.clone().convertLinearToSRGB(),P=i.gltfMaterials.length;i.gltfMaterials.push({pbrMetallicRoughness:{baseColorFactor:[E.r,E.g,E.b,v.opacity],...y>=0?{baseColorTexture:{index:y}}:{}},doubleSided:v.side===ws,alphaMode:v.transparent?"BLEND":v.alphaTest>0?"MASK":"OPAQUE",alphaCutoff:v.alphaTest}),i.glbPrimitives.push({positions:b,uvs:w,indices:A,materialIndex:P})}}}),!i.glbPrimitives.length)throw new Error("This USDZ has no supported mesh surfaces.");return{scene:i,notice:"USDZ static preview with transforms, material colors and embedded textures. Animation, lighting, advanced material effects and some USD composition features may differ or be omitted."+(t.length?`
Reader notes: `+[...new Set(t)].slice(0,12).join(`
`):"")}}finally{console.warn=e}}return _a(Ih);})();

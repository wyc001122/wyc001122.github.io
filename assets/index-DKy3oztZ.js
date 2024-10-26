import{G as it,T as nt,R as q,S as ot,c as rt,_ as st,d as at,e as $,f as lt,D as ht,u as pt,O as ct,b as mt}from"./GLTFLoader-Cpm_xSlR.js";import{G as ut}from"./GPUComputationRenderer-CzXY8eDU.js";import{d as dt,f as vt,p as ft,k as xt,w as yt,q as gt,o as Pt,h as B}from"./index-qyBmO-yZ.js";import{a as Dt}from"./_plugin-vue_export-helper-CQ7wvoWd.js";import"./Pass-8nf9LS6g.js";function wt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function zt(t){var e=t.length,i=1,n=new Array(e),o;for(o=e;o>0;o--)n[o-1]=i,i=i*t[o-1];return{stride:n,data:new Uint32Array(i)}}function Mt(t){var e=t.length,i=1,n=new Array(e),o=[],r,s;for(r=e;r>0;r--)n[r-1]=i,i=i*t[r-1];for(s=0;s<i;s++)o.push([]);return{stride:n,data:o}}var W={integer:zt,array:Mt},X=bt;function bt(t,e){var i=new Array(t),n=Math.floor(t/2)<<1,o=0,r,s,h,u,f;for(f=0;f<n;f+=2)r=-2*Math.log(e()),s=Math.sqrt(r),h=2*Math.PI*e(),o+=r,i[f]=s*Math.cos(h),i[f+1]=s*Math.sin(h);if(t%2){var g=Math.sqrt(-2*Math.log(e()))*Math.cos(2*Math.PI*e());i[t-1]=g,o+=Math.pow(g,2)}for(u=1/Math.sqrt(o),f=0;f<t;++f)i[f]*=u;return i}var St=function(e,i){e=e||1,i=i||2;for(var n=e*2+1,o=Math.pow(n,i)-1,r=new Array(o),s=0;s<o;s++)for(var h=r[s]=new Array(i),u=s<o/2?s:s+1,f=1;f<=i;f++){var g=u%Math.pow(n,f);h[f-1]=g/Math.pow(n,f-1)-e,u-=g}return r},At=St;function Tt(t){var e=At(2,t),i=[],n;for(e=e.filter(function(o){for(var r=0,s=0;s<t;s++)r+=Math.pow(Math.max(0,Math.abs(o[s])-1),2);return r<t}),n=0;n<t;n++)i.push(0);return e.push(i),e.sort(function(o,r){var s=0,h=0,u;for(u=0;u<t;u++)s+=Math.pow(o[u],2),h+=Math.pow(r[u],2);return s<h?-1:s>h?1:0}),e}var R={};function Ct(t){return R[t]||(R[t]=Tt(t)),R[t]}var Y=Ct,It=W.integer,_t=X,Ft=Y;function Nt(t,e){for(var i=0,n=0;n<t.length;n++)i+=Math.pow(t[n]-e[n],2);return i}function c(t,e){if(typeof t.distanceFunction=="function")throw new Error("PoissonDiskSampling: Tried to instantiate the fixed density implementation with a distanceFunction");this.shape=t.shape,this.minDistance=t.minDistance,this.maxDistance=t.maxDistance||t.minDistance*2,this.maxTries=Math.ceil(Math.max(1,t.tries||30)),this.rng=e||Math.random;for(var i=0,n=0;n<this.shape.length;n++)i=Math.max(i,this.shape[n]);var o=Math.max(1,i/128|0),r=1e-14*o;this.dimension=this.shape.length,this.squaredMinDistance=this.minDistance*this.minDistance,this.minDistancePlusEpsilon=this.minDistance+r,this.deltaDistance=Math.max(0,this.maxDistance-this.minDistancePlusEpsilon),this.cellSize=this.minDistance/Math.sqrt(this.dimension),this.neighbourhood=Ft(this.dimension),this.currentPoint=null,this.processList=[],this.samplePoints=[],this.gridShape=[];for(var n=0;n<this.dimension;n++)this.gridShape.push(Math.ceil(this.shape[n]/this.cellSize));this.grid=It(this.gridShape)}c.prototype.shape=null;c.prototype.dimension=null;c.prototype.minDistance=null;c.prototype.maxDistance=null;c.prototype.minDistancePlusEpsilon=null;c.prototype.squaredMinDistance=null;c.prototype.deltaDistance=null;c.prototype.cellSize=null;c.prototype.maxTries=null;c.prototype.rng=null;c.prototype.neighbourhood=null;c.prototype.currentPoint=null;c.prototype.processList=null;c.prototype.samplePoints=null;c.prototype.gridShape=null;c.prototype.grid=null;c.prototype.addRandomPoint=function(){for(var t=new Array(this.dimension),e=0;e<this.dimension;e++)t[e]=this.rng()*this.shape[e];return this.directAddPoint(t)};c.prototype.addPoint=function(t){var e,i=!0;if(t.length===this.dimension)for(e=0;e<this.dimension&&i;e++)i=t[e]>=0&&t[e]<this.shape[e];else i=!1;return i?this.directAddPoint(t):null};c.prototype.directAddPoint=function(t){var e=0,i=this.grid.stride,n;for(this.processList.push(t),this.samplePoints.push(t),n=0;n<this.dimension;n++)e+=(t[n]/this.cellSize|0)*i[n];return this.grid.data[e]=this.samplePoints.length,t};c.prototype.inNeighbourhood=function(t){var e=this.dimension,i=this.grid.stride,n,o,r,s,h;for(n=0;n<this.neighbourhood.length;n++){for(o=0,r=0;r<e;r++){if(s=(t[r]/this.cellSize|0)+this.neighbourhood[n][r],s<0||s>=this.gridShape[r]){o=-1;break}o+=s*i[r]}if(o!==-1&&this.grid.data[o]!==0&&(h=this.samplePoints[this.grid.data[o]-1],Nt(t,h)<this.squaredMinDistance))return!0}return!1};c.prototype.next=function(){for(var t,e,i,n,o,r,s;this.processList.length>0;){for(this.currentPoint===null&&(this.currentPoint=this.processList.shift()),n=this.currentPoint,t=0;t<this.maxTries;t++){for(r=!0,i=this.minDistancePlusEpsilon+this.deltaDistance*this.rng(),this.dimension===2?(e=this.rng()*Math.PI*2,o=[Math.cos(e),Math.sin(e)]):o=_t(this.dimension,this.rng),s=0;r&&s<this.dimension;s++)o[s]=n[s]+o[s]*i,r=o[s]>=0&&o[s]<this.shape[s];if(r&&!this.inNeighbourhood(o))return this.directAddPoint(o)}t===this.maxTries&&(this.currentPoint=null)}return null};c.prototype.fill=function(){for(this.samplePoints.length===0&&this.addRandomPoint();this.next(););return this.samplePoints};c.prototype.getAllPoints=function(){return this.samplePoints};c.prototype.getAllPointsWithDistance=function(){throw new Error("PoissonDiskSampling: getAllPointsWithDistance() is not available in fixed-density implementation")};c.prototype.reset=function(){var t=this.grid.data,e=0;for(e=0;e<t.length;e++)t[e]=0;this.samplePoints=[],this.currentPoint=null,this.processList.length=0};var qt=c,Lt=W.array,Et=X,Vt=Y;function kt(t,e){for(var i=0,n=0;n<t.length;n++)i+=Math.pow(t[n]-e[n],2);return Math.sqrt(i)}function l(t,e){if(typeof t.distanceFunction!="function")throw new Error("PoissonDiskSampling: Tried to instantiate the variable density implementation without a distanceFunction");this.shape=t.shape,this.minDistance=t.minDistance,this.maxDistance=t.maxDistance||t.minDistance*2,this.maxTries=Math.ceil(Math.max(1,t.tries||30)),this.distanceFunction=t.distanceFunction,this.bias=Math.max(0,Math.min(1,t.bias||0)),this.rng=e||Math.random;for(var i=0,n=0;n<this.shape.length;n++)i=Math.max(i,this.shape[n]);var o=Math.max(1,i/128|0),r=1e-14*o;this.dimension=this.shape.length,this.minDistancePlusEpsilon=this.minDistance+r,this.deltaDistance=Math.max(0,this.maxDistance-this.minDistancePlusEpsilon),this.cellSize=this.maxDistance/Math.sqrt(this.dimension),this.neighbourhood=Vt(this.dimension),this.currentPoint=null,this.currentDistance=0,this.processList=[],this.samplePoints=[],this.sampleDistance=[],this.gridShape=[];for(var n=0;n<this.dimension;n++)this.gridShape.push(Math.ceil(this.shape[n]/this.cellSize));this.grid=Lt(this.gridShape)}l.prototype.shape=null;l.prototype.dimension=null;l.prototype.minDistance=null;l.prototype.maxDistance=null;l.prototype.minDistancePlusEpsilon=null;l.prototype.deltaDistance=null;l.prototype.cellSize=null;l.prototype.maxTries=null;l.prototype.distanceFunction=null;l.prototype.bias=null;l.prototype.rng=null;l.prototype.neighbourhood=null;l.prototype.currentPoint=null;l.prototype.currentDistance=null;l.prototype.processList=null;l.prototype.samplePoints=null;l.prototype.sampleDistance=null;l.prototype.gridShape=null;l.prototype.grid=null;l.prototype.addRandomPoint=function(){for(var t=new Array(this.dimension),e=0;e<this.dimension;e++)t[e]=this.rng()*this.shape[e];return this.directAddPoint(t)};l.prototype.addPoint=function(t){var e,i=!0;if(t.length===this.dimension)for(e=0;e<this.dimension&&i;e++)i=t[e]>=0&&t[e]<this.shape[e];else i=!1;return i?this.directAddPoint(t):null};l.prototype.directAddPoint=function(t){var e=0,i=this.grid.stride,n=this.samplePoints.length,o;for(this.processList.push(n),this.samplePoints.push(t),this.sampleDistance.push(this.distanceFunction(t)),o=0;o<this.dimension;o++)e+=(t[o]/this.cellSize|0)*i[o];return this.grid.data[e].push(n),t};l.prototype.inNeighbourhood=function(t){var e=this.dimension,i=this.grid.stride,n,o,r,s,h,u,f=this.distanceFunction(t);for(n=0;n<this.neighbourhood.length;n++){for(o=0,r=0;r<e;r++){if(s=(t[r]/this.cellSize|0)+this.neighbourhood[n][r],s<0||s>=this.gridShape[r]){o=-1;break}o+=s*i[r]}if(o!==-1&&this.grid.data[o].length>0)for(var g=0;g<this.grid.data[o].length;g++){h=this.samplePoints[this.grid.data[o][g]],u=this.sampleDistance[this.grid.data[o][g]];var C=Math.min(u,f),L=Math.max(u,f),I=C+(L-C)*this.bias;if(kt(t,h)<this.minDistance+this.deltaDistance*I)return!0}}return!1};l.prototype.next=function(){for(var t,e,i,n,o,r,s,h;this.processList.length>0;){if(this.currentPoint===null){var u=this.processList.shift();this.currentPoint=this.samplePoints[u],this.currentDistance=this.sampleDistance[u]}for(n=this.currentPoint,o=this.currentDistance,t=0;t<this.maxTries;t++){for(s=!0,i=this.minDistancePlusEpsilon+this.deltaDistance*(o+(1-o)*this.bias),this.dimension===2?(e=this.rng()*Math.PI*2,r=[Math.cos(e),Math.sin(e)]):r=Et(this.dimension,this.rng),h=0;s&&h<this.dimension;h++)r[h]=n[h]+r[h]*i,s=r[h]>=0&&r[h]<this.shape[h];if(s&&!this.inNeighbourhood(r))return this.directAddPoint(r)}t===this.maxTries&&(this.currentPoint=null)}return null};l.prototype.fill=function(){for(this.samplePoints.length===0&&this.addRandomPoint();this.next(););return this.samplePoints};l.prototype.getAllPoints=function(){return this.samplePoints};l.prototype.getAllPointsWithDistance=function(){var t=new Array(this.samplePoints.length),e=0,i=0,n;for(e=0;e<this.samplePoints.length;e++){for(n=new Array(this.dimension+1),i=0;i<this.dimension;i++)n[i]=this.samplePoints[e][i];n[this.dimension]=this.sampleDistance[e],t[e]=n}return t};l.prototype.reset=function(){var t=this.grid.data,e=0;for(e=0;e<t.length;e++)t[e]=[];this.samplePoints=[],this.currentPoint=null,this.processList.length=0};var Rt=l,jt=qt,Ut=Rt;function w(t,e){this.shape=t.shape,typeof t.distanceFunction=="function"?this.implementation=new Ut(t,e):this.implementation=new jt(t,e)}w.prototype.implementation=null;w.prototype.addRandomPoint=function(){return this.implementation.addRandomPoint()};w.prototype.addPoint=function(t){return this.implementation.addPoint(t)};w.prototype.next=function(){return this.implementation.next()};w.prototype.fill=function(){return this.implementation.fill()};w.prototype.getAllPoints=function(){return this.implementation.getAllPoints()};w.prototype.getAllPointsWithDistance=function(){return this.implementation.getAllPointsWithDistance()};w.prototype.reset=function(){this.implementation.reset()};var Ot=w;const $t=wt(Ot);var Bt=`uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying float vShade;
float PI = 3.141592653589793238;
void main()	{
	
	vec3 color = vec3(.2);
	float alpha = 1.-length(gl_PointCoord.xy - 0.5)*2.;

	float finalAlpha = alpha*0.05 + smoothstep(0.,1.,alpha)*0.1 + 0.5*smoothstep(0.9-fwidth(alpha),0.9,alpha);

	float opac = 1. - (.7*vShade);

	gl_FragColor = vec4(color,finalAlpha*opac);
}`,Wt=`uniform float time;
uniform sampler2D uTarget;
void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 position = texture2D(texturePosition, uv);
  vec4 velocity = texture2D(textureVelocity, uv);
  vec4 target = texture2D(uTarget, uv);

  velocity *= 0.8;
  velocity += (target - position) * 2.;

  gl_FragColor = vec4(velocity);
}`,Xt=`uniform float time;
uniform float delta;
vec4 mod289(vec4 x) {
    return x-floor(x*(1.0/289.0))*289.0;
}
float mod289(float x) {
    return x-floor(x*(1.0/289.0))*289.0;
}
vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}
float permute(float x) {
    return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159-0.85373472095314*r;
}
float taylorInvSqrt(float r) {
    return 1.79284291400159-0.85373472095314*r;
}
vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p, s;
    p.xyz = floor(fract(vec3(j)*ip.xyz)*7.0)*ip.z-1.0;
    p.w = 1.5-dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz+(s.xyz*2.0-1.0)*s.www;
    return p;
}
#define F4 0.309016994374947451
vec4 simplexNoiseDerivatives(vec4 v) {
    const vec4 C = vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
    vec4 i = floor(v+dot(v, vec4(F4)));
    vec4 x0 = v-i+dot(i, C.xxxx);
    vec4 i0;
    vec3 isX = step(x0.yzw, x0.xxx);
    vec3 isYZ = step(x0.zww, x0.yyz);
    i0.x = isX.x+isX.y+isX.z;
    i0.yzw = 1.0-isX;
    i0.y += isYZ.x+isYZ.y;
    i0.zw += 1.0-isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0-isYZ.z;
    vec4 i3 = clamp(i0, 0.0, 1.0);
    vec4 i2 = clamp(i0-1.0, 0.0, 1.0);
    vec4 i1 = clamp(i0-2.0, 0.0, 1.0);
    vec4 x1 = x0-i1+C.xxxx;
    vec4 x2 = x0-i2+C.yyyy;
    vec4 x3 = x0-i3+C.zzzz;
    vec4 x4 = x0+C.wwww;
    i = mod289(i);
    float j0 = permute(permute(permute(permute(i.w)+i.z)+i.y)+i.x);
    vec4 j1 = permute(permute(permute(permute(i.w+vec4(i1.w, i2.w, i3.w, 1.0))+i.z+vec4(i1.z, i2.z, i3.z, 1.0))+i.y+vec4(i1.y, i2.y, i3.y, 1.0))+i.x+vec4(i1.x, i2.x, i3.x, 1.0));
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);
    vec4 p0 = grad4(j0, ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4, p4));
    vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2));
    vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));
    vec3 m0 = max(0.5-vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
    vec2 m1 = max(0.5-vec2(dot(x3, x3), dot(x4, x4)), 0.0);
    vec3 temp0 = -6.0*m0*m0*values0;
    vec2 temp1 = -6.0*m1*m1*values1;
    vec3 mmm0 = m0*m0*m0;
    vec2 mmm1 = m1*m1*m1;
    float dx = temp0[0]*x0.x+temp0[1]*x1.x+temp0[2]*x2.x+temp1[0]*x3.x+temp1[1]*x4.x+mmm0[0]*p0.x+mmm0[1]*p1.x+mmm0[2]*p2.x+mmm1[0]*p3.x+mmm1[1]*p4.x;
    float dy = temp0[0]*x0.y+temp0[1]*x1.y+temp0[2]*x2.y+temp1[0]*x3.y+temp1[1]*x4.y+mmm0[0]*p0.y+mmm0[1]*p1.y+mmm0[2]*p2.y+mmm1[0]*p3.y+mmm1[1]*p4.y;
    float dz = temp0[0]*x0.z+temp0[1]*x1.z+temp0[2]*x2.z+temp1[0]*x3.z+temp1[1]*x4.z+mmm0[0]*p0.z+mmm0[1]*p1.z+mmm0[2]*p2.z+mmm1[0]*p3.z+mmm1[1]*p4.z;
    float dw = temp0[0]*x0.w+temp0[1]*x1.w+temp0[2]*x2.w+temp1[0]*x3.w+temp1[1]*x4.w+mmm0[0]*p0.w+mmm0[1]*p1.w+mmm0[2]*p2.w+mmm1[0]*p3.w+mmm1[1]*p4.w;
    return vec4(dx, dy, dz, dw)*49.0;
}
vec3 curl(in vec3 p, in float noiseTime, in float persistence) {
    vec4 xNoisePotentialDerivatives = vec4(0.0);
    vec4 yNoisePotentialDerivatives = vec4(0.0);
    vec4 zNoisePotentialDerivatives = vec4(0.0);
    for(int i = 0;i<2;++i) {
        float twoPowI = pow(2.0, float(i));
        float scale = 0.5*twoPowI*pow(persistence, float(i));
        xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(p*twoPowI, noiseTime))*scale;
        yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p+vec3(123.4, 129845.6, -1239.1))*twoPowI, noiseTime))*scale;
        zNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p+vec3(-9519.0, 9051.0, -123.0))*twoPowI, noiseTime))*scale;
    }
    return vec3(zNoisePotentialDerivatives[1]-yNoisePotentialDerivatives[2], xNoisePotentialDerivatives[2]-zNoisePotentialDerivatives[0], yNoisePotentialDerivatives[0]-xNoisePotentialDerivatives[1]);
}
vec4 hash43(vec3 p) {
    vec4 p4 = fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

void main() {
    float uTime = time*0.2;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 position = texture2D(texturePosition, uv);
  vec4 velocity = texture2D(textureVelocity, uv);

  position += velocity * 1./60.;

  vec4 rands = hash43(vec3(uv*10.,0.));

  position.xyz += curl(vec3(position.xy,rands.x), uTime*mix(0.3,0.7, rands.y),0.1)*0.001*smoothstep(0.3,0.9,rands.z);

  gl_FragColor = vec4(position.xyz, position.w);
}`,Yt=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D uPositions;
attribute vec2 reference;
varying float vShade;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  vec3 pos = texture2D( uPositions, reference ).xyz;

  vShade = texture2D( uPositions, reference ).w;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1. );
  gl_PointSize = 45. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}`;const Gt=dt({__name:"index",setup(t){new it,new nt;let e,i,n,o,r,s,h,u;function f(){({container:e,renderer:i,scene:n,camera:o,clock:r,viewPort:s,tick:h}=pt(document.querySelector(".webgl")))}function g(){o.position.set(0,0,3),i.setClearColor(15658734,1)}function C(){u=new ct(o,i.domElement),u.enableDamping=!0}function L(){yt(s,()=>{const{width:v,height:p}=s.value;o.aspect=v/p,o.updateProjectionMatrix(),i.setSize(v,p,!1)})}let I;function G(){I=new mt({container:document.querySelector(".debug")}),gt(()=>I.destroy)}let d=128,j=d**2;vt(()=>{f(),G(),C(),L(),g(),H(),h(()=>{if(!x)return;const v=r.getElapsedTime();u.update(),x.compute(),k.time.value=v,S.time.value=v,F.uniforms.uPositions.value=x.getCurrentRenderTarget(z).texture,F.uniforms.time.value=v,i.render(n,o)})});let E,V;function Z(v){return new Promise((p,m)=>{const a=new Image;a.crossOrigin="Anonymous",a.src=v,a.onload=()=>{p(a)},a.onerror=M=>{m(M)}})}async function H(){E=await U(new URL("/assets/xiong-Clc1B3xc.jpg",import.meta.url).href),V=await U(new URL("/assets/logo-Dx_0B8x2.png",import.meta.url).href),J(),Q()}async function U(v){const p=await Z(v);let m=document.createElement("canvas"),a=m.getContext("2d",{willReadFrequently:!0});m.width=d,m.height=d,a.drawImage(p,0,0,d,d);let M=a.getImageData(0,0,d,d).data,P=Array.from({length:d},()=>new Array(d).fill(0));for(let y=0;y<d;y++)for(let D=0;D<d;D++){let T=(y+D*d)*4,et=M[T]/255;P[y][D]=et}var tt=new $t({shape:[1,1],minDistance:1/400,maxDistance:4/400,tries:20,distanceFunction:function(y){let D=Math.floor(y[0]*d),T=Math.floor(y[1]*d);return P[D][T]},bias:0});let A=tt.fill();return A.sort((y,D)=>Math.random()-.5),A=A.slice(0,j),A=A.map(y=>{let D=Math.floor(y[0]*d),T=Math.floor(y[1]*d);return[y[0],y[1],P[D][T]]}),A}let x,b,z,k,S;function J(){x=new ut(d,d,i);const v=x.createTexture(),p=x.createTexture(),m=x.createTexture();_(v,E),_(p,V),K(m);const a=x.createTexture(),M=x.createTexture();_(a,E),_(M,V),b=x.addVariable("textureVelocity",Wt,m),z=x.addVariable("texturePosition",Xt,v),x.setVariableDependencies(b,[z,b]),x.setVariableDependencies(z,[z,b]),k=z.material.uniforms,S=b.material.uniforms,k.time={value:0},S.time={value:1},S.uTarget={value:a},b.wrapS=q,b.wrapT=q,z.wrapS=q,z.wrapT=q;let P=0;e.addEventListener("click",()=>{P==0?(S.uTarget={value:M},P=1):(S.uTarget={value:a},P=0)}),x.init()}function _(v,p){const m=v.image.data;for(let a=0,M=m.length;a<M;a+=4){let P=a/4;m[a+0]=2*(p[P][0]-.5),m[a+1]=-2*(p[P][1]-.5),m[a+2]=0,m[a+3]=p[P][2]}}function K(v){const p=v.image.data;for(let m=0,a=p.length;m<a;m+=4)p[m+0]=.01*(Math.random()-.5),p[m+1]=.01*(Math.random()-.5),p[m+2]=0,p[m+3]=1}let F,N,O;function Q(){F=new ot({side:rt,uniforms:{time:{value:0},uPositions:{value:null},resolution:{value:new st}},depthTest:!1,depthWrite:!1,transparent:!0,vertexShader:Yt,fragmentShader:Bt}),N=new at;let v=j,p=new Float32Array(v*3),m=new Float32Array(v*2);for(let a=0;a<v;a++)p[a*3]=5*(Math.random()-.5),p[a*3+1]=5*(Math.random()-.5),p[a*3+2]=0,m[a*2]=a%d/d,m[a*2+1]=~~(a/d)/d;N.setAttribute("position",new $(p,3)),N.setAttribute("reference",new $(m,2)),O=new lt(N,F),n.add(O)}return(v,p)=>(Pt(),ft(ht,null,{default:xt(()=>p[0]||(p[0]=[B("div",{class:"webgl"},null,-1),B("div",{class:"debug"},null,-1)])),_:1}))}}),te=Dt(Gt,[["__scopeId","data-v-7ee50fdd"]]);export{te as default};

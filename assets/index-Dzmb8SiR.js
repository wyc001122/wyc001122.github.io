import{G as _,T as F,U as i,C as v,g as W,h as M,i as B,m as A,I as k,a as f,D as j,u as D,j as I,k as E,E as G,l as L,P as R,n as Y,O as Z,b as N}from"./GLTFLoader-Cpm_xSlR.js";import{R as X,z as w}from"./three-custom-shader-material.es-BKijawVj.js";import{d as U,f as O,p as V,k as H,w as J,q as K,o as Q,h as y}from"./index-qyBmO-yZ.js";import{a as $}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var g=`uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;

varying float vWobble;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}
float permute(float x) {
  return floor(mod(((x * 34.0) + 1.0) * x, 289.0));
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}
float taylorInvSqrt(float r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip) {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p, s;

  p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz * 2.0 - 1.0) * s.www;

  return p;
}

float simplexNoise4d(vec4 v) {
  const vec2 C = vec2(0.138196601125010504,  
  0.309016994374947451); 
  
  vec4 i = floor(v + dot(v, C.yyyy));
  vec4 x0 = v - i + dot(i, C.xxxx);

  

  
  vec4 i0;

  vec3 isX = step(x0.yzw, x0.xxx);
  vec3 isYZ = step(x0.zww, x0.yyz);
  
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  
  vec4 i3 = clamp(i0, 0.0, 1.0);
  vec4 i2 = clamp(i0 - 1.0, 0.0, 1.0);
  vec4 i1 = clamp(i0 - 2.0, 0.0, 1.0);

  
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  
  i = mod(i, 289.0);
  float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute(permute(permute(permute(i.w + vec4(i1.w, i2.w, i3.w, 1.0)) + i.z + vec4(i1.z, i2.z, i3.z, 1.0)) + i.y + vec4(i1.y, i2.y, i3.y, 1.0)) + i.x + vec4(i1.x, i2.x, i3.x, 1.0));
  
  
  

  vec4 ip = vec4(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0);

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

  
  vec3 m0 = max(0.6 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3, x3), dot(x4, x4)), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * (dot(m0 * m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2))) + dot(m1 * m1, vec2(dot(p3, x3), dot(p4, x4))));

}

float getWobble(vec3 position) {
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(position * uWarpPositionFrequency, uTime * uWarpTimeFrequency)) * uWarpStrength;

    return simplexNoise4d(vec4(warpedPosition * uPositionFrequency, 
    uTime * uTimeFrequency         
    )) * uStrength;
}

void main() {
    vec3 biTangent = cross(normal, tangent.xyz);

    
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    
    vWobble = wobble / uStrength;
}`,ee=`uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;

void main() {
    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

    csm_Roughness = 1.0 - colorMix;
}`;const ne=U({__name:"index",setup(oe){new _,new F;const h=new X;let b,r,a,s,m,p,x,d;function C(){({container:b,renderer:r,scene:a,camera:s,clock:m,viewPort:p,tick:x}=D(document.querySelector(".webgl")))}function z(){s.position.set(13,-3,-5),r.shadowMap.enabled=!0,r.shadowMap.type=I,r.toneMapping=E,r.toneMappingExposure=1,h.load("texture/hdr/urban_alley_01_1k.hdr",c=>{c.mapping=G,a.background=c,a.environment=c});const e=new L("#ffffff",3);e.castShadow=!0,e.shadow.mapSize.set(1024,1024),e.shadow.camera.far=15,e.shadow.normalBias=.05,e.position.set(.25,2,-2.25),a.add(e);const o=new f(new R(15,15,15),new Y);o.receiveShadow=!0,o.rotation.y=Math.PI,o.position.y=-5,o.position.z=5,a.add(o)}function S(){d=new Z(s,r.domElement),d.enableDamping=!0}function P(){J(p,()=>{const{width:e,height:o}=p.value;s.aspect=e/o,s.updateProjectionMatrix(),r.setSize(e,o,!1)})}let n,u={uColorA:"#0000ff",uColorB:"#ff0000"};const t={uTime:new i(0),uPositionFrequency:new i(.5),uTimeFrequency:new i(.4),uStrength:new i(.3),uWarpPositionFrequency:new i(.38),uWarpTimeFrequency:new i(.12),uWarpStrength:new i(1.7),uColorA:new i(new v(u.uColorA)),uColorB:new i(new v(u.uColorB))};function q(){n=new N({container:document.querySelector(".debug")}),K(()=>n.destroy),n.addColor(u,"uColorA").onChange(()=>t.uColorA.value.set(u.uColorA)),n.addColor(u,"uColorB").onChange(()=>t.uColorB.value.set(u.uColorB))}let l;O(()=>{C(),q(),S(),P(),z(),T(),x(()=>{const e=m.getElapsedTime();t.uTime.value=e,d.update(),r.render(a,s)})});function T(){const e=new w({baseMaterial:W,vertexShader:g,fragmentShader:ee,uniforms:t,metalness:0,roughness:.5,color:"#ffffff",transmission:0,ior:1.5,thickness:1.5,transparent:!0,wireframe:!1}),o=new w({baseMaterial:M,vertexShader:g,uniforms:t,depthPacking:B});n.add(t.uPositionFrequency,"value",0,2,.001).name("uPositionFrequency"),n.add(t.uTimeFrequency,"value",0,2,.001).name("uTimeFrequency"),n.add(t.uStrength,"value",0,2,.001).name("uStrength"),n.add(t.uWarpPositionFrequency,"value",0,2,.001).name("uWarpPositionFrequency"),n.add(t.uWarpTimeFrequency,"value",0,2,.001).name("uWarpTimeFrequency"),n.add(t.uWarpStrength,"value",0,2,.001).name("uWarpStrength"),n.add(e,"metalness",0,1,.001),n.add(e,"roughness",0,1,.001),n.add(e,"transmission",0,1,.001),n.add(e,"ior",0,10,.001),n.add(e,"thickness",0,10,.001);const c=A(new k(2.5,50));c.computeTangents(),l=new f(c,e),l.customDepthMaterial=o,l.receiveShadow=!0,l.castShadow=!0,a.add(l)}return(e,o)=>(Q(),V(j,null,{default:H(()=>o[0]||(o[0]=[y("div",{class:"webgl"},null,-1),y("div",{class:"debug"},null,-1)])),_:1}))}}),se=$(ne,[["__scopeId","data-v-d062d4cd"]]);export{se as default};

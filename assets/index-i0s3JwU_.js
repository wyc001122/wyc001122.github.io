import{G as T,T as I,V as f,S as w,P as z,M as Z,a as g,C as W,y as k,c as G,W as q,D as B,u as F,O as H,b as N}from"./GLTFLoader-Cpm_xSlR.js";import{d as V,f as j,p as L,k as U,w as E,q as A,o as O,h as P}from"./index-qyBmO-yZ.js";import{a as J}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var K=`varying vec2 vHighPrecisionZW;\r
varying vec3 world_position;\r
varying vec3 world_normal;

varying vec4 v_screenPos;\r
void main() {\r
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);\r
    vec4 viewPosition = viewMatrix * worldPosition;\r
    vec4 clipPosition = projectionMatrix * viewPosition;

    world_position = (modelMatrix * vec4(position, 1.0)).xyz; 
    world_normal = mat3(transpose(inverse(modelMatrix))) * normal; 

    gl_Position = clipPosition;\r
    v_screenPos = clipPosition;\r
    vHighPrecisionZW = clipPosition.zw;\r
}`,Q=`#include <common>\r
#include <packing>

uniform float uIntersectPower;\r
uniform vec3 uRimColor;\r
uniform float uRimPower;\r
uniform float uRimIntensity;\r
uniform float uFar;\r
uniform float uNear;\r
uniform sampler2D uSceenDepth;

varying vec3 world_position;\r
varying vec3 world_normal;\r
varying vec4 v_screenPos;

float linear01Depth(const in float ndcZ) {\r
    float q1 = (uNear - uFar) * ndcZ / uNear;\r
    float q2 = uFar / uNear;\r
    return 1. / (q1 + q2);\r
}

void main() {\r
    vec3 screenUV = v_screenPos.xyz / v_screenPos.w * 0.5 + 0.5; 

    vec3 viewDir = normalize(cameraPosition - world_position);\r
    float fRim = 1.0 - abs(dot(normalize(world_normal), viewDir));\r
    fRim = pow(fRim, uRimPower);

    float screenDepth = unpackRGBAToDepth(texture2D(uSceenDepth, screenUV.xy));\r
    screenDepth = linear01Depth(screenDepth);

    float sphereZ = linear01Depth(v_screenPos.z / v_screenPos.w * 0.5 + 0.5);

    float diff = clamp(screenDepth - sphereZ, 0.0, 1.0);\r
    float fIntersect = pow(1.0 - diff, uIntersectPower);

    float factor = max(fRim, fIntersect);

    vec4 resColor = vec4(uRimColor, 1.) * factor * uRimIntensity;\r
    gl_FragColor = resColor;

    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;const X=V({__name:"index",setup(Y){new T,new I;let p,i,l,t,m,r,h,d;function _(){({container:p,renderer:i,scene:l,camera:t,clock:m,viewPort:r,tick:h}=F(document.querySelector(".webgl")))}function x(){t.near=.01,t.far=100,t.updateProjectionMatrix(),t.position.set(0,4,10),i.setClearColor(16777215)}function y(){d=new H(t,i.domElement),d.enableDamping=!0}function R(){E(r,()=>{const{width:e,height:n}=r.value;t.aspect=e/n,t.updateProjectionMatrix(),i.setSize(e,n,!1),u.setSize(e,n)})}let s;function D(){s=new N({container:document.querySelector(".debug")}),A(()=>s.destroy)}j(()=>{_(),D(),y(),R(),x(),b(),C(),S(),h(()=>{const e=m.getElapsedTime();a.uTime.value=e,a.uResolution.value=new f(r.value.width,r.value.height),d.update(),c.visible=!1,l.overrideMaterial=M,i.setRenderTarget(u),i.render(l,t),a.uSceenDepth.value=u.texture,l.overrideMaterial=null,c.visible=!0,i.setRenderTarget(null),i.render(l,t)})});const M=new w({vertexShader:`
  varying vec2 vHighPrecisionZW;
  void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vHighPrecisionZW = gl_Position.zw;
  }
  `,fragmentShader:`
  #include <packing>
  varying vec2 vHighPrecisionZW;
  vec4 depth_32bits(float depth){
    vec4 col = packDepthToRGBA(depth);
    return col;
  } 
  vec4 depth_8bits(float depth){
    vec4 col = vec4(depth, depth, depth, 1.0);
    return col;
  } 
  void main() {
    float depth = vHighPrecisionZW[0] * 0.5 / vHighPrecisionZW[1] + 0.5;
    gl_FragColor = depth_32bits(depth);
  }
  `});let v;function C(){const e=new z(10,10),n=new Z({color:3355443});v=new g(e,n),v.rotation.x=-Math.PI/2,l.add(v)}let a,c;function S(){a={uTime:{value:0},uRimColor:{value:new W(10066329)},uRimIntensity:{value:1},uRimPower:{value:1.5},uIntersectPower:{value:100},uResolution:{value:new f(r.value.width,r.value.height)},uFar:{value:t.far},uNear:{value:t.near},uSceenDepth:{value:null}},s.add(a.uRimIntensity,"value",.01,2,.01).name("边缘光强度"),s.add(a.uRimPower,"value",.01,5,.01).name("边缘光指数"),s.add(a.uIntersectPower,"value",.1,100,.01).name("相交指数");const e=new k(1,32,32),n=new w({uniforms:a,vertexShader:K,fragmentShader:Q,side:G,transparent:!0,depthWrite:!1,depthTest:!0});c=new g(e,n),l.add(c)}let u;function b(){u=new q(r.value.width,r.value.height);const e=r.value.width/5,n=r.value.height/5,o=document.createElement("canvas");o.style.width=e+"px",o.style.height=n+"px",o.style.position="absolute",o.style.top="0px",o.style.left="0px",o.style.zIndex="999",o.width=e,o.height=n,p.appendChild(o)}return(e,n)=>(O(),L(B,null,{default:U(()=>n[0]||(n[0]=[P("div",{class:"webgl"},null,-1),P("div",{class:"debug"},null,-1)])),_:1}))}}),te=J(X,[["__scopeId","data-v-f3e529ed"]]);export{te as default};

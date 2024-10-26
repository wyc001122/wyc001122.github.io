import{G as j,T as O,R as D,S as x,o as X,V as I,C as b,y as H,Y as E,X as K,a as M,W as S,aM as J,D as Q,u as $,am as ee,ac as L,O as ne,b as te}from"./GLTFLoader-Cpm_xSlR.js";import{d as re,f as oe,p as ae,k as ie,w as se,q as ue,o as le,h as U}from"./index-qyBmO-yZ.js";import{a as de}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var z=`varying vec2 vUv;\r
varying vec3 world_position;\r
varying vec3 world_normal;\r
varying vec4 v_screenPos;\r
void main() {\r
    vUv = uv;\r
    v_screenPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    world_position = (modelMatrix * vec4(position, 1.0)).xyz; 
    world_normal = mat3(transpose(inverse(modelMatrix))) * normal; 
    gl_Position = v_screenPos;\r
}`,F=`#include <packing>\r
uniform float uTime;\r
uniform float uNear;\r
uniform float uFar;\r
uniform vec3 uRimColor;\r
uniform float uRimPow;\r
uniform float uRimIntensity;\r
uniform sampler2D uSceneTexture;\r
uniform sampler2D uSceneDepthTexture;\r
uniform sampler2D uNoiseTexture;\r
uniform vec2 uResolution;\r
uniform float uIntersectPow;\r
uniform vec2 uSpeed;\r
uniform float uDistortIntensity;

varying vec2 vUv;\r
varying vec3 world_position;\r
varying vec3 world_normal;\r
varying vec4 v_screenPos;

float linear01Depth(const in float ndcZ) {\r
  float q1 = (uNear - uFar) * ndcZ / uNear;\r
  float q2 = uFar / uNear;\r
  return 1. / (q1 + q2);\r
}

void main() {\r
  
  vec3 viewDir = normalize(cameraPosition - world_position);\r
  float fRim = 1.0 - abs(dot(normalize(world_normal), viewDir));\r
  fRim = pow(fRim, uRimPow);

  
  vec2 screenUV = v_screenPos.xy / v_screenPos.w * 0.5 + 0.5;

  float screenDepth = unpackRGBAToDepth(texture2D(uSceneDepthTexture, screenUV));\r
  screenDepth = linear01Depth(screenDepth);

  float sphereZ = linear01Depth(v_screenPos.z / v_screenPos.w * 0.5 + 0.5);

  float diff = clamp(screenDepth - sphereZ, 0.0, 1.0);\r
  float fIntersect = 1.0 - diff;\r
  fIntersect = pow(fIntersect, 1000. * uIntersectPow);

  float factor = max(fRim, fIntersect);

  
  vec2 newUV = vUv + uTime * uSpeed;\r
  vec4 offset = texture2D(uNoiseTexture, newUV);\r
  screenUV.xy += (offset.xy * 2.0 - 1.0) * uDistortIntensity * 0.01;\r
  vec4 distortColor = texture2D(uSceneTexture, screenUV.xy);

  vec4 resColor;

  #if IS_FRONT == 1 \r
  resColor = vec4(uRimColor, 1.0) * factor * uRimIntensity + distortColor;\r
  #else\r
  resColor = vec4(uRimColor, 1.0) * factor * uRimIntensity;\r
  #endif

  gl_FragColor = resColor;

  #include <tonemapping_fragment>\r
  #include <colorspace_fragment>\r
}`;const ce=re({__name:"index",setup(me){const y=new j,h=new O().load("/texture/noise/noise8.jpg");h.wrapS=D,h.wrapT=D;let _,a,r,o,R,u,P,m;function N(){({container:_,renderer:a,scene:r,camera:o,clock:R,viewPort:u,tick:P}=$(document.querySelector(".webgl")))}function k(){o.position.set(0,0,1.2),o.near=.1,o.far=100,o.updateProjectionMatrix();const e=new ee(15658734,5);r.add(e);const n=new L(42495,1e3,0);n.position.set(0,0,20),r.add(n);const t=new L(42495,1e3,0);t.position.z=5,t.position.y=10,r.add(t),r.background=new b(15658734)}function V(){m=new ne(o,a.domElement),m.enableDamping=!0,m.maxPolarAngle=Math.PI/2,m.minAzimuthAngle=-Math.PI/6,m.maxAzimuthAngle=Math.PI/6}function W(){se(u,()=>{const{width:e,height:n}=u.value;o.aspect=e/n,o.updateProjectionMatrix(),a.setSize(e,n,!1),d&&d&&(d.setSize(e,n),d.setSize(e,n),c.uniforms.uResolution.value.set(e,n),f.uniforms.uResolution.value.set(e,n))})}let i;const s={uRimColor:"#00a5ff",uSpeedX:.2,uSpeedY:.4};function A(){i=new te({container:document.querySelector(".debug")}),ue(()=>i.destroy)}const G=new x({vertexShader:`
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
  `});oe(async()=>{N(),A(),V(),W(),k(),await Z(),q(),B(),Y(),P(()=>{const e=R.getElapsedTime();m.update(),c.uniforms.uTime.value=e,f.uniforms.uTime.value=e,l.rotation.y=e,p.visible=!1,v.visible=!1,r.overrideMaterial=G,a.setRenderTarget(d),a.render(r,o),c.uniforms.uSceneDepthTexture.value=d.texture,f.uniforms.uSceneDepthTexture.value=d.texture,r.overrideMaterial=null,v.visible=!0,a.setRenderTarget(g),a.render(r,o),c.uniforms.uSceneTexture.value=g.texture,p.visible=!0,r.overrideMaterial=null,a.setRenderTarget(null),a.render(r,o)})});let w,l,T;function Z(){return new Promise((e,n)=>{Promise.all([y.loadAsync(new URL("/assets/futou-CVMUe8v5.gltf",import.meta.url).href),y.loadAsync(new URL("/assets/futou_room2-NFqKLKYY.glb",import.meta.url).href)]).then(([t,C])=>{l=new X,w=t.scene,w.rotation.z=-Math.PI/4,l.scale.multiplyScalar(.03),l.position.set(0,-.2,-.7),l.add(w),T=C.scene,r.add(T,l),e([t,C])})})}let p,v,c,f;function q(){const e={uNear:{value:o.near},uFar:{value:o.far},uResolution:{value:new I(u.value.width,u.value.width)},uSceneTexture:{value:null},uSceneDepthTexture:{value:null},uNoiseTexture:{value:h},uTime:{value:0},uRimColor:{value:new b(s.uRimColor)},uRimPow:{value:6},uRimIntensity:{value:10},uIntersectPow:{value:5},uSpeed:{value:new I(s.uSpeedX,s.uSpeedY)},uDistortIntensity:{value:.3}};i.addColor(s,"uRimColor").name("能量罩颜色").onChange(()=>{c.uniforms.uRimColor.value.set(s.uRimColor)}),i.add(e.uRimPow,"value").min(1).max(10).step(.001).name("边缘光范围pow"),i.add(e.uRimIntensity,"value").min(0).max(10).step(.001).name("边缘光强弱"),i.add(e.uIntersectPow,"value").min(1).max(10).step(.001).name("相交光pow"),i.add(s,"uSpeedX").min(0).max(1).step(.001).name("扭曲速度X").onChange(()=>{e.uSpeed.value.set(s.uSpeedX,e.uSpeed.value.y)}),i.add(s,"uSpeedY").min(0).max(1).step(.001).name("扭曲速度Y").onChange(()=>{e.uSpeed.value.set(e.uSpeed.value.x,s.uSpeedY)}),i.add(e.uDistortIntensity,"value").min(0).max(2).step(.001).name("扭曲强度");const n=new H(.6,256,256);c=new x({defines:{IS_FRONT:1},uniforms:e,vertexShader:z,fragmentShader:F,side:E,transparent:!0,depthWrite:!1}),f=new x({defines:{IS_FRONT:0},uniforms:e,vertexShader:z,fragmentShader:F,side:K,transparent:!0,depthWrite:!1}),p=new M(n,c),v=new M(n,f),p.position.copy(l.position),v.position.copy(l.position),r.add(p,v)}let d,g;function B(){const{width:e,height:n}=u.value;d=new S(e,n),g=new S(e,n),new S(e,n)}function Y(){const e=u.value.width/10,n=u.value.height/10,t=document.createElement("canvas");t.style.width=e+"px",t.style.height=n+"px",t.style.position="absolute",t.style.top="0px",t.style.left="0px",t.style.zIndex="999",t.width=e,t.height=n,_.appendChild(t),new J({antialias:!0,canvas:t})}return(e,n)=>(le(),ae(Q,null,{default:ie(()=>n[0]||(n[0]=[U("div",{class:"webgl"},null,-1),U("div",{class:"debug"},null,-1)])),_:1}))}}),we=de(ce,[["__scopeId","data-v-350e0833"]]);export{we as default};

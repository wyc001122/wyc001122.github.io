import{G as D,T as W,R as x,C as M,P as U,S as z,a as O,D as q,u as B,aO as I,am as A,l as G,w as h,O as J,b as j}from"./GLTFLoader-Cpm_xSlR.js";import{d as E,f as K,p as Q,k as X,w as H,q as Y,o as Z,h as C}from"./index-qyBmO-yZ.js";import{a as $}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var ee=`uniform float uFresnelPow;

varying vec3 reflectVec;\r
varying float fresnel;\r
varying vec2 v_uv;\r
varying vec3 world_position;

void main() {\r
  vec3 world_normal = mat3(transpose(inverse(modelMatrix))) * normal; 
  world_position = (modelMatrix * vec4(position, 1.0)).xyz; 

  vec3 world_viewVec = normalize(world_position - cameraPosition); 
  vec3 view_normal = normalize(world_normal); 
  reflectVec = reflect(world_viewVec, view_normal); 
  reflectVec.x *= -1.;\r
  float F0 = 0.02;\r
  float F90 = 1.0;\r
  fresnel = F0 + (F90 - F0) * pow(1.0 - dot(view_normal, -world_viewVec), uFresnelPow); 

  v_uv = uv;\r
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,oe=`uniform samplerCube uReflectTexture;\r
uniform sampler2D uNoiseTexture;\r
uniform vec3 uFresnelColor;\r
uniform float uNoisePow;\r
uniform float uTime;\r
uniform float uWaterSpeed;\r
uniform float uNoiseScale;\r
uniform float uWaterOpacity;\r
uniform float uReflectPow;

varying vec3 reflectVec;\r
varying float fresnel;\r
varying vec2 v_uv;\r
varying vec3 world_position;

void main() {\r
  float T = texture2D(uNoiseTexture, v_uv + world_position.xz * uNoiseScale + uTime * uWaterSpeed).r; 
  vec3 newReflectVec = reflectVec + T * uNoisePow; 

  vec4 skyColor = textureCube(uReflectTexture, newReflectVec); 
  skyColor = mix(skyColor, vec4(uFresnelColor, 1.), fresnel * uReflectPow); 

  vec4 waterColor = vec4(skyColor.rgb, uWaterOpacity);\r
  waterColor.rgb = mix(waterColor.rgb, vec3(1.), smoothstep(0.91, 0.911, T));

  vec2 D = v_uv - vec2(.5);\r
  waterColor.rgb = mix(waterColor.rgb, uFresnelColor.rgb, smoothstep(0., .2, dot(D, D)));

  gl_FragColor = waterColor;

  #include <tonemapping_fragment>\r
  #include <colorspace_fragment>\r
}`;const re=E({__name:"index",setup(ne){const _=new D,u=new W().load(new URL("/texture/water/water_disp.png",import.meta.url).href);u.wrapS=x,u.wrapT=x;let y,i,r,a,p,c,f,d;function b(){({container:y,renderer:i,scene:r,camera:a,clock:p,viewPort:c,tick:f}=B(document.querySelector(".webgl")))}const P=[new URL("/assets/you-B204WNm3.png",import.meta.url).href,new URL("/assets/zuo-CprD3qoI.png",import.meta.url).href,new URL("/assets/shang-Dst4XsCz.png",import.meta.url).href,new URL("/assets/xia-FKT1VAdk.png",import.meta.url).href,new URL("/assets/qian-BJ1oQkqS.png",import.meta.url).href,new URL("/assets/hou-DKuJg3Si.png",import.meta.url).href];function F(){a.position.set(0,10,40);const t=new I().load(P);r.background=t;const s=new A(16777215,5);r.add(s);const l=new G(16777215,5),w=l.clone(),V=new h(0,1,0),g=new h(-30,15,30),k=g.clone().applyAxisAngle(V,Math.PI/2);l.position.copy(g),w.position.copy(k),r.add(l),r.add(w)}function L(){d=new J(a,i.domElement),d.enableDamping=!0}function S(){H(c,()=>{const{width:o,height:t}=c.value;a.aspect=o/t,a.updateProjectionMatrix(),i.setSize(o,t,!1)})}let n;const v={uFresnelColor:"#81d1ee"};function T(){n=new j({container:document.querySelector(".debug")}),Y(()=>n.destroy)}K(()=>{b(),T(),L(),S(),F(),R(),N(),f(()=>{const o=p.getElapsedTime();e&&(e.uTime.value=o),d.update(),i.render(r,a)})});let m;function R(){_.load(new URL("/assets/fenggehuashuiti-CiJ4hrf7.gltf",import.meta.url).href,o=>{m=o.scene,m.rotation.y=Math.PI/4,r.add(m)})}let e;function N(){e={uTime:{value:0,show:!1},uWaterSpeed:{value:.1},uFresnelPow:{value:2},uNoisePow:{value:.03},uWaterOpacity:{value:.8},uReflectPow:{value:.5},uReflectTexture:{value:r.background},uNoiseTexture:{value:u},uNoiseScale:{value:.1},uFresnelColor:{value:new M(v.uFresnelColor)}},n.add(e.uWaterSpeed,"value").name("uWaterSpeed").min(0).max(1).step(.01),n.add(e.uNoiseScale,"value").name("uNoiseScale").min(0).max(1).step(.01),n.add(e.uReflectPow,"value").name("uReflectPow").min(0).max(1).step(.01),n.add(e.uWaterOpacity,"value").name("uWaterOpacity").min(0).max(1).step(.01),n.add(e.uFresnelPow,"value").name("uFresnelPow").min(0).max(1).step(.01),n.add(e.uNoisePow,"value").name("uNoisePow").min(0).max(1).step(.01),n.addColor(v,"uFresnelColor").name("uFresnelColor").onChange(l=>{e.uFresnelColor.value.set(l)});const o=new U(300,300,100,100),t=new z({uniforms:e,vertexShader:ee,fragmentShader:oe,transparent:!0}),s=new O(o,t);s.rotation.x=-Math.PI/2,r.add(s)}return(o,t)=>(Z(),Q(q,null,{default:X(()=>t[0]||(t[0]=[C("div",{class:"webgl"},null,-1),C("div",{class:"debug"},null,-1)])),_:1}))}}),se=$(re,[["__scopeId","data-v-e3ea8a08"]]);export{se as default};

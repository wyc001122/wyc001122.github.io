import{G as J,T as K,E as Q,R as w,S as y,W as U,C as T,P as X,a as $,D as ee,u as oe,am as ae,l as ne,w as N,O as re,b as te}from"./GLTFLoader-Cpm_xSlR.js";import{d as ie,f as le,p as ue,k as se,w as ce,q as me,o as de,h as z}from"./index-qyBmO-yZ.js";import{a as fe}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var ve=`varying float fresnel;\r
varying vec2 v_uv;\r
varying vec3 world_position;\r
varying vec3 world_normal;

varying vec4 v_screenPos;\r
varying vec3 v_viewNormal;\r
void main() {\r
    world_normal = mat3(transpose(inverse(modelMatrix))) * normal; 
    world_position = (modelMatrix * vec4(position, 1.0)).xyz; 
    v_uv = uv;\r
    vec4 newNormal = vec4(normal, 1.);\r
    v_viewNormal = normalize(mat3(transpose(inverse(modelMatrix * viewMatrix))) * newNormal.xyz);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
    v_screenPos = gl_Position;\r
}`,pe=`#include <packing>\r
uniform float uTime;

uniform float uNear;\r
uniform float uFar;\r
uniform vec3 uAbedoColor;

uniform vec3 uRimColor;\r
uniform float uRimOpacity;\r
uniform float uFresnelPow;\r
uniform float F0;\r
uniform float F90;

uniform samplerCube uReflectTexture;\r
uniform sampler2D uReflectNoise;\r
uniform float uReflectPow;\r
uniform float uReflectScale;

uniform sampler2D uDepthTexture;\r
uniform float uDepthScale;\r
uniform float uWaterDepthPow;\r
uniform vec3 uShallowColor;

uniform sampler2D uCausticsTexture;\r
uniform float uCausticsIntensity;\r
uniform float uCausticsScale;

uniform sampler2D uFoamTexture;\r
uniform float uFoamScale;\r
uniform float uFoamDepthPow;\r
uniform float uFoamCutoff;\r
uniform float uFoamDistortionScale;\r
uniform sampler2D uNormalTexture;\r
uniform float uFoamMaxScale;\r
uniform float uFoamMinScale;

uniform sampler2D uDistortionTexture;\r
uniform float uDistortionIntensity;

varying vec2 v_uv;\r
varying vec3 world_position;\r
varying vec3 world_normal;\r
varying vec4 v_screenPos;\r
varying vec3 v_viewNormal;

float linear01Depth(const in float ndcZ) {\r
    float q1 = (uNear - uFar) * ndcZ / uNear;\r
    float q2 = uFar / uNear;\r
    return 1. / (q1 + q2);\r
}

void main() {\r
    vec3 screenUV = v_screenPos.xyz / v_screenPos.w * 0.5 + 0.5; 

    
    vec2 noiseUV = v_uv + world_position.xz * 0.5 + uTime * 1.;\r
    noiseUV *= uReflectScale;\r
    float noiseValue = texture2D(uReflectNoise, noiseUV).r;\r
    vec3 N = normalize(world_normal);\r
    vec3 V = normalize(world_position - cameraPosition);\r
    vec3 R = reflect(V, N) + noiseValue / uReflectPow;\r
    vec4 reflectColor = textureCube(uReflectTexture, R); 

    
    float fresnel = F0 + (F90 - F0) * pow(1.0 - dot(N, -V), uFresnelPow); 
    vec4 baseColor = mix(vec4(uAbedoColor, 1.), reflectColor, fresnel);

    
    float screenDepth = unpackRGBAToDepth(texture2D(uDepthTexture, screenUV.xy));\r
    screenDepth = linear01Depth(screenDepth);

    float waterDepth = linear01Depth(v_screenPos.z / v_screenPos.w * 0.5 + 0.5);

    float depthDifference = clamp(screenDepth - waterDepth, 0.0, 1.0);

    if(depthDifference <= uDepthScale) {\r
        float waterDepthDifference = clamp(depthDifference / uDepthScale, 0.0, 1.0);\r
        waterDepthDifference = pow(waterDepthDifference, uWaterDepthPow);

        
        vec2 causticsUV1 = v_uv + world_position.xz * 2. + vec2(uTime) * 0.03;\r
        causticsUV1 *= uCausticsScale;\r
        vec2 causticsUV2 = v_uv + world_position.xz * 2. - vec2(uTime) * 0.03;\r
        causticsUV2 *= uCausticsScale;\r
        vec4 causticsColor1 = texture2D(uCausticsTexture, causticsUV1);\r
        vec4 causticsColor2 = texture2D(uCausticsTexture, causticsUV2);\r
        vec4 tempColor = vec4(uShallowColor, 1.) + min(causticsColor1, causticsColor2) * uCausticsIntensity;

        vec4 waterColor = mix(tempColor, baseColor, waterDepthDifference);\r
        baseColor.rgb = waterColor.rgb;\r
        baseColor.a = waterDepthDifference;\r
    }

    
    vec2 foamDistortionUV = v_uv + world_position.xz * 1.0;\r
    foamDistortionUV *= uFoamDistortionScale;\r
    vec2 distortionValue = texture2D(uDistortionTexture, foamDistortionUV).xy;\r
    distortionValue = (distortionValue * 2.0 - 1.0) * uDistortionIntensity;

    float foamUVx = v_uv.x + world_position.x * 1.;\r
    foamUVx *= uFoamDistortionScale;\r
    float foamUVy = v_uv.y - world_position.z * 2.;\r
    foamUVy *= uFoamDistortionScale;

    vec2 foamUV = vec2(foamUVx + uTime * 0.03 + distortionValue.x, foamUVy + uTime * 0.03 + distortionValue.y);

    float foamSample = texture2D(uFoamTexture, foamUV).r;

    vec3 existingNormal = texture2D(uNormalTexture, screenUV.xy).rgb;\r
    float normalDot = clamp(dot(existingNormal, v_viewNormal.xyz), 0.0, 1.0);

    float foamScale = mix(uFoamMinScale, uFoamMaxScale, normalDot);

    if(depthDifference <= foamScale) {\r
        float foamDepthDifference = clamp(depthDifference / foamScale, 0.0, 1.0);\r
        foamDepthDifference = pow(foamDepthDifference, uFoamDepthPow);

        float foamCutoff = uFoamCutoff;\r
        foamCutoff *= foamDepthDifference;

        float smoothstepValue = 0.01;

        float foamValue = smoothstep(foamCutoff - smoothstepValue, foamCutoff + smoothstepValue, foamSample);\r
        baseColor.rgb += foamValue;\r
    }

    
    vec2 distance = v_uv - vec2(0.5, 0.5);\r
    baseColor.rgb = mix(baseColor.rgb, uRimColor, uRimOpacity * smoothstep(0.0, 0.2, dot(distance, distance)));

    gl_FragColor = baseColor;

    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;const we=ie({__name:"index",setup(xe){const L=new J,f=new K,h=f.load(new URL("/assets/sky-BGxM9zYz.png",import.meta.url).href);h.mapping=Q;const g=f.load(new URL("/texture/water/water_disp.png",import.meta.url).href);g.wrapS=g.wrapT=w;const D=f.load(new URL("/texture/noise/noise5.png",import.meta.url).href);D.wrapS=D.wrapT=w;const C=f.load(new URL("/texture/noise/noise4.png",import.meta.url).href);C.wrapS=C.wrapT=w;const F=f.load(new URL("/texture/noise/noise6.png",import.meta.url).href);F.wrapS=w,F.wrapT=w;let k,r,a,o,R,l,b,u;function A(){({container:k,renderer:r,scene:a,camera:o,clock:R,viewPort:l,tick:b}=oe(document.querySelector(".webgl")))}function I(){o.fov=68,o.near=.1,o.far=1e3,o.updateProjectionMatrix(),o.position.set(-113,32,88),r.setClearColor(16777215,1),a.background=h;const t=new ae(16777215,2);a.add(t);const n=new ne(16777215,2),v=n.clone(),m=new N(-30,15,30),x=m.clone().applyAxisAngle(new N(0,1,0),Math.PI/2);n.position.copy(m),v.position.copy(x),a.add(n),a.add(v)}function W(){u=new re(o,r.domElement),u.enableDamping=!0,u.enablePan=!1,u.enableZoom=!1,u.maxPolarAngle=Math.PI/2.2}function q(){ce(l,()=>{const{width:t,height:n}=l.value;o.aspect=t/n,o.updateProjectionMatrix(),r.setSize(t,n,!1)})}let i;const s={uAbedoColor:"#0084ff",uShallowColor:"#ffffff",uRimColor:"#cee0e3"};function G(){i=new te({container:document.querySelector(".debug")}),me(()=>i.destroy)}const Z=new y({vertexShader:`
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
  `}),B=new y({vertexShader:`
  varying vec3 viewNormal;
  void main() {
    vec4 newNormal = vec4(normal,1.); 
    viewNormal = normalize(mat3(transpose(inverse(modelMatrix * viewMatrix))) * newNormal.xyz);  

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
  `,fragmentShader:`
  #include <packing>
  varying vec3 viewNormal;
  void main() {
    vec4 col = vec4(viewNormal,1.);
    gl_FragColor = col;
  }
  `});le(()=>{A(),G(),W(),q(),I(),O(),j(),H(),b(()=>{const t=R.getElapsedTime();u.update(),e&&(e.uTime.value=t),a.overrideMaterial=Z,c.visible=!1,V&&V.render(a,o),r.setRenderTarget(_),r.render(a,o),a.overrideMaterial=B,r.setRenderTarget(S),r.render(a,o),M&&M.render(a,o),c.visible=!0,a.overrideMaterial=null,r.setRenderTarget(null),r.render(a,o)})});let P;function O(){L.load(new URL("/assets/screen-CTtCT7x3.gltf",import.meta.url).href,t=>{P=t.scene,a.add(P)})}let _,S,V,M;function j(){_=new U(l.value.width,l.value.height),S=new U(l.value.width,l.value.height)}let c,e;function H(){e={uTime:{value:0},uNear:{value:o.near},uFar:{value:o.far},uAbedoColor:{value:new T(s.uAbedoColor)},uRimColor:{value:new T(s.uRimColor)},uRimOpacity:{value:1},uFresnelPow:{value:5},F0:{value:.02},F90:{value:1},uReflectTexture:{value:h},uReflectNoise:{value:g},uReflectPow:{value:2},uReflectScale:{value:.01},uDepthTexture:{value:_.texture},uDepthScale:{value:.0032},uWaterDepthPow:{value:.375},uShallowColor:{value:new T(s.uShallowColor)},uCausticsTexture:{value:D},uCausticsIntensity:{value:4},uCausticsScale:{value:.016},uFoamTexture:{value:C},uFoamScale:{value:.003},uFoamDepthPow:{value:.702},uFoamCutoff:{value:.957},uFoamDistortionScale:{value:.0123},uFoamMaxScale:{value:.003},uFoamMinScale:{value:4e-5},uNormalTexture:{value:S.texture},uDistortionTexture:{value:F},uDistortionIntensity:{value:.73}},i.addFolder("基础").addColor(s,"uAbedoColor").name("基础颜色").onChange(p=>{e.uAbedoColor.value.set(p)});const n=i.addFolder("菲尼尔效果");n.addColor(s,"uRimColor").name("远处的水色").onChange(p=>{e.uRimColor.value.set(p)}),n.add(e.uRimOpacity,"value").min(0).max(1).step(.001).name("边缘透明度"),n.add(e.uFresnelPow,"value").min(0).max(10).step(.01).name("菲尼尔指数"),n.add(e.F0,"value").min(0).max(10).step(.001).name("F0"),n.add(e.F90,"value").min(0).max(10).step(.001).name("F90");const v=i.addFolder("反射效果");v.add(e.uReflectPow,"value").min(0).max(100).step(.1).name("反射指数"),v.add(e.uReflectScale,"value").min(0).max(.05).step(1e-4).name("扰动UV缩放");const m=i.addFolder("水深效果");m.add(e.uDepthScale,"value").min(0).max(.02).step(1e-4).name("深度范围"),m.add(e.uWaterDepthPow,"value").min(0).max(1).step(.001).name("水深指数"),m.addColor(s,"uShallowColor").name("浅水区颜色").onChange(p=>{e.uShallowColor.value.set(p)});const x=i.addFolder("焦散效果");x.add(e.uCausticsIntensity,"value").min(0).max(10).step(.01).name("焦散强度"),x.add(e.uCausticsScale,"value").min(0).max(.02).step(1e-4).name("焦散UV缩放");const d=i.addFolder("浮沫效果");d.add(e.uFoamScale,"value").min(0).max(.01).step(1e-4).name("浮沫范围"),d.add(e.uFoamDepthPow,"value").min(0).max(1).step(.001).name("浮沫指数"),d.add(e.uFoamCutoff,"value").min(0).max(2).step(.001).name("浮沫阈值"),d.add(e.uFoamDistortionScale,"value").min(0).max(.05).step(1e-4).name("浮沫扭曲UV缩放"),d.add(e.uFoamMaxScale,"value").min(0).max(.01).step(1e-5).name("浮沫范围"),d.add(e.uFoamMinScale,"value").min(0).max(.01).step(1e-5).name("岸边浮沫范围"),i.addFolder("扭曲效果").add(e.uDistortionIntensity,"value").min(0).max(1).step(.001).name("扭曲强度");const E=new X(1e3,1e3),Y=new y({vertexShader:ve,fragmentShader:pe,uniforms:e});c=new $(E,Y),c.position.y=-2,c.rotation.x=-Math.PI/2,a.add(c)}return(t,n)=>(de(),ue(ee,null,{default:se(()=>n[0]||(n[0]=[z("div",{class:"webgl"},null,-1),z("div",{class:"debug"},null,-1)])),_:1}))}}),Fe=fe(we,[["__scopeId","data-v-74ae3353"]]);export{Fe as default};

import{G as S,T as U,U as s,V as z,C as f,D as P,u as L,am as X,O as Y,b as O}from"./GLTFLoader-Cpm_xSlR.js";import{E as R,R as M,S as k}from"./EffectComposer-3ITbW_mG.js";import{O as B}from"./OutputPass-Cb-qhM84.js";import{d as T,f as E,p as V,k as q,w as I,q as j,o as F,h as m}from"./index-qyBmO-yZ.js";import{a as A}from"./_plugin-vue_export-helper-CQ7wvoWd.js";import"./Pass-8nf9LS6g.js";var N=`uniform vec2 u_Resolution;\r
varying vec2 vUv;\r
varying vec2 v_uv0;\r
varying vec2 v_uv1;\r
varying vec2 v_uv2;\r
varying vec2 v_uv3;\r
varying vec2 v_uv4;\r
varying vec2 v_uv5;\r
varying vec2 v_uv6;\r
varying vec2 v_uv7;\r
varying vec2 v_uv8;\r
void main() {\r
    vUv = uv;\r
    vec2 texelSize = 1.0 / u_Resolution;\r
    v_uv0 = vUv + texelSize * vec2(-1.0, 1.0);\r
    v_uv1 = vUv + texelSize * vec2(0.0, 1.0);\r
    v_uv2 = vUv + texelSize * vec2(1.0, 1.0);\r
    v_uv3 = vUv + texelSize * vec2(-1.0, 0.0);\r
    v_uv4 = vUv + texelSize * vec2(0.0, 0.0);\r
    v_uv5 = vUv + texelSize * vec2(1.0, 0.0);\r
    v_uv6 = vUv + texelSize * vec2(-1.0, -1.0);\r
    v_uv7 = vUv + texelSize * vec2(0.0, -1.0);\r
    v_uv8 = vUv + texelSize * vec2(1.0, -1.0);\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,Z=`#include <common>\r
uniform vec3 lineColor;\r
uniform float lineOpacity;\r
uniform bool showLine;\r
uniform sampler2D tDiffuse;\r
varying vec2 vUv;\r
varying vec2 v_uv0;\r
varying vec2 v_uv1;\r
varying vec2 v_uv2;\r
varying vec2 v_uv3;\r
varying vec2 v_uv4;\r
varying vec2 v_uv5;\r
varying vec2 v_uv6;\r
varying vec2 v_uv7;\r
varying vec2 v_uv8;\r
float sobel() {\r
    float Gx[9];\r
    Gx[0] = -1.0;\r
    Gx[1] = -2.0;\r
    Gx[2] = -1.0;\r
    Gx[3] = 0.0;\r
    Gx[4] = 0.0;\r
    Gx[5] = 0.0;\r
    Gx[6] = 1.0;\r
    Gx[7] = 2.0;\r
    Gx[8] = 1.0;

    float Gy[9];\r
    Gy[0] = -1.0;\r
    Gy[1] = 0.0;\r
    Gy[2] = 1.0;\r
    Gy[3] = -2.0;\r
    Gy[4] = 0.0;\r
    Gy[5] = 2.0;\r
    Gy[6] = -1.0;\r
    Gy[7] = 0.0;\r
    Gy[8] = 1.0;

    float texColor = 0.0;\r
    float edgeX = 0.0;\r
    float edgeY = 0.0;

    texColor = luminance(texture2D(tDiffuse, v_uv0).rgb);\r
    edgeX += texColor * Gx[0];\r
    edgeY += texColor * Gy[0];\r
    texColor = luminance(texture2D(tDiffuse, v_uv1).rgb);\r
    edgeX += texColor * Gx[1];\r
    edgeY += texColor * Gy[1];\r
    texColor = luminance(texture2D(tDiffuse, v_uv2).rgb);\r
    edgeX += texColor * Gx[2];\r
    edgeY += texColor * Gy[2];\r
    texColor = luminance(texture2D(tDiffuse, v_uv3).rgb);\r
    edgeX += texColor * Gx[3];\r
    edgeY += texColor * Gy[3];\r
    texColor = luminance(texture2D(tDiffuse, v_uv4).rgb);\r
    edgeX += texColor * Gx[4];\r
    edgeY += texColor * Gy[4];\r
    texColor = luminance(texture2D(tDiffuse, v_uv5).rgb);\r
    edgeX += texColor * Gx[5];\r
    edgeY += texColor * Gy[5];\r
    texColor = luminance(texture2D(tDiffuse, v_uv6).rgb);\r
    edgeX += texColor * Gx[6];\r
    edgeY += texColor * Gy[6];\r
    texColor = luminance(texture2D(tDiffuse, v_uv7).rgb);\r
    edgeX += texColor * Gx[7];\r
    edgeY += texColor * Gy[7];\r
    texColor = luminance(texture2D(tDiffuse, v_uv8).rgb);\r
    edgeX += texColor * Gx[8];\r
    edgeY += texColor * Gy[8];

    float edge = (abs(edgeX) + abs(edgeY));

    return edge;\r
}\r
void main() {\r
    float edge = sobel();

    vec4 tDiffuseColor = texture2D(tDiffuse, vUv);\r
    vec4 resColor = mix(tDiffuseColor, vec4(lineColor, lineOpacity), showLine ? lineOpacity * edge : 0.0);\r
    gl_FragColor = resColor;\r
}`;const H=T({__name:"index",setup(J){const _=new S;new U;let C,c,v,o,x,t,g,d;function y(){({container:C,renderer:c,scene:v,camera:o,clock:x,viewPort:t,tick:g}=L(document.querySelector(".webgl")))}function G(){const e=new X(16777215,5);v.add(e),v.background=new f(15658734),o.position.set(0,0,10)}function p(){d=new Y(o,c.domElement),d.enableDamping=!0}function w(){I(t,()=>{const{width:e,height:r}=t.value;o.aspect=e/r,o.updateProjectionMatrix(),c.setSize(e,r,!1),i.u_Resolution.value.set(e,r),n.setSize(e,r)})}let a,i={tDiffuse:new s(null),u_Resolution:new s(new z(1024,1024)),lineColor:new s(new f(16711680)),lineOpacity:new s(1),showLine:new s(!0)};function D(){a=new O({container:document.querySelector(".debug")}),j(()=>a.destroy),a.add(i.lineOpacity,"value",0,1).name("描边透明度").onChange(e=>{u.uniforms.lineOpacity.value=e}),a.add(i.showLine,"value").name("显示描边").onChange(e=>{u.uniforms.showLine.value=e}),a.addColor(i.lineColor,"value").name("描边颜色").onChange(e=>{u.uniforms.lineColor.value.set(e)})}let l,n,u;E(()=>{y(),D(),p(),w(),G(),h(),b(),g(()=>{const e=x.getElapsedTime();n.setSize(t.value.width,t.value.height),d.update(),n.render(e)})});function h(){_.load(new URL("/assets/autumn_house-BiyMsgZL.gltf",import.meta.url).href,e=>{l=e.scene,l.scale.set(.25,.25,.25),l.rotation.y=-Math.PI/2,l.position.y=-2.25,v.add(l)})}function b(){t.value,n=new R(c);const e=new M(v,o);u=new k({uniforms:i,vertexShader:N,fragmentShader:Z}),n.addPass(e),n.addPass(u),n.addPass(new B)}return(e,r)=>(F(),V(P,null,{default:q(()=>r[0]||(r[0]=[m("div",{class:"webgl"},null,-1),m("div",{class:"debug"},null,-1)])),_:1}))}}),re=A(H,[["__scopeId","data-v-50010274"]]);export{re as default};

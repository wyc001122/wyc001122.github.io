import{G as z,T as D,S as M,c as N,A as k,U as v,C as h,a as p,x as B,y as G,D as F,u as L,O as U,b as q}from"./GLTFLoader-Cpm_xSlR.js";import{d as j,f as A,p as E,k as I,w as K,q as O,o as R,h as x}from"./index-qyBmO-yZ.js";import{a as V}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var W=`uniform float uTime;

varying vec3 vPosition;\r
varying vec3 vNormal;

float random2D(vec2 value) {\r
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);\r
}

void main() {\r
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    
    float glitchTime = uTime - modelPosition.y;\r
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);\r
    glitchStrength /= 3.0;\r
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);\r
    glitchStrength *= 0.25;\r
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;\r
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    
    vPosition = modelPosition.xyz;\r
    vNormal = modelNormal.xyz;\r
}`,H=`uniform vec3 uColor;\r
uniform float uTime;

varying vec3 vPosition;\r
varying vec3 vNormal;

void main()\r
{\r
    
    vec3 normal = normalize(vNormal);\r
    if(!gl_FrontFacing)\r
        normal *= - 1.0;

    
    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);\r
    stripes = pow(stripes, 3.0);

    
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    float fresnel = dot(viewDirection, normal) + 1.0;\r
    fresnel = pow(fresnel, 2.0);

    
    float falloff = smoothstep(0.8, 0.2, fresnel);

    
    float holographic = stripes * fresnel;\r
    holographic += fresnel * 1.25;\r
    holographic *= falloff;

    
    gl_FragColor = vec4(uColor, holographic);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;const J=j({__name:"index",setup(Q){const w=new z;new D;let y,a,l,o,u,m,f,c;function C(){({container:y,renderer:a,scene:l,camera:o,clock:u,viewPort:m,tick:f}=L(document.querySelector(".webgl")))}function P(){o.position.set(0,0,10),a.setClearColor("#1d1f2a")}function S(){c=new U(o,a.domElement),c.enableDamping=!0}function _(){K(m,()=>{const{width:e,height:n}=m.value;o.aspect=e/n,o.updateProjectionMatrix(),a.setSize(e,n,!1)})}let d,g={color:"#70c1ff"};function T(){d=new q({container:document.querySelector(".debug")}),O(()=>d.destroy),d.addColor(g,"color").onChange(e=>{s.uniforms.uColor.value=new h(e)})}let s,t,r,i;A(()=>{C(),T(),S(),_(),P(),b(),f(()=>{const e=u.getElapsedTime();i&&(i.rotation.x=-e*.1,i.rotation.y=e*.2),t&&(t.rotation.x=-e*.1,t.rotation.y=e*.2),r&&(r.rotation.x=-e*.1,r.rotation.y=e*.2),c.update(),a.render(l,o)})});function b(){s=new M({vertexShader:W,fragmentShader:H,transparent:!0,depthWrite:!1,side:N,blending:k,uniforms:{uTime:new v(0),uColor:new v(new h(g.color))}}),r=new p(new B(.6,.25,128,32),s),r.position.x=3,l.add(r),t=new p(new G,s),t.position.x=-3,l.add(t),w.load("/models/suzanne.glb",e=>{i=e.scene,i.traverse(n=>{n.isMesh&&(n.material=s)}),l.add(i)})}return(e,n)=>(R(),E(F,null,{default:I(()=>n[0]||(n[0]=[x("div",{class:"webgl"},null,-1),x("div",{class:"debug"},null,-1)])),_:1}))}}),$=V(J,[["__scopeId","data-v-81229179"]]);export{$ as default};

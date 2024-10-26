import{G,T as R,av as P,y as I,S as _,U as e,w,C as s,a as y,X as E,aL as F,I as q,M as Q,D as V,u as $,O as X,b as H}from"./GLTFLoader-Cpm_xSlR.js";import{d as J,f as K,p as W,k as Y,w as Z,q as ee,o as oe,h as A}from"./index-qyBmO-yZ.js";import{a as re}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var ne=`varying vec2 vUv;\r
varying vec3 vNormal;\r
varying vec3 vPosition;

void main()\r
{\r
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);\r
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    
    vUv = uv;\r
    vNormal = modelNormal;\r
    vPosition = modelPosition.xyz;\r
}`,te=`uniform sampler2D uDayTexture;\r
uniform sampler2D uNightTexture;\r
uniform sampler2D uSpecularCloudsTexture;\r
uniform vec3 uSunDirection;\r
uniform vec3 uAtmosphereDayColor;\r
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;\r
varying vec3 vNormal;\r
varying vec3 vPosition;

void main()\r
{\r
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    vec3 normal = normalize(vNormal);\r
    vec3 color = vec3(0.0);

    
    float sunOrientation = dot(uSunDirection, normal);

    
    float dayMix = smoothstep(- 0.25, 0.5, sunOrientation);\r
    vec3 dayColor = texture(uDayTexture, vUv).rgb;\r
    vec3 nightColor = texture(uNightTexture, vUv).rgb;\r
    color = mix(nightColor, dayColor, dayMix);

    
    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;

    
    float cloudsMix = smoothstep(0.5, 1.0, specularCloudsColor.g);\r
    cloudsMix *= dayMix;\r
    color = mix(color, vec3(1.0), cloudsMix);

    
    float fresnel = dot(viewDirection, normal) + 1.0;\r
    fresnel = pow(fresnel, 2.0);

    
    float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);\r
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);\r
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

    
    vec3 reflection = reflect(- uSunDirection, normal);\r
    float specular = - dot(reflection, viewDirection);\r
    specular = max(specular, 0.0);\r
    specular = pow(specular, 32.0);\r
    specular *= specularCloudsColor.r;

    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);\r
    color += specular * specularColor;

    
    gl_FragColor = vec4(color, 1.0);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`,ae=`varying vec3 vNormal;\r
varying vec3 vPosition;

void main()\r
{\r
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);\r
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    
    vNormal = modelNormal;\r
    vPosition = modelPosition.xyz;\r
}`,ie=`uniform vec3 uSunDirection;\r
uniform vec3 uAtmosphereDayColor;\r
uniform vec3 uAtmosphereTwilightColor;

varying vec3 vNormal;\r
varying vec3 vPosition;

void main()\r
{\r
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    vec3 normal = normalize(vNormal);\r
    vec3 color = vec3(0.0);

    
    float sunOrientation = dot(uSunDirection, normal);

    
    float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);\r
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);\r
    color = mix(color, atmosphereColor, atmosphereDayMix);\r
    color += atmosphereColor;

    
    float edgeAlpha = dot(viewDirection, normal);\r
    edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);

    float dayAlpha = smoothstep(- 0.5, 0.0, sunOrientation);

    float alpha = edgeAlpha * dayAlpha;

    
    gl_FragColor = vec4(color, alpha);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;const le=J({__name:"index",setup(se){new G;const c=new R,u=c.load(new URL("/assets/day-DkcerPt2.jpg",import.meta.url).href);u.colorSpace=P,u.anisotropy=8;const m=c.load(new URL("/assets/night-BR_DbmEQ.jpg",import.meta.url).href);m.colorSpace=P,m.anisotropy=8;const C=c.load(new URL("/assets/specularClouds-DpLQ1-js.jpg",import.meta.url).href);C.anisotropy=8;let N,t,a,r,D,p,S,v;function U(){({container:N,renderer:t,scene:a,camera:r,clock:D,viewPort:p,tick:S}=$(document.querySelector(".webgl")))}function b(){r.position.set(12,5,4),t.setClearColor("#000011")}function z(){v=new X(r,t.domElement),v.enableDamping=!0}function L(){Z(p,()=>{const{width:o,height:n}=p.value;r.aspect=o/n,r.updateProjectionMatrix(),t.setSize(o,n,!1)})}let M;function B(){M=new H({container:document.querySelector(".debug")}),ee(()=>M.destroy)}const l={atmosphereDayColor:"#00aaff",atmosphereTwilightColor:"#ff6600"};K(()=>{U(),B(),z(),L(),b(),O(),j(),k(),S(()=>{const o=D.getElapsedTime();d.rotation.y=o*.1,v.update(),t.render(a,r)})});let d,h,f;function O(){h=new I(2,64,64),f=new _({vertexShader:ne,fragmentShader:te,uniforms:{uDayTexture:new e(u),uNightTexture:new e(m),uSpecularCloudsTexture:new e(C),uSunDirection:new e(new w(0,0,1)),uAtmosphereDayColor:new e(new s(l.atmosphereDayColor)),uAtmosphereTwilightColor:new e(new s(l.atmosphereTwilightColor))}}),d=new y(h,f),a.add(d)}let g,x;function j(){g=new _({side:E,transparent:!0,vertexShader:ae,fragmentShader:ie,uniforms:{uSunDirection:new e(new w(0,0,1)),uAtmosphereDayColor:new e(new s(l.atmosphereDayColor)),uAtmosphereTwilightColor:new e(new s(l.atmosphereTwilightColor))}}),x=new y(h,g),x.scale.set(1.04,1.04,1.04),a.add(x)}let T,i;function k(){T=new F(1,Math.PI*.5,.5),i=new w;const o=new y(new q(.1,2),new Q);a.add(o),(()=>{i.setFromSpherical(T),o.position.copy(i).multiplyScalar(5),f.uniforms.uSunDirection.value.copy(i),g.uniforms.uSunDirection.value.copy(i)})()}return(o,n)=>(oe(),W(V,null,{default:Y(()=>n[0]||(n[0]=[A("div",{class:"webgl"},null,-1),A("div",{class:"debug"},null,-1)])),_:1}))}}),pe=re(le,[["__scopeId","data-v-6fe703ec"]]);export{pe as default};

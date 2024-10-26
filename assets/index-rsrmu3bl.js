import{G as b,T as P,S as D,C as u,V as T,U as s,a as p,x as M,y as U,D as z,u as I,O as k,b as G}from"./GLTFLoader-Cpm_xSlR.js";import{d as N,f as B,p as V,k as q,w as F,q as j,o as E,h as f}from"./index-qyBmO-yZ.js";import{a as K}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var O=`varying vec2 vUv;\r
varying vec3 vPosition;\r
varying vec3 vNormal;

void main() {\r
    vUv = uv;\r
    vPosition = position;\r
    vNormal = normal;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,A=`vec3 ambientLight(vec3 lightColor, float lightIntensity)\r
{\r
    return lightColor * lightIntensity;\r
}\r
vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower)\r
{\r
    vec3 lightDirection = normalize(lightPosition);\r
    vec3 lightReflection = reflect(- lightDirection, normal);

    
    float shading = dot(normal, lightDirection);\r
    shading = max(0.0, shading);

    
    float specular = - dot(lightReflection, viewDirection);\r
    specular = max(0.0, specular);\r
    specular = pow(specular, specularPower);

    return lightColor * lightIntensity * (shading + specular);\r
}

uniform float uTime;\r
uniform vec3 uColor;\r
uniform vec2 uResolution;\r
uniform float uShadowRepetitions;\r
uniform vec3 uShadowColor;\r
uniform float uLightRepetitions;\r
uniform vec3 uLightColor;

varying vec2 vUv;\r
varying vec3 vPosition;\r
varying vec3 vNormal;

vec3 halftone(\r
    vec3 color,\r
    float repetitions,\r
    vec3 direction,\r
    float low,\r
    float high,\r
    vec3 pointColor,\r
    vec3 normal\r
) {\r
    float intensity = dot(normal, direction);\r
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;\r
    uv *= repetitions;\r
    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));\r
    point = 1.0 - step(0.5 * intensity, point);

    color = mix(color, pointColor, point);\r
    return mix(color, pointColor, point);\r
}\r
void main() {\r
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    vec3 normal = normalize(vNormal);\r
    vec3 color = uColor;

    
    
    vec3 light = vec3(0.0);

    light += ambientLight(vec3(1.0), 
    1.0        
    );\r
    light += directionalLight(vec3(1.0, 1.0, 1.0), 
    1.0,                 
    normal,              
    vec3(1.0, 1.0, 0.0), 
    viewDirection,       
    1.0                  
    );

    color *= light;

    
    color = halftone(color,               
    uLightRepetitions,   
    vec3(1.0, 1.0, 0.0), 
    0.5,                 
    1.5,                 
    uLightColor,         
    normal               
    );

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;const H=N({__name:"index",setup(J){const w=new b;new P;let C,r,a,i,v,o,d,c;function y(){({container:C,renderer:r,scene:a,camera:i,clock:v,viewPort:o,tick:d}=I(document.querySelector(".webgl")))}function x(){i.position.set(1.5,0,6),r.setClearAlpha(0)}function _(){c=new k(i,r.domElement),c.enableDamping=!0}function R(){F(o,()=>{const{width:n,height:e}=o.value;i.aspect=n/e,i.updateProjectionMatrix(),r.setSize(n,e,!1)})}let h,l={color:"#ff794d",shadowColor:"#8e19b8",lightColor:"#e5ffe0",shadowRepetitions:100,lightRepetitions:130};function L(){h=new G({container:document.querySelector(".debug")}),j(()=>h.destroy)}let t;B(()=>{y(),L(),_(),R(),x(),S(),d(()=>{const n=v.getElapsedTime();t&&(t.uniforms.uTime.value=n,t.uniforms.uResolution.value.set(o.value.width,o.value.height)),c.update(),r.render(a,i)})});function S(){t=new D({vertexShader:O,fragmentShader:A,uniforms:{uTime:{value:0},uColor:{value:new u().set(l.color)},uResolution:{value:new T(o.value.width,o.value.height)},uShadowRepetitions:new s(l.shadowRepetitions),uShadowColor:new s(new u(l.shadowColor)),uLightRepetitions:new s(l.lightRepetitions),uLightColor:new s(new u(l.lightColor))}});const n=new p(new M(.6,.25,128,32),t);n.position.x=3,a.add(n);const e=new p(new U,t);e.position.x=-3,a.add(e),w.load("/models/suzanne.glb",g=>{g.scene.traverse(m=>{m.isMesh&&(m.material=t)}),a.add(g.scene)})}return(n,e)=>(E(),V(z,null,{default:q(()=>e[0]||(e[0]=[f("div",{class:"webgl"},null,-1),f("div",{class:"debug"},null,-1)])),_:1}))}}),Y=K(H,[["__scopeId","data-v-a4c861e5"]]);export{Y as default};

import{G as z,T as S,P as C,S as w,V as W,C as l,a as D,D as _,u as B,O as b,b as E}from"./GLTFLoader-Cpm_xSlR.js";import{d as q,f as I,p as F,k as M,w as T,q as O,o as L,h as g}from"./index-qyBmO-yZ.js";import{a as N}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var A=`uniform float uTime;\r
uniform float uBigWavesElevation;\r
uniform vec2 uBigWavesFrequency;\r
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;\r
uniform float uSmallWavesFrequency;\r
uniform float uSmallWavesSpeed;\r
uniform float uSmallIterations;

varying float vElevation;\r
varying vec3 vNormal;\r
varying vec3 vPosition;

vec4 permute(vec4 x)\r
{\r
    return mod(((x*34.0)+1.0)*x, 289.0);\r
}\r
vec4 taylorInvSqrt(vec4 r)\r
{\r
    return 1.79284291400159 - 0.85373472095314 * r;\r
}\r
vec3 fade(vec3 t)\r
{\r
    return t*t*t*(t*(t*6.0-15.0)+10.0);\r
}

float perlinClassic3D(vec3 P)\r
{\r
    vec3 Pi0 = floor(P); 
    vec3 Pi1 = Pi0 + vec3(1.0); 
    Pi0 = mod(Pi0, 289.0);\r
    Pi1 = mod(Pi1, 289.0);\r
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r
    vec4 iy = vec4(Pi0.yy, Pi1.yy);\r
    vec4 iz0 = Pi0.zzzz;\r
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);\r
    vec4 ixy0 = permute(ixy + iz0);\r
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;\r
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\r
    gx0 = fract(gx0);\r
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r
    vec4 sz0 = step(gz0, vec4(0.0));\r
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;\r
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\r
    gx1 = fract(gx1);\r
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r
    vec4 sz1 = step(gz1, vec4(0.0));\r
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\r
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\r
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\r
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\r
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\r
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\r
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\r
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r
    g000 *= norm0.x;\r
    g010 *= norm0.y;\r
    g100 *= norm0.z;\r
    g110 *= norm0.w;\r
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r
    g001 *= norm1.x;\r
    g011 *= norm1.y;\r
    g101 *= norm1.z;\r
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);\r
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);\r
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \r
    return 2.2 * n_xyz;\r
}

float waveElevation(vec3 position) {\r
    float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *\r
        sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *\r
        uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++) {\r
        elevation -= abs(perlinClassic3D(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);\r
    }

    return elevation;\r
}

void main() {\r
    float shift = 0.01;\r
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);\r
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);\r
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);

    
    float elevation = waveElevation(modelPosition.xyz);\r
    modelPosition.y += elevation;\r
    modelPositionA.y += waveElevation(modelPositionA);\r
    modelPositionB.y += waveElevation(modelPositionB);

    
    vec3 toA = normalize(modelPositionA - modelPosition.xyz);\r
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);\r
    vec3 computedNormal = cross(toA, toB);\r
    vNormal = computedNormal;

    for(float i = 1.0; i <= uSmallIterations; i++) {\r
        elevation -= abs(perlinClassic3D(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);\r
    }

    modelPosition.y += elevation;

    
    vec4 viewPosition = viewMatrix * modelPosition;\r
    vec4 projectedPosition = projectionMatrix * viewPosition;\r
    gl_Position = projectedPosition;

    
    vElevation = elevation;\r
    vPosition = modelPosition.xyz;\r
}`,j=`uniform vec3 uDepthColor;\r
uniform vec3 uSurfaceColor;\r
uniform float uColorOffset;\r
uniform float uColorMultiplier;

varying float vElevation;\r
varying vec3 vNormal;\r
varying vec3 vPosition;

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
}\r
vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay)\r
{\r
    vec3 lightDelta = lightPosition - position;\r
    float lightDistance = length(lightDelta);\r
    vec3 lightDirection = normalize(lightDelta);\r
    vec3 lightReflection = reflect(- lightDirection, normal);

    
    float shading = dot(normal, lightDirection);\r
    shading = max(0.0, shading);

    
    float specular = - dot(lightReflection, viewDirection);\r
    specular = max(0.0, specular);\r
    specular = pow(specular, specularPower);

    
    float decay = 1.0 - lightDistance * lightDecay;\r
    decay = max(0.0, decay);

    return lightColor * lightIntensity * decay * (shading + specular);\r
}

void main() {\r
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    vec3 normal = normalize(vNormal);\r
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;\r
    mixStrength = smoothstep(0.0, 1.0, mixStrength);\r
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    
    vec3 light = vec3(0.0);

    light += directionalLight(vec3(1.0),            
    1.0,                  
    normal,               
    vec3(-1.0, 0.5, 0.0), 
    viewDirection,        
    30.0                  
    );\r
    light += pointLight(vec3(1.0),            
    10.0,                 
    normal,               
    vec3(0.0, 0.25, 0.0), 
    viewDirection,        
    30.0,                 
    vPosition,            
    0.95                  
    );

    color *= light;

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;const k=q({__name:"index",setup(R){new z,new S;let f,t,v,r,m,s,u,c;function d(){({container:f,renderer:t,scene:v,camera:r,clock:m,viewPort:s,tick:u}=B(document.querySelector(".webgl")))}function x(){r.position.set(1,1,1)}function y(){c=new b(r,t.domElement),c.enableDamping=!0}function p(){T(s,()=>{const{width:e,height:a}=s.value;r.aspect=e/a,r.updateProjectionMatrix(),t.setSize(e,a,!1)})}let o;const i={depthColor:"#ff4000",surfaceColor:"#151c37",bigWavesElevation:.2,bigWavesFrequency:4,bigWavesSpeed:.75,smallWavesElevation:.15,smallWavesFrequency:3,smallWavesSpeed:.2,smallIterations:4,colorOffset:.925,colorMultiplier:1};function h(){o=new E({container:document.querySelector(".debug")}),O(()=>o.destroy),o.addColor(i,"depthColor").name("深水颜色").onChange(e=>{n&&(n.material.uniforms.uDepthColor.value=new l(e))}),o.addColor(i,"surfaceColor").name("表面颜色").onChange(e=>{n&&(n.material.uniforms.uSurfaceColor.value=new l(e))}),o.add(i,"bigWavesElevation").name("整体浪高").min(0).max(1).step(.001).onChange(e=>{n&&(n.material.uniforms.uBigWavesElevation.value=e)}),o.add(i,"bigWavesFrequency").name("整体频率").min(0).max(10).step(.001).onChange(e=>{n&&(n.material.uniforms.uBigWavesFrequency.value=e)}),o.add(i,"bigWavesSpeed").name("整体速度").min(0).max(10).step(.001).onChange(e=>{n&&(n.material.uniforms.uBigWavesSpeed.value=e)}),o.add(i,"smallWavesElevation").name("噪音高度").min(0).max(1).step(.001).onChange(e=>{n&&(n.material.uniforms.uSmallWavesElevation.value=e)}),o.add(i,"smallWavesFrequency").name("噪音频率").min(0).max(10).step(.001).onChange(e=>{n&&(n.material.uniforms.uSmallWavesFrequency.value=e)}),o.add(i,"smallWavesSpeed").name("噪音速度").min(0).max(10).step(.001).onChange(e=>{n&&(n.material.uniforms.uSmallWavesSpeed.value=e)}),o.add(i,"smallIterations").name("噪音重复").min(0).max(10).step(.001).onChange(e=>{n&&(n.material.uniforms.uSmallIterations.value=e)}),o.add(i,"colorOffset").name("颜色偏移").min(0).max(1).step(.001).onChange(e=>{n&&(n.material.uniforms.uColorOffset.value=e)})}let n;I(()=>{d(),h(),y(),p(),x(),P(),u(()=>{const e=m.getElapsedTime();n&&(n.material.uniforms.uTime.value=e),c.update(),t.render(v,r)})});function P(){const e=new C(2,2,512,512),a=new w({vertexShader:A,fragmentShader:j,uniforms:{uTime:{value:0},uBigWavesElevation:{value:.2},uBigWavesFrequency:{value:new W(4,1.5)},uBigWavesSpeed:{value:.75},uSmallWavesElevation:{value:.15},uSmallWavesFrequency:{value:3},uSmallWavesSpeed:{value:.2},uSmallIterations:{value:4},uDepthColor:{value:new l(i.depthColor)},uSurfaceColor:{value:new l(i.surfaceColor)},uColorOffset:{value:.925},uColorMultiplier:{value:1}}});n=new D(e,a),n.rotation.x=-Math.PI*.5,v.add(n)}return(e,a)=>(L(),F(_,null,{default:M(()=>a[0]||(a[0]=[g("div",{class:"webgl"},null,-1),g("div",{class:"debug"},null,-1)])),_:1}))}}),H=N(k,[["__scopeId","data-v-414fd2bf"]]);export{H as default};

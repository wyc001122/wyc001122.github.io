import{G as C,T as N,a8 as q,a9 as U,I as M,S as D,c as L,f as F,a as T,D as A,u as j,aa as X,C as Y,ab as H,ac as _,ad as O,O as E,b as V}from"./GLTFLoader-Cpm_xSlR.js";import{g as W}from"./index-DjKJqAo0.js";import{d as Z,f as J,p as K,k as Q,w as $,q as e0,o as n0,h as l}from"./index-qyBmO-yZ.js";import{a as r0}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var o0=`vec3 mod289(vec3 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
vec4 mod289(vec4 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
vec4 permute(vec4 x) {\r
    return mod289(((x * 34.0) + 1.0) * x);\r
}\r
vec4 taylorInvSqrt(vec4 r) {\r
    return 1.79284291400159 - 0.85373472095314 * r;\r
}\r
vec3 fade(vec3 t) {\r
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\r
}\r
  
float cnoise(vec3 P) {\r
    vec3 Pi0 = floor(P); 
    vec3 Pi1 = Pi0 + vec3(1.0); 
    Pi0 = mod289(Pi0);\r
    Pi1 = mod289(Pi1);\r
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r
    vec4 iy = vec4(Pi0.yy, Pi1.yy);\r
    vec4 iz0 = Pi0.zzzz;\r
    vec4 iz1 = Pi1.zzzz;\r
    vec4 ixy = permute(permute(ix) + iy);\r
    vec4 ixy0 = permute(ixy + iz0);\r
    vec4 ixy1 = permute(ixy + iz1);\r
    vec4 gx0 = ixy0 * (1.0 / 7.0);\r
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\r
    gx0 = fract(gx0);\r
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r
    vec4 sz0 = step(gz0, vec4(0.0));\r
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\r
    vec4 gx1 = ixy1 * (1.0 / 7.0);\r
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\r
    gx1 = fract(gx1);\r
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r
    vec4 sz1 = step(gz1, vec4(0.0));\r
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\r
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\r
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\r
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\r
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\r
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\r
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\r
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\r
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\r
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r
    g000 *= norm0.x;\r
    g010 *= norm0.y;\r
    g100 *= norm0.z;\r
    g110 *= norm0.w;\r
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r
    g001 *= norm1.x;\r
    g011 *= norm1.y;\r
    g101 *= norm1.z;\r
    g111 *= norm1.w;\r
    float n000 = dot(g000, Pf0);\r
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r
    float n111 = dot(g111, Pf1);\r
    vec3 fade_xyz = fade(Pf0);\r
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\r
    return 1.2 * n_xyz;\r
}\r
  
float pnoise(vec3 P, vec3 rep) {\r
    vec3 Pi0 = mod(floor(P), rep); 
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); 
    Pi0 = mod289(Pi0);\r
    Pi1 = mod289(Pi1);\r
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r
    vec4 iy = vec4(Pi0.yy, Pi1.yy);\r
    vec4 iz0 = Pi0.zzzz;\r
    vec4 iz1 = Pi1.zzzz;\r
    vec4 ixy = permute(permute(ix) + iy);\r
    vec4 ixy0 = permute(ixy + iz0);\r
    vec4 ixy1 = permute(ixy + iz1);\r
    vec4 gx0 = ixy0 * (1.0 / 7.0);\r
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\r
    gx0 = fract(gx0);\r
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r
    vec4 sz0 = step(gz0, vec4(0.0));\r
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\r
    vec4 gx1 = ixy1 * (1.0 / 7.0);\r
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\r
    gx1 = fract(gx1);\r
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r
    vec4 sz1 = step(gz1, vec4(0.0));\r
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\r
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\r
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\r
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\r
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\r
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\r
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\r
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\r
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\r
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r
    g000 *= norm0.x;\r
    g010 *= norm0.y;\r
    g100 *= norm0.z;\r
    g110 *= norm0.w;\r
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r
    g001 *= norm1.x;\r
    g011 *= norm1.y;\r
    g101 *= norm1.z;\r
    g111 *= norm1.w;\r
    float n000 = dot(g000, Pf0);\r
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r
    float n111 = dot(g111, Pf1);\r
    vec3 fade_xyz = fade(Pf0);\r
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\r
    return 2.0 * n_xyz;\r
}\r
varying vec3 vNormal;\r
uniform float time;\r
uniform float weight;\r
uniform float morph;\r
uniform float psize;

void main() {\r
    float f = morph * pnoise(normal + time, vec3(10.0));\r
    vNormal = normalize(normal);\r
    vec4 pos = vec4(position + f * normal, 1.0);\r
    gl_Position = projectionMatrix * modelViewMatrix * pos;\r
    gl_PointSize = psize;\r
}`,t0=`vec3 mod289(vec3 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
vec4 mod289(vec4 x) {\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
vec4 permute(vec4 x) {\r
    return mod289(((x * 34.0) + 1.0) * x);\r
}\r
vec4 taylorInvSqrt(vec4 r) {\r
    return 1.79284291400159 - 0.85373472095314 * r;\r
}\r
vec3 fade(vec3 t) {\r
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\r
}\r
  
float cnoise(vec3 P) {\r
    vec3 Pi0 = floor(P); 
    vec3 Pi1 = Pi0 + vec3(1.0); 
    Pi0 = mod289(Pi0);\r
    Pi1 = mod289(Pi1);\r
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r
    vec4 iy = vec4(Pi0.yy, Pi1.yy);\r
    vec4 iz0 = Pi0.zzzz;\r
    vec4 iz1 = Pi1.zzzz;\r
    vec4 ixy = permute(permute(ix) + iy);\r
    vec4 ixy0 = permute(ixy + iz0);\r
    vec4 ixy1 = permute(ixy + iz1);\r
    vec4 gx0 = ixy0 * (1.0 / 7.0);\r
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\r
    gx0 = fract(gx0);\r
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r
    vec4 sz0 = step(gz0, vec4(0.0));\r
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\r
    vec4 gx1 = ixy1 * (1.0 / 7.0);\r
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\r
    gx1 = fract(gx1);\r
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r
    vec4 sz1 = step(gz1, vec4(0.0));\r
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\r
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\r
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\r
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\r
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\r
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\r
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\r
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\r
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\r
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r
    g000 *= norm0.x;\r
    g010 *= norm0.y;\r
    g100 *= norm0.z;\r
    g110 *= norm0.w;\r
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r
    g001 *= norm1.x;\r
    g011 *= norm1.y;\r
    g101 *= norm1.z;\r
    g111 *= norm1.w;\r
    float n000 = dot(g000, Pf0);\r
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r
    float n111 = dot(g111, Pf1);\r
    vec3 fade_xyz = fade(Pf0);\r
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\r
    return 2.2 * n_xyz;\r
}\r
  
float pnoise(vec3 P, vec3 rep) {\r
    vec3 Pi0 = mod(floor(P), rep); 
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); 
    Pi0 = mod289(Pi0);\r
    Pi1 = mod289(Pi1);\r
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r
    vec4 iy = vec4(Pi0.yy, Pi1.yy);\r
    vec4 iz0 = Pi0.zzzz;\r
    vec4 iz1 = Pi1.zzzz;\r
    vec4 ixy = permute(permute(ix) + iy);\r
    vec4 ixy0 = permute(ixy + iz0);\r
    vec4 ixy1 = permute(ixy + iz1);\r
    vec4 gx0 = ixy0 * (1.0 / 7.0);\r
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\r
    gx0 = fract(gx0);\r
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r
    vec4 sz0 = step(gz0, vec4(0.0));\r
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\r
    vec4 gx1 = ixy1 * (1.0 / 7.0);\r
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\r
    gx1 = fract(gx1);\r
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r
    vec4 sz1 = step(gz1, vec4(0.0));\r
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\r
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\r
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\r
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\r
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\r
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\r
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\r
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\r
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\r
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r
    g000 *= norm0.x;\r
    g010 *= norm0.y;\r
    g100 *= norm0.z;\r
    g110 *= norm0.w;\r
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r
    g001 *= norm1.x;\r
    g011 *= norm1.y;\r
    g101 *= norm1.z;\r
    g111 *= norm1.w;\r
    float n000 = dot(g000, Pf0);\r
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r
    float n111 = dot(g111, Pf1);\r
    vec3 fade_xyz = fade(Pf0);\r
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\r
    return 10.0 * n_xyz;\r
}\r
varying vec3 vNormal;\r
uniform sampler2D tShine;\r
uniform float time;\r
uniform float RGBr;\r
uniform float RGBg;\r
uniform float RGBb;\r
uniform float RGBn;\r
uniform float RGBm;\r
uniform float dnoise;

float PI = 3.14159265358979323846264;\r
void main() {\r
    float r = (pnoise(RGBr * (vNormal + time), vec3(10.0)));\r
    float g = (pnoise(RGBg * (vNormal + time), vec3(10.0)));\r
    float b = (pnoise(RGBb * (vNormal + time), vec3(10.0)));\r
    float n = pnoise(-1.0 * (vNormal + time), vec3(10.0));\r
    
    n = 50.0 * pnoise((RGBn) * (vNormal), vec3(10.0)) * pnoise(RGBm * (vNormal + time), vec3(10.0));\r
    n -= 0.10 * pnoise(dnoise * vNormal, vec3(10.0));\r
    vec3 color = vec3(r + n, g + n, b + n);\r
    gl_FragColor = vec4(color, 1.0);\r
}`;const g0=Z({__name:"index",setup(c0){new C,new N;let w,f,i,c,p,z,P,m;function h(){({container:w,renderer:f,scene:i,camera:c,clock:p,viewPort:z,tick:P}=j(document.querySelector(".webgl")))}function G(){f.shadowMap.enabled=!0,c.fov=20,c.updateProjectionMatrix(),c.position.set(0,10,120),i.fog=new X(v._dark,150,320),i.background=new Y(v._dark),i.add(u);const n=new H(v._cont,v._white,1),r=new _(v._white,1);r.position.set(-5,-20,-20);const g=new O(v._white,20,3,3);g.position.set(0,0,2);const o=new _(v._white,2);o.position.set(20,10,0),i.add(n,r,g,o)}function b(){m=new E(c,f.domElement),m.enableDamping=!0}function B(){$(z,()=>{const{width:n,height:r}=z.value;c.aspect=n/r,c.updateProjectionMatrix(),f.setSize(n,r,!1)})}let x;function R(){x=new V({container:document.querySelector(".debug")}),e0(()=>x.destroy)}let t,a,d;const u=new q,v={_gray:2236962,_dark:0,_cont:4473924,_blue:4095,_red:15728640,_cyan:65535,_white:15730057},y={time:{type:"f",value:0},RGBr:{type:"f",value:0},RGBg:{type:"f",value:0},RGBb:{type:"f",value:0},RGBn:{type:"f",value:0},RGBm:{type:"f",value:0},morph:{type:"f",value:0},dnoise:{type:"f",value:0},psize:{type:"f",value:3}},e={perlin:{time:5,morph:0,dnoise:2.5},chroma:{RGBr:4.5,RGBg:0,RGBb:3,RGBn:.3,RGBm:1},camera:{zoom:150,speedY:.6,speedX:0,guide:!1},sphere:{wireframe:!1,points:!1,psize:3}};let s;J(()=>{h(),R(),b(),B(),G(),S(),I(),k(),P(()=>{const n=p.getElapsedTime();y.time.value=e.perlin.time/1e4*n,y.morph.value=e.perlin.morph,y.dnoise.value=e.perlin.dnoise,W.to(c.position,{duration:2,z:300-e.camera.zoom}),t.mesh.rotation.y+=e.camera.speedY/100,t.mesh.rotation.z+=e.camera.speedX/100,t.point.rotation.y=t.mesh.rotation.y,t.point.rotation.z=t.mesh.rotation.z,s.rotation.y=t.mesh.rotation.y,a.uniforms.RGBr.value=e.chroma.RGBr/10,a.uniforms.RGBg.value=e.chroma.RGBg/10,a.uniforms.RGBb.value=e.chroma.RGBb/10,a.uniforms.RGBn.value=e.chroma.RGBn/100,a.uniforms.RGBm.value=e.chroma.RGBm,a.uniforms.psize.value=e.sphere.psize,s.visible=e.camera.guide,t.mesh.visible=!e.sphere.points,t.point.visible=e.sphere.points,a.wireframe=e.sphere.wireframe,c.lookAt(i.position),m.update(),f.render(i,c)})});function S(n=-20){s=new U(200,20,v._cont,v._gray),s.position.y=n,i.add(s)}function I(){const n=x.addFolder("Camera");n.add(e.camera,"zoom",50,250).name("Zoom").listen(),n.add(e.camera,"speedY",-1,1).name("Speed Y").listen(),n.add(e.camera,"speedX",0,1).name("Speed X").listen(),n.add(e.camera,"guide",!1).name("Guide").listen();const r=x.addFolder("Setup");r.add(e.perlin,"time",0,10).name("Speed").listen(),r.add(e.perlin,"morph",0,20).name("Morph").listen(),r.add(e.perlin,"dnoise",0,100).name("DNoise").listen(),r.open();const g=x.addFolder("RGB");g.add(e.chroma,"RGBr",0,10).name("Red").listen(),g.add(e.chroma,"RGBg",0,10).name("Green").listen(),g.add(e.chroma,"RGBb",0,10).name("Blue").listen(),g.add(e.chroma,"RGBn",0,3).name("Black").listen(),g.add(e.chroma,"RGBm",0,1).name("Chroma").listen(),g.open();const o=x.addFolder("Sphere");o.add(e.sphere,"wireframe",!0).name("Wireframe").listen(),o.add(e.sphere,"points",!0).name("Points").listen(),o.add(e.sphere,"psize",1,10).name("Point Size").step(1),console.log("Create GUI")}function k(n=5){n>=5&&(n=5),d=new M(20,n),a=new D({uniforms:y,side:L,vertexShader:o0,fragmentShader:t0,wireframe:e.sphere.wireframe});const g=new F(d,a),o=new T(d,a);o.geometry.verticesNeedUpdate=!0,o.geometry.morphTargetsNeedUpdate=!0,o.receiveShadow=!0,o.castShadow=!0,u.add(g,o),t={point:g,mesh:o},t.mesh.scale.set(1,1,1),i.add(t.mesh)}return(n,r)=>(n0(),K(A,null,{default:Q(()=>r[0]||(r[0]=[l("div",{class:"webgl"},[l("div",{class:"text"},"Abstract Ball")],-1),l("div",{class:"debug"},null,-1)])),_:1}))}}),f0=r0(g0,[["__scopeId","data-v-e76e9b40"]]);export{f0 as default};

import{G as B,T as I,o as N,C as E,d as O,F as z,S as x,f as W,p as P,q as U,P as h,a as y,W as T,r as H,R as V,s as Z,t as J,c as b,v as K,V as Q,D as X,u as Y,O as ee,b as ne,w as te}from"./GLTFLoader-Cpm_xSlR.js";import{d as ae,f as re,p as oe,k as ie,w as le,q as se,o as ve,h as R}from"./index-qyBmO-yZ.js";import{a as ce}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var de=`varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vUv = uv;
}`,ge=`uniform float uTime;
uniform sampler2D uGradientTexture;
uniform sampler2D uNoisesTexture;

varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  float noise1 = texture(uNoisesTexture, vUv - uTime * 0.1).r;
  float noise2 = texture(uNoisesTexture, vUv - uTime * 0.08).g;
  float noise3 = texture(uNoisesTexture, vUv - uTime * 0.06).b;
  float noise4 = texture(uNoisesTexture, vUv - uTime * 0.04).a;
  vec4 noiseVector = vec4(noise1, noise2, noise3, noise4);
  float noiseLength = length(noiseVector);

  float outerFalloff = remap(vUv.y, 0.4, 0.0, 1.0, 0.0);
  float innerFalloff = remap(vUv.y, 1.0, 0.95, 0.0, 1.0);
  float falloff = min(outerFalloff, innerFalloff);
  falloff = smoothstep(0.0, 1.0, falloff);

  vec2 uv = vUv;
  uv.y += noiseLength * 0.4;
  uv.y *= falloff;

  vec4 color = texture(uGradientTexture, uv);
  color.a = uv.y;
  gl_FragColor = color;
}`,ue=`varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}`,fe=`varying vec2 vUv;

vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
    return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float perlin3dPeriodic(vec3 P, vec3 rep)
{
    vec3 Pi0 = mod(floor(P), rep); 
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); 
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}

void main() {
  float perlin1 = perlin3dPeriodic(vec3(vUv.xy * 5.0, 12.34), vec3(5.0));
  float perlin2 = perlin3dPeriodic(vec3(vUv.xy * 10.0, 34.56), vec3(10.0));
  float perlin3 = perlin3dPeriodic(vec3(vUv.xy * 20.0, 56.78), vec3(20.0));
  float perlin4 = perlin3dPeriodic(vec3(vUv.xy * 40.0, 56.78), vec3(40.0));
  gl_FragColor = vec4(perlin1, perlin2, perlin3, perlin4);
}`,me=`attribute float size;
attribute vec3 color;

varying vec3 vColor;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size;

  vColor = color;
}`,xe=`varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord;
  float distanceToCenter = length(uv - 0.5);
  float alpha = 0.02 / distanceToCenter;
  alpha *= 1.0 - distanceToCenter * 2.0;
  gl_FragColor = vec4(vColor, alpha);
}`,pe=`varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}`,ye=`varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  float distanceToCenter = length(vUv - 0.5);
  float strength = remap(distanceToCenter, 0.2, 0.5, 1.0, 0.0);
  strength = smoothstep(0.0, 1.0, strength);
  gl_FragColor = vec4(vec3(strength), 1.0);
}`,he=`varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}`,Me=`uniform float uTime;
uniform sampler2D uDefaultTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uConvergencePosition;

varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}
float random2d(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float distortionStrength = texture(uDistortionTexture, vUv).r;
  vec2 convergencePoint = vec2(0.5);
  vec2 toConvergence = uConvergencePosition - vUv;
  vec2 distoredUv = vUv + toConvergence * distortionStrength;

  

  
  float distanceToCenter = length(vUv - 0.5);
  float vignetteStrength = remap(distanceToCenter, 0.3, 0.7, 0.0, 1.0);
  vignetteStrength = smoothstep(0.0, 1.0, vignetteStrength);
  

  
  float r = texture(uDefaultTexture, distoredUv + vec2(sin(0.0), cos(0.0)) * 0.02 * vignetteStrength).r;
  float g = texture(uDefaultTexture, distoredUv + vec2(sin(2.1), cos(2.1)) * 0.02 * vignetteStrength).g;
  float b = texture(uDefaultTexture, distoredUv + vec2(sin(-2.1), cos(-2.1)) * 0.02 * vignetteStrength).b;
  vec4 color = vec4(r, g, b, 1.0);

  
  float noise = random2d(vUv + uTime);
  noise = noise - 0.5;

  float grayscale = r * 0.299 + g * 0.587 + b * 0.114;
  noise *= grayscale;

  color += noise * 0.5;

  gl_FragColor = color;
}`,we=`varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}`,ze=`varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  float distanceToCenter = length(vUv - 0.5);
  float strength = remap(distanceToCenter, 0.2 / 3.0, 0.5 / 3.0, 1.0, 0.0);
  strength = smoothstep(0.0, 1.0, strength);

  float alpha = remap(distanceToCenter, 0.4, 0.5, 1.0, 0.0);
  alpha = smoothstep(0.0, 1.0, alpha);

  gl_FragColor = vec4(vec3(strength), 1.0);
}`;const Pe=ae({__name:"index",setup(Te){new B,new I;let D,a,f,o,C,g,_,p;function F(){({container:D,renderer:a,scene:f,camera:o,clock:C,viewPort:g,tick:_}=Y(document.querySelector(".webgl")))}function L(){o.position.set(0,3,10),a.setClearColor("#130e16")}function G(){p=new ee(o,a.domElement),p.enableDamping=!0,p.zoomSpeed=.4,p.enableDamping=!0}function A(){le(g,()=>{const{width:s,height:v}=g.value;o.aspect=s/v,o.updateProjectionMatrix(),a.setSize(s,v,!1)})}let S;function $(){S=new ne({container:document.querySelector(".debug")}),se(()=>S.destroy)}let m=null;const n={},i={},r={},e={},t={};re(()=>{F(),$(),G(),A(),L(),j(),_(()=>{const{width:s,height:v}=g.value,u=C.getElapsedTime();e.material.uniforms.uTime.value=u,o.rotateZ(.2);const l=u*.2,c=.1;m.position.x=c*Math.sin(l)*Math.sin(l*2.1)*Math.sin(l*4.3),m.position.y=c*Math.sin(l*1.23)*Math.sin(l*4.56)*Math.sin(l*7.89),m.position.z=c*Math.sin(l*3.45)*Math.sin(l*6.78)*Math.sin(l*9.01),o.updateProjectionMatrix(),t.hole.mesh.lookAt(o.position);const d=new te(0,0,0);d.project(o),d.x=d.x*.5+.5,d.y=d.y*.5+.5,n.plane.material.uniforms.uConvergencePosition.value.set(d.x,d.y),n.plane.material.uniforms.uTime.value=u,n.distortionRenderTarget&&n.distortionRenderTarget.setSize(s,v),n.defaultRenderTarget&&n.defaultRenderTarget.setSize(s,v),p.update(),a.render(f,o),a.render(t.scene,o),a.setRenderTarget(n.defaultRenderTarget),a.setClearColor("#130e16"),a.render(f,o),a.setRenderTarget(null),a.setRenderTarget(n.distortionRenderTarget),a.setClearColor("#000000"),a.render(t.scene,o),a.setRenderTarget(null),a.render(n.scene,n.camera)})});function j(){m=new N,f.add(m),m.add(o),i.count=1e4;const s=new Float32Array(i.count*3),v=new Float32Array(i.count),u=new Float32Array(i.count*3);for(let l=0;l<i.count;l++){const c=l*3,d=2*Math.PI*Math.random(),M=Math.acos(2*Math.random()-1);s[c+0]=Math.cos(d)*Math.sin(M)*400,s[c+1]=Math.sin(d)*Math.sin(M)*400,s[c+2]=Math.cos(M)*400,v[l]=.5+Math.random()*30;const k=Math.round(Math.random()*360),q=Math.round(80+Math.random()*20),w=new E(`hsl(${k}, 100%, ${q}%)`);u[c+0]=w.r,u[c+1]=w.g,u[c+2]=w.b}i.geometry=new O,i.geometry.setAttribute("position",new z(s,3)),i.geometry.setAttribute("size",new z(v,1)),i.geometry.setAttribute("color",new z(u,3)),i.material=new x({transparent:!0,vertexShader:me,fragmentShader:xe}),i.points=new W(i.geometry,i.material),f.add(i.points),r.scene=new P,r.camera=new U(-1,1,1,-1,.1,10),r.camera.position.set(0,0,5),r.scene.add(r.camera),r.plane={},r.plane.geometry=new h(2,2),r.plane.material=new x({vertexShader:ue,fragmentShader:fe}),r.plane.mesh=new y(r.plane.geometry,r.plane.material),r.scene.add(r.plane.mesh),r.renderTarget=new T(256,256,{generateMipmaps:!1,type:H,wrapS:V,wrapT:V}),a.setRenderTarget(r.renderTarget),a.render(r.scene,r.camera),a.setRenderTarget(null),e.gradient={},e.gradient.canvas=document.createElement("canvas"),e.gradient.canvas.width=1,e.gradient.canvas.height=128,e.gradient.context=e.gradient.canvas.getContext("2d"),e.gradient.style=e.gradient.context.createLinearGradient(0,0,0,e.gradient.canvas.height),e.gradient.style.addColorStop(0,"#fffbf9"),e.gradient.style.addColorStop(.1,"#ffbc68"),e.gradient.style.addColorStop(.2,"#ff5600"),e.gradient.style.addColorStop(.4,"#ff0053"),e.gradient.style.addColorStop(.8,"#cc00ff"),e.gradient.context.fillStyle=e.gradient.style,e.gradient.context.fillRect(0,0,e.gradient.canvas.width,e.gradient.canvas.height),e.gradient.texture=new Z(e.gradient.canvas),e.geometry=new J(1.5,6,0,64,8,!0),e.material=new x({transparent:!0,side:b,vertexShader:de,fragmentShader:ge,uniforms:{uTime:{value:0},uGradientTexture:{value:e.gradient.texture},uNoisesTexture:{value:r.renderTarget.texture}}}),e.mesh=new y(e.geometry,e.material),f.add(e.mesh),t.scene=new P,t.hole={},t.hole.geometry=new h(4,4),t.hole.material=new x({vertexShader:pe,fragmentShader:ye}),t.hole.mesh=new y(t.hole.geometry,t.hole.material),t.scene.add(t.hole.mesh),t.disc={},t.disc.geometry=new h(12,12),t.disc.material=new x({transparent:!0,side:b,vertexShader:we,fragmentShader:ze}),t.disc.mesh=new y(t.disc.geometry,t.disc.material),t.disc.mesh.rotation.x=-Math.PI*.5,t.scene.add(t.disc.mesh),n.defaultRenderTarget=new T(g.value.width,g.value.height,{generateMipmaps:!1}),n.distortionRenderTarget=new T(g.value.width,g.value.height,{generateMipmaps:!1,format:K}),n.scene=new P,n.camera=new U(-1,1,1,-1,.1,10),n.camera.position.set(0,0,5),n.scene.add(n.camera),n.plane={},n.plane.geometry=new h(2,2),n.plane.material=new x({vertexShader:he,fragmentShader:Me,uniforms:{uTime:{value:0},uDefaultTexture:{value:n.defaultRenderTarget.texture},uDistortionTexture:{value:n.distortionRenderTarget.texture},uConvergencePosition:{value:new Q}}}),n.plane.mesh=new y(n.plane.geometry,n.plane.material),n.scene.add(n.plane.mesh)}return(s,v)=>(ve(),oe(X,null,{default:ie(()=>v[0]||(v[0]=[R("div",{class:"webgl"},null,-1),R("div",{class:"debug"},null,-1)])),_:1}))}}),Ue=ce(Pe,[["__scopeId","data-v-2be37938"]]);export{Ue as default};

import{G as I,T as B,y as G,S as C,U as v,V as b,a as V,d as F,e as R,f as A,D as L,u as E,O,b as $}from"./GLTFLoader-Cpm_xSlR.js";import{d as H,f as J,p as Q,k as W,w as X,q as Y,o as Z,h as S}from"./index-qyBmO-yZ.js";import{a as nn}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var en=`vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float simplexNoise3d(vec3 v)
{ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  
  
  
  
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; 
  vec3 x3 = x0 - D.yyy;      

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857; 
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  
  
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
vec3 hsv2rgb(vec3 hsv) {\r
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\r
    vec3 p = abs(fract(hsv.xxx + K.xyz) * 6.0 - K.www);\r
    return hsv.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), hsv.y);\r
}

uniform vec2 uResolution;
uniform float uSize;
uniform float uTime;

varying vec3 vColor;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    float nosie = simplexNoise3d(position * 8.0 + uTime / 8.);
    vec3 newPosition = position * (nosie + .5);

    vColor = hsv2rgb(vec3(nosie * .1 + 0.03, 0.8, 0.8));
    vNormal = normal;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}`,on=`uniform float uTime;

varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vUv;

void main() {

    vec3 light = vec3(0.);
    vec3 skyColor = vec3(1., 1., .574);
    vec3 groundColor = vec3(.562, .275, .111);

    vec3 lightDirection = normalize(vec3(0., -1., -1.));

    light += dot(lightDirection, vNormal);

    light = mix(skyColor, groundColor, dot(lightDirection, vNormal));

    gl_FragColor = vec4(vec3(light * vColor), 1.0);
    
    
    
}`,tn=`vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float simplexNoise3d(vec3 v)
{ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  
  
  
  
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; 
  vec3 x3 = x0 - D.yyy;      

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857; 
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  
  
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
vec3 hsv2rgb(vec3 hsv) {\r
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\r
    vec3 p = abs(fract(hsv.xxx + K.xyz) * 6.0 - K.www);\r
    return hsv.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), hsv.y);\r
}

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    vec3 p = position;

    p.y += 0.2 * (sin(p.y * 5. + uTime * 5.) * 0.5 + 0.5);
    p.z += 0.05 * (sin(p.y * 15. + uTime * 5.) * 0.5 + 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    gl_PointSize = 10.0 * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    vPosition = position;
    vNormal = normal;
}`,rn=`varying float uTime;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
void main() {

    gl_FragColor = vec4(0.826, 1., 1., .4);
    
    
    
}`;const vn=H({__name:"index",setup(cn){new I,new B;let P,i,x,t,u,c,f,l;function T(){({container:P,renderer:i,scene:x,camera:t,clock:u,viewPort:c,tick:f}=E(document.querySelector(".webgl")))}function D(){t.position.set(0,0,5)}function M(){l=new O(t,i.domElement),l.enableDamping=!0}function N(){X(c,()=>{const{width:n,height:e}=c.value;t.aspect=n/e,t.updateProjectionMatrix(),i.setSize(n,e,!1)})}let y;const h={clearColor:"#000000"};function K(){y=new $({container:document.querySelector(".debug")}),Y(()=>y.destroy),y.addColor(h,"clearColor").onChange(()=>{i.setClearColor(h.clearColor)})}J(()=>{T(),K(),M(),N(),D(),U(),j(),f(()=>{const n=u.getElapsedTime();m.material.uniforms.uTime.value=n,s.material.uniforms.uTime.value=n,s.rotation.y=n,l.update(),i.render(x,t)})});let m;function U(){const{width:n,height:e}=c.value,a=new G(1,462,462),r=new C({vertexShader:en,fragmentShader:on,uniforms:{uSize:new v(.4),uTime:new v(0),uResolution:new v(new b(n,e))}});m=new V(a,r),x.add(m)}let s;function j(){const{width:n,height:e}=c.value;let a=1e4,r=new Float32Array(a*3);const w=new F;let q=Math.PI*(3-Math.sqrt(5)),z=2/a,p=1.7;for(let o=0;o<a;o++){let d=o*z-1+z/2,g=Math.sqrt(1-d*d),_=o*q;r[o*3]=p*Math.cos(_)*g,r[o*3+1]=p*d,r[o*3+2]=p*Math.sin(_)*g}w.setAttribute("position",new R(r,3));const k=new C({vertexShader:tn,fragmentShader:rn,transparent:!0,uniforms:{uSize:new v(.4),uTime:new v(0),uResolution:new v(new b(n,e))}});s=new A(w,k),x.add(s)}return(n,e)=>(Z(),Q(L,null,{default:W(()=>e[0]||(e[0]=[S("div",{class:"webgl"},null,-1),S("div",{class:"debug"},null,-1)])),_:1}))}}),ln=nn(vn,[["__scopeId","data-v-ae77cfd6"]]);export{ln as default};

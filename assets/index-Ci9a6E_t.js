import{G as M,T as L,F as j,d as R,e as F,S as O,U as u,V as k,C as z,A as q,f as I,D as U,u as G,O as N,b as V}from"./GLTFLoader-Cpm_xSlR.js";import{g as E}from"./index-DjKJqAo0.js";import{D as W}from"./DRACOLoader-DJmNJuvT.js";import{d as H,f as J,p as K,k as Q,w as X,q as Y,o as Z,h as b}from"./index-qyBmO-yZ.js";import{a as $}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var ee=`uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aPositionTarget;
attribute float aSize;

varying vec3 vColor;

vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

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

    
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    
    
    float n_ = 1.0/7.0; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  

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
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main()
{
    
    float noiseOrigin = simplexNoise3d(position * 0.2);
    float noiseTarget = simplexNoise3d(aPositionTarget * 0.2);
    float noise = mix(noiseOrigin, noiseTarget, uProgress);
    noise = smoothstep(-1.0, 1.0, noise);
    
    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);
    vec3 mixedPosition = mix(position, aPositionTarget, progress);

    
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    
    gl_PointSize = aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    
    vColor = mix(uColorA, uColorB, noise);
}`,oe=`varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = 0.05 / distanceToCenter - 0.1;
    
    gl_FragColor = vec4(vColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`;const ne=H({__name:"index",setup(te){const g=new W;g.setDecoderPath("./draco/");const y=new M;y.setDRACOLoader(g),new L;let P,s,m,l,C,c,h,x;function _(){({container:P,renderer:s,scene:m,camera:l,clock:C,viewPort:c,tick:h}=G(document.querySelector(".webgl")))}function A(){l.position.set(0,0,8*2),s.setClearColor(p.clearColor)}function S(){x=new N(l,s.domElement),x.enableDamping=!0}function B(){X(c,()=>{const{width:d,height:r}=c.value;l.aspect=d/r,l.updateProjectionMatrix(),s.setSize(d,r,!1)})}let n,p={clearColor:"#160920"};function T(){n=new V({container:document.querySelector(".debug")}),Y(()=>n.destroy),n.addColor(p,"clearColor").onChange(()=>{s.setClearColor(p.clearColor)})}let e=null;J(()=>{_(),T(),S(),B(),A(),D(),h(()=>{C.getElapsedTime(),x.update(),s.render(m,l)})});function D(){y.load(new URL("/assets/models-Bt460700.glb",import.meta.url).href,d=>{e={},e.index=0;const r=d.scene.children.map(o=>o.geometry.attributes.position);e.maxCount=0;for(const o of r)o.count>e.maxCount&&(e.maxCount=o.count);e.positions=[];for(const o of r){const i=o.array,a=new Float32Array(e.maxCount*3);for(let v=0;v<e.maxCount;v++){const t=v*3;if(t<i.length)a[t+0]=i[t+0],a[t+1]=i[t+1],a[t+2]=i[t+2];else{const f=Math.floor(o.count*Math.random())*3;a[t+0]=i[f+0],a[t+1]=i[f+1],a[t+2]=i[f+2]}}e.positions.push(new j(a,3))}const w=new Float32Array(e.maxCount);for(let o=0;o<e.maxCount;o++)w[o]=Math.random();e.geometry=new R,e.geometry.setAttribute("position",e.positions[e.index]),e.geometry.setAttribute("aPositionTarget",e.positions[3]),e.geometry.setAttribute("aSize",new F(w,1)),e.colorA="#ff7300",e.colorB="#0091ff",e.material=new O({vertexShader:ee,fragmentShader:oe,uniforms:{uSize:new u(.4),uResolution:new u(new k(c.value.width,c.value.height)),uProgress:new u(0),uColorA:new u(new z(e.colorA)),uColorB:new u(new z(e.colorB))},blending:q,depthWrite:!1}),e.points=new I(e.geometry,e.material),e.points.frustumCulled=!1,m.add(e.points),e.morph=o=>{e.geometry.attributes.position=e.positions[e.index],e.geometry.attributes.aPositionTarget=e.positions[o],E.fromTo(e.material.uniforms.uProgress,{value:0},{value:1,duration:3,ease:"linear"}),e.index=o},n.addColor(e,"colorA").onChange(()=>{e.material.uniforms.uColorA.value.set(e.colorA)}),n.addColor(e,"colorB").onChange(()=>{e.material.uniforms.uColorB.value.set(e.colorB)}),n.add(e.material.uniforms.uProgress,"value").min(0).max(1).step(.001).name("uProgress").listen(),e.morph0=()=>{e.morph(0)},e.morph1=()=>{e.morph(1)},e.morph2=()=>{e.morph(2)},e.morph3=()=>{e.morph(3)},n.add(e,"morph0"),n.add(e,"morph1"),n.add(e,"morph2"),n.add(e,"morph3")})}return(d,r)=>(Z(),K(U,null,{default:Q(()=>r[0]||(r[0]=[b("div",{class:"webgl"},null,-1),b("div",{class:"debug"},null,-1)])),_:1}))}}),ce=$(ne,[["__scopeId","data-v-f2d8c4b1"]]);export{ce as default};

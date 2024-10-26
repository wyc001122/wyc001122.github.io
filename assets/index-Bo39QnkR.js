import{G as Q,T as $,af as ee,V as C,a as _,P as q,M as G,y as ne,p as te,q as oe,ag as V,ah as I,r as T,ai as d,S as Y,W as ie,c as re,_ as ae,d as se,e as k,f as le,D as me,u as ve,O as ce,b as ue}from"./GLTFLoader-Cpm_xSlR.js";import{d as pe,f as xe,p as de,k as fe,w as ye,q as we,o as ge,h as O}from"./index-qyBmO-yZ.js";import{a as Pe}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var ze=`uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vColor;
float PI = 3.141592653589793238;
void main()	{
	
	gl_FragColor = vec4(1.,0.,0.0,1.);
	gl_FragColor = vColor;
}`,he=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vColor;
uniform sampler2D uPositions;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;

  vec4 pos = texture2D( uPositions, uv );

  float angle = atan( pos.y, pos.x );

  vColor = vec4(0.5 + 0.45*sin(angle+time*0.4));
  vColor = vec4(1.);

  vec4 mvPosition = modelViewMatrix * vec4( vec3(pos.xy,0.), 1. );
  gl_PointSize = 1. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}`,be=`uniform float time;
uniform float progress;
uniform sampler2D uPositions;
uniform sampler2D uInfo;
uniform vec4 resolution;
uniform vec2 uMouse;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
#define PI 3.1415926538

const float EPS = 0.001;
vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
float mod289(float x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}
float permute(float x) {
    return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}
float taylorInvSqrt(float r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p, s;
    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    return p;
}
#define F4 0.309016994374947451

vec4 simplexNoiseDerivatives (vec4 v) {
    const vec4  C = vec4( 0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
    vec4 i = floor(v + dot(v, vec4(F4)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
    i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
    + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
    + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
    + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
    vec4 p0 = grad4(j0, ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4, p4));
    vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)); 
    
    vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));
    vec3 m0 = max(0.5 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0); 
    
    vec2 m1 = max(0.5 - vec2(dot(x3, x3), dot(x4, x4)), 0.0);
    vec3 temp0 = -6.0 * m0 * m0 * values0;
    vec2 temp1 = -6.0 * m1 * m1 * values1;
    vec3 mmm0 = m0 * m0 * m0;
    vec2 mmm1 = m1 * m1 * m1;
    float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;
    float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;
    float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;
    
    
    
    
    return vec4(dx, dy, dz, 0.0) * 49.0;
}
vec3 curl( in vec3 p, in float noiseTime, in float persistence ) {
    vec4 xNoisePotentialDerivatives = vec4(0.0);
    vec4 yNoisePotentialDerivatives = vec4(0.0);
    
    
    
    for (int i = 0; i < 2; ++i) {
        float twoPowI = pow(2.0, float(i));
        float scale = 0.5 * twoPowI * pow(persistence, float(i));
        xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(p * twoPowI, noiseTime)) * scale;
        yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(123.4, 129845.6, -1239.1)) * twoPowI, noiseTime)) * scale;
        
    }
    return vec3(
    yNoisePotentialDerivatives[1] - xNoisePotentialDerivatives[1], yNoisePotentialDerivatives[2] - xNoisePotentialDerivatives[2], yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[0]
    );
}
void main()	{
	vec4 pos = texture2D(uPositions, vUv);
	vec4 info = texture2D(uInfo, vUv);

	vec2 mouse = uMouse;

	float radius = length(pos.xy);
	
	float circlularForce = 1. - smoothstep(0.3,1.4, abs(pos.x-radius));
	float angle = atan(pos.y, pos.x) - info.y*0.3*mix(0.5,1.,circlularForce);

	float targetRadius = mix(
		info.x,1.8, 
		0.5 + 0.45*sin(angle*2. + time*0.2)
	);

	radius += (targetRadius - radius) * mix(0.2,0.5,circlularForce);
	
	

	vec3 targetPos = vec3(cos(angle), sin(angle), 0.0) * radius;

	pos.xy += (targetPos.xy - pos.xy) * 0.1;

	pos.xy += curl(pos.xyz*4., time*0.1, 0.1).xy * 0.006;

	float dist = length(pos.xy - mouse);
	vec2 dir = normalize(pos.xy - mouse);
	pos.xy += dir * 0.1 * smoothstep(0.3,0.0,dist);

	
	
	gl_FragColor = vec4(pos.xy,1.,1.);
}`,De=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;const Me=pe({__name:"index",setup(Fe){new Q,new $;let S,a,b,l,j,f,N,z;function X(){({container:S,renderer:a,scene:b,camera:l,clock:j,viewPort:f,tick:N}=ve(document.querySelector(".webgl")))}function Z(){l.position.set(0,0,4)}function E(){z=new ce(l,a.domElement),z.enableDamping=!0}function L(){ye(f,()=>{const{width:t,height:e}=f.value;l.aspect=t/e,l.updateProjectionMatrix(),a.setSize(t,e,!1)})}let U;function W(){U=new ue({container:document.querySelector(".debug")}),we(()=>U.destroy)}xe(()=>{X(),W(),E(),L(),Z(),H(),J(),K(),N(()=>{const t=j.getElapsedTime();z.update(),P.uniforms.time.value=t,m.uniforms.time.value=t,m.uniforms.uPositions.value=g.texture,P.uniforms.uPositions.value=p.texture,a.setRenderTarget(p),a.render(y,v),a.setRenderTarget(null),a.render(b,l);let e=p;p=g,g=e})});let D,h,m;function H(){D=new ee,h=new C;const t=new _(new q(100,100),new G),e=new _(new ne(.1,32,32),new G({color:5592405}));S.addEventListener("pointermove",i=>{const{viewWidth:r,viewHeight:o}=f.value;h.x=i.offsetX/r*2-1,h.y=-(i.offsetY/o)*2+1,D.setFromCamera(h,l);let s=D.intersectObject(t);if(s.length>0){let{x,y:F}=s[0].point;m.uniforms.uMouse.value=new C(x,F),console.log(x,F),e.position.set(x,F,0)}})}let y,v,c,u,w,R,n,p,g;function J(){n=256,p=A(),g=A(),y=new te,v=new oe(-1,1,1,-1,-1,1),v.position.set(0,0,.5),v.lookAt(0,0,0);let t=new q(2,2);const e=new Float32Array(n*n*4);for(let i=0;i<n;i++)for(let r=0;r<n;r++){let o=(i+r*n)*4,s=Math.random()*Math.PI*2,x=.5+.5*Math.random();e[o+0]=x*Math.cos(s),e[o+1]=x*Math.sin(s),e[o+2]=1,e[o+3]=1}c=new V(e,n,n,I,T),c.magFilter=d,c.minFilter=d,c.needsUpdate=!0,m=new Y({uniforms:{uPositions:{value:c},uInfo:{value:null},uMouse:{value:new C(0,0)},time:{value:0}},vertexShader:De,fragmentShader:be}),u=new Float32Array(n*n*4);for(let i=0;i<n;i++)for(let r=0;r<n;r++){let o=(i+r*n)*4;u[o+0]=.5+Math.random(),u[o+1]=.5+Math.random(),u[o+2]=1,u[o+3]=1}w=new V(u,n,n,I,T),w.magFilter=d,w.minFilter=d,w.needsUpdate=!0,m.uniforms.uInfo.value=w,R=new _(t,m),y.add(R),z.update(),a.setRenderTarget(p),a.render(y,v),a.setRenderTarget(g),a.render(y,v)}function A(){const{width:t,height:e}=f.value;return new ie(t,e,{minFilter:d,magFilter:d,format:I,type:T})}let P,M,B;function K(){P=new Y({side:re,uniforms:{time:{value:0},uPositions:{value:null},resolution:{value:new ae}},transparent:!0,vertexShader:he,fragmentShader:ze}),M=n**2;let t=new se,e=new Float32Array(M*3),i=new Float32Array(M*2);for(let r=0;r<n;r++)for(let o=0;o<n;o++){let s=r+o*n;e[s*3+0]=Math.random(),e[s*3+1]=Math.random(),e[s*3+2]=0,i[s*2+0]=r/n,i[s*2+1]=o/n}t.setAttribute("position",new k(e,3)),t.setAttribute("uv",new k(i,2)),P.uniforms.uPositions.value=c,B=new le(t,P),b.add(B)}return(t,e)=>(ge(),de(me,null,{default:fe(()=>e[0]||(e[0]=[O("div",{class:"webgl"},null,-1),O("div",{class:"debug"},null,-1)])),_:1}))}}),Te=Pe(Me,[["__scopeId","data-v-4b5e669f"]]);export{Te as default};

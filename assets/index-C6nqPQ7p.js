import{G as Fe,T as oe,af as Ue,V as be,ae as k,ag as F,ah as d,r as f,a as E,M as ae,y as Ce,p as Te,q as Ve,w as U,P as _e,S as re,W as ie,ai as O,d as Oe,e as se,B as Ae,ak as Se,al as Be,D as Ie,u as Re,O as Ge,b as je}from"./GLTFLoader-Cpm_xSlR.js";import{M as Le}from"./MeshSurfaceSampler-8_L5t4lS.js";import{G as Ne}from"./GPUComputationRenderer-CzXY8eDU.js";import{d as ke,f as Ee,p as qe,k as Xe,w as We,q as Ze,o as Je,h as le}from"./index-qyBmO-yZ.js";import{a as Ye}from"./_plugin-vue_export-helper-CQ7wvoWd.js";import"./Pass-8nf9LS6g.js";var He=`varying vec2 vUv;
uniform float time;

uniform sampler2D uTexture;
uniform sampler2D uVelocity;
attribute vec2 uvRef;

varying vec3 vNormal;
varying vec3 vViewPosition;

vec3 rotate3D(vec3 v, vec3 vel) {
      vec3 newpos = v;
      vec3 up = vec3(0, 1, 0);
      vec3 axis = normalize(cross(up, vel));
      float angle = acos(dot(up, normalize(vel)));
      newpos = newpos * cos(angle) + cross(axis, newpos) * sin(angle) + axis * dot(axis, newpos) * (1. - cos(angle));
      return newpos;
}

void main() {

    vUv = uv;
    vec4 color = texture2D( uTexture, uvRef );
    vec4 vel = texture2D( uVelocity, uvRef );
    vec3  newpos = color.xyz;

    vec3 transformed = position.xyz;
    if(length(vel.xyz) <0.0001){
        vel.xyz = vec3(0,0.0001,0.00001);
    }
    transformed.y *= max(1., length(vel.xyz)*1000.);
    transformed = rotate3D(transformed, vel.xyz);

    vNormal = rotate3D(normal, vel.xyz);

    
    
    mat4 instanceMat = instanceMatrix;

    instanceMat[3].x = newpos.x;
    instanceMat[3].y = newpos.y;
    instanceMat[3].z = newpos.z;

    vec4 mvPosition = modelViewMatrix *instanceMat* vec4( transformed, 1.0 );
    vViewPosition = - mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;

}`,Ke=`varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uMatcap;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
    vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, vNormal ), dot( y, vNormal ) ) * 0.495 + 0.5; 

    vec4 matcapcolor = texture2D( uMatcap, uv );

    vec4 color = texture2D( uTexture, vUv );
    gl_FragColor = vec4( vNormal, 1. );
    gl_FragColor = matcapcolor;
}`,ue=`uniform float uProgress;

uniform sampler2D uOriginalPosition;
uniform sampler2D uOriginalPosition1;
uniform vec3 uMouse;
uniform float uTime;
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
    vec2 vUv = gl_FragCoord.xy / resolution.xy;
    float offset = rand(vUv);
    vec3 position = texture2D( uCurrentPosition, vUv ).xyz;
    vec3 velocity = texture2D( uCurrentVelocity, vUv ).xyz;

    position += velocity;

    
    gl_FragColor = vec4( position, 1.);
}`,Qe=`uniform float uProgress;

uniform sampler2D uOriginalPosition;
uniform vec3 uMouse;
uniform float uTime;
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
    vec2 vUv = gl_FragCoord.xy / resolution.xy;
    float offset = rand(vUv);
    vec3 position = texture2D( uCurrentPosition, vUv ).xyz;
    vec3 original = texture2D( uOriginalPosition, vUv ).xyz;
    vec3 velocity = texture2D( uCurrentVelocity, vUv ).xyz;

    

    

    velocity *= 0.9;

    
    vec3 direction = normalize( original - position );
    float dist = length( original - position );
    if( dist > 0.01 ) {
        velocity += direction  * 0.0001;
    }
    

    
    float mouseDistance = distance( position, uMouse );
    float maxDistance = 0.3;
    if( mouseDistance < maxDistance ) {
        vec3 direction = normalize( position - uMouse );
        velocity += direction * ( 1.0 - mouseDistance / maxDistance ) * 0.01;
    }

    
    
    
    
    
    
    

    

    
    gl_FragColor = vec4(velocity, 1.);
}`,$e=`varying vec2 vUv;
uniform float time;
void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}`;const n=128,en=ke({__name:"index",setup(nn){const ce=new Fe;new oe;let q,h,b,c,X,M,W,A;function me(){({container:q,renderer:h,scene:b,camera:c,clock:X,viewPort:M,tick:W}=Re(document.querySelector(".webgl")))}function ve(){c.position.set(0,0,3.5)}function de(){A=new Ge(c,h.domElement),A.enableDamping=!0}function fe(){We(M,()=>{const{width:e,height:r}=M.value;c.aspect=e/r,c.updateProjectionMatrix(),h.setSize(e,r,!1)})}let Z;function pe(){Z=new je({container:document.querySelector(".debug")}),Ze(()=>Z.destroy)}Ee(()=>{me(),pe(),de(),fe(),ve(),xe(),W(()=>{const e=X.getElapsedTime();j&&(w.uniforms.time.value=e,u.compute(),A.update(),h.render(b,c),w.uniforms.uTexture.value=u.getCurrentRenderTarget(g).texture,w.uniforms.uVelocity.value=u.getCurrentRenderTarget(x).texture,p.uTime.value=e)})});const l=n*n,J=new Ue,S=new be;function Y(e,r,o){return(1-o)*e+o*r}const ge=e=>new Promise((r,o)=>{const t=new Image;t.crossOrigin="Anonymous",t.src=e,t.onload=()=>{r(t)},t.onerror=a=>{o(a)}});let P,H,B,K;function xe(){Promise.all([ce.loadAsync(new URL("/assets/suzanne-D-SAXalZ.glb",import.meta.url).href)]).then(([e])=>{P=e.scene.children[0],P.geometry.rotateX(-Math.PI/2),P.material=new k,H=new Le(P).build(),B=Q(),K=Q(),we(new URL("/texture/logo.png",import.meta.url).href),ye(),he(),Me(),ze()})}function Q(){const e=new Float32Array(4*l);for(let o=0;o<n;o++)for(let t=0;t<n;t++){const a=o*n+t;let i=Math.random()*Math.PI*2,m=Math.acos(Math.random()*2-1),v=Math.sin(m)*Math.cos(i),_=Math.sin(m)*Math.sin(i),s=Math.cos(m);e[4*a]=v,e[4*a+1]=_,e[4*a+2]=s,e[4*a+3]=(Math.random()-.5)*.01}let r=new F(e,n,n,d,f);return r.needsUpdate=!0,r}async function we(e){let r=await ge(e),o=200,t=document.createElement("canvas");t.width=o,t.height=o;let a=t.getContext("2d");a.drawImage(r,0,0,o,o);let i=a.getImageData(0,0,o,o).data,m=[];for(let s=0;s<i.length;s+=4){let z=s/4%o,y=Math.floor(s/4/o);i[s]<5&&m.push({x:z/o-.5,y:.5-y/o})}const v=new Float32Array(4*l);for(let s=0;s<n;s++)for(let z=0;z<n;z++){const y=s*n+z;let N=m[Math.floor(Math.random()*m.length)];Math.random()>.9&&(N={x:3*(Math.random()-.5),y:3*(Math.random()-.5)}),v[4*y]=N.x+(Math.random()-.5)*.01,v[4*y+1]=N.y+(Math.random()-.5)*.01,v[4*y+2]=(Math.random()-.5)*.01,v[4*y+3]=(Math.random()-.5)*.01}let _=new F(v,n,n,d,f);return _.needsUpdate=!0,_}let $,I,C,p,D;function ye(){$=new E(P.geometry,new ae),I=new E(new Ce(.01,32,32),new k),b.add(I),q.addEventListener("mousemove",e=>{console.log("%c Line:264 🍕 e","color:#f5ce50",e),S.x=e.offsetX/M.value.width*2-1,S.y=-(e.offsetY/M.value.height)*2+1,J.setFromCamera(S,c);const r=J.intersectObjects([$]);r.length>0&&(I.position.copy(r[0].point),C.uniforms.uMouse.value=r[0].point,p.uMouse.value=r[0].point,D.uMouse.value=r[0].point)})}let ee,ne,R,te;function he(){const e=new Float32Array(4*l);for(let o=0;o<n;o++)for(let t=0;t<n;t++){const a=o*n+t;e[4*a]=Y(-.5,.5,t/(n-1)),e[4*a+1]=Y(-.5,.5,o/(n-1)),e[4*a+2]=0,e[4*a+3]=1}ee=new F(e,n,n,d,f),ee.needsUpdate=!0,ne=new Te,R=new Ve(-1,1,1,-1,-2,2),R.position.z=1,R.lookAt(new U(0,0,0));let r=new _e(2,2,2,2);C=new ae({color:16711680,wireframe:!0}),C=new re({uniforms:{time:{value:0},uMouse:{value:new U(0,0,0)},uProgress:{value:0},uTime:{value:0},uCurrentPosition:{value:B},uOriginalPosition:{value:B},uOriginalPosition1:{value:K}},vertexShader:$e,fragmentShader:ue}),te=new E(r,C),ne.add(te),new ie(n,n,{minFilter:O,magFilter:O,format:d,type:f}),new ie(n,n,{minFilter:O,magFilter:O,format:d,type:f})}let u,T,g,x;function Me(){u=new Ne(n,n,h),T=Pe(),g=u.addVariable("uCurrentPosition",ue,T),x=u.addVariable("uCurrentVelocity",Qe,De()),u.setVariableDependencies(g,[g,x]),u.setVariableDependencies(x,[g,x]),p=g.material.uniforms,D=x.material.uniforms,p.uTime={value:0},D.uTime={value:0},p.uMouse={value:new U(0,0,0)},D.uMouse={value:new U(0,0,0)},p.uOriginalPosition={value:T},D.uOriginalPosition={value:T},u.init()}const V=new U;function Pe(){const e=new Float32Array(4*l);for(let o=0;o<n;o++)for(let t=0;t<n;t++){const a=o*n+t;H.sample(V),e[4*a]=V.x,e[4*a+1]=V.y,e[4*a+2]=V.z,e[4*a+3]=(Math.random()-.5)*.01}let r=new F(e,n,n,d,f);return r.needsUpdate=!0,r}function De(){const e=new Float32Array(4*l);for(let o=0;o<n;o++)for(let t=0;t<n;t++){const a=o*n+t;e[4*a]=0,e[4*a+1]=0,e[4*a+2]=0,e[4*a+3]=0}let r=new F(e,n,n,d,f);return r.needsUpdate=!0,r}let G,w,j,L;function ze(){G=new Oe;const e=new Float32Array(l*3),r=new Float32Array(l*2);for(let t=0;t<n;t++)for(let a=0;a<n;a++){const i=t*n+a;e[3*i]=a/n-.5,e[3*i+1]=t/n-.5,e[3*i+2]=0,r[2*i]=a/(n-1),r[2*i+1]=t/(n-1)}G.setAttribute("position",new se(e,3)),G.setAttribute("uv",new se(r,2)),w=new k,w=new re({uniforms:{time:{value:0},uTexture:{value:e},uVelocity:{value:null},uMatcap:{value:new oe().load(new URL("/assets/matcap1-BXMtZ2rJ.png",import.meta.url).href)}},vertexShader:He,fragmentShader:Ke}),L=new Ae(.1,.01,.01),j=new Se(L,w,l);let o=new Float32Array(l*2);for(let t=0;t<n;t++)for(let a=0;a<n;a++){const i=t*n+a;o[2*i]=a/(n-1),o[2*i+1]=t/(n-1)}L.setAttribute("uvRef",new Be(o,2)),b.add(j)}return(e,r)=>(Je(),qe(Ie,null,{default:Xe(()=>r[0]||(r[0]=[le("div",{class:"webgl"},null,-1),le("div",{class:"debug"},null,-1)])),_:1}))}}),un=Ye(en,[["__scopeId","data-v-615dfeb5"]]);export{un as default};

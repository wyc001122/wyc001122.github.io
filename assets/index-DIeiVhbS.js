import{G as Ce,T as le,w as m,af as De,V as Se,M as j,aj as be,ag as H,ah as x,r as M,a as O,y as ue,ae as de,p as _e,q as Ae,d as me,e as G,S as ce,f as ve,W as I,ai as f,P as ze,B as Le,D as Be,u as je,O as Oe,b as Ge}from"./GLTFLoader-Cpm_xSlR.js";import{d as Ie,f as Ve,p as ke,k as Ee,w as We,q as qe,o as Ne,h as fe}from"./index-qyBmO-yZ.js";import{a as He}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var Xe=`varying vec2 vUv;
varying float vLife;
uniform float time;

uniform sampler2D uTexture;

void main() {

    vUv = uv;
    vec3 newpos = position;
    vec4 simPosition = texture2D( uTexture, vUv );
    newpos.xyz = simPosition.xyz;
    vLife = simPosition.w;
    
    

    vec4 mvPosition = modelViewMatrix * vec4( newpos, 1.0 );

    gl_PointSize =  5.*( 2.0 / -mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

}`,Ye=`varying vec2 vUv;
uniform sampler2D uTexture;
varying float vLife;
void main() {
    if(vLife<0.001) discard;
    vec4 color = texture2D( uTexture, vUv );
    gl_FragColor = vec4( 1.,1.,1., 0.5*vLife );
    
}`,Je=`varying vec2 vUv;
uniform float uProgress;
uniform int uRenderMode;
uniform vec3 uSource;
uniform sampler2D uCurrentPosition;
uniform sampler2D uDirections;
uniform vec3 uMouse;
uniform float uTime;
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
    float offset = rand(vUv);
    vec3 position = texture2D( uCurrentPosition, vUv ).xyz;
    vec4 direction = texture2D( uDirections, vUv );

    if(uRenderMode==0){
        float life = 1. - clamp( (uTime - direction.a)/15., 0.,1.);
        float speedlife = clamp(life,0.1,1.);
        position.xyz = position.xyz + speedlife*direction.xyz * 0.01 + vec3(0.,-1,0.)*0.005 + vec3(0.,0.,-1.)*0.01;

        gl_FragColor = vec4( position, life);
    }

    
    if(uRenderMode==1){
        float rnd1 = rand(vUv) - 0.5;
        float rnd2 = rand(vUv + vec2(0.1,0.1)) - 0.5;
        float rnd3 = rand(vUv + vec2(0.3,0.3)) - 0.5;
        gl_FragColor = vec4( uSource + vec3(rnd1,rnd2,rnd3)*0.9, uTime);
    }

    
    if(uRenderMode==2){
        float rnd1 = rand(vUv) - 0.5;
        float rnd2 = rand(vUv + vec2(0.1,0.1)) - 0.5;
        float rnd3 = rand(vUv + vec2(0.3,0.3)) - 0.5;
        gl_FragColor = vec4( uSource + vec3(rnd1,rnd2,rnd3)*0.9, 1.);
    }

    
}`,Ke=`varying vec2 vUv;
uniform float time;
void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = 1.;
    gl_Position = projectionMatrix * mvPosition;
}`;const Qe=Ie({__name:"index",setup(Ze){const pe=new Ce;new le;let X,s,T,p,Y,C,J,V;function we(){({container:X,renderer:s,scene:T,camera:p,clock:Y,viewPort:C,tick:J}=je(document.querySelector(".webgl")))}function ge(){p.position.set(0,0,2),s.setClearColor(2236962,1)}function he(){V=new Oe(p,s.domElement),V.enableDamping=!0}function xe(){We(C,()=>{const{width:t,height:n}=C.value;p.aspect=t/n,p.updateProjectionMatrix(),s.setSize(t,n,!1)})}let K;function Me(){K=new Ge({container:document.querySelector(".debug")}),qe(()=>K.destroy)}let Q=!1,D=0;Ve(()=>{we(),Me(),he(),xe(),ge(),Pe(),J(()=>{const t=Y.getElapsedTime();if(!se)return;V.update(),Q||(Q=!0,i.uniforms.uRenderMode.value=1,i.uniforms.uTime.value=-100,i.uniforms.uSource.value=new m(0,-1,0),s.setRenderTarget(F),s.render(w,v),i.uniforms.uDirections.value=F.texture,i.uniforms.uRenderMode.value=2,i.uniforms.uSource.value=new m(0,0,0),s.setRenderTarget(q),s.render(w,v),i.uniforms.uCurrentPosition.value=q.texture),R.uniforms.time.value=t,i.uniforms.uDirections.value=F.texture,i.uniforms.uRenderMode.value=0,y.setDrawRange(0,c),s.setRenderTarget(g),s.render(w,v);let n=15;s.autoClear=!1,$.forEach(r=>{r.mesh.getWorldPosition(S),k=S.clone();let a=Math.random()>.5;r.dir=S.clone().sub(r.prev).multiplyScalar(100),y.setDrawRange(D,n),i.uniforms.uRenderMode.value=1,i.uniforms.uDirections.value=null,i.uniforms.uCurrentPosition.value=null,a&&(r.dir.x*=-1),i.uniforms.uSource.value=r.dir,s.setRenderTarget(F),s.render(w,v),i.uniforms.uRenderMode.value=2,a&&(k.x*=-1),i.uniforms.uSource.value=k,s.setRenderTarget(g),s.render(w,v),D+=n,D>c&&(D=0),r.prev=S.clone()}),s.autoClear=!0,s.setRenderTarget(null),s.render(T,p);const o=g;g=z,z=o,R.uniforms.uTexture.value=g.texture,i.uniforms.uCurrentPosition.value=z.texture,i.uniforms.uTime.value=t,ie.material.map=g.texture,A&&A.update(.01)})});let S=new m(0,0,0),k=new m(0,0,0),e=512,c=e*e,Z=new De,E=new Se,$=[];function b(t,n,o){return(1-o)*t+o*n}const ye=t=>new Promise((n,o)=>{const r=new Image;r.crossOrigin="Anonymous",r.src=t,r.onload=()=>{n(r)},r.onerror=a=>{o(a)}});let _,A,ee;function Pe(){Promise.all([pe.loadAsync(new URL("/assets/bird-s9V7nSkI.glb",import.meta.url).href)]).then(([t])=>{_=t.scene,T.add(_),_.traverse(n=>{n.isMesh&&n.geometry.attributes.position.array.length<120&&($.push({mesh:n,prev:n.position.clone(),dir:new m(0,0,0)}),n.visible=!1,n.material=new j({color:16711680}))}),A=new be(_),A.clipAction(t.animations[0]).play(),ee=te(),te(),Te(new URL("/texture/logo.png",import.meta.url).href),Fe(),Re(),Ue()})}function te(){const t=new Float32Array(4*c);for(let o=0;o<e;o++)for(let r=0;r<e;r++){const a=o*e+r;let u=Math.random()*Math.PI*2,l=Math.acos(Math.random()*2-1),h=Math.sin(l)*Math.cos(u),B=Math.sin(l)*Math.sin(u),d=Math.cos(l);t[4*a]=h,t[4*a+1]=B,t[4*a+2]=d,t[4*a+3]=(Math.random()-.5)*.01}let n=new H(t,e,e,x,M);return n.needsUpdate=!0,n}async function Te(t){let n=await ye(t),o=200,r=document.createElement("canvas");r.width=o,r.height=o;let a=r.getContext("2d");a.drawImage(n,0,0,o,o);let u=a.getImageData(0,0,o,o).data,l=[];for(let d=0;d<u.length;d+=4){let U=d/4%o,P=Math.floor(d/4/o);u[d]<5&&l.push({x:U/o-.5,y:.5-P/o})}const h=new Float32Array(4*c);for(let d=0;d<e;d++)for(let U=0;U<e;U++){const P=d*e+U;let N=l[Math.floor(Math.random()*l.length)];Math.random()>.9&&(N={x:3*(Math.random()-.5),y:3*(Math.random()-.5)}),h[4*P]=N.x+(Math.random()-.5)*.01,h[4*P+1]=N.y+(Math.random()-.5)*.01,h[4*P+2]=(Math.random()-.5)*.01,h[4*P+3]=(Math.random()-.5)*.01}let B=new H(h,e,e,x,M);return B.needsUpdate=!0,B}let ne,W,i;function Fe(){ne=new O(new ue(1,30,30),new j),W=new O(new ue(.01,32,32),new de),T.add(W),X.addEventListener("mousemove",t=>{const{viewWidth:n,viewHeight:o}=C.value;E.x=t.offsetX/n*2-1,E.y=-(t.offsetY/o)*2+1,Z.setFromCamera(E,p);const r=Z.intersectObjects([ne]);r.length>0&&(console.log(r[0].point),W.position.copy(r[0].point),i.uniforms.uMouse.value=r[0].point)})}let re,w,v,oe,F,g,q,z,y;function Re(){const t=new Float32Array(4*c);for(let a=0;a<e;a++)for(let u=0;u<e;u++){const l=a*e+u;t[4*l]=b(-.5,.5,u/(e-1)),t[4*l+1]=b(-.5,.5,a/(e-1)),t[4*l+2]=0,t[4*l+3]=1}re=new H(t,e,e,x,M),re.needsUpdate=!0,w=new _e;let n=e/2+.01;v=new Ae(-n,n,n,-n,-2,2),v.position.z=1,v.lookAt(new m(0,0,0)),y=new me;let o=new Float32Array(c*3),r=new Float32Array(c*2);for(let a=0;a<e;a++)for(let u=0;u<e;u++){const l=a*e+u;o[3*l]=e*b(-.5,.5,u/(e-1)),o[3*l+1]=e*b(-.5,.5,a/(e-1)),o[3*l+2]=0,r[2*l]=u/(e-1),r[2*l+1]=a/(e-1)}y.setAttribute("position",new G(o,3)),y.setAttribute("uv",new G(r,2)),i=new ce({uniforms:{time:{value:0},uMouse:{value:new m(0,0,0)},uProgress:{value:0},uTime:{value:0},uSource:{value:new m(0,0,0)},uRenderMode:{value:0},uCurrentPosition:{value:ee},uDirections:{value:null}},vertexShader:Ke,fragmentShader:Je}),oe=new ve(y,i),w.add(oe),g=new I(e,e,{minFilter:f,magFilter:f,format:x,type:M}),F=new I(e,e,{minFilter:f,magFilter:f,format:x,type:M}),q=new I(e,e,{minFilter:f,magFilter:f,format:x,type:M}),z=new I(e,e,{minFilter:f,magFilter:f,format:x,type:M})}let L,R,ae,ie,se;function Ue(){L=new me;const t=new Float32Array(c*3),n=new Float32Array(c*2);for(let o=0;o<e;o++)for(let r=0;r<e;r++){const a=o*e+r;t[3*a]=r/e-.5,t[3*a+1]=o/e-.5,t[3*a+2]=0,n[2*a]=r/(e-1),n[2*a+1]=o/(e-1)}L.setAttribute("position",new G(t,3)),L.setAttribute("uv",new G(n,2)),R=new de,R=new ce({uniforms:{time:{value:0},uTexture:{value:t}},vertexShader:Xe,fragmentShader:Ye,depthWrite:!1,depthTest:!1,transparent:!0}),ae=new ve(L,R),T.add(ae),ie=new O(new ze(1,1,1,1),new j({map:new le().load(new URL("/texture/logo.png",import.meta.url).href)})),se=new O(new Le(.1,.1,.1),new j({color:16711680})),new m(0,0,0),new m(0,0,0)}return(t,n)=>(Ne(),ke(Be,null,{default:Ee(()=>n[0]||(n[0]=[fe("div",{class:"webgl"},null,-1),fe("div",{class:"debug"},null,-1)])),_:1}))}}),nt=He(Qe,[["__scopeId","data-v-5ae758ec"]]);export{nt as default};

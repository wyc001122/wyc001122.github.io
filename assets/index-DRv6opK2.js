import{G as se,T as le,af as ue,V as ce,a as j,P as E,M as me,y as de,ae as ve,ag as N,ah as T,r as C,p as fe,q as ge,S as W,U as m,w as pe,W as $,ai as b,d as xe,e as H,f as we,D as ye,u as he,O as Pe,b as Me}from"./GLTFLoader-Cpm_xSlR.js";import{d as De,f as Te,p as Ce,k as be,w as _e,q as Ue,o as Fe,h as X}from"./index-qyBmO-yZ.js";import{a as Oe}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var Se=`varying vec2 vUv;

uniform sampler2D uTexture;

void main() {

    vUv = uv;\r
    vec3 newpos = position;\r
    vec4 color = texture2D( uTexture, vUv );\r
    newpos.xy = color.xy;\r
    
    

    vec4 mvPosition = modelViewMatrix * vec4( newpos, 1.0 );

    gl_PointSize =  ( 2.0 / -mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

}`,Ae=`varying vec2 vUv;\r
uniform sampler2D uTexture;\r
void main() {\r
    vec4 color = texture2D( uTexture, vUv );\r
    gl_FragColor = vec4( 1.,1.,1., .1 );\r
    
}`,Be=`varying vec2 vUv;\r
void main() {\r
    vUv = uv;\r
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\r
    gl_Position = projectionMatrix * mvPosition;\r
}`,je=`varying vec2 vUv;\r
uniform float uProgress;\r
uniform sampler2D uCurrentPosition;\r
uniform sampler2D uOriginalPosition;\r
uniform sampler2D uOriginalPosition1;\r
uniform vec3 uMouse;\r
void main() {\r
    vec2 position = texture2D( uCurrentPosition, vUv ).xy;\r
    vec2 original = texture2D( uOriginalPosition, vUv ).xy;\r
    vec2 original1 = texture2D( uOriginalPosition1, vUv ).xy;

    vec2 velocity = texture2D( uCurrentPosition, vUv ).zw;

    vec2 finalOriginal = mix(original, original1, uProgress);

    velocity *= 0.99;

    
    vec2 direction = normalize( finalOriginal - position );\r
    float dist = length( finalOriginal - position );\r
    if( dist > 0.01 ) {\r
        velocity += direction  * 0.0001;\r
    }\r
    \r

    
    float mouseDistance = distance( position, uMouse.xy );\r
    float maxDistance = 0.1;\r
    if( mouseDistance < maxDistance ) {\r
        vec2 direction = normalize( position - uMouse.xy );\r
        velocity += direction * ( 1.0 - mouseDistance / maxDistance ) * 0.001;\r
    }\r

    position.xy += velocity;

    \r
    gl_FragColor = vec4( position, velocity);\r
}`;const r=256,Ge=De({__name:"index",setup(Re){new se,new le;let G,l,v,c,R,f,I,_;function Y(){({container:G,renderer:l,scene:v,camera:c,clock:R,viewPort:f,tick:I}=he(document.querySelector(".webgl")))}function J(){c.position.set(0,0,2),l.setClearColor(2236962,1)}function K(){_=new Pe(c,l.domElement),_.enableDamping=!0}function Q(){_e(f,()=>{const{width:e,height:t}=f.value;c.aspect=e/t,c.updateProjectionMatrix(),l.setSize(e,t,!1)})}let U,Z={progress:0};function ee(){U=new Me({container:document.querySelector(".debug")}),Ue(()=>U.destroy),U.add(Z,"progress",0,1,.001).onChange(e=>{p.material.uniforms.uProgress.value=e})}let F,h;const g=r*r;let p,x,P,te,O,M,D,S,k;Te(async()=>{Y(),ee(),K(),Q(),J(),re(),[S,k]=await oe(),ae(),ie(),I(()=>{const e=R.getElapsedTime();D.material.uniforms.uTime.value=e,l.setRenderTarget(x),l.render(O,M),l.setRenderTarget(null),l.render(v,c),[x,P]=[P,x],D.material.uniforms.uTexture.value=x.texture,p.material.uniforms.uCurrentPosition.value=P.texture,_.update(),l.render(v,c)})});function V(e,t,o){return(1-o)*e+o*t}function ne(e){return new Promise((t,o)=>{const a=new Image;a.crossOrigin="Anonymous",a.src=e,a.onload=()=>{t(a)},a.onerror=n=>{o(n)}})}async function L(e,t,o){let a=await ne(e),n=200,i=document.createElement("canvas");i.width=n,i.height=n;let s=i.getContext("2d");s.drawImage(a,0,0,n,n);let q=s.getImageData(0,0,n,n).data,A=[];for(let u=0;u<q.length;u+=4){let y=u/4%n,d=Math.floor(u/4/n);q[u]<5&&A.push({x:y/n-.5,y:.5-d/n})}const w=new Float32Array(4*o);for(let u=0;u<t;u++)for(let y=0;y<t;y++){const d=u*t+y;let B=A[Math.floor(Math.random()*A.length)];Math.random()>.9&&(B={x:3*(Math.random()-.5),y:3*(Math.random()-.5)}),w[4*d]=B.x+(Math.random()-.5)*.01,w[4*d+1]=B.y+(Math.random()-.5)*.01,w[4*d+2]=(Math.random()-.5)*.01,w[4*d+3]=(Math.random()-.5)*.01}const z=new N(w,t,t,T,C);return z.needsUpdate=!0,z}function re(){F=new ue,h=new ce;const e=new j(new E(10,10),new me({transparent:!0,color:16777215,opacity:.5})),t=new j(new de(.01,32,32),new ve);v.add(t),G.addEventListener("mousemove",o=>{h.x=o.offsetX/f.value.viewWidth*2-1,h.y=-(o.offsetY/f.value.viewHeight)*2+1,F.setFromCamera(h,c);const a=F.intersectObject(e);a.length>0&&(t.position.copy(a[0].point),p.material.uniforms.uMouse.value=a[0].point)})}function oe(){return Promise.all([L("/texture/logo.png",r,g),L("/texture/super.png",r,g)])}function ae(){const e=new Float32Array(g*4);for(let n=0;n<e.length;n++)for(let i=0;i<r;i++){const s=n*r+i;e[4*s]=V(-.5,.5,i/(r-1)),e[4*s+1]=V(-.5,.5,n/(r-1)),e[4*s+2]=0,e[4*s+3]=1}const t=new N(e,r,r,T,C);t.needsUpdate=!0,O=new fe,M=new ge(-1,1,1,-1,-2,2),M.position.set(0,0,1),M.lookAt(0,0,0);const o=new E(2,2,2,2),a=new W({uniforms:{uMouse:new m(new pe(0,0,0)),uTime:new m(0),uProgress:new m(0),uCurrentPosition:new m(S),uOriginalPosition:new m(S),uOriginalPosition1:new m(k)},vertexShader:Be,fragmentShader:je});p=new j(o,a),O.add(p),x=new $(r,r,{minFilter:b,magFilter:b,format:T,type:C}),P=new $(r,r,{minFilter:b,magFilter:b,format:T,type:C})}function ie(){const e=new xe,t=new Float32Array(g*3),o=new Float32Array(g*2);for(let n=0;n<r;n++)for(let i=0;i<r;i++){const s=n*r+i;t[3*s+0]=i/r-.5,t[3*s+1]=n/r-.5,t[3*s+2]=0,o[2*s+0]=i/(r-1),o[2*s+1]=n/(r-1)}e.setAttribute("position",new H(t,3)),e.setAttribute("uv",new H(o,2));const a=new W({uniforms:{uTime:new m(0),uTexture:new m(te)},vertexShader:Se,fragmentShader:Ae});D=new we(e,a),v.add(D)}return(e,t)=>(Fe(),Ce(ye,null,{default:be(()=>t[0]||(t[0]=[X("div",{class:"webgl"},null,-1),X("div",{class:"debug"},null,-1)])),_:1}))}}),Le=Oe(Ge,[["__scopeId","data-v-94a6cf5e"]]);export{Le as default};

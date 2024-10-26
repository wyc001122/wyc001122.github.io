import{G as se,T as le,af as ue,V as ce,a as B,P as N,M as me,y as de,ae as fe,ag as W,ah as b,r as C,p as ve,q as ge,S as z,U as m,w as pe,W as $,ai as D,d as we,e as H,f as xe,D as he,u as ye,O as Pe,b as Me}from"./GLTFLoader-Cpm_xSlR.js";import{d as Te,f as be,p as Ce,k as De,w as _e,q as Fe,o as Ue,h as X}from"./index-qyBmO-yZ.js";import{a as Oe}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var Se=`varying vec2 vUv;\r
uniform float time;

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
    gl_FragColor = vec4( 1.,1.,1., .3 );\r
    
}`,Ge=`varying vec2 vUv;\r
uniform float time;\r
void main() {\r
    vUv = uv;\r
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\r
    gl_Position = projectionMatrix * mvPosition;\r
}`,Be=`varying vec2 vUv;\r
uniform float uProgress;\r
uniform sampler2D uCurrentPosition;\r
uniform sampler2D uOriginalPosition;\r
uniform sampler2D uOriginalPosition1;\r
uniform vec3 uMouse;\r
void main() {\r
    vec2 position = texture2D( uCurrentPosition, vUv ).xy;\r
    vec2 original = texture2D( uOriginalPosition, vUv ).xy;\r
    vec2 original1 = texture2D( uOriginalPosition1, vUv ).xy;

    vec2 finalOriginal = mix(original, original1, uProgress);

    vec2 force = finalOriginal - uMouse.xy;

    float len = length(force);\r
    float forceFactor = 1./max(1.,len*50.);\r

    vec2 positionToGo = finalOriginal + normalize(force)*forceFactor *0.3;

    position.xy += (positionToGo - position.xy) * 0.05;

    

    \r
    gl_FragColor = vec4( position, 0.0, 1.0);\r
}`;const r=256,je=Te({__name:"index",setup(Re){new se,new le;let j,l,f,c,R,v,I,_;function Y(){({container:j,renderer:l,scene:f,camera:c,clock:R,viewPort:v,tick:I}=ye(document.querySelector(".webgl")))}function J(){c.position.set(0,0,2),l.setClearColor(2236962,1)}function K(){_=new Pe(c,l.domElement),_.enableDamping=!0}function Q(){_e(v,()=>{const{width:e,height:t}=v.value;c.aspect=e/t,c.updateProjectionMatrix(),l.setSize(e,t,!1)})}let F,Z={progress:0};function ee(){F=new Me({container:document.querySelector(".debug")}),Fe(()=>F.destroy),F.add(Z,"progress",0,1,.001).onChange(e=>{p.material.uniforms.uProgress.value=e})}let U,y;const g=r*r;let p,w,P,te,O,M,T,S,k;be(async()=>{Y(),ee(),K(),Q(),J(),re(),[S,k]=await oe(),ae(),ie(),I(()=>{const e=R.getElapsedTime();T.material.uniforms.uTime.value=e,l.setRenderTarget(w),l.render(O,M),l.setRenderTarget(null),l.render(f,c),[w,P]=[P,w],T.material.uniforms.uTexture.value=w.texture,p.material.uniforms.uCurrentPosition.value=P.texture,_.update(),l.render(f,c)})});function V(e,t,o){return(1-o)*e+o*t}function ne(e){return new Promise((t,o)=>{const a=new Image;a.crossOrigin="Anonymous",a.src=e,a.onload=()=>{t(a)},a.onerror=n=>{o(n)}})}async function L(e,t,o){let a=await ne(e),n=200,i=document.createElement("canvas");i.width=n,i.height=n;let s=i.getContext("2d");s.drawImage(a,0,0,n,n);let q=s.getImageData(0,0,n,n).data,A=[];for(let u=0;u<q.length;u+=4){let h=u/4%n,d=Math.floor(u/4/n);q[u]<5&&A.push({x:h/n-.5,y:.5-d/n})}const x=new Float32Array(4*o);for(let u=0;u<t;u++)for(let h=0;h<t;h++){const d=u*t+h;let G=A[Math.floor(Math.random()*A.length)];Math.random()>.9&&(G={x:3*(Math.random()-.5),y:3*(Math.random()-.5)}),x[4*d]=G.x+(Math.random()-.5)*.01,x[4*d+1]=G.y+(Math.random()-.5)*.01,x[4*d+2]=0,x[4*d+3]=1}let E=new W(x,t,t,b,C);return E.needsUpdate=!0,E}function re(){U=new ue,y=new ce;const e=new B(new N(10,10),new me({transparent:!0,color:16777215,opacity:.5})),t=new B(new de(.01,32,32),new fe);f.add(t),j.addEventListener("mousemove",o=>{y.x=o.offsetX/v.value.viewWidth*2-1,y.y=-(o.offsetY/v.value.viewHeight)*2+1,U.setFromCamera(y,c);const a=U.intersectObject(e);a.length>0&&(t.position.copy(a[0].point),p.material.uniforms.uMouse.value=a[0].point)})}function oe(){return Promise.all([L("/texture/logo.png",r,g),L("/texture/super.png",r,g)])}function ae(){const e=new Float32Array(g*4);for(let n=0;n<e.length;n++)for(let i=0;i<r;i++){const s=n*r+i;e[4*s]=V(-.5,.5,i/(r-1)),e[4*s+1]=V(-.5,.5,n/(r-1)),e[4*s+2]=0,e[4*s+3]=1}const t=new W(e,r,r,b,C);t.needsUpdate=!0,O=new ve,M=new ge(-1,1,1,-1,-2,2),M.position.set(0,0,1),M.lookAt(0,0,0);const o=new N(2,2,2,2),a=new z({uniforms:{uMouse:new m(new pe(0,0,0)),uTime:new m(0),uProgress:new m(0),uCurrentPosition:new m(S),uOriginalPosition:new m(S),uOriginalPosition1:new m(k)},vertexShader:Ge,fragmentShader:Be});p=new B(o,a),O.add(p),w=new $(r,r,{minFilter:D,magFilter:D,format:b,type:C}),P=new $(r,r,{minFilter:D,magFilter:D,format:b,type:C})}function ie(){const e=new we,t=new Float32Array(g*3),o=new Float32Array(g*2);for(let n=0;n<r;n++)for(let i=0;i<r;i++){const s=n*r+i;t[3*s+0]=i/r-.5,t[3*s+1]=n/r-.5,t[3*s+2]=0,o[2*s+0]=i/(r-1),o[2*s+1]=n/(r-1)}e.setAttribute("position",new H(t,3)),e.setAttribute("uv",new H(o,2));const a=new z({uniforms:{uTime:new m(0),uTexture:new m(te)},vertexShader:Se,fragmentShader:Ae});T=new xe(e,a),f.add(T)}return(e,t)=>(Ue(),Ce(he,null,{default:De(()=>t[0]||(t[0]=[X("div",{class:"webgl"},null,-1),X("div",{class:"debug"},null,-1)])),_:1}))}}),Le=Oe(je,[["__scopeId","data-v-631cf1eb"]]);export{Le as default};

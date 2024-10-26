import{G as $,T as H,V as X,a as P,P as G,M as Y,y as J,ae as K,ag as Q,ah as _,r as C,p as Z,q as ee,S as B,U as c,w as ne,W as O,ai as y,d as te,e as R,f as re,D as oe,u as ae,O as ie,b as se,af as ue}from"./GLTFLoader-Cpm_xSlR.js";import{d as le,f as ce,p as me,k as ve,w as fe,q as de,o as pe,h as j}from"./index-qyBmO-yZ.js";import{a as we}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var ge=`varying vec2 vUv;\r
uniform float uTime;

uniform sampler2D uTexture;

void main() {

    vUv = uv;\r
    vec3 newpos = position;\r
    vec4 color = texture2D( uTexture, vUv );\r
    newpos.xy = color.xy;\r
    
    

    vec4 mvPosition = modelViewMatrix * vec4( newpos, 1.0 );

    gl_PointSize =  ( 10.0 / -mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

}`,xe=`varying vec2 vUv;\r
uniform sampler2D uTexture;\r
void main() {\r
    vec4 color = texture2D(uTexture, vUv);\r
    gl_FragColor = vec4(1., 1., 1., 1.0);\r
}`,ye=`varying vec2 vUv;\r
void main() {\r
    vUv = uv;\r
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\r
    gl_Position = projectionMatrix * mvPosition;\r
}`,he=`varying vec2 vUv;

uniform sampler2D uCurrentPosition; 
uniform sampler2D uOriginalPosition; 
uniform vec3 uMouse; 

void main() {\r
    float radius = 0.01;\r
    
    vec2 position = texture2D(uCurrentPosition, vUv).xy;\r
    
    vec2 original = texture2D(uOriginalPosition, vUv).xy;

    
    vec2 force = original - uMouse.xy;

    
    float len = length(force) * 150.;\r
    
    float forceFactor = 1. / max(1., len);

    
    vec2 positionToGo = original + normalize(force) * forceFactor * 0.6;

    
    position.xy += (positionToGo - position.xy) * 0.05;

    
    gl_FragColor = vec4(position, 0.0, 1.0);\r
}`;const t=32,Te=le({__name:"index",setup(be){new $,new H;let S,s,m,u,F,v,D,h;function k(){({container:S,renderer:s,scene:m,camera:u,clock:F,viewPort:v,tick:D}=ae(document.querySelector(".webgl")))}function z(){u.position.set(0,0,2),s.setClearColor(2236962,1)}function V(){h=new ie(u,s.domElement),h.enableDamping=!0}function L(){fe(v,()=>{const{width:e,height:n}=v.value;u.aspect=e/n,u.updateProjectionMatrix(),s.setSize(e,n,!1)})}let U;function q(){U=new se({container:document.querySelector(".debug")}),de(()=>U.destroy)}let T,d;const b=t*t;let p,f,w,N,M,g,x;ce(()=>{k(),q(),V(),L(),z(),E(),W(),I(),D(()=>{const e=F.getElapsedTime();x.material.uniforms.uTime.value=e,s.setRenderTarget(f),s.render(M,g),s.setRenderTarget(null),s.render(m,u),[f,w]=[w,f],x.material.uniforms.uTexture.value=f.texture,p.material.uniforms.uCurrentPosition.value=w.texture,h.update(),s.render(m,u)})});function A(e,n,r){return(1-r)*e+r*n}function E(){T=new ue,d=new X;const e=new P(new G(10,10),new Y({transparent:!0,color:16777215,opacity:.5})),n=new P(new J(.01,32,32),new K);m.add(n),S.addEventListener("mousemove",r=>{d.x=r.offsetX/v.value.viewWidth*2-1,d.y=-(r.offsetY/v.value.viewHeight)*2+1,T.setFromCamera(d,u);const l=T.intersectObject(e);l.length>0&&(n.position.copy(l[0].point),p.material.uniforms.uMouse.value=l[0].point)})}function W(){const e=new Float32Array(b*4);for(let o=0;o<e.length;o++)for(let a=0;a<t;a++){const i=o*t+a;e[4*i]=A(-.5,.5,a/(t-1)),e[4*i+1]=A(-.5,.5,o/(t-1)),e[4*i+2]=0,e[4*i+3]=1}const n=new Q(e,t,t,_,C);n.needsUpdate=!0,M=new Z,g=new ee(-1,1,1,-1,-2,2),g.position.set(0,0,1),g.lookAt(0,0,0);const r=new G(2,2,2,2),l=new B({uniforms:{uMouse:new c(new ne(0,0,0)),uTime:new c(0),uCurrentPosition:new c(n),uOriginalPosition:new c(n)},vertexShader:ye,fragmentShader:he});p=new P(r,l),M.add(p),f=new O(t,t,{minFilter:y,magFilter:y,format:_,type:C}),w=new O(t,t,{minFilter:y,magFilter:y,format:_,type:C})}function I(){const e=new te,n=new Float32Array(b*3),r=new Float32Array(b*2);for(let o=0;o<t;o++)for(let a=0;a<t;a++){const i=o*t+a;n[3*i+0]=a/t-.5,n[3*i+1]=o/t-.5,n[3*i+2]=0,r[2*i+0]=a/(t-1),r[2*i+1]=o/(t-1)}e.setAttribute("position",new R(n,3)),e.setAttribute("uv",new R(r,2));const l=new B({uniforms:{uTime:new c(0),uTexture:new c(N)},vertexShader:ge,fragmentShader:xe});x=new re(e,l),m.add(x)}return(e,n)=>(pe(),me(oe,null,{default:ve(()=>n[0]||(n[0]=[j("div",{class:"webgl"},null,-1),j("div",{class:"debug"},null,-1)])),_:1}))}}),Ce=we(Te,[["__scopeId","data-v-e7691a3a"]]);export{Ce as default};

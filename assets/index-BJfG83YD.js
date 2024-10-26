import{G as X,T as q,R as z,D as j,u as Y,C as W,O as J,b as K,a as I,aq as Q,d as Z,e as C,S as $,c as ee}from"./GLTFLoader-Cpm_xSlR.js";import{d as te,f as oe,p as ne,k as ae,w as re,q as se,o as ie,h as E}from"./index-qyBmO-yZ.js";import{a as ce}from"./_plugin-vue_export-helper-CQ7wvoWd.js";const w=.1,ue=.8,le=.6,A=5,me=.1,fe=te({__name:"index",setup(de){new X;const S=new q;let B,d,v,c,M,x,_,y;function G(){({container:B,renderer:d,scene:v,camera:c,clock:M,viewPort:x,tick:_}=Y(document.querySelector(".webgl")))}function L(){c.position.set(5,10,5),v.background=new W("#ffffff")}function N(){y=new J(c,d.domElement),y.enableDamping=!0}function U(){re(x,()=>{const{width:e,height:o}=x.value;c.aspect=e/o,c.updateProjectionMatrix(),d.setSize(e,o,!1)})}let D;function V(){D=new K({container:document.querySelector(".debug")}),se(()=>D.destroy)}const T=S.load("https://z2586300277.github.io/3d-file-server/threeExamples/shader/cloud.jpg");T.wrapS=T.wrapT=z;function P(e,o,n,t,r){return(e-o)*(r-t)/(n-o)+t}oe(()=>{G(),V(),N(),U(),L(),R(),_(()=>{const e=M.getElapsedTime();b.material.uniforms.uTime.value=e,y.update(),d.render(v,c)})});function k(e,o=0){const n=ue+Math.random()*le,t=o*A,r=Math.random()*Math.PI*2,s=[Math.sin(r),0,-Math.cos(r)],u=Math.random()*Math.PI*2,p=[Math.sin(u),0,-Math.cos(u)],g=s.map((a,i)=>a*(w/2)*1+e[i]),h=s.map((a,i)=>a*(w/2)*-1+e[i]),l=s.map((a,i)=>a*(w/4)*1+e[i]),m=s.map((a,i)=>a*(w/4)*-1+e[i]),f=p.map((a,i)=>a*me+e[i]);return l[1]+=n/2,m[1]+=n/2,f[1]+=n,{positions:[...g,...h,...m,...l,...f],indices:[t,t+1,t+2,t+2,t+4,t+3,t+3,t,t+2]}}function F(e,o){const n=new Z,t=[],r=[],s=[];for(let u=0;u<o;u++){const p=e/2*-1,g=e/2,h=e/2*Math.random(),l=Math.random()*2*Math.PI,m=h*Math.cos(l),f=h*Math.sin(l);r.push(...Array.from({length:A}).flatMap(()=>[P(m,p,g,0,1),P(f,p,g,0,1)]));const a=k([m,0,f],u);t.push(...a.positions),s.push(...a.indices)}return n.setAttribute("position",new C(new Float32Array(t),3)),n.setAttribute("uv",new C(new Float32Array(r),2)),n.setIndex(s),n.computeVertexNormals(),n}function O(){return new $({uniforms:{uCloud:{value:T},offsetX:{value:.5},offsetY:{value:.3},uTime:{value:0}},side:ee,vertexShader:`
      uniform float uTime;
      uniform float offsetX;
      uniform float offsetY;
    
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
    
      float wave(float waveSize, float tipDistance, float centerDistance) {
        bool isTip = (gl_VertexID + 1) % 5 == 0;
        float waveDistance = isTip ? tipDistance : centerDistance;
        return sin((uTime / 2.0) + waveSize) * waveDistance;
      }
    
      void main() {
        vPosition = position;
        vUv = uv;
        
        vUv.x += uTime * 0.0001 * offsetX;
        vUv.y += uTime * 0.0001 * offsetY;
    
        vNormal = normalize(normalMatrix * normal);
        if (vPosition.y < 0.0) {
          vPosition.y = 0.0;
        } else {
          vPosition.x += wave(uv.x * 10.0, 0.3, 0.1);      
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
 
      }
    `,fragmentShader:`
      uniform sampler2D uCloud;
      uniform float uTime;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
    
      vec3 green = vec3(0.2, 0.6, 0.3);
    
      void main() {
        vec3 color = mix(green * 0.7, green, vPosition.y);
        color = mix(color, texture2D(uCloud, vUv).rgb, 0.4);
        float lighting = normalize(dot(vNormal, vec3(10)));
        gl_FragColor = vec4(color + lighting * 0.03, 1.0);
      }
    `})}function H(e,o){const n=F(e,o),t=O(),r=new I(n,t),s=new I(new Q(e/2,8).rotateX(Math.PI/2),t);return s.position.y=-Number.EPSILON,r.add(s),r}let b;function R(){b=H(50,1e5),v.add(b)}return(e,o)=>(ie(),ne(j,null,{default:ae(()=>o[0]||(o[0]=[E("div",{class:"webgl"},null,-1),E("div",{class:"debug"},null,-1)])),_:1}))}}),he=ce(fe,[["__scopeId","data-v-3bcab01e"]]);export{he as default};

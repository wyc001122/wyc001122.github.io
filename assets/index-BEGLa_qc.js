import{G as D,T as O,d as q,C as M,e as p,S as I,A as L,f as E,D as U,u as N,O as V,b as W}from"./GLTFLoader-Cpm_xSlR.js";import{d as X,f as Y,p as Z,k as H,w as J,q as K,o as Q,h as _}from"./index-qyBmO-yZ.js";import{a as $}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var nn=`uniform float uTime;
uniform float uSize;

attribute vec3 aRandomness;
attribute float aScale;

varying vec3 vColor;

void main() {
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
     * Size
     */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    /**
     * Color
     */
    vColor = color;
}`,en=`varying vec3 vColor;

void main() {
    
    
    
    

    
    
    
    

    
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}`;const on=X({__name:"index",setup(tn){new D,new O;let S,d,m,r,w,C,P,v;function z(){({container:S,renderer:d,scene:m,camera:r,clock:w,viewPort:C,tick:P}=N(document.querySelector(".webgl")))}function y(){r.position.set(3,3,3)}function F(){v=new V(r,d.domElement),v.enableDamping=!0}function T(){J(C,()=>{const{width:e,height:o}=C.value;r.aspect=e/o,r.updateProjectionMatrix(),d.setSize(e,o,!1)})}let t,n={count:2e5,size:.005,radius:5,branches:3,spin:1,randomness:.2,randomnessPower:3,insideColor:"#ff6030",outsideColor:"#1b3984"};function A(){t=new W({container:document.querySelector(".debug")}),K(()=>t.destroy),t.add(n,"count").min(100).max(1e6).step(100).onFinishChange(i),t.add(n,"radius").min(.01).max(20).step(.01).onFinishChange(i),t.add(n,"branches").min(2).max(20).step(1).onFinishChange(i),t.add(n,"randomness").min(0).max(2).step(.001).onFinishChange(i),t.add(n,"randomnessPower").min(1).max(10).step(.001).onFinishChange(i),t.addColor(n,"insideColor").onFinishChange(i),t.addColor(n,"outsideColor").onFinishChange(i)}let s=null,u=null,h=null;Y(()=>{z(),A(),F(),T(),y(),i(),P(()=>{const e=w.getElapsedTime();u.uniforms.uTime.value=e,v.update(),d.render(m,r)})});function i(){h!==null&&(s.dispose(),u.dispose(),m.remove(h)),s=new q;const e=new Float32Array(n.count*3),o=new Float32Array(n.count*3),f=new Float32Array(n.count*3),x=new Float32Array(n.count*1),B=new M(n.insideColor),k=new M(n.outsideColor);for(let c=0;c<n.count;c++){const a=c*3,l=Math.random()*n.radius,b=c%n.branches/n.branches*Math.PI*2,G=Math.pow(Math.random(),n.randomnessPower)*(Math.random()<.5?1:-1)*n.randomness*l,R=Math.pow(Math.random(),n.randomnessPower)*(Math.random()<.5?1:-1)*n.randomness*l,j=Math.pow(Math.random(),n.randomnessPower)*(Math.random()<.5?1:-1)*n.randomness*l;e[a]=Math.cos(b)*l,e[a+1]=0,e[a+2]=Math.sin(b)*l,o[a]=G,o[a+1]=R,o[a+2]=j;const g=B.clone();g.lerp(k,l/n.radius),f[a]=g.r,f[a+1]=g.g,f[a+2]=g.b,x[c]=Math.random()}s.setAttribute("position",new p(e,3)),s.setAttribute("aRandomness",new p(o,3)),s.setAttribute("color",new p(f,3)),s.setAttribute("aScale",new p(x,1)),u=new I({depthWrite:!1,blending:L,vertexColors:!0,uniforms:{uTime:{value:0},uSize:{value:30*d.getPixelRatio()}},vertexShader:nn,fragmentShader:en}),h=new E(s,u),m.add(h)}return(e,o)=>(Q(),Z(U,null,{default:H(()=>o[0]||(o[0]=[_("div",{class:"webgl"},null,-1),_("div",{class:"debug"},null,-1)])),_:1}))}}),ln=$(on,[["__scopeId","data-v-8f184a1c"]]);export{ln as default};

import{G as B,T as L,V as c,a as y,P as C,M as U,y as E,ae as G,af as P,s as j,e as b,S as k,U as g,A as F,f as O,D as q,u as V,O as N,b as X}from"./GLTFLoader-Cpm_xSlR.js";import{d as Y,f as H,p as W,k as Z,w as J,q as K,o as Q,h as I}from"./index-qyBmO-yZ.js";import{a as $}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var ee=`uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);

    vec3 displacement = vec3(
        cos(aAngle) * 0.2,
        sin(aAngle) * 0.2,
        1.0
    );
    displacement = normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;
    
    newPosition += displacement;

    
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    
    float pictureIntensity = texture(uPictureTexture, uv).r;

    
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    
    vColor = vec3(pow(pictureIntensity, 2.0));
}`,te=`varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - vec2(0.5));

    if(distanceToCenter > 0.5)
        discard;

    gl_FragColor = vec4(vColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`;const ne=Y({__name:"index",setup(ae){new B;const _=new L;let m,r,l,i,f,n,h,p;function M(){({container:m,renderer:r,scene:l,camera:i,clock:f,viewPort:n,tick:h}=V(document.querySelector(".webgl")))}function A(){i.position.set(0,0,18),r.setClearColor("#181818")}function T(){p=new N(i,r.domElement),p.enableDamping=!0}function S(){J(n,()=>{const{width:t,height:a}=n.value;i.aspect=t/a,i.updateProjectionMatrix(),r.setSize(t,a,!1),u.uniforms.uResolution.value.set(n.value.width,n.value.height)})}let x;function R(){x=new X({container:document.querySelector(".debug")}),K(()=>x.destroy)}let u,e={},w,d;H(()=>{M(),R(),T(),S(),A(),z(),D(),h(()=>{f.getElapsedTime(),e.context.globalCompositeOperation="source-over",e.context.globalAlpha=.02,e.context.fillRect(0,0,e.canvas.width,e.canvas.height);const t=e.canvasCursorPrevious.distanceTo(e.canvasCursor);e.canvasCursorPrevious.copy(e.canvasCursor);const a=Math.min(t*.05,1),o=e.canvas.width*.25;e.context.globalCompositeOperation="lighten",e.context.globalAlpha=a,e.context.drawImage(e.glowImage,e.canvasCursor.x-o*.5,e.canvasCursor.y-o*.5,o,o),e.texture.needsUpdate=!0,p.update(),r.render(l,i)})});function D(){w=new P,d=new c;const t=new y(new C(10,10),new U({transparent:!0,color:16777215,opacity:.5})),a=new y(new E(.01,32,32),new G);l.add(a),m.addEventListener("mousemove",o=>{d.x=o.offsetX/n.value.viewWidth*2-1,d.y=-(o.offsetY/n.value.viewHeight)*2+1,w.setFromCamera(d,i);const v=w.intersectObject(t);if(v.length){const s=v[0].uv;e.canvasCursor.x=s.x*e.canvas.width,e.canvasCursor.y=(1-s.y)*e.canvas.height}})}function z(){e.canvas=document.createElement("canvas"),e.canvas.width=128,e.canvas.height=128,e.canvas.style.position="absolute",e.canvas.style.width="256px",e.canvas.style.height="256px",e.canvas.style.top=0,e.canvas.style.left=0,e.canvas.style.zIndex=10,m.append(e.canvas),e.context=e.canvas.getContext("2d"),e.context.fillRect(0,0,e.canvas.width,e.canvas.height),e.glowImage=new Image,e.glowImage.src=new URL("/assets/glow-UcE5q2Bs.png",import.meta.url).href,e.raycaster=new P,e.screenCursor=new c(9999,9999),e.canvasCursor=new c(9999,9999),e.canvasCursorPrevious=new c(9999,9999),window.addEventListener("pointermove",s=>{e.screenCursor.x=s.offsetX/n.value.width*2-1,e.screenCursor.y=-(s.offsetY/n.value.height)*2+1}),e.texture=new j(e.canvas);const t=new C(10,10,128,128);t.setIndex(null),t.deleteAttribute("normal");const a=new Float32Array(t.attributes.position.count),o=new Float32Array(t.attributes.position.count);for(let s=0;s<t.attributes.position.count;s++)a[s]=Math.random(),o[s]=Math.random()*Math.PI*2;t.setAttribute("aIntensity",new b(a,1)),t.setAttribute("aAngle",new b(o,1)),u=new k({vertexShader:ee,fragmentShader:te,uniforms:{uResolution:new g(new c(n.value.width,n.value.height)),uPictureTexture:new g(_.load(new URL("/assets/picture-1-CcRZvoBz.png",import.meta.url).href)),uDisplacementTexture:new g(e.texture)},blending:F}),u.uniforms.uResolution.value.set(n.value.width,n.value.height);const v=new O(t,u);l.add(v)}return(t,a)=>(Q(),W(q,null,{default:Z(()=>a[0]||(a[0]=[I("div",{class:"webgl"},null,-1),I("div",{class:"debug"},null,-1)])),_:1}))}}),re=$(ne,[["__scopeId","data-v-b2dff6cc"]]);export{re as default};

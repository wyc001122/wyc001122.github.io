import{G as I,T as E,n as m,c as R,h as T,i as z,D as F,u as G,j as q,k as O,E as U,a as j,P as V,w as H,l as N,O as J,U as w,b as K}from"./GLTFLoader-Cpm_xSlR.js";import{D as Q}from"./DRACOLoader-DJmNJuvT.js";import{R as W,z as S}from"./three-custom-shader-material.es-BKijawVj.js";import{d as X,f as Y,p as Z,k as $,w as ee,q as ae,o as te,h as v}from"./index-qyBmO-yZ.js";import{a as oe}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var M=`varying vec3 vPosition;

void main() {
    vPosition = csm_Position.xyz;
}`,_=`uniform float uSliceStart;
uniform float uSliceArc;

varying vec3 vPosition;

void main() {
    float angle = atan(vPosition.y, vPosition.x);
    angle -= uSliceStart;
    angle = mod(angle, PI * 2.0);

    if(angle > 0.0 && angle < uSliceArc)
        discard;

    float csm_Slice;
}`;const ne=X({__name:"index",setup(re){const p=new Q;p.setDecoderPath("./draco/");const f=new I;f.setDRACOLoader(p),new E;const P=new W;let b,t,o,r,g,d,h,u;function x(){({container:b,renderer:t,scene:o,camera:r,clock:g,viewPort:d,tick:h}=G(document.querySelector(".webgl")))}function y(){r.position.set(-5,5,12),t.shadowMap.enabled=!0,t.shadowMap.type=q,t.toneMapping=O,t.toneMappingExposure=1,P.load("/texture/hdr/aerodynamics_workshop.hdr",i=>{i.mapping=U,o.background=i,o.backgroundBlurriness=.5,o.environment=i});const a=new j(new V(10,10,10),new m({color:"#aaaaaa"}));a.receiveShadow=!0,a.position.x=-4,a.position.y=-3,a.position.z=-4,a.lookAt(new H(0,0,0)),o.add(a);const e=new N("#ffffff",4);e.position.set(6.25,3,4),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),e.shadow.camera.near=.1,e.shadow.camera.far=30,e.shadow.normalBias=.05,e.shadow.camera.top=8,e.shadow.camera.right=8,e.shadow.camera.bottom=-8,e.shadow.camera.left=-8,o.add(e)}function D(){u=new J(r,t.domElement),u.enableDamping=!0}function k(){ee(d,()=>{const{width:a,height:e}=d.value;r.aspect=a/e,r.updateProjectionMatrix(),t.setSize(a,e,!1)})}let c,l={uSliceStart:new w(1.75),uSliceArc:new w(1.25)};function C(){c=new K({container:document.querySelector(".debug")}),ae(()=>c.destroy),c.add(l.uSliceStart,"value",-Math.PI,Math.PI,.001).name("剖切起始角度"),c.add(l.uSliceArc,"value",0,Math.PI*2,.001).name("剖切弧度")}let s;Y(()=>{x(),C(),D(),k(),y(),L(),h(()=>{const a=g.getElapsedTime();s&&(s.rotation.y=a*.1),u.update(),t.render(o,r)})});function L(){const a={csm_Slice:{"#include <colorspace_fragment>":`
            #include <colorspace_fragment>

            if(!gl_FrontFacing)
                gl_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
        `}},e=new m({metalness:.5,roughness:.25,envMapIntensity:.5,color:"#858080"}),i=new S({baseMaterial:m,vertexShader:M,fragmentShader:_,uniforms:l,patchMap:a,metalness:.5,roughness:.25,envMapIntensity:.5,color:"#858080",side:R}),A=new S({baseMaterial:T,vertexShader:M,fragmentShader:_,uniforms:l,patchMap:a,depthPacking:z});f.load("/models/gears.glb",B=>{s=B.scene,s.traverse(n=>{n.isMesh&&(n.name==="outerHull"?(n.material=i,n.customDepthMaterial=A):n.material=e,n.castShadow=!0,n.receiveShadow=!0)}),o.add(s)})}return(a,e)=>(te(),Z(F,null,{default:$(()=>e[0]||(e[0]=[v("div",{class:"webgl"},null,-1),v("div",{class:"debug"},null,-1)])),_:1}))}}),ue=oe(ne,[["__scopeId","data-v-01f9d023"]]);export{ue as default};

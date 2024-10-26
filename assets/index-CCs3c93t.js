import{G as k,T as H,W as X,q as R,p as Z,S as W,P as S,a as C,M as J,g as q,C as v,ak as K,a8 as U,al as $,D as AA,u as eA,am as tA,an as oA,O as nA,b as rA}from"./GLTFLoader-Cpm_xSlR.js";import{D as aA}from"./DRACOLoader-DJmNJuvT.js";import{d as iA,f as cA,p as lA,k as sA,w as gA,q as vA,o as mA,h as B}from"./index-qyBmO-yZ.js";import{a as uA}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var fA=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,dA=`uniform float time;
uniform float uProgress;
uniform sampler2D uState1;
uniform sampler2D uState2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main()	{
	
	vec4 color = texture2D(uState1, vUv );
	vec4 color2 = texture2D(uState2, vec2(vUv.x,1.-vUv.y) );

	float dist = distance(vUv, vec2(0.5));
	float radius = 1.41;
	float outer_progress = clamp(1.1*uProgress, 0.,1.);
	float inner_progress = clamp(1.1*uProgress - 0.05, 0.,1.);

	float innerCircle = 1.-smoothstep((inner_progress-0.1)*radius, inner_progress*radius , dist);
	float outerCircle = 1.-smoothstep((outer_progress-0.1)*radius, inner_progress*radius , dist);

	float displacement = outerCircle-innerCircle;
	float scale = mix(color.r,color2.r, innerCircle);

	vec4 finalColor = mix(color, color2, uProgress);

	
	gl_FragColor = finalColor;
	gl_FragColor = vec4(vec3(displacement,scale,0.),1.);
}`;const pA=`
//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}`,xA=iA({__name:"index",setup(yA){const b=new aA;b.setDecoderPath("/draco/");const P=new k;P.setDRACOLoader(b);const u=new H;let E,a,c,n,w,i,Q,f;function V(){({container:E,renderer:a,scene:c,clock:w,viewPort:i,tick:Q}=eA(document.querySelector(".webgl")));const e=i.value.height,A=i.value.width/i.value.height;n=new R(e*A/-2,e*A/2,e/2,e/-2,-2e3,2e3)}function Y(){n.position.set(2,2,2),a.setClearColor(526637,1);const e=new tA(16777215,.7);c.add(e);const A=new oA(16771561,2200);A.position.set(-80*3,500*3,-80*3);let o=new U;o.position.set(0,-80,200),A.target=o,A.intensity=300,A.angle=1,A.penumbra=1.5,A.decay=.7,A.distance=3e3,c.add(A)}function O(){f=new nA(n,a.domElement),f.enableDamping=!0}function G(){gA(i,()=>{const{width:e,height:A}=i.value,o=A,t=e/A;n.left=-o*t/2,n.right=o*t/2,n.top=o/2,n.bottom=-o/2,n.updateProjectionMatrix(),g.setSize(e,A,!1),a.setSize(e,A,!1)})}let d;const F={progress:0};function T(){d=new rA({container:document.querySelector(".debug")}),vA(()=>d.destroy)}let g,m,M,p,x;cA(()=>{V(),T(),O(),G(),Y(),j(),L(),Q(()=>{const e=w.getElapsedTime();m.time.value=e,f.update(),a.setRenderTarget(g),a.render(p,M),a.setRenderTarget(null),m.uFBO.value=g.texture,a.render(c,n)})});function j(){g=new X(i.value.width,i.value.height),M=new R(-1,1,1,-1,-1,1),p=new Z,x=new W({uniforms:{uProgress:{value:0},uState1:{value:u.load(new URL("data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAANAAD/4QMxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA3LjEtYzAwMCA3OS45Y2NjNGRlOTMsIDIwMjIvMDMvMTQtMTQ6MDc6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMy4zIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM0OTM4Qjc5Q0JFODExRUVBQTY1QjNGRjYyM0E5NjUwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM0OTM4QjdBQ0JFODExRUVBQTY1QjNGRjYyM0E5NjUwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzQ5MzhCNzdDQkU4MTFFRUFBNjVCM0ZGNjIzQTk2NTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzQ5MzhCNzhDQkU4MTFFRUFBNjVCM0ZGNjIzQTk2NTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAATEBAYERgmFxcmMCUeJTAsJSQkJSw7MzMzMzM7Qz4+Pj4+PkNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDARQYGB8bHyUYGCU0JR8lNEM0KSk0Q0NDQDNAQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0P/wAARCAEAAQADASIAAhEBAxEB/8QAYAABAQEBAQAAAAAAAAAAAAAAAAcEAgYBAQEAAAAAAAAAAAAAAAAAAAABEAEAAQIFBQEBAQAAAAAAAAAAAQID0ZMEVBVxMrJzNAURIREBAQAAAAAAAAAAAAAAAAAAAEH/2gAMAwEAAhEDEQA/APEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6ooquVRRREzVM/wAiI/2ZmWziddt7uVVgfk/dp/ba8oV0Ei4nXbe7lVYHE67b3cqrBXQEi4nXbe7lVYHE67b3cqrBXQEi4nXbe7lVYMK1otc7p6yDkAAAAAAAAAAAAAAAAAAAAAAAG78n7tP7bXlCupF+T92n9tryhXQAAAAEWud09ZWlFrndPWRK5AFAAAAAAAAAAAAAAAAAAAAAAbvyfu0/tteUK6kX5P3af22vKFdAAAAARa53T1laUWud09ZErkAUAAAAAAAAAAAAAAAAAAAAABu/J+7T+215QrqLUV1W6oromYqif7Ex/kxMNnLa7cXc2rEFdEi5bXbi7m1YnLa7cXc2rEFdEi5bXbi7m1YnLa7cXc2rEFdRa53T1ls5bXbi7m1YsIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2Q==",import.meta.url).href)},uState2:{value:u.load(new URL("/assets/state2-_lzypOoy.jpg",import.meta.url).href)},uFBO:{value:null}},vertexShader:fA,fragmentShader:dA}),d.add(F,"progress",0,1,.01).onChange(o=>{x.uniforms.uProgress.value=o});const e=new S(2,2),A=new C(e,x);p.add(A)}function L(){const e=u.load(new URL("/assets/ao-DQTRHhOR.png",import.meta.url).href),A=new C(new S(100,100),new J({map:g.texture}));A.position.y=150,e.flipY=!1;const o=new q({roughness:.65,map:e,aoMap:e,aoMapIntensity:.75});m={time:{value:0},uFBO:{value:null},aoMap:{value:e},light_color:{value:new v("#ffe9e9")},ramp_color_one:{value:new v("#06082D")},ramp_color_two:{value:new v("#020284")},ramp_color_three:{value:new v("#0000ff")},ramp_color_four:{value:new v("#71c7f5")}},o.onBeforeCompile=t=>{t.uniforms=Object.assign(t.uniforms,m),t.vertexShader=t.vertexShader.replace("#include <common>",`
      #include <common>
      uniform sampler2D uFBO;
      uniform float time;
      attribute vec2 instanceUV;
      varying float vHeight;
      varying float vHeightUV;
      ${pA}
      `),t.vertexShader=t.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      float n = cnoise(vec3(instanceUV.x*5., instanceUV.y*5. , time*0.1));
      transformed.y += n*90.;
      vHeightUV = clamp(position.y*2.,0.,1.);
      vec4 transition = texture2D(uFBO, instanceUV);
      transformed *=(transition.g);
      transformed.y += transition.r*100.;
      vHeight = transformed.y;
      `),t.fragmentShader=t.fragmentShader.replace("#include <common>",`
      #include <common>
      uniform vec3 light_color;
      uniform vec3 ramp_color_one;
      uniform vec3 ramp_color_two;
      uniform vec3 ramp_color_three;
      uniform vec3 ramp_color_four;
      varying float vHeight;
      varying float vHeightUV;
      `),t.fragmentShader=t.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
        vec3 highlight = mix(ramp_color_three, ramp_color_four, vHeightUV);
        diffuseColor.rgb = ramp_color_two;
        diffuseColor.rgb = mix(diffuseColor.rgb, ramp_color_three, vHeightUV);
        diffuseColor.rgb = mix(diffuseColor.rgb, highlight, clamp(vHeight/10. -3.,0.,1.));
      `)},P.load(new URL("/assets/bar-B1wN1nRB.glb",import.meta.url).href,t=>{const y=t.scene.children[0];c.add(y),y.material=o;const z=y.geometry;z.scale(40,40,40);const r=50,_=r**2,D=new K(z,o,_);let h=new U,N=60,I=new Float32Array(_*2);for(let l=0;l<r;l++)for(let s=0;s<r;s++)I.set([l/r,s/r],(l*r+s)*2),h.position.set(N*(l-r/2),0,N*(s-r/2)),h.updateMatrix(),D.setMatrixAt(l*r+s,h.matrix);z.setAttribute("instanceUV",new $(I,2)),c.add(D)})}return(e,A)=>(mA(),lA(AA,null,{default:sA(()=>A[0]||(A[0]=[B("div",{class:"webgl"},null,-1),B("div",{class:"debug"},null,-1)])),_:1}))}}),wA=uA(xA,[["__scopeId","data-v-f516aa7c"]]);export{wA as default};

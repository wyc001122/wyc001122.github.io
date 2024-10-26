import{G as E,T as Q,W as h,e as W,q as X,p as I,a as U,P as S,S as q,M as Y,c as Z,_ as H,D as J,u as K,O as $,b as e0}from"./GLTFLoader-Cpm_xSlR.js";import{D as n0}from"./DRACOLoader-DJmNJuvT.js";import{d as t0,f as o0,p as a0,k as r0,w as c0,q as g0,o as s0,h as L}from"./index-qyBmO-yZ.js";import{a as i0}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var v0=`uniform float time;
uniform float progress;
uniform sampler2D texture1;
varying vec3 vNormal;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main()	{

	
	gl_FragColor = vec4(vNormal,1.);
}`,l0=`uniform float time;
uniform float triScale;
uniform float progress;
uniform float mosaic;
uniform vec2 pixels;

varying vec2 vUv;
varying vec3 vNormal;

attribute vec3 center;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec4 P){
  vec4 Pi0 = floor(P); 
  vec4 Pi1 = Pi0 + 1.0; 
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec4 Pf0 = fract(P); 
  vec4 Pf1 = Pf0 - 1.0; 
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = vec4(Pi0.zzzz);
  vec4 iz1 = vec4(Pi1.zzzz);
  vec4 iw0 = vec4(Pi0.wwww);
  vec4 iw1 = vec4(Pi1.wwww);

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 ixy00 = permute(ixy0 + iw0);
  vec4 ixy01 = permute(ixy0 + iw1);
  vec4 ixy10 = permute(ixy1 + iw0);
  vec4 ixy11 = permute(ixy1 + iw1);

  vec4 gx00 = ixy00 / 7.0;
  vec4 gy00 = floor(gx00) / 7.0;
  vec4 gz00 = floor(gy00) / 6.0;
  gx00 = fract(gx00) - 0.5;
  gy00 = fract(gy00) - 0.5;
  gz00 = fract(gz00) - 0.5;
  vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
  vec4 sw00 = step(gw00, vec4(0.0));
  gx00 -= sw00 * (step(0.0, gx00) - 0.5);
  gy00 -= sw00 * (step(0.0, gy00) - 0.5);

  vec4 gx01 = ixy01 / 7.0;
  vec4 gy01 = floor(gx01) / 7.0;
  vec4 gz01 = floor(gy01) / 6.0;
  gx01 = fract(gx01) - 0.5;
  gy01 = fract(gy01) - 0.5;
  gz01 = fract(gz01) - 0.5;
  vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
  vec4 sw01 = step(gw01, vec4(0.0));
  gx01 -= sw01 * (step(0.0, gx01) - 0.5);
  gy01 -= sw01 * (step(0.0, gy01) - 0.5);

  vec4 gx10 = ixy10 / 7.0;
  vec4 gy10 = floor(gx10) / 7.0;
  vec4 gz10 = floor(gy10) / 6.0;
  gx10 = fract(gx10) - 0.5;
  gy10 = fract(gy10) - 0.5;
  gz10 = fract(gz10) - 0.5;
  vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
  vec4 sw10 = step(gw10, vec4(0.0));
  gx10 -= sw10 * (step(0.0, gx10) - 0.5);
  gy10 -= sw10 * (step(0.0, gy10) - 0.5);

  vec4 gx11 = ixy11 / 7.0;
  vec4 gy11 = floor(gx11) / 7.0;
  vec4 gz11 = floor(gy11) / 6.0;
  gx11 = fract(gx11) - 0.5;
  gy11 = fract(gy11) - 0.5;
  gz11 = fract(gz11) - 0.5;
  vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
  vec4 sw11 = step(gw11, vec4(0.0));
  gx11 -= sw11 * (step(0.0, gx11) - 0.5);
  gy11 -= sw11 * (step(0.0, gy11) - 0.5);

  vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
  vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
  vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
  vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
  vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
  vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
  vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
  vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
  vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
  vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
  vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
  vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
  vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
  vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
  vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
  vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

  vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
  g0000 *= norm00.x;
  g0100 *= norm00.y;
  g1000 *= norm00.z;
  g1100 *= norm00.w;

  vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
  g0001 *= norm01.x;
  g0101 *= norm01.y;
  g1001 *= norm01.z;
  g1101 *= norm01.w;

  vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
  g0010 *= norm10.x;
  g0110 *= norm10.y;
  g1010 *= norm10.z;
  g1110 *= norm10.w;

  vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
  g0011 *= norm11.x;
  g0111 *= norm11.y;
  g1011 *= norm11.z;
  g1111 *= norm11.w;

  float n0000 = dot(g0000, Pf0);
  float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
  float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
  float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
  float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
  float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
  float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
  float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
  float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
  float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
  float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
  float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
  float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
  float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
  float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
  float n1111 = dot(g1111, Pf1);

  vec4 fade_xyzw = fade(Pf0);
  vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
  vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
  vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
  vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
  float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
  return 2.2 * n_xyzw;
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

const float PI = 3.141592653589793238;

float backout(float t, float s) {
    float p = t - 1.0;
    return p * p * ((s + 1.0) * p + s) + 1.0;
}

vec3 applyTriangleScale(vec3 pos, vec3 center, float scale) {
    return (pos - center) * scale + center;
}

vec3 applyPixelation(vec3 pos, float mosaic, float progress) {
    vec3 posPixelated = floor(pos * mosaic + 0.5) / mosaic;
    return mix(pos, posPixelated, progress);
}

vec3 applyNoiseTransformation(vec3 pos, float time) {
    float noise = cnoise(vec4(pos, time * 0.3));
    
    
    float rotation = noise * PI * 0.05;
    pos = rotate(pos, vec3(1.0, 0.0, 0.0), rotation);
    pos = rotate(pos, vec3(0.0, 1.0, 0.0), rotation);
    pos = rotate(pos, vec3(0.0, 1.0, 1.0), rotation);
    
    
    float scale = 1.0 + noise * 0.05;
    return pos * scale;
}

void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;

    float transformStart = -(position.y * 0.5 + 0.5) * 4.0;
    float transformProgress = backout(clamp(progress * 5.0 + transformStart, 0.0, 1.0), 5.0);

    
    pos = applyTriangleScale(pos, center, triScale);
    pos = applyPixelation(pos, mosaic, transformProgress);
    pos = applyNoiseTransformation(pos, time);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;const x0=t0({__name:"index",setup(f0){const C=new n0;C.setDecoderPath("/draco/");const M=new E;M.setDRACOLoader(C),new Q;let N,a,y,s,T,l,D,u;function R(){({container:N,renderer:a,scene:y,camera:s,clock:T,viewPort:l,tick:D}=K(document.querySelector(".webgl")))}function k(){s.position.set(0,0,2)}function B(){u=new $(s,a.domElement),u.enableDamping=!0}function O(){c0(l,()=>{const{width:e,height:n}=l.value;s.aspect=e/n,s.updateProjectionMatrix(),a.setSize(e,n,!1)})}let c;const r={progress:0,triScale:1,start:0,translate:0,mosaic:4};function j(){c=new e0({container:document.querySelector(".debug")}),g0(()=>c.destroy),c.add(r,"progress",0,1,.01).onChange(e=>{i.uniforms.progress.value=e}),c.add(r,"mosaic",0,15,.01).onChange(e=>{i.uniforms.mosaic.value=e}),c.add(r,"triScale",0,1,.01).onChange(e=>{i.uniforms.triScale.value=e}),c.add(r,"start",0,1,.01).onChange(e=>{g.material.uniforms.start.value=e}),c.add(r,"translate",0,1,.01).onChange(e=>{g.material.uniforms.translate.value=e})}let g;o0(()=>{R(),j(),B(),O(),k(),A(),G(),D(()=>{if(!t)return;const e=T.getElapsedTime();u.update(),t.rotation.x=.2*Math.sin(e*.1),t.rotation.y=.5*Math.cos(e*.1),g.material.uniforms.time.value=e,i.uniforms.time.value=e,a.setRenderTarget(w),a.render(y,s),g.material.uniforms.current.value=w.texture,g.material.uniforms.prev.value=v.texture,a.setRenderTarget(x),a.render(d,f),p.material.map=v.texture,a.setRenderTarget(null),a.render(z,f);let n=v;v=x,x=n})});let w,v,x;function A(){const{width:e,height:n}=l.value;w=new h(e,n),v=new h(e,n),x=new h(e,n)}let t;function G(){M.load(new URL("/assets/face-DskQEshW.glb",import.meta.url).href,e=>{F(),V(),t=e.scene.getObjectByName("obj_50879273"),t.geometry.scale(9,9,9),t.geometry=t.geometry.toNonIndexed(),t.geometry.center();let n=t.geometry.attributes.position.array,m=[];for(let o=0;o<n.length;o+=9){let P=(n[o]+n[o+3]+n[o+6])/3,_=(n[o+1]+n[o+4]+n[o+7])/3,b=(n[o+2]+n[o+5]+n[o+8])/3;m.push(P,_,b),m.push(P,_,b),m.push(P,_,b)}t.geometry.setAttribute("center",new W(new Float32Array(m),3)),y.add(t),t.material=i})}let f,d,p,z;function F(){f=new X(-1,1,1,-1,0,1),f.position.z=1,d=new I,g=new U(new S(2,2),new q({uniforms:{current:{value:null},prev:{value:null},start:{value:0},time:{value:0},translate:{value:0}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,fragmentShader:`
        uniform sampler2D current;
        uniform sampler2D prev;
        uniform float start;
        uniform float time;
        uniform float translate;
        varying vec2 vUv;
        
        void main() {
        float PI = 3.14159265359;
          vec2 uv = vUv;
          uv -= vec2(0.5);
          uv*=vec2(2.,1.);
          uv.y += translate;
          uv /= 4.;
          
          uv.x += sin(uv.y * PI*4. + translate*0.3)*0.15;
          uv.x += sin(uv.y * PI*16.  +translate*0.5)*0.15;

          
          
          uv += vec2(0.5);


          uv = mix(vUv, uv, start);


          vec4 currentColor = texture2D(current, uv);
          vec4 prevColor = texture2D(prev, vUv);
          prevColor.rgb -= 0.004;
          vec4 color = vec4(mix(prevColor.rgb,currentColor.rgb,  0.03), 1.);
          gl_FragColor = color;

        }
        `})),d.add(g),z=new I,p=new U(new S(2,2),new Y({color:16777215,map:null})),z.add(p)}let i;function V(){i=new q({side:Z,uniforms:{time:{value:0},mosaic:{value:r.mosaic},progress:{value:r.progress},triScale:{value:r.triScale},resolution:{value:new H}},vertexShader:l0,fragmentShader:v0}),new S(1,1,1,1)}return(e,n)=>(s0(),a0(J,null,{default:r0(()=>n[0]||(n[0]=[L("div",{class:"webgl"},null,-1),L("div",{class:"debug"},null,-1)])),_:1}))}}),d0=i0(x0,[["__scopeId","data-v-17ccc4cd"]]);export{d0 as default};

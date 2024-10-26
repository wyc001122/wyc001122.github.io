import{G as L,T as M,S as B,c as u,_ as q,g as T,a6 as U,y as k,a as G,D as R,u as j,av as O,am as A,l as F,O as V,b as $}from"./GLTFLoader-Cpm_xSlR.js";import{D as E}from"./DRACOLoader-DJmNJuvT.js";import{d as Q,f as X,p as Y,k as H,w as J,q as K,o as W,h as P}from"./index-qyBmO-yZ.js";import{a as Z}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var ee=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;
uniform vec2 pixels;
float PI = 3.141592653589793238;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); 
  vec3 Pi1 = Pi0 + vec3(1.0); 
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); 
  vec3 Pf1 = Pf0 - vec3(1.0); 
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
}

float distored_pos(vec3 p){
  float n = cnoise(p*1. + vec3(time));
  float noisearea = sin(smoothstep(-1.,1., p.y)*PI);
  vNoise = n*noisearea;
  

  return n*noisearea;
}

vec3 orthogonal(vec3 n){
  return normalize(
    abs(n.x) > abs(n.z) ? vec3(-n.y,n.x,0): vec3(0.,-n.z,n.y)
  );
}

float amp = 0.5;

void main() {
  vUv = uv;
  
  vec3 displacedposition = position + amp*normal*distored_pos(position);
  vec3 eps = vec3(0.001,0.,0.);
  vec3 tangent = orthogonal(normal);
  vec3 bitangent = normalize(cross(tangent,normal));

  vec3 neighbour1 = position + tangent*0.0001;
  vec3 neighbour2 = position + bitangent*0.0001;
  vec3 displacedN1 = neighbour1 + amp*normal*distored_pos(neighbour1);
  vec3 displacedN2 = neighbour2 + amp*normal*distored_pos(neighbour2);

  vec3 displacedTangent = displacedN1 - displacedposition;
  vec3 displacedBitangent = displacedN2 - displacedposition;
  vec3 displacedNormal = normalize(cross(displacedTangent,displacedBitangent));

  vNormal = displacedNormal;

  

  gl_Position = projectionMatrix * modelViewMatrix * vec4( displacedposition, 1.0 );
}`,ne=`uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;
float PI = 3.141592653589793238;
void main()	{

	
	gl_FragColor = vec4(vNormal,1.);
	
}`;const oe=Q({__name:"index",setup(te){const d=new E;d.setDecoderPath("/draco/");const f=new L;f.setDRACOLoader(d);const _=new M;let h,t,r,a,m,g,x,v;function b(){({container:h,renderer:t,scene:r,camera:a,clock:m,viewPort:g,tick:x}=j(document.querySelector(".webgl")))}function w(){a.position.set(0,0,-10),t.setClearColor(15658734,1),t.setClearAlpha(0),t.outputColorSpace=O;const n=new A(16777215,.3);r.add(n);const o=new F(16777215,.8*Math.PI);o.position.set(.5,0,.866),r.add(o)}function S(){v=new V(a,t.domElement),v.enableDamping=!0}function N(){J(g,()=>{const{width:n,height:o}=g.value;a.aspect=n/o,a.updateProjectionMatrix(),t.setSize(n,o,!1)})}let p;function C(){p=new $({container:document.querySelector(".debug")}),K(()=>p.destroy)}X(()=>{b(),C(),S(),N(),w(),I(),x(()=>{const n=m.getElapsedTime();c&&(c.uniforms.time.value=n/10),l&&(l.time.value=n/10),v.update(),t.render(r,a)})});let y;function I(){f.load(new URL("/assets/shape-LyQUMk1e.glb",import.meta.url).href,n=>{y=n.scene.children[0],D()})}let c,s,l,i,z;function D(){c=new B({side:u,uniforms:{time:{value:0},resolution:{value:new q}},vertexShader:ee,fragmentShader:ne}),s=new T({map:_.load(new URL("/assets/map-0CGXCgMY.jpg",import.meta.url).href),roughness:.34,metalness:.05,reflectivity:0,clearcoat:0,side:u});const n=`float PI = 3.141592653589793238;
    float amp = 1.4;

    uniform float time;
    varying float vNoise;


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
    }


    float distored_pos(vec3 p){
      float n = cnoise(p*1. + vec3(time));
      float noisearea = sin(smoothstep(-1.,1., p.y)*PI);
      vNoise = n*noisearea;


      return n*noisearea;
    }

    vec3 orthogonal(vec3 n){
      return normalize(
        abs(n.x) > abs(n.z) ? vec3(-n.y,n.x,0): vec3(0.,-n.z,n.y)
      );
  }`,o=`vec3 displacedposition = position + amp*normal*distored_pos(position);
    vec3 eps = vec3(0.001,0.,0.);
    vec3 tangent = orthogonal(normal);
    vec3 bitangent = normalize(cross(tangent,normal));

    vec3 neighbour1 = position + tangent*0.0001;
    vec3 neighbour2 = position + bitangent*0.0001;
    vec3 displacedN1 = neighbour1 + amp*normal*distored_pos(neighbour1);
    vec3 displacedN2 = neighbour2 + amp*normal*distored_pos(neighbour2);

    vec3 displacedTangent = displacedN1 - displacedposition;
    vec3 displacedBitangent = displacedN2 - displacedposition;
    vec3 displacedNormal = normalize(cross(displacedTangent,displacedBitangent));`;s.onBeforeCompile=e=>{c.userData.shader=e,l=c.userData.shader.uniforms,e.uniforms.time={value:0},e.vertexShader=`
      ${n}
      ${e.vertexShader}
      `,e.vertexShader=e.vertexShader.replace("void main() {",`void main() {${o}`),e.vertexShader=e.vertexShader.replace("#include <displacementmap_vertex>","transformed = displacedposition;"),e.vertexShader=e.vertexShader.replace("#include <defaultnormal_vertex>",U.defaultnormal_vertex.replace("vec3 transformedNormal = objectNormal;","vec3 transformedNormal = displacedNormal;")),e.fragmentShader=`varying float vNoise;
      vec3 a = vec3(0.5, 0.5, 0.5		);
      vec3 b = vec3(0.5, 0.5, 0.5	);
      vec3 c = vec3(1.0, 1.0, 1.0	);
      vec3 d = vec3(0.00, 0.10, 0.20); 
      vec3 col(float t){
        return  a + b * cos(2.*3.1415926*(c*t+d));
      }
      ${e.fragmentShader}
      `,e.fragmentShader=e.fragmentShader.replace("#include <map_fragment>",`
      #include <map_fragment>
        diffuseColor.rgb = col(0.2 + vNoise*10.);
        `)},i=new k(1,162,162),i=y.geometry,i.computeVertexNormals(),console.log(i),z=new G(i,s),r.add(z)}return(n,o)=>(W(),Y(R,null,{default:H(()=>o[0]||(o[0]=[P("div",{class:"webgl"},null,-1),P("div",{class:"debug"},null,-1)])),_:1}))}}),ge=Z(oe,[["__scopeId","data-v-e5d6d91c"]]);export{ge as default};
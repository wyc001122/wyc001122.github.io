import{G as b,T as D,P as C,R as v,S as M,c as L,U as f,a as z,D as G,u as O,O as B,b as R}from"./GLTFLoader-Cpm_xSlR.js";import{d as q,f as E,p as j,k as F,w as I,q as N,o as V,h as p}from"./index-qyBmO-yZ.js";import{a as W}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var Z=`uniform float uTime;\r
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle) {\r
    float s = sin(angle);\r
    float c = cos(angle);\r
    mat2 m = mat2(c, s, -s, c);\r
    return m * value;\r
}

void main() {\r
    vUv = uv;\r
    vec3 newPosition = position;

    
    float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.005)).r;\r
    float angle = twistPerlin * 10.0;\r
    newPosition.xz = rotate2D(newPosition.xz, angle);

    
    vec2 windOffset = vec2(texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5, texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5);\r
    windOffset *= pow(uv.y, 2.0) * 10.0;\r
    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\r
}`,A=`uniform sampler2D uPerlinTexture;\r
uniform float uTime;

varying vec2 vUv;

void main() {\r
    vec2 smokeUv = vUv;\r
    smokeUv.x *= 0.5;\r
    smokeUv.y *= 0.3;\r
    smokeUv.y -= uTime * 0.03;

    float smoke = texture(uPerlinTexture, smokeUv).r;

    
    smoke = smoothstep(0.4, 1.0, smoke);

    
    smoke *= smoothstep(0.0, 0.1, vUv.x);\r
    smoke *= smoothstep(1.0, 0.9, vUv.x);\r
    smoke *= smoothstep(0.0, 0.1, vUv.y);\r
    smoke *= smoothstep(1.0, 0.4, vUv.y);

    gl_FragColor = vec4(0.6, 0.3, 0.2, smoke);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;const H=q({__name:"index",setup(J){const x=new b,w=new D;let g,o,r,t,l,s,u,i;function k(){({container:g,renderer:o,scene:r,camera:t,clock:l,viewPort:s,tick:u}=O(document.querySelector(".webgl")))}function T(){t.position.set(5,10,5)}function P(){i=new B(t,o.domElement),i.enableDamping=!0}function h(){I(s,()=>{const{width:e,height:n}=s.value;t.aspect=e/n,t.updateProjectionMatrix(),o.setSize(e,n,!1)})}let m;function U(){m=new R({container:document.querySelector(".debug")}),N(()=>m.destroy)}let c,a;E(()=>{k(),U(),P(),h(),T(),_(),u(()=>{const e=l.getElapsedTime();i.update(),a&&(a.material.uniforms.uTime.value=e),o.render(r,t)})});function _(){x.load(new URL("/assets/coffee-EZnnxNa-.glb",import.meta.url).href,e=>{c=e.scene,a=y(),r.add(c),r.add(a)})}function y(){const e=new C(1,1,16,64);e.translate(0,.5,0),e.scale(1.5,6,1.5);const n=w.load("texture/noise/perlin.png");n.wrapS=v,n.wrapT=v;const S=new M({vertexShader:Z,fragmentShader:A,side:L,transparent:!0,depthWrite:!1,uniforms:{uTime:new f(0),uPerlinTexture:new f(n)}}),d=new z(e,S);return d.position.y=1.83,d}return(e,n)=>(V(),j(G,null,{default:F(()=>n[0]||(n[0]=[p("div",{class:"webgl"},null,-1),p("div",{class:"debug"},null,-1)])),_:1}))}}),Y=W(H,[["__scopeId","data-v-7d7e6651"]]);export{Y as default};

import{G as K,T as Z,af as $,V as ee,w as ne,W as u,p as _,a,P as i,M as c,B as te,q as re,S as G,_ as V,c as F,y as oe,D as ae,u as le,O as se,b as ie}from"./GLTFLoader-Cpm_xSlR.js";import{D as ce}from"./DRACOLoader-DJmNJuvT.js";import{d as ve,f as fe,p as ue,k as de,w as me,q as be,o as ge,h as I}from"./index-qyBmO-yZ.js";import{a as he}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var pe=`uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main()	{
	
	gl_FragColor = vec4(vUv,0.0,1.);
}`,xe=`uniform float time;
uniform float progress;
uniform sampler2D tDiffuse;
uniform sampler2D tPrev;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
}

float fbm(vec2 x, int numOctaves) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);

    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for(int i = 0; i < numOctaves; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float blendDarken(float base, float blend) {
    return min(blend, base);
}
vec3 blendDarken(vec3 base, vec3 blend) {
    return vec3(blendDarken(base.r, blend.r), blendDarken(base.g, blend.g), blendDarken(base.b, blend.b));
}
vec3 blendDarken(vec3 base, vec3 blend, float opacity) {
    return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
}

float hue2rgb(float f1, float f2, float hue) {
    if(hue < 0.0)
        hue += 1.0;
    else if(hue > 1.0)
        hue -= 1.0;
    float res;
    if((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if((2.0 * hue) < 1.0)
        res = f2;
    else if((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;
    if(hsl.y == 0.0) {
        rgb = vec3(hsl.z); 
    } else {
        float f2;
        if(hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = hsl.z + hsl.y - hsl.y * hsl.z;
        float f1 = 2.0 * hsl.z - f2;
        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0 / 3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0 / 3.0));
    }
    return rgb;
}
vec3 hsl2rgb(float h, float s, float l) {
    return hsl2rgb(vec3(h, s, l));
}

vec3 bgColor = vec3(1., 1., 1.);
void main() {
	
    vec4 color = texture2D(tDiffuse, vUv); 
    vec4 prev = texture2D(tPrev, vUv); 

    vec2 aspect = vec2(1., resolution.y / resolution.x);

    vec2 disp = fbm(vUv * 22.0, 4) * aspect * 0.01;

    vec4 texel = texture2D(tPrev, vUv);
    vec4 texel2 = texture2D(tPrev, vec2(vUv.x + disp.x, vUv.y));
    vec4 texel3 = texture2D(tPrev, vec2(vUv.x - disp.x, vUv.y));
    vec4 texel4 = texture2D(tPrev, vec2(vUv.x, vUv.y + disp.y));
    vec4 texel5 = texture2D(tPrev, vec2(vUv.x, vUv.y - disp.y));
    vec3 floodcolor = texel.rgb;
    floodcolor = blendDarken(floodcolor, texel2.rgb);
    floodcolor = blendDarken(floodcolor, texel3.rgb);
    floodcolor = blendDarken(floodcolor, texel4.rgb);
    floodcolor = blendDarken(floodcolor, texel5.rgb);

    vec3 gradient = hsl2rgb(fract(time * 0.1), 0.5, 0.5);
    vec3 lcolor = mix(vec3(1.), gradient, color.r);

    vec3 waterColor = blendDarken(prev.rgb, floodcolor * (1. + 0.02), 0.7);

    vec3 finalColor = blendDarken(waterColor, lcolor, 1.);

    
	
    
    
    
    
    
    gl_FragColor = prev;

    gl_FragColor = vec4(min(bgColor, finalColor * (1. + 0.01) + 0.001), 1.);
}`,j=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;const we=ve({__name:"index",setup(De){const k=new ce;k.setDecoderPath("/draco/"),new K().setDRACOLoader(k),new Z;let S,t,d,r,T,l,L,v;function q(){({container:S,renderer:t,scene:d,camera:r,clock:T,viewPort:l,tick:L}=le(document.querySelector(".webgl")))}function E(){r.position.set(0,0,2)}function A(){v=new se(r,t.domElement),v.enableDamping=!0}function W(){me(l,()=>{const{width:e,height:n}=l.value;r.aspect=e/n,r.updateProjectionMatrix(),t.setSize(e,n,!1)})}let M;function Q(){M=new ie({container:document.querySelector(".debug")}),be(()=>M.destroy)}fe(()=>{q(),Q(),A(),W(),E(),H(),N(),X(),Y(),L(()=>{const e=T.getElapsedTime();v.update(),U.uniforms.time.value=e,t.setRenderTarget(p),t.render(d,r),t.setRenderTarget(o),t.render(w,D),s.uniforms.tDiffuse.value=p.texture,s.uniforms.tPrev.value=o.texture,s.uniforms.time.value=e,P.material.map=o.texture,t.setRenderTarget(null),t.render(y,D);let n=o;o=x,x=n})});let m,f,b,g,h;function H(){const{width:e,height:n}=l.value;m=new $,f=new ee,new ne,b=new u(e,n),g=new _,h=new a(new i(100,100),new c({color:16777215})),g.add(h),h.position.z=-2,new a(new te(1,1,1),new c({color:65280}))}let p,o,x,w,D,s,z,y,P;function N(){const{width:e,height:n}=l.value;p=new u(e,n),o=new u(e,n),x=new u(e,n),t.setRenderTarget(b),v.update(),t.render(g,r),w=new _,D=new re(-1,1,1,-1,0,1),s=new G({uniforms:{time:{value:0},tDiffuse:{value:null},tPrev:{value:b.texture},resolution:{value:new V(e,n,1,1)}},vertexShader:j,fragmentShader:xe}),z=new a(new i(2,2),s),w.add(z),y=new _,P=new a(new i(2,2),new c({map:o.texture})),y.add(P)}let O,C;function X(){O=new a(new i(100,100),new c({color:16711680,side:F})),C=new a(new oe(.2,30,30),new c({color:16777215})),d.add(C),S.addEventListener("mousemove",e=>{const{viewWidth:n,viewHeight:J}=l.value;f.x=e.offsetX/n*2-1,f.y=-(e.offsetY/J)*2+1,m.setFromCamera(f,r);const B=m.intersectObjects([O]);B.length>0&&C.position.copy(B[0].point)})}let U,R;function Y(){U=new G({side:F,uniforms:{time:{value:0},resolution:{value:new V}},vertexShader:j,fragmentShader:pe}),R=new i(1,1,1,1),new a(R,U)}return(e,n)=>(ge(),ue(ae,null,{default:de(()=>n[0]||(n[0]=[I("div",{class:"webgl"},null,-1),I("div",{class:"debug"},null,-1)])),_:1}))}}),ke=he(we,[["__scopeId","data-v-551f441e"]]);export{ke as default};

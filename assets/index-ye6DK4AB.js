import{w as j,C as le,ay as ge,az as xe,av as ce,o as ue,d as Y,F,aP as H,a5 as $,aQ as A,as as be,aR as ee,f as q,a as D,G as we,T as ye,p as _e,aS as Ce,V as B,P as te,S as J,y as Pe,M as Ve,a8 as je,m as Ue,D as Fe,u as De,am as Le,j as ke,k as Me,O as Te,b as ze,K as Se}from"./GLTFLoader-Cpm_xSlR.js";import{R as Re,E as Ne}from"./EffectComposer-3ITbW_mG.js";import{U as Ie}from"./UnrealBloomPass-CnSu0yKn.js";import{d as Ae,f as Be,p as Ee,k as Ge,w as Oe,q as We,o as He,h as re}from"./index-qyBmO-yZ.js";import{a as qe}from"./_plugin-vue_export-helper-CQ7wvoWd.js";import"./Pass-8nf9LS6g.js";const Je=/^[og]\s*(.+)?/,Ke=/^mtllib /,Qe=/^usemtl /,Ze=/^usemap /,oe=/\s+/,ne=new j,K=new j,se=new j,ae=new j,w=new j,E=new le;function Xe(){const z={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(r,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=r,this.object.fromDeclaration=e!==!1;return}const n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:r||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(t,o){const u=this._finalize(!1);u&&(u.inherited||u.groupCount<=0)&&this.materials.splice(u.index,1);const f={index:this.materials.length,name:t||"",mtllib:Array.isArray(o)&&o.length>0?o[o.length-1]:"",smooth:u!==void 0?u.smooth:this.smooth,groupStart:u!==void 0?u.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(x){const a={index:typeof x=="number"?x:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return a.clone=this.clone.bind(a),a}};return this.materials.push(f),f},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(t){const o=this.currentMaterial();if(o&&o.groupEnd===-1&&(o.groupEnd=this.geometry.vertices.length/3,o.groupCount=o.groupEnd-o.groupStart,o.inherited=!1),t&&this.materials.length>1)for(let u=this.materials.length-1;u>=0;u--)this.materials[u].groupCount<=0&&this.materials.splice(u,1);return t&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),o}},n&&n.name&&typeof n.clone=="function"){const t=n.clone(0);t.inherited=!0,this.object.materials.push(t)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(r,e){const n=parseInt(r,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(r,e){const n=parseInt(r,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(r,e){const n=parseInt(r,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(r,e,n){const t=this.vertices,o=this.object.geometry.vertices;o.push(t[r+0],t[r+1],t[r+2]),o.push(t[e+0],t[e+1],t[e+2]),o.push(t[n+0],t[n+1],t[n+2])},addVertexPoint:function(r){const e=this.vertices;this.object.geometry.vertices.push(e[r+0],e[r+1],e[r+2])},addVertexLine:function(r){const e=this.vertices;this.object.geometry.vertices.push(e[r+0],e[r+1],e[r+2])},addNormal:function(r,e,n){const t=this.normals,o=this.object.geometry.normals;o.push(t[r+0],t[r+1],t[r+2]),o.push(t[e+0],t[e+1],t[e+2]),o.push(t[n+0],t[n+1],t[n+2])},addFaceNormal:function(r,e,n){const t=this.vertices,o=this.object.geometry.normals;ne.fromArray(t,r),K.fromArray(t,e),se.fromArray(t,n),w.subVectors(se,K),ae.subVectors(ne,K),w.cross(ae),w.normalize(),o.push(w.x,w.y,w.z),o.push(w.x,w.y,w.z),o.push(w.x,w.y,w.z)},addColor:function(r,e,n){const t=this.colors,o=this.object.geometry.colors;t[r]!==void 0&&o.push(t[r+0],t[r+1],t[r+2]),t[e]!==void 0&&o.push(t[e+0],t[e+1],t[e+2]),t[n]!==void 0&&o.push(t[n+0],t[n+1],t[n+2])},addUV:function(r,e,n){const t=this.uvs,o=this.object.geometry.uvs;o.push(t[r+0],t[r+1]),o.push(t[e+0],t[e+1]),o.push(t[n+0],t[n+1])},addDefaultUV:function(){const r=this.object.geometry.uvs;r.push(0,0),r.push(0,0),r.push(0,0)},addUVLine:function(r){const e=this.uvs;this.object.geometry.uvs.push(e[r+0],e[r+1])},addFace:function(r,e,n,t,o,u,f,x,a){const d=this.vertices.length;let s=this.parseVertexIndex(r,d),c=this.parseVertexIndex(e,d),l=this.parseVertexIndex(n,d);if(this.addVertex(s,c,l),this.addColor(s,c,l),f!==void 0&&f!==""){const v=this.normals.length;s=this.parseNormalIndex(f,v),c=this.parseNormalIndex(x,v),l=this.parseNormalIndex(a,v),this.addNormal(s,c,l)}else this.addFaceNormal(s,c,l);if(t!==void 0&&t!==""){const v=this.uvs.length;s=this.parseUVIndex(t,v),c=this.parseUVIndex(o,v),l=this.parseUVIndex(u,v),this.addUV(s,c,l),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(r){this.object.geometry.type="Points";const e=this.vertices.length;for(let n=0,t=r.length;n<t;n++){const o=this.parseVertexIndex(r[n],e);this.addVertexPoint(o),this.addColor(o)}},addLineGeometry:function(r,e){this.object.geometry.type="Line";const n=this.vertices.length,t=this.uvs.length;for(let o=0,u=r.length;o<u;o++)this.addVertexLine(this.parseVertexIndex(r[o],n));for(let o=0,u=e.length;o<u;o++)this.addUVLine(this.parseUVIndex(e[o],t))}};return z.startObject("",!1),z}class Ye extends ge{constructor(r){super(r),this.materials=null}load(r,e,n,t){const o=this,u=new xe(this.manager);u.setPath(this.path),u.setRequestHeader(this.requestHeader),u.setWithCredentials(this.withCredentials),u.load(r,function(f){try{e(o.parse(f))}catch(x){t?t(x):console.error(x),o.manager.itemError(r)}},n,t)}setMaterials(r){return this.materials=r,this}parse(r){const e=new Xe;r.indexOf(`\r
`)!==-1&&(r=r.replace(/\r\n/g,`
`)),r.indexOf(`\\
`)!==-1&&(r=r.replace(/\\\n/g,""));const n=r.split(`
`);let t=[];for(let f=0,x=n.length;f<x;f++){const a=n[f].trimStart();if(a.length===0)continue;const d=a.charAt(0);if(d!=="#")if(d==="v"){const s=a.split(oe);switch(s[0]){case"v":e.vertices.push(parseFloat(s[1]),parseFloat(s[2]),parseFloat(s[3])),s.length>=7?(E.setRGB(parseFloat(s[4]),parseFloat(s[5]),parseFloat(s[6]),ce),e.colors.push(E.r,E.g,E.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(s[1]),parseFloat(s[2]),parseFloat(s[3]));break;case"vt":e.uvs.push(parseFloat(s[1]),parseFloat(s[2]));break}}else if(d==="f"){const c=a.slice(1).trim().split(oe),l=[];for(let i=0,p=c.length;i<p;i++){const h=c[i];if(h.length>0){const b=h.split("/");l.push(b)}}const v=l[0];for(let i=1,p=l.length-1;i<p;i++){const h=l[i],b=l[i+1];e.addFace(v[0],h[0],b[0],v[1],h[1],b[1],v[2],h[2],b[2])}}else if(d==="l"){const s=a.substring(1).trim().split(" ");let c=[];const l=[];if(a.indexOf("/")===-1)c=s;else for(let v=0,i=s.length;v<i;v++){const p=s[v].split("/");p[0]!==""&&c.push(p[0]),p[1]!==""&&l.push(p[1])}e.addLineGeometry(c,l)}else if(d==="p"){const c=a.slice(1).trim().split(" ");e.addPointGeometry(c)}else if((t=Je.exec(a))!==null){const s=(" "+t[0].slice(1).trim()).slice(1);e.startObject(s)}else if(Qe.test(a))e.object.startMaterial(a.substring(7).trim(),e.materialLibraries);else if(Ke.test(a))e.materialLibraries.push(a.substring(7).trim());else if(Ze.test(a))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(d==="s"){if(t=a.split(" "),t.length>1){const c=t[1].trim().toLowerCase();e.object.smooth=c!=="0"&&c!=="off"}else e.object.smooth=!0;const s=e.object.currentMaterial();s&&(s.smooth=e.object.smooth)}else{if(a==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+a+'"')}}e.finalize();const o=new ue;if(o.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let f=0,x=e.objects.length;f<x;f++){const a=e.objects[f],d=a.geometry,s=a.materials,c=d.type==="Line",l=d.type==="Points";let v=!1;if(d.vertices.length===0)continue;const i=new Y;i.setAttribute("position",new F(d.vertices,3)),d.normals.length>0&&i.setAttribute("normal",new F(d.normals,3)),d.colors.length>0&&(v=!0,i.setAttribute("color",new F(d.colors,3))),d.hasUVIndices===!0&&i.setAttribute("uv",new F(d.uvs,2));const p=[];for(let b=0,L=s.length;b<L;b++){const y=s[b],S=y.name+"_"+y.smooth+"_"+v;let m=e.materials[S];if(this.materials!==null){if(m=this.materials.create(y.name),c&&m&&!(m instanceof H)){const _=new H;$.prototype.copy.call(_,m),_.color.copy(m.color),m=_}else if(l&&m&&!(m instanceof A)){const _=new A({size:10,sizeAttenuation:!1});$.prototype.copy.call(_,m),_.color.copy(m.color),_.map=m.map,m=_}}m===void 0&&(c?m=new H:l?m=new A({size:1,sizeAttenuation:!1}):m=new be,m.name=y.name,m.flatShading=!y.smooth,m.vertexColors=v,e.materials[S]=m),p.push(m)}let h;if(p.length>1){for(let b=0,L=s.length;b<L;b++){const y=s[b];i.addGroup(y.groupStart,y.groupCount,b)}c?h=new ee(i,p):l?h=new q(i,p):h=new D(i,p)}else c?h=new ee(i,p[0]):l?h=new q(i,p[0]):h=new D(i,p[0]);h.name=a.name,o.add(h)}else if(e.vertices.length>0){const f=new A({size:1,sizeAttenuation:!1}),x=new Y;x.setAttribute("position",new F(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(x.setAttribute("color",new F(e.colors,3)),f.vertexColors=!0);const a=new q(x,f);o.add(a)}return o}}var ie=`varying vec2 vUv;\r
varying vec3 camPos;\r
varying vec3 eyeVector;\r
varying vec3 vNormal;

void main() {\r
    vUv = uv;\r
    camPos = cameraPosition;\r
    vNormal = normal;\r
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);\r
    eyeVector = normalize(worldPosition.xyz - abs(cameraPosition));\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,$e=`varying vec2 vUv;\r
uniform sampler2D skullrender;\r
uniform sampler2D cardtemplate;\r
uniform sampler2D backtexture;\r
uniform sampler2D noiseTex;\r
uniform sampler2D color;\r
uniform sampler2D noise;\r
uniform vec2 uResolution;\r
varying vec3 camPos;\r
varying vec3 eyeVector;\r
varying vec3 vNormal;

float Fresnel(vec3 eyeVector, vec3 worldNormal) {\r
  return pow(1.0 + dot(eyeVector, worldNormal), 1.80);\r
}

void main() {\r
  vec2 uv = gl_FragCoord.xy / uResolution.xy;\r
  vec4 temptex = texture2D(cardtemplate, vUv);\r
  vec4 skulltex = texture2D(skullrender, uv);\r
  gl_FragColor = temptex;\r
  float f = Fresnel(eyeVector, vNormal);\r
  vec4 noisetex = texture2D(noise, mod(vUv * 2., 1.));\r
  if(gl_FragColor.g >= .5 && gl_FragColor.r < 0.6) {\r
    gl_FragColor = f + skulltex;\r
    gl_FragColor += noisetex / 5.;\r
  } else {\r
    vec4 bactex = texture2D(backtexture, vUv);\r
    float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);\r
    vec4 colortex = texture2D(color, vec2(tone, 0.));

    vec2 uv2 = vUv;\r
    float iTime = 1. * 0.004;\r
    uv.y += iTime / 10.0;\r
    uv.x -= (sin(iTime / 10.0) / 2.0);\r
    uv2.y += iTime / 14.0;\r
    uv2.x += (sin(iTime / 10.0) / 9.0);\r
    float result = 0.0;\r
    result += texture2D(noiseTex, mod(uv * 4., 1.) * 0.6 + vec2(iTime * -0.003)).r;\r
    result *= texture2D(noiseTex, mod(uv2 * 4., 1.) * 0.9 + vec2(iTime * +0.002)).b;\r
    result = pow(result, 10.0);\r
    gl_FragColor *= colortex;\r
    gl_FragColor += vec4(sin((tone + vUv.x + vUv.y / 10.) * 10.)) / 8.;\r
  }\r
  gl_FragColor.a = temptex.a;\r
}`,et=`varying vec2 vUv;\r
uniform sampler2D skullrender;\r
uniform sampler2D cardtemplate;\r
uniform sampler2D backtexture;\r
uniform sampler2D noiseTex;\r
uniform sampler2D color;\r
uniform sampler2D noise;\r
uniform vec2 uResolution;\r
varying vec3 camPos;\r
varying vec3 eyeVector;\r
varying vec3 vNormal;

float Fresnel(vec3 eyeVector, vec3 worldNormal) {\r
    return pow(1.0 + dot(eyeVector, worldNormal), 1.80);\r
}

void main() {\r
    vec2 uv = gl_FragCoord.xy / uResolution.xy;\r
    vec4 temptex = texture2D(cardtemplate, vUv);\r
    vec4 skulltex = texture2D(skullrender, vUv);\r
    gl_FragColor = temptex;\r
    vec4 noisetex = texture2D(noise, mod(vUv * 2., 1.));\r
    float f = Fresnel(eyeVector, vNormal);

    vec2 uv2 = vUv;\r
    float iTime = 1. * 0.004;\r
    uv.y += iTime / 10.0;\r
    uv.x -= (sin(iTime / 10.0) / 2.0);\r
    uv2.y += iTime / 14.0;\r
    uv2.x += (sin(iTime / 10.0) / 9.0);\r
    float result = 0.0;\r
    result += texture2D(noiseTex, mod(uv * 4., 1.) * 0.6 + vec2(iTime * -0.003)).r;\r
    result *= texture2D(noiseTex, mod(uv2 * 4., 1.) * 0.9 + vec2(iTime * +0.002)).b;\r
    result = pow(result, 10.0);

    vec4 bactex = texture2D(backtexture, vUv);\r
    float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);\r
    vec4 colortex = texture2D(color, vec2(tone, 0.));\r
    if(gl_FragColor.g >= .5 && gl_FragColor.r < 0.6) {\r
        float tone = pow(dot(normalize(camPos), normalize(skulltex.rgb)), 1.);\r
        if(skulltex.a > 0.2) {\r
            gl_FragColor = colortex;\r
        } else {\r
            gl_FragColor = vec4(0.) + f;\r
            gl_FragColor += noisetex / 5.;\r
        }\r
        gl_FragColor += noisetex / 5.;\r
    } else {\r
        gl_FragColor *= colortex;\r
        gl_FragColor += vec4(sin((tone + vUv.x + vUv.y / 10.) * 10.)) / 8.;\r
    }

}`,tt=`varying vec3 vNormal;\r
varying vec3 camPos;\r
varying vec3 vPosition;\r
varying vec2 vUv;\r
varying vec3 eyeVector;

void main() {\r
    vNormal = normal;\r
    vUv = uv;\r
    camPos = cameraPosition;\r
    vPosition = position;\r
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);\r
    eyeVector = normalize(worldPosition.xyz - cameraPosition);\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,rt=`#define NUM_OCTAVES 5\r
uniform vec2 uResolution;\r
varying vec3 vNormal;\r
varying vec3 vPosition;\r
uniform float time;\r
varying vec3 camPos;\r
uniform vec3 color1;\r
uniform vec3 color0;\r
varying vec3 eyeVector;

float rand(vec2 n) {\r
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\r
}

float noise(vec2 p) {\r
    vec2 ip = floor(p);\r
    vec2 u = fract(p);\r
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);\r
    return res * res;\r
}

float fbm(vec2 x) {\r
    float v = 0.0;\r
    float a = 0.5;\r
    vec2 shift = vec2(100);\r
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));\r
    for(int i = 0; i < NUM_OCTAVES; ++i) {\r
        v += a * noise(x);\r
        x = rot * x * 2.0 + shift;\r
        a *= 0.5;\r
    }\r
    return v;\r
}

float setOpacity(float r, float g, float b) {\r
    float tone = (r + g + b) / 3.0;\r
    float alpha = 1.0;\r
    if(tone < 0.69) {\r
        alpha = 0.0;\r
    }\r
    return alpha;\r
}

vec3 rgbcol(float r, float g, float b) {\r
    return vec3(r / 255.0, g / 255.0, b / 255.0);\r
}

float Fresnel(vec3 eyeVector, vec3 worldNormal) {\r
    return pow(1.0 + dot(eyeVector, worldNormal), 3.0);\r
}

void main() {\r
    vec2 olduv = gl_FragCoord.xy / uResolution.xy;\r
    float f = Fresnel(eyeVector, vNormal);\r
    float scale = 8.;\r
    olduv.y = olduv.y - time;\r
    vec2 p = olduv * scale;\r
    float noise = fbm(p + time);

    vec3 newCam = vec3(0., 5., 10.);\r
    float gradient = dot(.0 - normalize(newCam), normalize(vNormal));

    vec3 viewDirectionW = normalize(camPos - vPosition);\r
    float fresnelTerm = dot(viewDirectionW, vNormal);\r
    fresnelTerm = clamp(1. - fresnelTerm, 0., 1.);

    vec3 color = vec3(noise) + gradient;\r
    vec3 color2 = color - 0.2;

    float noisetone = setOpacity(color.r, color.g, color.b);\r
    float noisetone2 = setOpacity(color2.r, color2.g, color2.b);

    vec4 backColor = vec4(color, 1.);\r
    backColor.rgb = rgbcol(color0.r, color0.g, color0.b) * noisetone;

    vec4 frontColor = vec4(color2, 1.);\r
    frontColor.rgb = rgbcol(color1.r, color1.g, color1.b) * noisetone;

    if(noisetone2 > 0.0) {\r
        gl_FragColor = frontColor;\r
    } else {\r
        gl_FragColor = backColor;\r
    }\r
}`;const ot=Ae({__name:"index",setup(z){const r=new URL("/assets/cardtemplate-sEnNQU84.png",import.meta.url).href,e=new URL("/assets/cardtemplateback-BvAyGzq3.png",import.meta.url).href,n=new URL("/assets/flower-DW0JK3CJ.png",import.meta.url).href,t=new URL("/assets/noise2-ekzEV4zj.png",import.meta.url).href,o=new URL("/assets/color11-Bwi5cUaU.png",import.meta.url).href,u=new URL("/assets/backtexture-CZ9epn8z.png",import.meta.url).href,f=new URL("/assets/model-D230iyFB.obj",import.meta.url).href,x=new URL("/assets/voronoi-C4qDU9Fe.png",import.meta.url).href;new we;const a=new ye;let d,s,c,l,v,i,p,h;function b(){({container:d,renderer:s,scene:c,camera:l,clock:v,viewPort:i,tick:p}=De(document.querySelector(".webgl")))}function L(){l.fov=30,l.near=1,l.far=1e4,l.updateProjectionMatrix(),l.position.set(0,0,70);const g=new Le(16777215,.5);c.add(g),s.shadowMap.type=ke,s.toneMapping=Me,s.outputColorSpace=ce}function y(){h=new Te(l,s.domElement),h.enableDamping=!0,h.enableZoom=!1}function S(){Oe(i,()=>{const{width:g,height:C}=i.value;l.aspect=g/C,M.aspect=g/C,l.updateProjectionMatrix(),s.setSize(g,C,!1),P.setSize(g,C)})}let m;function _(){m=new ze({container:document.querySelector(".debug")}),We(()=>m.destroy)}const k={exposure:2.8,bloomStrength:.8,bloomThreshold:0,bloomRadius:1.29,color0:[197,81,245],color1:[65,0,170],color2:[0,150,255],isanimate:!1};new Se,Be(()=>{b(),_(),y(),S(),L(),me(),de(),ve(),fe(),p(()=>{const g=v.getElapsedTime();h.update(),pe(g),P.render(),s.render(c,l)})});let G,M,P,O;function me(){G=new _e,M=new Ce(30,i.value.viewWidth/i.value.viewHeight,1,1e4),M.position.z=60,M.position.y=-3.5;const g=new Re(G,M);O=new Ie(new B(i.value.viewWidth,i.value.viewHeight),.07,.04,.085),console.log("%c Line:420 🍬 bloomPass","color:#93c0a4",O),P=new Ne(s),P.setSize(i.value.viewWidth,i.value.viewHeight),P.addPass(g),P.addPass(O),P.renderToScreen=!1}let Q,Z;function de(){const g=new te(20,30);Z=new J({uniforms:{cardtemplate:{value:a.load(r)},backtexture:{value:a.load(u)},noise:{value:a.load(t)},skullrender:{value:P.readBuffer.texture},uResolution:{value:new B(i.value.viewWidth,i.value.viewHeight)},noiseTex:{value:a.load(x)},color:{value:a.load(o)}},fragmentShader:$e,vertexShader:ie,transparent:!0,depthWrite:!1}),Q=new D(g,Z),c.add(Q)}let W,X;function ve(){const g=new te(20,30);X=new J({uniforms:{cardtemplate:{value:a.load(e)},backtexture:{value:a.load(u)},noise:{value:a.load(t)},skullrender:{value:a.load(n)},uResolution:{value:new B(i.value.viewWidth,i.value.viewHeight)},noiseTex:{value:a.load(x)},color:{value:a.load(o)}},fragmentShader:et,vertexShader:ie,transparent:!0,depthWrite:!1}),W=new D(g,X),W.rotation.set(0,Math.PI,0),c.add(W)}let R,V=new ue,N,I;function fe(){R=new J({uniforms:{time:{value:0},color1:{value:new j(...k.color1)},color0:{value:new j(...k.color0)},uResolution:{value:new B(i.value.viewWidth,i.value.viewHeight)}},fragmentShader:rt,vertexShader:tt});const g=new Pe(1.5,32,32),C=new Ve({color:new le(...k.color2)});N=new D(g,C),I=new D(g,C),N.position.set(-2.2,-2.2,-6.6),I.position.set(2.2,-2.2,-6.6),V=new je,V.add(N),V.add(I),new Ye().load(f,T=>{T.position.set(0,0,-10),T.rotation.set(Math.PI,0,Math.PI),T.children.forEach((he,st)=>{he.traverse(U=>{U.geometry=Ue(U.geometry),U.geometry.computeTangents(),U.geometry.computeVertexNormals(),U.material.flatShading=!0,U.material=R})}),T.scale.set(10,10,10),V.add(T),V.position.set(0,1,0),G.add(V)})}function pe(g){V.rotation.set(-l.rotation.x,-l.rotation.y,0),R&&(R.uniforms.time.value=g/10,I.material.color.setRGB(...k.color2),N.material.color.setRGB(...k.color2))}return(g,C)=>(He(),Ee(Fe,null,{default:Ge(()=>C[0]||(C[0]=[re("div",{class:"webgl"},null,-1),re("div",{class:"debug"},null,-1)])),_:1}))}}),dt=qe(ot,[["__scopeId","data-v-759d37e5"]]);export{dt as default};

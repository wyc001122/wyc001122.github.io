import{a0 as W,a1 as O,r as k,a2 as G,a3 as X,a4 as j,a5 as q,a6 as V}from"./GLTFLoader-Cpm_xSlR.js";class le extends W{constructor(l){super(l),this.type=O}parse(l){const n=function(a,s){switch(a){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(s||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(s||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(s||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(s||""))}},P=`
`,D=function(a,s,t){s=s||1024;let f=a.pos,d=-1,i=0,h="",o=String.fromCharCode.apply(null,new Uint16Array(a.subarray(f,f+128)));for(;0>(d=o.indexOf(P))&&i<s&&f<a.byteLength;)h+=o,i+=o.length,f+=128,o+=String.fromCharCode.apply(null,new Uint16Array(a.subarray(f,f+128)));return-1<d?(a.pos+=i+d+1,h+o.slice(0,d)):!1},r=function(a){const s=/^#\?(\S+)/,t=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,m=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,f=/^\s*FORMAT=(\S+)\s*$/,d=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,i={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};let h,o;for((a.pos>=a.byteLength||!(h=D(a)))&&n(1,"no header found"),(o=h.match(s))||n(3,"bad initial token"),i.valid|=1,i.programtype=o[1],i.string+=h+`
`;h=D(a),h!==!1;){if(i.string+=h+`
`,h.charAt(0)==="#"){i.comments+=h+`
`;continue}if((o=h.match(t))&&(i.gamma=parseFloat(o[1])),(o=h.match(m))&&(i.exposure=parseFloat(o[1])),(o=h.match(f))&&(i.valid|=2,i.format=o[1]),(o=h.match(d))&&(i.valid|=4,i.height=parseInt(o[1],10),i.width=parseInt(o[2],10)),i.valid&2&&i.valid&4)break}return i.valid&2||n(3,"missing format specifier"),i.valid&4||n(3,"missing image size specifier"),i},M=function(a,s,t){const m=s;if(m<8||m>32767||a[0]!==2||a[1]!==2||a[2]&128)return new Uint8Array(a);m!==(a[2]<<8|a[3])&&n(3,"wrong scanline width");const f=new Uint8Array(4*s*t);f.length||n(4,"unable to allocate buffer space");let d=0,i=0;const h=4*m,o=new Uint8Array(4),x=new Uint8Array(h);let U=t;for(;U>0&&i<a.byteLength;){i+4>a.byteLength&&n(1),o[0]=a[i++],o[1]=a[i++],o[2]=a[i++],o[3]=a[i++],(o[0]!=2||o[1]!=2||(o[2]<<8|o[3])!=m)&&n(3,"bad rgbe scanline format");let B=0,L;for(;B<h&&i<a.byteLength;){L=a[i++];const N=L>128;if(N&&(L-=128),(L===0||B+L>h)&&n(3,"bad scanline data"),N){const $=a[i++];for(let z=0;z<L;z++)x[B++]=$}else x.set(a.subarray(i,i+L),B),B+=L,i+=L}const K=m;for(let N=0;N<K;N++){let $=0;f[d]=x[N+$],$+=m,f[d+1]=x[N+$],$+=m,f[d+2]=x[N+$],$+=m,f[d+3]=x[N+$],d+=4}U--}return f},T=function(a,s,t,m){const f=a[s+3],d=Math.pow(2,f-128)/255;t[m+0]=a[s+0]*d,t[m+1]=a[s+1]*d,t[m+2]=a[s+2]*d,t[m+3]=1},E=function(a,s,t,m){const f=a[s+3],d=Math.pow(2,f-128)/255;t[m+0]=G.toHalfFloat(Math.min(a[s+0]*d,65504)),t[m+1]=G.toHalfFloat(Math.min(a[s+1]*d,65504)),t[m+2]=G.toHalfFloat(Math.min(a[s+2]*d,65504)),t[m+3]=G.toHalfFloat(1)},_=new Uint8Array(l);_.pos=0;const R=r(_),A=R.width,p=R.height,H=M(_.subarray(_.pos),A,p);let C,F,I;switch(this.type){case k:I=H.length/4;const a=new Float32Array(I*4);for(let t=0;t<I;t++)T(H,t*4,a,t*4);C=a,F=k;break;case O:I=H.length/4;const s=new Uint16Array(I*4);for(let t=0;t<I;t++)E(H,t*4,s,t*4);C=s,F=O;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:A,height:p,data:C,header:R.string,gamma:R.gamma,exposure:R.exposure,type:F}}setDataType(l){return this.type=l,this}load(l,v,u,w){function b(n,g){switch(n.type){case k:case O:n.colorSpace=X,n.minFilter=j,n.magFilter=j,n.generateMipmaps=!1,n.flipY=!0;break}v&&v(n,g)}return super.load(l,b,u,w)}}const Z=`
    
#ifdef IS_VERTEX
    vec3 csm_Position;
    vec4 csm_PositionRaw;
    vec3 csm_Normal;

    // csm_PointSize
    #ifdef IS_POINTSMATERIAL
        float csm_PointSize;
    #endif
#else
    vec4 csm_DiffuseColor;
    vec4 csm_FragColor;
    float csm_UnlitFac;

    // csm_Emissive, csm_Roughness, csm_Metalness
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
        vec3 csm_Emissive;
        float csm_Roughness;
        float csm_Metalness;
        float csm_Iridescence;
        
        #if defined IS_MESHPHYSICALMATERIAL
            float csm_Clearcoat;
            float csm_ClearcoatRoughness;
            vec3 csm_ClearcoatNormal;
            float csm_Transmission;
            float csm_Thickness;
        #endif
    #endif

    // csm_AO
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHBASICMATERIAL || defined IS_MESHLAMBERTMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHTOONMATERIAL
        float csm_AO;
    #endif

    // csm_Bump
    #if defined IS_MESHLAMBERTMATERIAL || defined IS_MESHMATCAPMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHSTANDARDMATERIAL || defined IS_MESHTOONMATERIAL || defined IS_SHADOWMATERIAL 
        vec3 csm_Bump;
        vec3 csm_FragNormal;
    #endif

    float csm_DepthAlpha;
#endif
`,J=`

#ifdef IS_VERTEX
    // csm_Position & csm_PositionRaw
    #ifdef IS_UNKNOWN
        csm_Position = vec3(0.0);
        csm_PositionRaw = vec4(0.0);
        csm_Normal = vec3(0.0);
    #else
        csm_Position = position;
        csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        csm_Normal = normal;
    #endif

    // csm_PointSize
    #ifdef IS_POINTSMATERIAL
        csm_PointSize = size;
    #endif
#else
    csm_UnlitFac = 0.0;

    // csm_DiffuseColor & csm_FragColor
    #if defined IS_UNKNOWN || defined IS_SHADERMATERIAL || defined IS_MESHDEPTHMATERIAL || defined IS_MESHDISTANCEMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_SHADOWMATERIAL
        csm_DiffuseColor = vec4(1.0, 0.0, 1.0, 1.0);
        csm_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    #else
        #ifdef USE_MAP
            vec4 _csm_sampledDiffuseColor = texture2D(map, vMapUv);

            #ifdef DECODE_VIDEO_TEXTURE
            // inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)
            _csm_sampledDiffuseColor = vec4(mix(pow(_csm_sampledDiffuseColor.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), _csm_sampledDiffuseColor.rgb * 0.0773993808, vec3(lessThanEqual(_csm_sampledDiffuseColor.rgb, vec3(0.04045)))), _csm_sampledDiffuseColor.w);
            #endif

            csm_DiffuseColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;
            csm_FragColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;
        #else
            csm_DiffuseColor = vec4(diffuse, opacity);
            csm_FragColor = vec4(diffuse, opacity);
        #endif
    #endif

    // csm_Emissive, csm_Roughness, csm_Metalness
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
        csm_Emissive = emissive;
        csm_Roughness = roughness;
        csm_Metalness = metalness;

        #ifdef USE_IRIDESCENCE
            csm_Iridescence = iridescence;
        #else
            csm_Iridescence = 0.0;
        #endif

        #if defined IS_MESHPHYSICALMATERIAL
            #ifdef USE_CLEARCOAT
                csm_Clearcoat = clearcoat;
                csm_ClearcoatRoughness = clearcoatRoughness;
            #else
                csm_Clearcoat = 0.0;
                csm_ClearcoatRoughness = 0.0;
            #endif

            #ifdef USE_TRANSMISSION
                csm_Transmission = transmission;
                csm_Thickness = thickness;
            #else
                csm_Transmission = 0.0;
                csm_Thickness = 0.0;
            #endif
        #endif
    #endif

    // csm_AO
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHBASICMATERIAL || defined IS_MESHLAMBERTMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHTOONMATERIAL
        csm_AO = 0.0;
    #endif

    // csm_Bump
    #if defined IS_MESHLAMBERTMATERIAL || defined IS_MESHMATCAPMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHSTANDARDMATERIAL || defined IS_MESHTOONMATERIAL || defined IS_SHADOWMATERIAL 
        csm_Bump = vec3(0.0);
        #ifdef FLAT_SHADED
            vec3 fdx = dFdx( vViewPosition );
            vec3 fdy = dFdy( vViewPosition );
            csm_FragNormal = normalize( cross( fdx, fdy ) );
        #else
            csm_FragNormal = normalize(vNormal);
            #ifdef DOUBLE_SIDED
                csm_FragNormal *= gl_FrontFacing ? 1.0 : - 1.0;
            #endif
        #endif
    #endif

    csm_DepthAlpha = 1.0;
#endif
`,Q=`
    varying mat4 csm_internal_vModelViewMatrix;
`,ee=`
    csm_internal_vModelViewMatrix = modelViewMatrix;
`,ae=`
    varying mat4 csm_internal_vModelViewMatrix;
`,re=`
    
`,e={diffuse:"csm_DiffuseColor",roughness:"csm_Roughness",metalness:"csm_Metalness",emissive:"csm_Emissive",ao:"csm_AO",bump:"csm_Bump",fragNormal:"csm_FragNormal",clearcoat:"csm_Clearcoat",clearcoatRoughness:"csm_ClearcoatRoughness",clearcoatNormal:"csm_ClearcoatNormal",transmission:"csm_Transmission",thickness:"csm_Thickness",iridescence:"csm_Iridescence",pointSize:"csm_PointSize",fragColor:"csm_FragColor",depthAlpha:"csm_DepthAlpha",unlitFac:"csm_UnlitFac",position:"csm_Position",positionRaw:"csm_PositionRaw",normal:"csm_Normal"},ie={[`${e.position}`]:"*",[`${e.positionRaw}`]:"*",[`${e.normal}`]:"*",[`${e.depthAlpha}`]:"*",[`${e.pointSize}`]:["PointsMaterial"],[`${e.diffuse}`]:"*",[`${e.fragColor}`]:"*",[`${e.fragNormal}`]:"*",[`${e.unlitFac}`]:"*",[`${e.emissive}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.roughness}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.metalness}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.iridescence}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.ao}`]:["MeshStandardMaterial","MeshPhysicalMaterial","MeshBasicMaterial","MeshLambertMaterial","MeshPhongMaterial","MeshToonMaterial"],[`${e.bump}`]:["MeshLambertMaterial","MeshMatcapMaterial","MeshNormalMaterial","MeshPhongMaterial","MeshPhysicalMaterial","MeshStandardMaterial","MeshToonMaterial","ShadowMaterial"],[`${e.clearcoat}`]:["MeshPhysicalMaterial"],[`${e.clearcoatRoughness}`]:["MeshPhysicalMaterial"],[`${e.clearcoatNormal}`]:["MeshPhysicalMaterial"],[`${e.transmission}`]:["MeshPhysicalMaterial"],[`${e.thickness}`]:["MeshPhysicalMaterial"]},se={"*":{"#include <lights_physical_fragment>":V.lights_physical_fragment,"#include <transmission_fragment>":V.transmission_fragment},[`${e.normal}`]:{"#include <beginnormal_vertex>":`
    vec3 objectNormal = ${e.normal};
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `},[`${e.position}`]:{"#include <begin_vertex>":`
    vec3 transformed = ${e.position};
  `},[`${e.positionRaw}`]:{"#include <begin_vertex>":`
    vec4 csm_internal_positionUnprojected = ${e.positionRaw};
    mat4x4 csm_internal_unprojectMatrix = projectionMatrix * modelViewMatrix;
    #ifdef USE_INSTANCING
      csm_internal_unprojectMatrix = csm_internal_unprojectMatrix * instanceMatrix;
    #endif
    csm_internal_positionUnprojected = inverse(csm_internal_unprojectMatrix) * csm_internal_positionUnprojected;
    vec3 transformed = csm_internal_positionUnprojected.xyz;
  `},[`${e.pointSize}`]:{"gl_PointSize = size;":`
    gl_PointSize = ${e.pointSize};
    `},[`${e.diffuse}`]:{"#include <color_fragment>":`
    #include <color_fragment>
    diffuseColor = ${e.diffuse};
  `},[`${e.fragColor}`]:{"#include <opaque_fragment>":`
    #include <opaque_fragment>
    gl_FragColor = mix(gl_FragColor, ${e.fragColor}, ${e.unlitFac});
  `},[`${e.emissive}`]:{"vec3 totalEmissiveRadiance = emissive;":`
    vec3 totalEmissiveRadiance = ${e.emissive};
    `},[`${e.roughness}`]:{"#include <roughnessmap_fragment>":`
    #include <roughnessmap_fragment>
    roughnessFactor = ${e.roughness};
    `},[`${e.metalness}`]:{"#include <metalnessmap_fragment>":`
    #include <metalnessmap_fragment>
    metalnessFactor = ${e.metalness};
    `},[`${e.ao}`]:{"#include <aomap_fragment>":`
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - ${e.ao};
    `},[`${e.bump}`]:{"#include <normal_fragment_maps>":`
    #include <normal_fragment_maps>

    vec3 csm_internal_orthogonal = ${e.bump} - (dot(${e.bump}, normal) * normal);
    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;
    normal = normalize(normal - csm_internal_projectedbump);
    `},[`${e.fragNormal}`]:{"#include <normal_fragment_maps>":`
      #include <normal_fragment_maps>
      normal = ${e.fragNormal};
    `},[`${e.depthAlpha}`]:{"gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );":`
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * 1.0 - ${e.depthAlpha} );
    `,"gl_FragColor = packDepthToRGBA( fragCoordZ );":`
      if(${e.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `,"gl_FragColor = packDepthToRGBA( dist );":`
      if(${e.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `},[`${e.clearcoat}`]:{"material.clearcoat = clearcoat;":`material.clearcoat = ${e.clearcoat};`},[`${e.clearcoatRoughness}`]:{"material.clearcoatRoughness = clearcoatRoughness;":`material.clearcoatRoughness = ${e.clearcoatRoughness};`},[`${e.clearcoatNormal}`]:{"#include <clearcoat_normal_fragment_begin>":`
      vec3 csm_coat_internal_orthogonal = csm_ClearcoatNormal - (dot(csm_ClearcoatNormal, nonPerturbedNormal) * nonPerturbedNormal);
      vec3 csm_coat_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_coat_internal_orthogonal;
      vec3 clearcoatNormal = normalize(nonPerturbedNormal - csm_coat_internal_projectedbump);
    `},[`${e.transmission}`]:{"material.transmission = transmission;":`
      material.transmission = ${e.transmission};
    `},[`${e.thickness}`]:{"material.thickness = thickness;":`
      material.thickness = ${e.thickness};
    `},[`${e.iridescence}`]:{"material.iridescence = iridescence;":`
      material.iridescence = ${e.iridescence};
    `}},te={clearcoat:[e.clearcoat,e.clearcoatNormal,e.clearcoatRoughness],transmission:[e.transmission],iridescence:[e.iridescence]};function ne(y){let l=0;for(let u=0;u<y.length;u++)l=y.charCodeAt(u)+(l<<6)+(l<<16)-l;const v=l>>>0;return String(v)}function oe(y){try{new y}catch(l){if(l.message.indexOf("is not a constructor")>=0)return!1}return!0}function Y(y){return y.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,"")}class me extends q{constructor({baseMaterial:l,vertexShader:v,fragmentShader:u,uniforms:w,patchMap:b,cacheKey:n,...g}){if(!l)throw new Error("CustomShaderMaterial: baseMaterial is required.");let c;if(oe(l)){const r=Object.keys(g).length===0;c=new l(r?void 0:g)}else c=l,Object.assign(c,g);if(["ShaderMaterial","RawShaderMaterial"].includes(c.type))throw new Error(`CustomShaderMaterial does not support ${c.type} as a base material.`);super(),this.uniforms={},this.vertexShader="",this.fragmentShader="";const S=c;S.name=`CustomShaderMaterial<${c.name||c.type}>`,S.update=this.update.bind(S),S.__csm={prevOnBeforeCompile:c.onBeforeCompile};const P={...S.uniforms||{},...w||{}};S.uniforms=this.uniforms=P,S.vertexShader=this.vertexShader=v||"",S.fragmentShader=this.fragmentShader=u||"",S.update({fragmentShader:S.fragmentShader,vertexShader:S.vertexShader,uniforms:S.uniforms,patchMap:b,cacheKey:n}),Object.assign(this,S);const D=Object.getOwnPropertyDescriptors(Object.getPrototypeOf(S));for(const r in D){const M=D[r];(M.get||M.set)&&Object.defineProperty(this,r,M)}return this}update({fragmentShader:l,vertexShader:v,uniforms:u,cacheKey:w,patchMap:b}){const n=Y(v||""),g=Y(l||""),c=this;u&&(c.uniforms=u),v&&(c.vertexShader=v),l&&(c.fragmentShader=l),Object.entries(te).forEach(([r,M])=>{for(const T in M){const E=M[T];(g&&g.includes(E)||n&&n.includes(E))&&(c[r]||(c[r]=1))}});const S=c.__csm.prevOnBeforeCompile,P=(r,M,T)=>{var E;let _,R="";if(M){const A=/void\s+main\s*\(\s*\)[^{]*{((?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*})*})*})/gm;_=(E=M.matchAll(A).next().value)==null?void 0:E[1],_&&(_=_.slice(0,-1));const p=/void\s+main\s*\(\s*\)\s*{/gm,H=M.search(p);R=M.slice(0,H)}if(T&&M&&M.includes(e.fragColor)&&_&&(_=`csm_UnlitFac = 1.0;
`+_),r.includes("//~CSM_DEFAULTS")){r=r.replace("void main() {",`
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${R}
          
          void main() {
          `);const A=r.lastIndexOf("//~CSM_MAIN_END");if(A!==-1){const p=`
            ${_?`${_}`:""}
            //~CSM_MAIN_END
          `;r=r.slice(0,A)+p+r.slice(A)}}else{const A=/void\s*main\s*\(\s*\)\s*{/gm;r=r.replace(A,`
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          //~CSM_DEFAULTS
          ${T?ae:Q}
          ${Z}
  
          ${R}
          
          void main() {
            {
              ${J}
            }
            ${T?re:ee}

            ${_?`${_}`:""}
            //~CSM_MAIN_END
          `)}return r};c.onBeforeCompile=(r,M)=>{S==null||S(r,M);const T=b||{},E=c.type,_=E?`#define IS_${E.toUpperCase()};
`:`#define IS_UNKNOWN;
`;r.vertexShader=_+`#define IS_VERTEX
`+r.vertexShader,r.fragmentShader=_+`#define IS_FRAGMENT
`+r.fragmentShader;const R=A=>{for(const p in A){const H=p==="*"||n&&n.includes(p);if(p==="*"||g&&g.includes(p)||H){const C=ie[p];if(C&&C!=="*"&&(Array.isArray(C)?!C.includes(E):C!==E)){console.error(`CustomShaderMaterial: ${p} is not available in ${E}. Shader cannot compile.`);return}const F=A[p];for(const I in F){const a=F[I];if(typeof a=="object"){const s=a.type,t=a.value;s==="fs"?r.fragmentShader=r.fragmentShader.replace(I,t):s==="vs"&&(r.vertexShader=r.vertexShader.replace(I,t))}else a&&(r.vertexShader=r.vertexShader.replace(I,a),r.fragmentShader=r.fragmentShader.replace(I,a))}}}};R(se),R(T),r.vertexShader=P(r.vertexShader,n,!1),r.fragmentShader=P(r.fragmentShader,g,!0),u&&(r.uniforms={...r.uniforms,...c.uniforms}),c.uniforms=r.uniforms};const D=c.customProgramCacheKey;c.customProgramCacheKey=()=>((w==null?void 0:w())||ne((n||"")+(g||"")))+(D==null?void 0:D.call(c)),c.needsUpdate=!0}}export{le as R,me as z};

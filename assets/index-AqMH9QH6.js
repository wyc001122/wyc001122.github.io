var X=Object.defineProperty;var Y=(u,o,a)=>o in u?X(u,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):u[o]=a;var S=(u,o,a)=>Y(u,typeof o!="symbol"?o+"":o,a);import{w as C,C as h,ar as U,a7 as $,c as ee,G as oe,T as ae,as as F,R as ie,a as D,ak as re,at as I,D as te,u as se,au as ne,j as le,av as ue,k as de,am as ce,l as me,O as pe,b as ge,K as fe,aw as he}from"./GLTFLoader-Cpm_xSlR.js";import{M as ve}from"./MeshSurfaceSampler-8_L5t4lS.js";import{d as we,f as Ce,p as Se,k as xe,w as be,q as ye,o as _e,h as A}from"./index-qyBmO-yZ.js";import{a as De}from"./_plugin-vue_export-helper-CQ7wvoWd.js";class Te{constructor(o){S(this,"material");S(this,"grassColorProps",{baseColor:"#313f1b",tipColor1:"#9bd38d",tipColor2:"#1f352a"});S(this,"uniforms",{uTime:{value:0},uEnableShadows:{value:!0},uShadowDarkness:{value:.5},uGrassLightIntensity:{value:1},uNoiseScale:{value:1.5},uPlayerPosition:{value:new C},baseColor:{value:new h(this.grassColorProps.baseColor)},tipColor1:{value:new h(this.grassColorProps.tipColor1)},tipColor2:{value:new h(this.grassColorProps.tipColor2)},noiseTexture:{value:new U},grassAlphaTexture:{value:new U}});this.mergeUniforms(o),this.material=new $({side:ee,color:2267460,transparent:!0,alphaTest:.1,shadowSide:1}),this.setupGrassMaterial(this.material)}mergeUniforms(o){if(o)for(const[a,n]of Object.entries(o))n&&this.uniforms.hasOwnProperty(a)&&(this.uniforms[a].value=n)}updateGrassGraphicsChange(o=!0){o?this.uniforms.uEnableShadows.value=!0:this.uniforms.uEnableShadows.value=!1}update(o){this.uniforms.uTime.value=o}setupGrassMaterial(o){o.onBeforeCompile=a=>{a.uniforms={...a.uniforms,uTime:this.uniforms.uTime,uTipColor1:this.uniforms.tipColor1,uTipColor2:this.uniforms.tipColor2,uBaseColor:this.uniforms.baseColor,uEnableShadows:this.uniforms.uEnableShadows,uShadowDarkness:this.uniforms.uShadowDarkness,uGrassLightIntensity:this.uniforms.uGrassLightIntensity,uNoiseScale:this.uniforms.uNoiseScale,uNoiseTexture:this.uniforms.noiseTexture,uGrassAlphaTexture:this.uniforms.grassAlphaTexture,fogColor2:this.uniforms.fogColor2,fogColor3:this.uniforms.fogColor3},a.vertexShader=`
      // FOG
      #include <common>
      #include <fog_pars_vertex>
      // FOG
      #include <shadowmap_pars_vertex>
      uniform sampler2D uNoiseTexture;
      uniform float uNoiseScale;
      uniform float uTime;
      
      varying vec3 vColor;
      varying vec2 vGlobalUV;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vWindColor;
      void main() {
        #include <color_vertex>
        
        // FOG
        #include <begin_vertex>
        #include <project_vertex>
        #include <fog_vertex>
        // FOG
        
        // SHADOW
        #include <beginnormal_vertex>
        #include <defaultnormal_vertex>
        #include <worldpos_vertex>
        #include <shadowmap_vertex>
        // SHADOW

        // wind effect
        vec2 uWindDirection = vec2(1.0,1.0);
        float uWindAmp = 0.1;
        float uWindFreq = 50.;
        float uSpeed = 1.0;
        float uNoiseFactor = 5.50;
        float uNoiseSpeed = 0.001;

        vec2 windDirection = normalize(uWindDirection); // Normalize the wind direction
        vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);

        float terrainSize = 100.;
        vGlobalUV = (terrainSize-vec2(modelPosition.xz))/terrainSize;

        vec4 noise = texture2D(uNoiseTexture,vGlobalUV+uTime*uNoiseSpeed);

        float sinWave = sin(uWindFreq*dot(windDirection, vGlobalUV) + noise.g*uNoiseFactor + uTime * uSpeed) * uWindAmp * (1.-uv.y);

        float xDisp = sinWave;
        float zDisp = sinWave;
        modelPosition.x += xDisp;
        modelPosition.z += zDisp;

        // use perlinNoise to vary the terrainHeight of the grass
        modelPosition.y += exp(texture2D(uNoiseTexture,vGlobalUV * uNoiseScale).r) * 0.5 * (1.-uv.y);

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;

        // assign varyings
        vUv = vec2(uv.x,1.-uv.y);
        vNormal = normalize(normalMatrix * normal);
        vWindColor = vec2(xDisp,zDisp);
        vViewPosition = mvPosition.xyz;
      }    
      `,a.fragmentShader=`
      #include <alphatest_pars_fragment>
      #include <alphamap_pars_fragment>
      // FOG
      #include <fog_pars_fragment>
      // FOG

      #include <common>
      #include <packing>
      #include <lights_pars_begin>
      #include <shadowmap_pars_fragment>
      #include <shadowmask_pars_fragment>
      
      uniform float uTime;
      uniform vec3 uBaseColor;
      uniform vec3 uTipColor1;
      uniform vec3 uTipColor2;
      uniform sampler2D uGrassAlphaTexture;
      uniform sampler2D uNoiseTexture;
      uniform float uNoiseScale;
      uniform int uEnableShadows;
      
      uniform float uGrassLightIntensity;
      uniform float uShadowDarkness;
      uniform float uDayTime;
      varying vec3 vColor;
      
      varying vec2 vUv;
      varying vec2 vGlobalUV;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vWindColor;
      
      void main() {
        vec4 grassAlpha = texture2D(uGrassAlphaTexture,vUv);

        vec4 grassVariation = texture2D(uNoiseTexture, vGlobalUV * uNoiseScale);
        vec3 tipColor = mix(uTipColor1,uTipColor2,grassVariation.r);
        
        vec4 diffuseColor = vec4( mix(uBaseColor,tipColor,vUv.y), step(0.1,grassAlpha.r) );
        vec3 grassFinalColor = diffuseColor.rgb * uGrassLightIntensity;
        
        // light calculation derived from <lights_fragment_begin>
        vec3 geometryPosition = vViewPosition;
        vec3 geometryNormal = vNormal;
        vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
        vec3 geometryClearcoatNormal;
          IncidentLight directLight;
          float shadow = 0.0;
          float currentShadow = 0.0;
          float NdotL;
          if(uEnableShadows == 1){
            #if ( NUM_DIR_LIGHTS > 0) 
              DirectionalLight directionalLight;
            #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
              DirectionalLightShadow directionalLightShadow;
            #endif
              #pragma unroll_loop_start
              for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
                directionalLight = directionalLights[ i ];
                getDirectionalLightInfo( directionalLight, directLight );
                directionalLightShadow = directionalLightShadows[ i ];
                // currentShadow = getShadow( directionalShadowMap[ i ], 
                //   directionalLightShadow.shadowMapSize, 
                //   directionalLightShadow.shadowBias, 
                //   directionalLightShadow.shadowRadius, 
                //   vDirectionalShadowCoord[ i ] );
                currentShadow = all( bvec2( directLight.visible, receiveShadow ) ) ? currentShadow : 1.0;
                float weight = clamp( pow( length( vDirectionalShadowCoord[ i ].xy * 2. - 1. ), 4. ), .0, 1. );

                shadow += mix( currentShadow, 1., weight);
              }
              #pragma unroll_loop_end
            #endif
            grassFinalColor = mix(grassFinalColor , grassFinalColor * uShadowDarkness,  1.-shadow) ;
          } else{
            grassFinalColor = grassFinalColor ;
          }
        diffuseColor.rgb = clamp(diffuseColor.rgb*shadow,0.0,1.0);

        #include <alphatest_fragment>
        gl_FragColor = vec4(grassFinalColor ,1.0);

        // uncomment to visualize wind
        // vec3 windColorViz = vec3((vWindColor.x+vWindColor.y)/2.);
        // gl_FragColor = vec4(windColorViz,1.0);
        
        #include <tonemapping_fragment>
        #include <colorspace_fragment>

        // FOG
        #include <fog_fragment>
        // FOG

      }
      
    `}}setupTextures(o,a){this.uniforms.grassAlphaTexture.value=o,this.uniforms.noiseTexture.value=a}setupGUI(o){const a=o.addFolder("Grass Props");a.addColor(this.grassColorProps,"baseColor").onChange(n=>{this.uniforms.baseColor.value.set(n)}),a.addColor(this.grassColorProps,"tipColor1").onChange(n=>{this.uniforms.tipColor1.value.set(n)}),a.addColor(this.grassColorProps,"tipColor2").onChange(n=>{this.uniforms.tipColor2.value.set(n)}),a.add(this.uniforms.uNoiseScale,"value",0,5).name("Noise Scale"),a.add(this.uniforms.uGrassLightIntensity,"value",0,2).name("Light Intensity"),a.add(this.uniforms.uShadowDarkness,"value",0,1).name("ShadowDarkness"),a.add(this.uniforms.uEnableShadows,"value").name("Enable Shadows"),a.open()}}const z=8e3,Le=we({__name:"index",setup(u){const o=new oe,a=new ae;let n,l,t,g,T,x,L,d;function V(){({container:n,renderer:l,scene:t,camera:g,clock:T,viewPort:x,tick:L}=se(document.querySelector(".webgl")))}const c={fogColor:"#eeeeee",terrainColor:"#5e875e",fogDensity:.02};function W(){g.position.set(-17,12,-10),t.background=new h(c.fogColor),t.fog=new ne(c.fogColor,c.fogDensity),l.shadowMap.enabled=!0,l.shadowMap.autoUpdate=!0,l.shadowMap.type=le,l.outputColorSpace=ue,l.toneMapping=de,t.frustumCulled=!0;const i=new ce(16777215,.5);t.add(i);const e=new me(16777215,2);e.castShadow=!0,e.position.set(100,100,100),e.shadow.camera.far=200,e.shadow.camera.left=-50,e.shadow.camera.right=50,e.shadow.camera.top=50,e.shadow.camera.bottom=-50,e.shadow.mapSize.set(2048,2048),t.add(e)}function k(){d=new pe(g,l.domElement),d.enableDamping=!0,d.autoRotate=!0,d.autoRotateSpeed=-.5,d.enableDamping=!0}function O(){be(x,()=>{const{width:i,height:e}=x.value;g.aspect=i/e,g.updateProjectionMatrix(),l.setSize(i,e,!1)})}let v;function E(){v=new ge({container:document.querySelector(".debug")}),ye(()=>v.destroy)}const G={uTime:{value:0},color:{value:new h("#0000ff")}};Ce(()=>{V(),E(),k(),O(),W(),R(),B(),H(),j(),L(()=>{const i=T.getElapsedTime();d.update(),G.uTime.value=i,w.update(G.uTime.value),l.render(t,g)})});let w,b;function R(){w=new Te,b=new F({color:c.terrainColor})}let m;function B(){v.close();const i=v.domElement.parentElement;i.style.zIndex="9999",i.style.position="fixed",i.style.top="0",i.style.left="0",i.style.right="auto",i.style.display="block",m=v.addFolder("Scene Properties"),m.add(d,"autoRotate").name("Auto Rotate"),m.add(c,"fogDensity",0,.05,1e-6).onChange(e=>{t.fog.density=e}),m.addColor(c,"fogColor").onChange(e=>{var r;(r=t.fog)==null||r.color.set(e),t.background=new h(e)}),w.setupGUI(m),m.open()}let f={};function H(){f.perlinNoise=a.load(new URL("/texture/noise/perlinnoise.webp",import.meta.url).href),f.perlinNoise.wrapS=f.perlinNoise.wrapT=ie,f.grassAlpha=a.load(new URL("/assets/grass-DaWHTdM9.jpeg",import.meta.url).href),w.setupTextures(f.grassAlpha,f.perlinNoise)}let M;function j(){m.addColor(c,"terrainColor").onChange(e=>{b.color.set(e)}),o.load(new URL("/assets/island-Z5f2JUVg.glb",import.meta.url).href,e=>{let r;e.scene.traverse(s=>{s instanceof D&&(s.material=b,s.receiveShadow=!0,s.geometry.scale(3,3,3),r=s)}),t.add(e.scene),o.load(new URL("/assets/grassLODs-D_S0tGie.glb",import.meta.url).href,s=>{s.scene.traverse(p=>{p instanceof D&&p.name.includes("LOD00")&&(p.geometry.scale(5,5,5),M=p.geometry)}),q(r,M)})});const i=new F({color:3355443});o.load(new URL("/assets/fluffy_grass_text-D0MzLhsQ.glb",import.meta.url).href,e=>{e.scene.traverse(r=>{r instanceof D&&(r.material=i,r.geometry.scale(3,3,3),r.position.y+=.5,r.castShadow=!0,r.receiveShadow=!0)}),t.add(e.scene)})}function q(i,e){const r=new ve(i).setWeightAttribute("color").build(),s=new re(e,w.material,z);s.receiveShadow=!0;const p=new C,y=new I,Q=new C(1,1,1),P=new C,J=new C(0,1,0),N=new fe;for(let _=0;_<z;_++){r.sample(p,P),y.setFromUnitVectors(J,P);const K=new he(0,Math.random()*Math.PI*2,0),Z=new I().setFromEuler(K);y.multiply(Z),N.compose(p,y,Q),s.setMatrixAt(_,N)}t.add(s)}return(i,e)=>(_e(),Se(te,null,{default:xe(()=>e[0]||(e[0]=[A("div",{class:"webgl"},null,-1),A("div",{class:"debug"},null,-1)])),_:1}))}}),Fe=De(Le,[["__scopeId","data-v-bc756bb9"]]);export{Fe as default};

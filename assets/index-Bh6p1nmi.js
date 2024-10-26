import{G as O,T as X,U as o,a as Z,P as k,M as E,d as H,e as q,S as J,V as K,f as Q,D as W,u as $,O as ee,b as ne}from"./GLTFLoader-Cpm_xSlR.js";import{D as te}from"./DRACOLoader-DJmNJuvT.js";import{G as ie}from"./GPUComputationRenderer-CzXY8eDU.js";import{d as oe,f as ae,p as re,k as le,w as se,q as ce,o as ue,h as D}from"./index-qyBmO-yZ.js";import{a as me}from"./_plugin-vue_export-helper-CQ7wvoWd.js";import"./Pass-8nf9LS6g.js";var de=`uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;

attribute vec2 aParticlesUv;
attribute vec3 aColor;
attribute float aSize;

varying vec3 vColor;

void main()
{   
    
    vec4 particle = texture(uParticlesTexture, aParticlesUv);

    
    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    
    float sizeIn = smoothstep(0.0, 0.1, particle.a);
    float sizeOut = 1.0 - smoothstep(0.7, 1.0, particle.a);
    float size = min(sizeIn, sizeOut);

    
    gl_PointSize = size * aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    
    vColor = aColor;
}`,pe=`varying vec3 vColor;

void main()
{   
    
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if(distanceToCenter > 0.5)
        discard;
    
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`,xe=`uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float simplexNoise4d(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  
                        0.309016994374947451); 

  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );

  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

void main()
{
    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    
    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);
    
    
    if(particle.a >= 1.0)
    {
        particle.a = mod(particle.a, 1.0);
        particle.xyz = base.xyz;
    }

    
    else
    {
        
        float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
        float influence = (uFlowFieldInfluence - 0.5) * (- 2.0);
        strength = smoothstep(influence, 1.0, strength);

        
        vec3 flowField = vec3(
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))
        );
        flowField = normalize(flowField);

        
        particle.xyz += flowField * uDeltaTime * strength * uFlowFieldStrength;

        
        particle.a += uDeltaTime * 0.3;
    }
    
    gl_FragColor = particle;
}`;const ve=oe({__name:"index",setup(fe){const C=new te;C.setDecoderPath("/draco/");const b=new O;b.setDRACOLoader(C),new X;let I,c,F,u,P,p,T,g;function M(){({container:I,renderer:c,scene:F,camera:u,clock:P,viewPort:p,tick:T}=$(document.querySelector(".webgl")))}function j(){u.position.set(9,5,9),c.setClearColor("#29191f")}function A(){g=new ee(u,c.domElement),g.enableDamping=!0}function R(){se(p,()=>{const{width:a,height:e}=p.value;u.aspect=a/e,u.updateProjectionMatrix(),c.setSize(a,e,!1)})}let x;function V(){x=new ne({container:document.querySelector(".debug")}),ce(()=>x.destroy)}let S;const t={},v={};ae(()=>{M(),j(),A(),R(),V(),B();let a=0;T(()=>{const e=P.getElapsedTime(),l=e-a;a=e,t.particlesVariable&&(t.particlesVariable.material.uniforms.uTime.value=e,t.particlesVariable.material.uniforms.uDeltaTime.value=l,t.computation.compute()),v.points&&(v.material.uniforms.uParticlesTexture.value=t.computation.getCurrentRenderTarget(t.particlesVariable).texture),g.update(),c.render(F,u)})});function B(){b.load(new URL("/assets/ship-1AEEyafl.glb",import.meta.url).href,a=>{S=a.scene.children[0];const e=S.geometry,l=e.attributes.position.count,f=t.size=~~Math.sqrt(l),w=t.computation=new ie(t.size,t.size,c),m=w.createTexture();for(let i=0;i<l;i++){const r=i*3,s=i*4,d=e.attributes.position.array;m.image.data[s+0]=d[r+0],m.image.data[s+1]=d[r+1],m.image.data[s+2]=d[r+2],m.image.data[s+3]=Math.random()}const n=t.particlesVariable=w.addVariable("uParticles",xe,m);w.setVariableDependencies(n,[n]),n.material.uniforms.uTime=new o(0),n.material.uniforms.uDeltaTime=new o(0),n.material.uniforms.uBase=new o(m),n.material.uniforms.uFlowFieldInfluence=new o(.5),n.material.uniforms.uFlowFieldStrength=new o(2),n.material.uniforms.uFlowFieldFrequency=new o(.5);const z={uFlowFieldInfluence:n.material.uniforms.uFlowFieldInfluence,uFlowFieldStrength:n.material.uniforms.uFlowFieldStrength,uFlowFieldFrequency:n.material.uniforms.uFlowFieldFrequency};x.add(z.uFlowFieldInfluence,"value").min(0).max(10).step(.001).name("uFlowFieldInfluence"),x.add(z.uFlowFieldStrength,"value").min(0).max(10).step(.001).name("uFlowFieldStrength"),x.add(z.uFlowFieldFrequency,"value").min(0).max(10).step(.001).name("uFlowFieldFrequency"),w.init();const U=new Z(new k(2,2),new E({map:w.getCurrentRenderTarget(n).texture}));U.position.x=5;const h=new Float32Array(l*2),_=new Float32Array(l);for(let i=0;i<f;i++)for(let r=0;r<f;r++){const s=i*f+r,d=s*2,Y=(r+.5)/f,N=(i+.5)/f;h[d+0]=Y,h[d+1]=N,_[s]=Math.random()}const y=v.geometry=new H;y.setDrawRange(0,l),y.setAttribute("aParticlesUv",new q(h,2)),y.setAttribute("aColor",e.attributes.color),y.setAttribute("aSize",new q(_,1));const L=v.material=new J({vertexShader:de,fragmentShader:pe,uniforms:{uSize:new o(.07),uResolution:new o(new K(p.value.width,p.value.height)),uParticlesTexture:new o("")}}),G=v.points=new Q(y,L);F.add(G)})}return(a,e)=>(ue(),re(W,null,{default:le(()=>e[0]||(e[0]=[D("div",{class:"webgl"},null,-1),D("div",{class:"debug"},null,-1)])),_:1}))}}),Ce=me(ve,[["__scopeId","data-v-85ef41f4"]]);export{Ce as default};

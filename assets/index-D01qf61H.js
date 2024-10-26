import{G as H,T as J,S as h,c as Q,_ as P,d as X,e as D,f as Z,w as ee,ao as ne,ap as oe,R as a,Y as L,a as I,P as te,D as ae,u as re,O as ie,b as le}from"./GLTFLoader-Cpm_xSlR.js";import{D as se}from"./DRACOLoader-DJmNJuvT.js";import{d as ve,f as me,p as ue,k as ce,w as de,q as fe,o as ge,h as N}from"./index-qyBmO-yZ.js";import{a as pe}from"./_plugin-vue_export-helper-CQ7wvoWd.js";var xe=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D texture1;
attribute vec3 aRandom;
attribute float aSize;

float PI = 3.141592653589793238;
vec3 getPos(float progress){
	float angle = progress * PI * 2.;

  
  float x = sin(angle) + 2. * sin(2. * angle);
  float y = cos(angle) - 2. * cos(2. * angle);
  float z = -sin(3. * angle);
	return vec3(x,y,z);
}

vec3 getTangent(float progress){
  float angle = progress * PI * 2.;

  float x = cos(angle) + 4. * cos(2. * angle);
  float y = -sin(angle) + 4. * sin(2. * angle);
  float z = 3.*-cos(3. * angle);
	return normalize(vec3(x,y,z));
}

vec3 getNormal(float progress){
  float angle = progress * PI * 2.;
  float x = -sin(angle) - 8. * sin(2. * angle);
  float y = -cos(angle) + 8. * cos(2. * angle);
  float z = 9.*sin(3. * angle);
	return normalize(vec3(x,y,z));
}

void main() {
  vec3 pos = position;
  float progress = fract(time*0.01 + aRandom.x);
  
  pos = getPos(progress);
  vec3 normal = getNormal(progress);
  vec3 tangent = getTangent(progress);
  vec3 binormal = normalize(cross(normal, tangent));

  float radius = 0.2 + aRandom.z * 0.3;
  float cx = radius*cos(aRandom.y * PI * 2. *time*0.05 + aRandom.z *7.);
  float cy = radius*sin(aRandom.y * PI * 2. *time*0.05 + aRandom.z *7.);

  pos += (normal * cx + binormal * cy);
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( pos, 1. );
  gl_PointSize = 2.*(10. + 50.*aSize) * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}`,we=`uniform float time;
uniform float progress;
uniform sampler2D uNormals;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main()	{
	vec3 color = vec3(0.136, 0.559, 0.832);

	vec2 st = gl_PointCoord.xy;

	float disc = length(st - vec2(0.5));
	float alpha = smoothstep(0.5, 0.48, disc);

	vec4 normalTexture = texture2D(uNormals, st);

	vec3 normal = vec3(normalTexture.rg * 2.0 - 1.0, 0.0);
    normal.z = sqrt(1.0 - normal.x * normal.x - normal.y * normal.y);

    normal = normalize(normal);

	vec3 lightPos = vec3(1.,1.,1.);
	float diffuse = max(0., dot(normal, normalize(lightPos)));
	vec3 color1 = vec3(0.579, 0.903, 0.983);
	
	gl_FragColor = vec4(color1,alpha*diffuse*0.5);
}`,ye=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
varying vec3 vWorldPosition;
varying vec3 vNormal;

float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  vNormal = normal;

  vWorldPosition = (modelMatrix * vec4( position, 1.0 )).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,he=`uniform float time;
uniform float progress;
uniform sampler2D uDots;
uniform sampler2D uStripes;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main()	{
	float time1 = time * 0.01;
	float texture1 = texture2D(uStripes, vUv - vec2(time1)).r;
	float texture11 = texture2D(uStripes, vUv - time1*1.5).r;
	float texture3 = texture2D(uDots, vUv*vec2(8.,4.) - time1*4.5).r;
	float alpha = min(texture1, texture11) + texture3;
	vec3 color = vec3(0.136, 0.559, 0.832);

	vec3 viewDir = -normalize(vWorldPosition.xyz - cameraPosition);

	float fresnel =  dot(viewDir, vNormal);
	fresnel = pow( fresnel, 3.0);

	vec3 color1 = vec3(0.579, 0.903, 0.983);
	gl_FragColor = vec4(color1,1.);
	gl_FragColor = vec4(vUv,0.,1.);
	gl_FragColor = vec4(vec3(color1),alpha*fresnel);
	
	
}`;const Pe=ve({__name:"index",setup(De){const{sin:u,cos:_}=Math,z=new se;z.setDecoderPath("/draco/"),new H().setDRACOLoader(z);const s=new J;let W,r,i,t,S,c,b,d;function A(){({container:W,renderer:r,scene:i,camera:t,clock:S,viewPort:c,tick:b}=re(document.querySelector(".webgl")))}function j(){t.position.set(0,0,6),r.setClearColor(336700,1)}function G(){d=new ie(t,r.domElement),d.enableDamping=!0}function V(){de(c,()=>{const{width:n,height:o}=c.value;t.aspect=n/o,t.updateProjectionMatrix(),r.setSize(n,o,!1)})}let T;function B(){T=new le({container:document.querySelector(".debug")}),fe(()=>T.destroy)}let U,C,f,g,M,p;me(()=>{A(),B(),G(),V(),j(),q(),b(()=>{const n=S.getElapsedTime();p.uniforms.time.value=n,f.uniforms.time.value=n,g.uniforms.time.value=n,d.update(),r.render(i,t)})});function q(){p=new h({side:Q,uniforms:{time:{value:0},resolution:{value:new P},uNormals:{value:s.load(new URL("/assets/sphere-normal-D8p5GTlj.jpeg",import.meta.url).href)}},transparent:!0,depthTest:!1,vertexShader:xe,fragmentShader:we});let n=2e4;const o=new X,v=new Float32Array(n*3),m=new Float32Array(n*3),R=new Float32Array(n*1);for(let e=0;e<n*3;e+=3)v[e+0]=Math.random()-.5,v[e+1]=Math.random()-.5,v[e+2]=Math.random()-.5,m[e+0]=Math.random(),m[e+1]=Math.random(),m[e+2]=Math.random(),R[e+0]=.5+.5*Math.random();o.setAttribute("position",new D(v,3)),o.setAttribute("aRandom",new D(m,3)),o.setAttribute("size",new D(R,1));const O=new Z(o,p);i.add(O);let F=[];for(let e=0;e<=100;e++){let l=2*Math.PI*e/100,K=u(l)+2*u(2*l),$=_(l)-2*_(2*l),Y=-u(3*l);F.push(new ee(K,$,Y))}let k=new ne(F);C=new oe(k,100,.4,100,!0);let x=s.load(new URL("/assets/dots-KtDTV-qF.png",import.meta.url).href),w=s.load(new URL("/assets/stripes-CmTxhLOE.png",import.meta.url).href);x.wrapS=a,x.wrapT=a,w.wrapS=a,w.wrapT=a,f=new h({side:L,uniforms:{time:{value:0},resolution:{value:new P},uDots:{value:x},uStripes:{value:w}},transparent:!0,depthTest:!1,vertexShader:ye,fragmentShader:he}),U=new I(C,f),i.add(U);let y=s.load(new URL("/assets/noise-BKRij_pS.png",import.meta.url).href);y.wrapS=a,y.wrapT=a;let E=new te(10,10);g=new h({side:L,uniforms:{time:{value:0},resolution:{value:new P},uTexture:{value:y}},transparent:!0,vertexShader:`
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vWorldPosition = (modelMatrix * vec4( position, 1.0 )).xyz;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
      }
        `,fragmentShader:`
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      uniform sampler2D uTexture;
      uniform float time;
      void main() {
        vec2 newUV = vUv;
        vec4 tt = texture2D(uTexture, vUv);

        vec2 godray = vWorldPosition.xy - vec2(0.,6.);
        float uvDirection = atan(godray.y,godray.x);

        float c = texture2D(uTexture, vec2(uvDirection, 0.) + 0.02*time).x;
        float c1 = texture2D(uTexture, vec2(0.1, uvDirection) + 0.02*time*1.5).x;

        float alpha = min(c,c1);
        gl_FragColor = vec4(vUv,0.,1.);
        float fade = smoothstep(0.15,0.86,abs(vUv.y));
        gl_FragColor = vec4(vWorldPosition,1.);
        gl_FragColor = vec4(tt.rgb,1.);
        gl_FragColor = vec4(vec3(alpha),alpha*0.3*fade);
      }
        `}),M=new I(E,g),i.add(M)}return(n,o)=>(ge(),ue(ae,null,{default:ce(()=>o[0]||(o[0]=[N("div",{class:"webgl"},null,-1),N("div",{class:"debug"},null,-1)])),_:1}))}}),Ue=pe(Pe,[["__scopeId","data-v-f12e32bd"]]);export{Ue as default};

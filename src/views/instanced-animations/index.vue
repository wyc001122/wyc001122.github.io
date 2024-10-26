<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * custom shader 
 */
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/') // 设置Draco解码器路径
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader) // 设置GLTF加载器使用Draco解码器
const textureLoader = new THREE.TextureLoader()

/**
 * core variables
 */
let container: HTMLElement, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.OrthographicCamera, clock: THREE.Clock, viewPort: ComputedRef<{ width: number; height: number; viewWidth: number; viewHeight: number; }>, tick: (callback: () => void) => void; 
let control: any;
function initCore() {
  ({ container, renderer, scene, clock, viewPort, tick } = useThree(document.querySelector('.webgl')!))
  const frustumSize = viewPort.value.height;
  const aspect = viewPort.value.width / viewPort.value.height;
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    -2000,
    2000
  );
}

/**
 * setup preset
 */
function setupPreset() {
  camera.position.set(2, 2, 2);
  renderer.setClearColor(0x08092d, 1);
  const light1 = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(light1);

  const spotlight = new THREE.SpotLight(0xffe9e9, 2200);
  spotlight.position.set(-80 * 3, 500 * 3, -80 * 3);
  let target = new THREE.Object3D();
  target.position.set(0, -80, 200);
  spotlight.target = target;
  spotlight.intensity = 300;
  spotlight.angle = 1;
  spotlight.penumbra = 1.5;
  spotlight.decay = 0.7;
  spotlight.distance = 3000;


  scene.add(spotlight);
}

/**
 * init control
 */
function initControl() {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
}

/**
 * auto resize
 */
function autoResize() {
  watch(viewPort, () => {
    const { width, height, } = viewPort.value

    const frustumSize = height;
    const aspect = width / height;

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    camera.updateProjectionMatrix();

    fbo.setSize(width, height, false);

    renderer.setSize(width, height, false);
  })
}

/**
 * debug
 */
let gui: any;
const debug: any = {
  progress: 0,
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
}

const noise = `
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
}`

let isPlaying = false
let fbo: any;
let uniforms: any;
let fboCamera: any;
let fboScene: any;
let fboMaterial: any;
onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  setupFBO()
  addObjects();

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    uniforms.time.value = elapsedTime;

    control.update()


    renderer.setRenderTarget(fbo);
    renderer.render(fboScene, fboCamera);


    renderer.setRenderTarget(null);
    uniforms.uFBO.value = fbo.texture;
    renderer.render(scene, camera); 
  });
})



function setupFBO() {
  fbo = new THREE.WebGLRenderTarget(viewPort.value.width, viewPort.value.height);
  fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  fboScene = new THREE.Scene();
  fboMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uProgress: { value: 0 },
      uState1: { value: textureLoader.load(new URL("./texture/state1.jpg", import.meta.url).href) },
      uState2: { value: textureLoader.load(new URL("./texture/state2.jpg", import.meta.url).href) },
      uFBO: { value: null },
    },
    vertexShader,
    fragmentShader,
  });
  gui.add(debug, "progress", 0, 1, 0.01).onChange((val: any) => {
    fboMaterial.uniforms.uProgress.value = val;
  });
  const fbogeo = new THREE.PlaneGeometry(2, 2);
  const fboQuad = new THREE.Mesh(fbogeo, fboMaterial);
  fboScene.add(fboQuad);
}

function addObjects() {
  const aoTexture = textureLoader.load(new URL("./texture/ao.png", import.meta.url).href);

  const debugPlane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({ map: fbo.texture }));
  debugPlane.position.y = 150
  // scene.add(debugPlane)

  aoTexture.flipY = false

  const material = new THREE.MeshPhysicalMaterial({
    roughness: 0.65,
    map: aoTexture,
    // set AO map
    aoMap: aoTexture,
    aoMapIntensity: 0.75,
  });

  uniforms = {
    time: { value: 0 },
    uFBO: { value: null },
    aoMap: { value: aoTexture },
    light_color: { value: new THREE.Color('#ffe9e9') },
    ramp_color_one: { value: new THREE.Color('#06082D') },
    ramp_color_two: { value: new THREE.Color('#020284') },
    ramp_color_three: { value: new THREE.Color('#0000ff') },
    ramp_color_four: { value: new THREE.Color('#71c7f5') },
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms = Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform sampler2D uFBO;
      uniform float time;
      attribute vec2 instanceUV;
      varying float vHeight;
      varying float vHeightUV;
      ${noise}
      `)

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      float n = cnoise(vec3(instanceUV.x*5., instanceUV.y*5. , time*0.1));
      transformed.y += n*90.;
      vHeightUV = clamp(position.y*2.,0.,1.);
      vec4 transition = texture2D(uFBO, instanceUV);
      transformed *=(transition.g);
      transformed.y += transition.r*100.;
      vHeight = transformed.y;
      `)


    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform vec3 light_color;
      uniform vec3 ramp_color_one;
      uniform vec3 ramp_color_two;
      uniform vec3 ramp_color_three;
      uniform vec3 ramp_color_four;
      varying float vHeight;
      varying float vHeightUV;
      `)

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
        vec3 highlight = mix(ramp_color_three, ramp_color_four, vHeightUV);
        diffuseColor.rgb = ramp_color_two;
        diffuseColor.rgb = mix(diffuseColor.rgb, ramp_color_three, vHeightUV);
        diffuseColor.rgb = mix(diffuseColor.rgb, highlight, clamp(vHeight/10. -3.,0.,1.));
      `)


  }
  gltfLoader.load(new URL('./models/bar.glb', import.meta.url).href, (gltf) => {
    const model: any = gltf.scene.children[0];
    scene.add(model);

    model.material = material;
    const geometry = model.geometry;
    geometry.scale(40, 40, 40);

    const iSize = 50;
    const instances = iSize ** 2;
    const instanceMesh = new THREE.InstancedMesh(
      geometry,
      material,
      instances
    );
    let dummy = new THREE.Object3D();
    let w = 60;

    let instanceUV = new Float32Array(instances * 2);
    for (let i = 0; i < iSize; i++) {
      for (let j = 0; j < iSize; j++) {

        instanceUV.set([i / iSize, j / iSize], (i * iSize + j) * 2);


        dummy.position.set(
          w * (i - iSize / 2),
          0,
          w * (j - iSize / 2)
        );
        dummy.updateMatrix();
        instanceMesh.setMatrixAt(i * iSize + j, dummy.matrix);

      }
    }
    geometry.setAttribute('instanceUV', new THREE.InstancedBufferAttribute(instanceUV, 2));
    scene.add(instanceMesh);

    isPlaying = true
  });
}

</script>

<template>
  <DemoContainer>
    <div class="webgl"></div>
    <div class="debug"></div>
  </DemoContainer>
</template>

<style scoped lang='scss'>
.webgl {
  canvas {
    width: 100% !important;
    height: 100% !important;
  }

  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

}

.debug {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'


/**
 * custom shader 
 */
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const skyTexture = textureLoader.load(new URL('./texture/sky.png', import.meta.url).href)
skyTexture.mapping = THREE.EquirectangularReflectionMapping;

const u_reflectNoise = textureLoader.load(new URL('/texture/water/water_disp.png', import.meta.url).href)
u_reflectNoise.wrapS = u_reflectNoise.wrapT = THREE.RepeatWrapping;

const u_caustics = textureLoader.load(new URL('/texture/noise/noise5.png', import.meta.url).href)
u_caustics.wrapS = u_caustics.wrapT = THREE.RepeatWrapping;

const u_foam = textureLoader.load(new URL('/texture/noise/noise4.png', import.meta.url).href)
u_foam.wrapS = u_foam.wrapT = THREE.RepeatWrapping;

const distortion = textureLoader.load(new URL('/texture/noise/noise6.png', import.meta.url).href)
distortion.wrapS = THREE.RepeatWrapping;
distortion.wrapT = THREE.RepeatWrapping;
/**
 * core variables
 */
let container: HTMLElement, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, clock: THREE.Clock, viewPort: ComputedRef<{ width: number; height: number; viewWidth: number; viewHeight: number; }>, tick: (callback: () => void) => void;
let control: any;
function initCore() {
  ({ container, renderer, scene, camera, clock, viewPort, tick } = useThree(document.querySelector('.webgl')!))
}

/**
 * setup preset
 */
function setupPreset() {
  camera.fov = 68;
  camera.near = 0.1;
  camera.far = 1000;

  camera.updateProjectionMatrix()
  camera.position.set(-113, 32, 88);

  renderer.setClearColor(0xffffff, 1)

  scene.background = skyTexture

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  const directionalLight2 = directionalLight.clone();

  const vec = new THREE.Vector3(-30, 15, 30);
  const vec2 = vec.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

  directionalLight.position.copy(vec);
  directionalLight2.position.copy(vec2);

  scene.add(directionalLight);
  scene.add(directionalLight2);
}

/**
 * init control
 */
function initControl() {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  // 不允许上下旋转
  control.enablePan = false;
  control.enableZoom = false;
  control.maxPolarAngle = Math.PI / 2.2;
}

/**
 * auto resize
 */
function autoResize() {
  watch(viewPort, () => {
    const { width, height, } = viewPort.value
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false);

  })
}

/**
 * debug
 */
let gui: any;
const debug: any = {
  uAbedoColor: "#0084ff",
  uShallowColor: "#ffffff",
  uRimColor: "#cee0e3"
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
}
const depthMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec2 vHighPrecisionZW;
  void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vHighPrecisionZW = gl_Position.zw;
  }
  `,
  fragmentShader: `
  #include <packing>
  varying vec2 vHighPrecisionZW;
  vec4 depth_32bits(float depth){
    vec4 col = packDepthToRGBA(depth);
    return col;
  } 
  vec4 depth_8bits(float depth){
    vec4 col = vec4(depth, depth, depth, 1.0);
    return col;
  } 
  void main() {
    float depth = vHighPrecisionZW[0] * 0.5 / vHighPrecisionZW[1] + 0.5;
    gl_FragColor = depth_32bits(depth);
  }
  `,
})
const normalMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec3 viewNormal;
  void main() {
    vec4 newNormal = vec4(normal,1.); 
    viewNormal = normalize(mat3(transpose(inverse(modelMatrix * viewMatrix))) * newNormal.xyz);  

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: `
  #include <packing>
  varying vec3 viewNormal;
  void main() {
    vec4 col = vec4(viewNormal,1.);
    gl_FragColor = col;
  }
  `,
})
onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  loadModel()
  initRenderTarget()
  initWater()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // update control
    control.update()
    if (uniforms) {
      uniforms.uTime.value = elapsedTime
    }

    scene.overrideMaterial = depthMaterial
    planeMesh.visible = false
    testRender && testRender.render(scene, camera)
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)
    
    scene.overrideMaterial = normalMaterial
    renderer.setRenderTarget(renderTarget2)
    renderer.render(scene, camera)

    testRender2 && testRender2.render(scene, camera)

    planeMesh.visible = true
    scene.overrideMaterial = null
    renderer.setRenderTarget(null)
    renderer.render(scene, camera)
  });
})


let model: any;
function loadModel() {
  gltfLoader.load(new URL('./models/screen.gltf', import.meta.url).href, (gltf) => {
    model = gltf.scene
    scene.add(model)
  })
}


let renderTarget: any;
let renderTarget2: any;
let testRender: any;
let testRender2: any;
function initRenderTarget() {
  renderTarget = new THREE.WebGLRenderTarget(viewPort.value.width, viewPort.value.height)
  renderTarget2 = new THREE.WebGLRenderTarget(viewPort.value.width, viewPort.value.height)

  // const width = viewPort.value.width / 10
  // const height = viewPort.value.height / 10

  // testRender = new THREE.WebGLRenderer({ antialias: true, canvas: document.createElement('canvas') });
  // testRender.domElement.style.width = width + 'px'
  // testRender.domElement.style.height = height + 'px'
  // testRender.domElement.style.position = 'absolute'
  // testRender.domElement.style.top = '0px'
  // testRender.domElement.style.left = '0px'
  // testRender.domElement.style.zIndex = '999'
  // testRender.domElement.width = width
  // testRender.domElement.height = height
  // container.appendChild(testRender.domElement)

  // testRender2 = new THREE.WebGLRenderer({ antialias: true, canvas: document.createElement('canvas') });
  // testRender2.domElement.style.width = width + 'px'
  // testRender2.domElement.style.height = height + 'px'
  // testRender2.domElement.style.position = 'absolute'
  // testRender2.domElement.style.top = '0px'
  // testRender2.domElement.style.left = width + 'px'
  // testRender2.domElement.style.zIndex = '999'
  // testRender2.domElement.width = width
  // testRender2.domElement.height = height
  // container.appendChild(testRender2.domElement)


}

let planeMesh: any;
let uniforms: any;
function initWater() {
  uniforms = {
    uTime: { value: 0 },
    uNear: { value: camera.near },
    uFar: { value: camera.far },
    uAbedoColor: { value: new THREE.Color(debug.uAbedoColor) },
    // 菲尼尔
    uRimColor: { value: new THREE.Color(debug.uRimColor) },
    uRimOpacity: { value: 1 },
    uFresnelPow: { value: 5. }, // 菲尼尔指数
    F0: { value: 0.02 }, // 菲尼尔0
    F90: { value: 1. }, // 菲尼尔90
    // 反射
    uReflectTexture: { value: skyTexture },
    uReflectNoise: { value: u_reflectNoise },
    uReflectPow: { value: 2. },
    uReflectScale: { value: 0.01 },
    // 深度
    uDepthTexture: { value: renderTarget.texture },
    uDepthScale: { value: 0.0032 }, // 控制浅水的范围
    uWaterDepthPow: { value: 0.375 }, // 水深指数
    uShallowColor: { value: new THREE.Color(debug.uShallowColor) }, // 浅水区颜色

    // 焦散
    uCausticsTexture: { value: u_caustics },
    uCausticsIntensity: { value: 4. }, // 焦散强度
    uCausticsScale: { value: 0.016 },
    // 浮沫
    uFoamTexture: { value: u_foam },
    uFoamScale: { value: 0.003 }, // 浮沫范围
    uFoamDepthPow: { value: 0.702 }, // 浮沫深度指数
    uFoamCutoff: { value: 0.957 }, // 浮沫阈值
    uFoamDistortionScale: { value: 0.0123 }, // 浮沫扭曲UV缩放
    uFoamMaxScale: { value: 0.003 }, // 浮沫最大范围
    uFoamMinScale: { value: 0.00004 }, // 浮沫最小范围
    uNormalTexture: { value: renderTarget2.texture },
    // 扭曲
    uDistortionTexture: { value: distortion },
    uDistortionIntensity: { value: 0.73 },
    // 法线
  }
  const baseFolder = gui.addFolder('基础')
  baseFolder.addColor(debug, 'uAbedoColor').name('基础颜色').onChange((color: any) => {
    uniforms.uAbedoColor.value.set(color)
  })

  const fresnelFolder = gui.addFolder('菲尼尔效果')
  fresnelFolder.addColor(debug, 'uRimColor').name('远处的水色').onChange((color: any) => {
    uniforms.uRimColor.value.set(color)
  })
  fresnelFolder.add(uniforms.uRimOpacity, 'value').min(0).max(1).step(0.001).name('边缘透明度')
  fresnelFolder.add(uniforms.uFresnelPow, 'value').min(0).max(10).step(0.01).name('菲尼尔指数')
  fresnelFolder.add(uniforms.F0, 'value').min(0).max(10).step(0.001).name('F0')
  fresnelFolder.add(uniforms.F90, 'value').min(0).max(10).step(0.001).name('F90')

  const reflectFolder = gui.addFolder('反射效果')
  reflectFolder.add(uniforms.uReflectPow, 'value').min(0).max(100).step(0.1).name('反射指数')
  reflectFolder.add(uniforms.uReflectScale, 'value').min(0).max(0.05).step(0.0001).name('扰动UV缩放')

  const depthFolder = gui.addFolder('水深效果')
  depthFolder.add(uniforms.uDepthScale, 'value').min(0).max(0.02).step(0.0001).name('深度范围')
  depthFolder.add(uniforms.uWaterDepthPow, 'value').min(0).max(1).step(0.001).name('水深指数')
  depthFolder.addColor(debug, 'uShallowColor').name('浅水区颜色').onChange((color: any) => {
    uniforms.uShallowColor.value.set(color)
  })

  const causticsFolder = gui.addFolder('焦散效果')
  causticsFolder.add(uniforms.uCausticsIntensity, 'value').min(0).max(10).step(0.01).name('焦散强度')
  causticsFolder.add(uniforms.uCausticsScale, 'value').min(0).max(0.02).step(0.0001).name('焦散UV缩放')

  const foamFolder = gui.addFolder('浮沫效果')
  foamFolder.add(uniforms.uFoamScale, 'value').min(0).max(0.01).step(0.0001).name('浮沫范围')
  foamFolder.add(uniforms.uFoamDepthPow, 'value').min(0).max(1).step(0.001).name('浮沫指数')
  foamFolder.add(uniforms.uFoamCutoff, 'value').min(0).max(2).step(0.001).name('浮沫阈值')
  foamFolder.add(uniforms.uFoamDistortionScale, 'value').min(0).max(0.05).step(0.0001).name('浮沫扭曲UV缩放')
  foamFolder.add(uniforms.uFoamMaxScale, 'value').min(0).max(0.01).step(0.00001).name('浮沫范围')
  foamFolder.add(uniforms.uFoamMinScale, 'value').min(0).max(0.01).step(0.00001).name('岸边浮沫范围')

  const distortionFolder = gui.addFolder('扭曲效果')
  distortionFolder.add(uniforms.uDistortionIntensity, 'value').min(0).max(1).step(0.001).name('扭曲强度')



  const geo = new THREE.PlaneGeometry(1000, 1000)
  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
  })

  planeMesh = new THREE.Mesh(geo, mat)
  planeMesh.position.y = -2
  planeMesh.rotation.x = -Math.PI / 2
  scene.add(planeMesh)

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
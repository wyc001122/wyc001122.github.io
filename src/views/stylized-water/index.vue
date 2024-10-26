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
const uNoise = textureLoader.load(new URL('/texture/water/water_disp.png', import.meta.url).href)
uNoise.wrapS = THREE.RepeatWrapping;
uNoise.wrapT = THREE.RepeatWrapping;
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
const cubeUrls = [
  new URL('./texture/sky/you.png', import.meta.url).href,
  new URL('./texture/sky/zuo.png', import.meta.url).href,
  new URL('./texture/sky/shang.png', import.meta.url).href,
  new URL('./texture/sky/xia.png', import.meta.url).href,
  new URL('./texture/sky/qian.png', import.meta.url).href,
  new URL('./texture/sky/hou.png', import.meta.url).href,
]

function setupPreset() {
  camera.position.set(0, 10, 40)
  const cubeLoader = new THREE.CubeTextureLoader()
  const cubeTexture = cubeLoader.load(cubeUrls)
  scene.background = cubeTexture

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 5);
  scene.add(ambientLight);
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  const directionalLight2 = directionalLight.clone();

  const axis = new THREE.Vector3(0, 1, 0);
  const vec = new THREE.Vector3(-30, 15, 30);
  const vec2 = vec.clone().applyAxisAngle(axis, Math.PI / 2);

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
  uFresnelColor: "#81d1ee",
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
}

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
  addWater()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()
    if (uniforms) {
      uniforms.uTime.value = elapsedTime
    }
    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})






let model: any
function loadModel() {
  gltfLoader.load(new URL('./models/fenggehuashuiti.gltf', import.meta.url).href, (gltf) => {
    model = gltf.scene
    model.rotation.y = Math.PI / 4;
    scene.add(model)
  })
}
let uniforms: any
function addWater() {
  uniforms = {
    uTime: { value: 0, show: false },
    uWaterSpeed: { value: 0.1, },
    uFresnelPow: { value: 2, },
    uNoisePow: { value: 0.03, },
    uWaterOpacity: { value: 0.8, },
    uReflectPow: { value: 0.5, },
    uReflectTexture: { value: scene.background },
    uNoiseTexture: { value: uNoise },
    uNoiseScale: { value: 0.1, },
    uFresnelColor: {
      value: new THREE.Color(debug.uFresnelColor),
    },
  };
  gui.add(uniforms.uWaterSpeed, 'value').name('uWaterSpeed').min(0).max(1).step(0.01)
  gui.add(uniforms.uNoiseScale, 'value').name('uNoiseScale').min(0).max(1).step(0.01)
  gui.add(uniforms.uReflectPow, 'value').name('uReflectPow').min(0).max(1).step(0.01)
  gui.add(uniforms.uWaterOpacity, 'value').name('uWaterOpacity').min(0).max(1).step(0.01)
  gui.add(uniforms.uFresnelPow, 'value').name('uFresnelPow').min(0).max(1).step(0.01)
  gui.add(uniforms.uNoisePow, 'value').name('uNoisePow').min(0).max(1).step(0.01)
  gui.addColor(debug, 'uFresnelColor').name('uFresnelColor').onChange((color: any) => {
    uniforms.uFresnelColor.value.set(color)
  })

  const geo = new THREE.PlaneGeometry(300, 300, 100, 100);
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh)
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
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
  camera.position.set(3, 3, 3)

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
let debug: any = {
  count: 200000,
  size: 0.005,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)

  gui.add(debug, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
  gui.add(debug, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
  gui.add(debug, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
  gui.add(debug, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
  gui.add(debug, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
  gui.addColor(debug, 'insideColor').onFinishChange(generateGalaxy)
  gui.addColor(debug, 'outsideColor').onFinishChange(generateGalaxy)
}

let geometry: any = null
let material: any = null
let points: any = null

onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  generateGalaxy()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    material.uniforms.uTime.value = elapsedTime

    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})


function generateGalaxy() {
  if (points !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(debug.count * 3)
  const randomness = new Float32Array(debug.count * 3)
  const colors = new Float32Array(debug.count * 3)
  const scales = new Float32Array(debug.count * 1)

  const insideColor = new THREE.Color(debug.insideColor)
  const outsideColor = new THREE.Color(debug.outsideColor)

  for (let i = 0; i < debug.count; i++) {
    const i3 = i * 3

    // Position
    const radius = Math.random() * debug.radius

    const branchAngle = (i % debug.branches) / debug.branches * Math.PI * 2

    const randomX = Math.pow(Math.random(), debug.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * debug.randomness * radius
    const randomY = Math.pow(Math.random(), debug.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * debug.randomness * radius
    const randomZ = Math.pow(Math.random(), debug.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * debug.randomness * radius

    positions[i3] = Math.cos(branchAngle) * radius
    positions[i3 + 1] = 0
    positions[i3 + 2] = Math.sin(branchAngle) * radius

    randomness[i3] = randomX
    randomness[i3 + 1] = randomY
    randomness[i3 + 2] = randomZ

    // Color
    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, radius / debug.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    // Scale
    scales[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

  /**
   * Material
   */
  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms:
    {
      uTime: { value: 0 },
      uSize: { value: 30 * renderer.getPixelRatio() }
    },
    vertexShader,
    fragmentShader
  })

  /**
   * Points
   */
  points = new THREE.Points(geometry, material)
  scene.add(points)
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
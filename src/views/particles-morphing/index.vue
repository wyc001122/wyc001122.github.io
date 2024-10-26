<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'


/**
 * custom shader 
 */
import vertexShader from "./shaders/particles/vertexShader.glsl";
import fragmentShader from "./shaders/particles/fragmentShader.glsl";

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
const textureLoader = new THREE.TextureLoader()

/**
 * core variables
 */
let container: HTMLElement, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, clock: THREE.Clock, viewPort: ComputedRef<{ width: number; height: number; viewWidth: number; viewHeight: number; }>, tick: (callback: () => void) => void; 
let control: any;
function initCore() {
// 标记

  ({ container, renderer, scene, camera, clock, viewPort, tick } = useThree(document.querySelector('.webgl')!))
}

/**
 * setup preset
 */
function setupPreset() {
  camera.position.set(0, 0, 8 * 2)
  renderer.setClearColor(debug.clearColor)

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
  clearColor: '#160920'
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
  gui.addColor(debug, 'clearColor').onChange(() => { renderer.setClearColor(debug.clearColor) })

}

let particles: any = null


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

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})



function loadModel() {
  gltfLoader.load(new URL('./models/models.glb', import.meta.url).href, (gltf) => {
    particles = {}
    particles.index = 0
    // Positions
    const positions = gltf.scene.children.map((child: any) => child.geometry.attributes.position)

    particles.maxCount = 0
    for (const position of positions) {
      if (position.count > particles.maxCount)
        particles.maxCount = position.count
    }

    particles.positions = []
    for (const position of positions) {
      const originalArray = position.array
      const newArray = new Float32Array(particles.maxCount * 3)

      for (let i = 0; i < particles.maxCount; i++) {
        const i3 = i * 3

        if (i3 < originalArray.length) {
          newArray[i3 + 0] = originalArray[i3 + 0]
          newArray[i3 + 1] = originalArray[i3 + 1]
          newArray[i3 + 2] = originalArray[i3 + 2]
        }
        else {
          const randomIndex = Math.floor(position.count * Math.random()) * 3
          newArray[i3 + 0] = originalArray[randomIndex + 0]
          newArray[i3 + 1] = originalArray[randomIndex + 1]
          newArray[i3 + 2] = originalArray[randomIndex + 2]
        }
      }

      particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3))
    }

    // Geometry
    const sizesArray = new Float32Array(particles.maxCount)

    for (let i = 0; i < particles.maxCount; i++)
      sizesArray[i] = Math.random()

    particles.geometry = new THREE.BufferGeometry()
    particles.geometry.setAttribute('position', particles.positions[particles.index])
    particles.geometry.setAttribute('aPositionTarget', particles.positions[3])
    particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1))


    // Material
    particles.colorA = '#ff7300'
    particles.colorB = '#0091ff'

    particles.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms:
      {
        uSize: new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(new THREE.Vector2(viewPort.value.width, viewPort.value.height)),
        uProgress: new THREE.Uniform(0),
        uColorA: new THREE.Uniform(new THREE.Color(particles.colorA)),
        uColorB: new THREE.Uniform(new THREE.Color(particles.colorB))
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    // Points
    particles.points = new THREE.Points(particles.geometry, particles.material)
    particles.points.frustumCulled = false
    scene.add(particles.points)

    // Methods
    particles.morph = (index: any) => {
      // Update attributes
      particles.geometry.attributes.position = particles.positions[particles.index]
      particles.geometry.attributes.aPositionTarget = particles.positions[index]

      // Animate uProgress
      gsap.fromTo(
        particles.material.uniforms.uProgress,
        { value: 0 },
        { value: 1, duration: 3, ease: 'linear' }
      )

      // Save index
      particles.index = index
    }

    // Tweaks
    gui.addColor(particles, 'colorA').onChange(() => { particles.material.uniforms.uColorA.value.set(particles.colorA) })
    gui.addColor(particles, 'colorB').onChange(() => { particles.material.uniforms.uColorB.value.set(particles.colorB) })
    gui.add(particles.material.uniforms.uProgress, 'value').min(0).max(1).step(0.001).name('uProgress').listen()

    particles.morph0 = () => { particles.morph(0) }
    particles.morph1 = () => { particles.morph(1) }
    particles.morph2 = () => { particles.morph(2) }
    particles.morph3 = () => { particles.morph(3) }

    gui.add(particles, 'morph0')
    gui.add(particles, 'morph1')
    gui.add(particles, 'morph2')
    gui.add(particles, 'morph3')
  })
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
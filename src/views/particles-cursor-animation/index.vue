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
// 标记

  ({ container, renderer, scene, camera, clock, viewPort, tick } = useThree(document.querySelector('.webgl')!))
}

/**
 * setup preset
 */
function setupPreset() {
  camera.position.set(0, 0, 18)
  renderer.setClearColor('#181818')

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
    particlesMaterial.uniforms.uResolution.value.set(viewPort.value.width, viewPort.value.height)
  })
}

/**
 * debug
 */
let gui: any;
const debug: any = {

}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
}


let particlesMaterial: any;
let displacement: any = {}

let raycaster: any
let pointer: any

onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  gogogo()
  initMouse()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()


    /**
     * Displacement
     */
    // Fade out
    displacement.context.globalCompositeOperation = 'source-over'
    displacement.context.globalAlpha = 0.02
    displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

    // Speed alpha
    const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor)
    displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
    const alpha = Math.min(cursorDistance * 0.05, 1)

    // Draw glow
    const glowSize = displacement.canvas.width * 0.25
    displacement.context.globalCompositeOperation = 'lighten'
    displacement.context.globalAlpha = alpha
    displacement.context.drawImage(
      displacement.glowImage,
      displacement.canvasCursor.x - glowSize * 0.5,
      displacement.canvasCursor.y - glowSize * 0.5,
      glowSize,
      glowSize
    )

    // Texture
    displacement.texture.needsUpdate = true

    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})

function initMouse() {
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0xffffff,
      opacity: 0.5,
    })
  )

  const curosrPoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 32, 32),
    new THREE.MeshNormalMaterial()
  )

  // scene.add(planeMesh)
  scene.add(curosrPoint)

  container.addEventListener('mousemove', (e) => {
    pointer.x = (e.offsetX / viewPort.value.viewWidth) * 2 - 1;
    pointer.y = -(e.offsetY / viewPort.value.viewHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera)

    const intersections = raycaster.intersectObject(planeMesh)
    if (intersections.length) {
      const uv = intersections[0].uv

      displacement.canvasCursor.x = uv.x * displacement.canvas.width
      displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height
    }
  })
}

function gogogo() {
  /**
   * Displacement
   */
  // 2D canvas
  displacement.canvas = document.createElement('canvas')
  displacement.canvas.width = 128
  displacement.canvas.height = 128
  displacement.canvas.style.position = 'absolute'
  displacement.canvas.style.width = '256px'
  displacement.canvas.style.height = '256px'
  displacement.canvas.style.top = 0
  displacement.canvas.style.left = 0
  displacement.canvas.style.zIndex = 10
  container.append(displacement.canvas)

  // Context
  displacement.context = displacement.canvas.getContext('2d')
  displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

  // Glow image
  displacement.glowImage = new Image()
  displacement.glowImage.src = new URL('./texture/glow.png', import.meta.url).href

  // // Interactive plane
  // displacement.interactivePlane = new THREE.Mesh(
  //   new THREE.PlaneGeometry(10, 10),
  //   new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide })
  // )
  // displacement.interactivePlane.visible = false
  // scene.add(displacement.interactivePlane)

  // Raycaster
  displacement.raycaster = new THREE.Raycaster()

  // Coordinates
  displacement.screenCursor = new THREE.Vector2(9999, 9999)
  displacement.canvasCursor = new THREE.Vector2(9999, 9999)
  displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999)

  window.addEventListener('pointermove', (event) => {
    displacement.screenCursor.x = (event.offsetX / viewPort.value.width) * 2 - 1
    displacement.screenCursor.y = - (event.offsetY / viewPort.value.height) * 2 + 1
  })

  // Texture
  displacement.texture = new THREE.CanvasTexture(displacement.canvas)

  /**
   * Particles
   */
  const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128)
  particlesGeometry.setIndex(null)
  particlesGeometry.deleteAttribute('normal')

  const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count)
  const anglesArray = new Float32Array(particlesGeometry.attributes.position.count)

  for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
    intensitiesArray[i] = Math.random()
    anglesArray[i] = Math.random() * Math.PI * 2
  }

  particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
  particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))

  particlesMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:
    {
      uResolution: new THREE.Uniform(new THREE.Vector2(viewPort.value.width, viewPort.value.height)),
      uPictureTexture: new THREE.Uniform(textureLoader.load(new URL('./texture/picture-1.png', import.meta.url).href)),
      uDisplacementTexture: new THREE.Uniform(displacement.texture)
    },
    blending: THREE.AdditiveBlending
  })
  particlesMaterial.uniforms.uResolution.value.set(viewPort.value.width, viewPort.value.height)

  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)
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
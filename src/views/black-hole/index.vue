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

import discVertex from './shaders/disc/vertex.glsl'
import discFragment from './shaders/disc/fragment.glsl'
import noisesVertex from './shaders/noises/vertex.glsl'
import noisesFragment from './shaders/noises/fragment.glsl'
import starsVertex from './shaders/stars/vertex.glsl'
import starsFragment from './shaders/stars/fragment.glsl'
import distortionHoleVertex from './shaders/distortionHole/vertex.glsl'
import distortionHoleFragment from './shaders/distortionHole/fragment.glsl'
import compositionVertex from './shaders/composition/vertex.glsl'
import compositionFragment from './shaders/composition/fragment.glsl'
import distortionDiscVertex from './shaders/distortionDisc/vertex.glsl'
import distortionDiscFragment from './shaders/distortionDisc/fragment.glsl'

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
  camera.position.set(0, 3, 10)
  renderer.setClearColor('#130e16')

}

/**
 * init control
 */
function initControl() {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.zoomSpeed = 0.4
  control.enableDamping = true
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

}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
}
let cameraGroup: any = null

const composition: any = {}

const stars: any = {}

const noises: any = {}

const disc: any = {}

const distortion: any = {}

onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  createBlackHole()

  tick(() => {
    const { width, height, } = viewPort.value
    // get elapsedTime
    const time = clock.getElapsedTime()

    disc.material.uniforms.uTime.value = time

    camera.rotateZ(0.2);


    const cameraTime = time * 0.2
    const shakeAmplitude = 0.1
    cameraGroup.position.x = shakeAmplitude * Math.sin(cameraTime) * Math.sin(cameraTime * 2.1) * Math.sin(cameraTime * 4.3);
    cameraGroup.position.y = shakeAmplitude * Math.sin(cameraTime * 1.23) * Math.sin(cameraTime * 4.56) * Math.sin(cameraTime * 7.89);
    cameraGroup.position.z = shakeAmplitude * Math.sin(cameraTime * 3.45) * Math.sin(cameraTime * 6.78) * Math.sin(cameraTime * 9.01);;
    camera.updateProjectionMatrix()


    distortion.hole.mesh.lookAt(camera.position)

    const screenPosition = new THREE.Vector3(0, 0, 0)
    screenPosition.project(camera)
    screenPosition.x = screenPosition.x * 0.5 + 0.5
    screenPosition.y = screenPosition.y * 0.5 + 0.5
    composition.plane.material.uniforms.uConvergencePosition.value.set(screenPosition.x, screenPosition.y)
    composition.plane.material.uniforms.uTime.value = time



    if (composition.distortionRenderTarget) {
      composition.distortionRenderTarget.setSize(width, height)
    }
    if (composition.defaultRenderTarget) {
      composition.defaultRenderTarget.setSize(width, height)
    }


    // update control
    control.update()

    renderer.render(scene, camera)
    renderer.render(distortion.scene, camera)

    renderer.setRenderTarget(composition.defaultRenderTarget)
    renderer.setClearColor('#130e16')
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)

    renderer.setRenderTarget(composition.distortionRenderTarget)
    renderer.setClearColor('#000000')
    renderer.render(distortion.scene, camera)
    renderer.setRenderTarget(null)

    renderer.render(composition.scene, composition.camera)

  });
})



function createBlackHole() {
  cameraGroup = new THREE.Group()
  scene.add(cameraGroup)
  cameraGroup.add(camera)


  // 
  stars.count = 10000



  const positionsArray = new Float32Array(stars.count * 3)
  const sizesArray = new Float32Array(stars.count)
  const colorsArray = new Float32Array(stars.count * 3)

  for (let i = 0; i < stars.count; i++) {
    const i3 = i * 3

    const theta = 2 * Math.PI * Math.random()
    const phi = Math.acos(2 * Math.random() - 1.0)

    positionsArray[i3 + 0] = Math.cos(theta) * Math.sin(phi) * 400
    positionsArray[i3 + 1] = Math.sin(theta) * Math.sin(phi) * 400
    positionsArray[i3 + 2] = Math.cos(phi) * 400

    sizesArray[i] = 0.5 + Math.random() * 30

    const hue = Math.round(Math.random() * 360)
    const lightness = Math.round(80 + Math.random() * 20)
    const color = new THREE.Color(`hsl(${hue}, 100%, ${lightness}%)`)

    colorsArray[i3 + 0] = color.r
    colorsArray[i3 + 1] = color.g
    colorsArray[i3 + 2] = color.b
  }

  stars.geometry = new THREE.BufferGeometry()
  stars.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))
  stars.geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizesArray, 1))
  stars.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3))

  stars.material = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: starsVertex,
    fragmentShader: starsFragment
  })

  stars.points = new THREE.Points(stars.geometry, stars.material)
  scene.add(stars.points)

  // 

  noises.scene = new THREE.Scene()
  noises.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  noises.camera.position.set(0, 0, 5)
  noises.scene.add(noises.camera)

  noises.plane = {}
  noises.plane.geometry = new THREE.PlaneGeometry(2, 2)
  noises.plane.material = new THREE.ShaderMaterial({
    vertexShader: noisesVertex,
    fragmentShader: noisesFragment
  })
  noises.plane.mesh = new THREE.Mesh(noises.plane.geometry, noises.plane.material)
  noises.scene.add(noises.plane.mesh)


  noises.renderTarget = new THREE.WebGLRenderTarget(
    256,
    256,
    {
      generateMipmaps: false,
      type: THREE.FloatType,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping
    }
  )

  renderer.setRenderTarget(noises.renderTarget)
  renderer.render(noises.scene, noises.camera)
  renderer.setRenderTarget(null)


  disc.gradient = {}
  disc.gradient.canvas = document.createElement('canvas')
  disc.gradient.canvas.width = 1
  disc.gradient.canvas.height = 128
  disc.gradient.context = disc.gradient.canvas.getContext('2d')
  disc.gradient.style = disc.gradient.context.createLinearGradient(0, 0, 0, disc.gradient.canvas.height)
  disc.gradient.style.addColorStop(0, '#fffbf9')
  disc.gradient.style.addColorStop(0.1, '#ffbc68')
  disc.gradient.style.addColorStop(0.2, '#ff5600')
  disc.gradient.style.addColorStop(0.4, '#ff0053')
  disc.gradient.style.addColorStop(0.8, '#cc00ff')
  disc.gradient.context.fillStyle = disc.gradient.style
  disc.gradient.context.fillRect(0, 0, disc.gradient.canvas.width, disc.gradient.canvas.height)
  disc.gradient.texture = new THREE.CanvasTexture(disc.gradient.canvas)


  disc.geometry = new THREE.CylinderGeometry(1.5, 6, 0, 64, 8, true)
  disc.material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: discVertex,
    fragmentShader: discFragment,
    uniforms: {
      uTime: { value: 0 },
      uGradientTexture: { value: disc.gradient.texture },
      uNoisesTexture: { value: noises.renderTarget.texture }
    }
  })
  disc.mesh = new THREE.Mesh(disc.geometry, disc.material)
  scene.add(disc.mesh)

  distortion.scene = new THREE.Scene()

  distortion.hole = {}
  distortion.hole.geometry = new THREE.PlaneGeometry(4, 4)
  distortion.hole.material = new THREE.ShaderMaterial({
    vertexShader: distortionHoleVertex,
    fragmentShader: distortionHoleFragment
  })
  distortion.hole.mesh = new THREE.Mesh(distortion.hole.geometry, distortion.hole.material)
  distortion.scene.add(distortion.hole.mesh)

  distortion.disc = {}
  distortion.disc.geometry = new THREE.PlaneGeometry(12, 12)
  distortion.disc.material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: distortionDiscVertex,
    fragmentShader: distortionDiscFragment
  })
  distortion.disc.mesh = new THREE.Mesh(distortion.disc.geometry, distortion.disc.material)
  distortion.disc.mesh.rotation.x = - Math.PI * 0.5
  distortion.scene.add(distortion.disc.mesh)


  composition.defaultRenderTarget = new THREE.WebGLRenderTarget(
    viewPort.value.width,
    viewPort.value.height,
    {
      generateMipmaps: false
    }
  )

  composition.distortionRenderTarget = new THREE.WebGLRenderTarget(
    viewPort.value.width,
    viewPort.value.height,
    {
      generateMipmaps: false,
      format: THREE.RedFormat
    }
  )

  composition.scene = new THREE.Scene()
  composition.camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.1, 10)
  composition.camera.position.set(0, 0, 5)
  composition.scene.add(composition.camera)

  composition.plane = {}
  composition.plane.geometry = new THREE.PlaneGeometry(2, 2)
  composition.plane.material = new THREE.ShaderMaterial({
    vertexShader: compositionVertex,
    fragmentShader: compositionFragment,
    uniforms: {
      uTime: { value: 0 },
      uDefaultTexture: { value: composition.defaultRenderTarget.texture },
      uDistortionTexture: { value: composition.distortionRenderTarget.texture },
      uConvergencePosition: { value: new THREE.Vector2() }
    }
  })
  composition.plane.mesh = new THREE.Mesh(composition.plane.geometry, composition.plane.material)
  composition.scene.add(composition.plane.mesh)
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
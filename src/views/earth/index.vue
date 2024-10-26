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
import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

const earthDayTexture = textureLoader.load(new URL('./texture/day.jpg', import.meta.url).href)
earthDayTexture.colorSpace = THREE.SRGBColorSpace
earthDayTexture.anisotropy = 8

const earthNightTexture = textureLoader.load(new URL('./texture/night.jpg', import.meta.url).href)
earthNightTexture.colorSpace = THREE.SRGBColorSpace
earthNightTexture.anisotropy = 8

const earthSpecularCloudsTexture = textureLoader.load(new URL('./texture/specularClouds.jpg', import.meta.url).href)
earthSpecularCloudsTexture.anisotropy = 8
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
  camera.position.set(12, 5, 4)
  renderer.setClearColor('#000011')

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

}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
}

const earthParameters: any = {
  atmosphereDayColor: '#00aaff',
  atmosphereTwilightColor: '#ff6600'
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
  addEarth()
  addAtmosphere();
  addSun();

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    earth.rotation.y = elapsedTime * 0.1

    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})


let earth: any
let earthGeometry: any
let earthMaterial: any;
function addEarth() {
  // Mesh
  earthGeometry = new THREE.SphereGeometry(2, 64, 64)

  earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms:
    {
      uDayTexture: new THREE.Uniform(earthDayTexture),
      uNightTexture: new THREE.Uniform(earthNightTexture),
      uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
      uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
      uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    }
  })
  earth = new THREE.Mesh(earthGeometry, earthMaterial)

  scene.add(earth)

}

let atmosphereMaterial: any;
let atmosphere: any;
function addAtmosphere() {
  // Atmosphere
  atmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms:
    {
      uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
      uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
      uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    },
  })


  atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial)
  atmosphere.scale.set(1.04, 1.04, 1.04)
  scene.add(atmosphere)
}


let sunSpherical: any;
let sunDirection: any;
function addSun() {
  sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5)
  sunDirection = new THREE.Vector3()

  // Debug
  const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
  )
  scene.add(debugSun)

  // Update
  const updateSun = () => {
    // Sun direction
    sunDirection.setFromSpherical(sunSpherical)

    // Debug
    debugSun.position
      .copy(sunDirection)
      .multiplyScalar(5)

    // Uniforms
    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection)
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
  }

  updateSun()

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
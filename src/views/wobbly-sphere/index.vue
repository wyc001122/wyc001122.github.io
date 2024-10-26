<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

/**
 * custom shader 
 */
import vertexShader from "./shaders/wobble/vertexShader.glsl";
import fragmentShader from "./shaders/wobble/fragmentShader.glsl";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const rgbeLoader = new RGBELoader()


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
  camera.position.set(13, - 3, - 5);

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  rgbeLoader.load('texture/hdr/urban_alley_01_1k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap
  })

  /**
     * Lights
     */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0.25, 2, - 2.25)
  scene.add(directionalLight)

  /**
     * Plane
     */
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15, 15),
    new THREE.MeshStandardMaterial()
  )
  plane.receiveShadow = true
  plane.rotation.y = Math.PI
  plane.position.y = - 5
  plane.position.z = 5
  scene.add(plane)
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
  uColorA: '#0000ff',
  uColorB: '#ff0000'
}
const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.5),
  uTimeFrequency: new THREE.Uniform(0.4),
  uStrength: new THREE.Uniform(0.3),
  uWarpPositionFrequency: new THREE.Uniform(0.38),
  uWarpTimeFrequency: new THREE.Uniform(0.12),
  uWarpStrength: new THREE.Uniform(1.7),
  uColorA: new THREE.Uniform(new THREE.Color(debug.uColorA)),
  uColorB: new THREE.Uniform(new THREE.Color(debug.uColorB))
}

function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
  gui.addColor(debug, 'uColorA').onChange(() => uniforms.uColorA.value.set(debug.uColorA))
  gui.addColor(debug, 'uColorB').onChange(() => uniforms.uColorB.value.set(debug.uColorB))

}


let wobble: any;

onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  addSphere()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    uniforms.uTime.value = elapsedTime

    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})



function addSphere() {

  const material = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader,
    fragmentShader,
    uniforms,

    // MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.5,
    color: '#ffffff',
    transmission: 0,
    ior: 1.5,
    thickness: 1.5,
    transparent: true,
    wireframe: false
  })

  const depthMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader,
    uniforms,

    // MeshDepthMaterial
    depthPacking: THREE.RGBADepthPacking
  })


  gui.add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001).name('uPositionFrequency')
  gui.add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001).name('uTimeFrequency')
  gui.add(uniforms.uStrength, 'value', 0, 2, 0.001).name('uStrength')
  gui.add(uniforms.uWarpPositionFrequency, 'value', 0, 2, 0.001).name('uWarpPositionFrequency')
  gui.add(uniforms.uWarpTimeFrequency, 'value', 0, 2, 0.001).name('uWarpTimeFrequency')
  gui.add(uniforms.uWarpStrength, 'value', 0, 2, 0.001).name('uWarpStrength')

  gui.add(material, 'metalness', 0, 1, 0.001)
  gui.add(material, 'roughness', 0, 1, 0.001)
  gui.add(material, 'transmission', 0, 1, 0.001)
  gui.add(material, 'ior', 0, 10, 0.001)
  gui.add(material, 'thickness', 0, 10, 0.001)

  // Geometry
  const geometry = mergeVertices(new THREE.IcosahedronGeometry(2.5, 50))
  geometry.computeTangents()

  // Mesh
  wobble = new THREE.Mesh(geometry, material)
  wobble.customDepthMaterial = depthMaterial
  wobble.receiveShadow = true
  wobble.castShadow = true

  scene.add(wobble)
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
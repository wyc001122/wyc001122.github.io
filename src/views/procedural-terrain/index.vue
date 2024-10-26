<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { SUBTRACTION, Evaluator, Brush } from 'three-bvh-csg'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

/**
 * custom shader 
 */
import vertexShader from './shaders/terrain/vertexShader.glsl'
import fragmentShader from './shaders/terrain/fragmentShader.glsl'


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
  camera.position.set(-10, 6, -2)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  rgbeLoader.load('/texture/hdr/spruit_sunrise.hdr', (environmentMap: any) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.backgroundBlurriness = 0.5
    scene.environment = environmentMap
  })

  /**
     * Lights
     */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
  directionalLight.position.set(6.25, 3, 4)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 30
  directionalLight.shadow.camera.top = 8
  directionalLight.shadow.camera.right = 8
  directionalLight.shadow.camera.bottom = -8
  directionalLight.shadow.camera.left = -8
  scene.add(directionalLight)
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
  colorWaterDeep: '#002b3d',
  colorWaterSurface: '#66a8ff',
  colorSand: '#ffe894',
  colorGrass: '#85d534',
  colorSnow: '#ffffff',
  colorRock: '#bfbd8d',
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
}

const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.2),
  uStrength: new THREE.Uniform(2.0),
  uWarpFrequency: new THREE.Uniform(5),
  uWarpStrength: new THREE.Uniform(0.5),
  uColorWaterDeep: new THREE.Uniform(new THREE.Color(debug.colorWaterDeep)),
  uColorWaterSurface: new THREE.Uniform(new THREE.Color(debug.colorWaterSurface)),
  uColorSand: new THREE.Uniform(new THREE.Color(debug.colorSand)),
  uColorGrass: new THREE.Uniform(new THREE.Color(debug.colorGrass)),
  uColorSnow: new THREE.Uniform(new THREE.Color(debug.colorSnow)),
  uColorRock: new THREE.Uniform(new THREE.Color(debug.colorRock)),
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
  addBoard()
  addTerrain()
  addWater()

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

function addBoard() {
  // Brushes
  const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11))
  const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10))

  // Evaluate
  const evaluator = new Evaluator()
  const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION)
  board.geometry.clearGroups()
  board.material = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0, roughness: 0.3 })
  board.castShadow = true
  board.receiveShadow = true
  scene.add(board)
}

function addTerrain() {
  const geometry = new THREE.PlaneGeometry(10, 10, 500, 500)
  geometry.deleteAttribute('uv')
  geometry.deleteAttribute('normal')
  geometry.rotateX(- Math.PI * 0.5)

  gui.add(uniforms.uPositionFrequency, 'value', 0, 1, 0.001).name('uPositionFrequency')
  gui.add(uniforms.uStrength, 'value', 0, 10, 0.001).name('uStrength')
  gui.add(uniforms.uWarpFrequency, 'value', 0, 10, 0.001).name('uWarpFrequency')
  gui.add(uniforms.uWarpStrength, 'value', 0, 1, 0.001).name('uWarpStrength')
  gui.addColor(debug, 'colorWaterDeep').onChange(() => uniforms.uColorWaterDeep.value.set(debug.colorWaterDeep))
  gui.addColor(debug, 'colorWaterSurface').onChange(() => uniforms.uColorWaterSurface.value.set(debug.colorWaterSurface))
  gui.addColor(debug, 'colorSand').onChange(() => uniforms.uColorSand.value.set(debug.colorSand))
  gui.addColor(debug, 'colorGrass').onChange(() => uniforms.uColorGrass.value.set(debug.colorGrass))
  gui.addColor(debug, 'colorSnow').onChange(() => uniforms.uColorSnow.value.set(debug.colorSnow))
  gui.addColor(debug, 'colorRock').onChange(() => uniforms.uColorRock.value.set(debug.colorRock))


  const material = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,

    // MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.5,
    color: '#85d534'
  })

  const depthMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: vertexShader,
    uniforms: uniforms,

    // MeshDepthMaterial
    depthPacking: THREE.RGBADepthPacking
  })

  // Mesh
  const terrain = new THREE.Mesh(geometry, material)
  terrain.customDepthMaterial = depthMaterial
  terrain.receiveShadow = true
  terrain.castShadow = true
  scene.add(terrain)
}

function addWater() {
  /**
     * Water
     */
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 1, 1),
    new THREE.MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0.3
    })
  )
  water.rotation.x = - Math.PI * 0.5
  water.position.y = - 0.1
  scene.add(water)
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
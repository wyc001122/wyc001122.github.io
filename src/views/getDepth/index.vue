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
  camera.near = 0.01;
  camera.far = 100;
  camera.updateProjectionMatrix()
  camera.position.set(0, 4, 10)

  renderer.setClearColor(0xffffff)
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

    renderTarget.setSize(width, height)
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

onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  setupRT()
  addPlane()
  addSphere()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // update uniforms
    uniforms.uTime.value = elapsedTime
    uniforms.uResolution.value = new THREE.Vector2(viewPort.value.width, viewPort.value.height)

    // update control 
    control.update()

    // render scene without sphere
    sphere.visible = false
    scene.overrideMaterial = depthMaterial
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)
    uniforms.uSceenDepth.value = renderTarget.texture

    // render scene with sphere
    scene.overrideMaterial = null 

    sphere.visible = true
    renderer.setRenderTarget(null)
    renderer.render(scene, camera)
  });
})

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


let plane: THREE.Mesh;
function addPlane() {
  const geo = new THREE.PlaneGeometry(10, 10)
  const mat = new THREE.MeshBasicMaterial({
    color: 0x333333,
  })
  plane = new THREE.Mesh(geo, mat)
  plane.rotation.x = -Math.PI / 2
  scene.add(plane)
}

let uniforms: any;
let sphere: THREE.Mesh;
function addSphere() {
  uniforms = {
    uTime: { value: 0 },
    uRimColor: { value: new THREE.Color(0x999999) },
    uRimIntensity: { value: 1 }, // 边缘光强度
    uRimPower: { value: 1.5 }, // 边缘光指数
    uIntersectPower: { value: 100 }, // 相交指数
    uResolution: { value: new THREE.Vector2(viewPort.value.width, viewPort.value.height) },
    uFar: { value: camera.far },
    uNear: { value: camera.near },
    uSceenDepth: { value: null },
  }
  gui.add(uniforms.uRimIntensity, 'value', .01, 2, 0.01).name('边缘光强度')
  gui.add(uniforms.uRimPower, 'value', .01, 5, 0.01).name('边缘光指数')
  gui.add(uniforms.uIntersectPower, 'value', .1, 100, 0.01).name('相交指数')


  const geo = new THREE.SphereGeometry(1, 32, 32)
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    depthTest: true,
  })
  sphere = new THREE.Mesh(geo, mat)
  scene.add(sphere)
}

let renderTarget: THREE.WebGLRenderTarget;
function setupRT() {
  renderTarget = new THREE.WebGLRenderTarget(viewPort.value.width, viewPort.value.height)
  // test
  const width = viewPort.value.width / 5
  const height = viewPort.value.height / 5

  const canvas = document.createElement('canvas')
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.style.position = 'absolute'
  canvas.style.top = '0px'
  canvas.style.left = '0px'
  canvas.style.zIndex = '999'
  canvas.width = width
  canvas.height = height
  container.appendChild(canvas)
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
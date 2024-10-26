<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";


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
  const ambientLight = new THREE.AmbientLight(0xffffff, 5);
  scene.add(ambientLight);
  scene.background = new THREE.Color(0xeeeeee);

  camera.position.set(0, 0, 10)
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

    uniforms.u_Resolution.value.set(width, height)
    composer.setSize(width, height)
  })
}

/**
 * debug
 */
let gui: any;
let debug: any = {

}
let uniforms: any = {
  tDiffuse: new THREE.Uniform(null),
  u_Resolution: new THREE.Uniform(new THREE.Vector2(1024, 1024)),
  lineColor: new THREE.Uniform(new THREE.Color(0xff0000)),
  lineOpacity: new THREE.Uniform(1.0),
  showLine: new THREE.Uniform(true),
}

function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
  gui.add(uniforms.lineOpacity, 'value', 0, 1).name('描边透明度').onChange((value: any) => {
    shaderPass.uniforms.lineOpacity.value = value
  })
  gui.add(uniforms.showLine, 'value').name('显示描边').onChange((value: any) => {
    shaderPass.uniforms.showLine.value = value
  })
  gui.addColor(uniforms.lineColor, 'value').name('描边颜色').onChange((color: any) => {
    shaderPass.uniforms.lineColor.value.set(color)
  })
}


let model: any;
let composer: any;
let shaderPass: any
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
  initPass()

  tick(() => {

    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    composer.setSize(viewPort.value.width, viewPort.value.height)
    // update control
    control.update()

    // renderer render
    composer.render(elapsedTime)
  });
})
function loadModel() {
  gltfLoader.load(new URL('./models/autumn_house.gltf', import.meta.url).href, (gltf: any) => {
    model = gltf.scene;
    model.scale.set(0.25, 0.25, 0.25);
    model.rotation.y = -Math.PI / 2;
    model.position.y = -2.25;
    scene.add(model);
  })
}


function initPass() {
  const { width, height, } = viewPort.value

  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);

  shaderPass = new ShaderPass({
    uniforms,
    vertexShader,
    fragmentShader
  });

  composer.addPass(renderPass);
  composer.addPass(shaderPass);
  composer.addPass(new OutputPass());

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
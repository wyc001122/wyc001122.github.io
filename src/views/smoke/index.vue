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
// import vertexShader from "./shaders/vertexShader.glsl";
// import fragmentShader from "./shaders/fragmentShader.glsl";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

const textTexture = textureLoader.load(new URL('./texture/quickText.png', import.meta.url).href);
const smokeTexture = textureLoader.load(new URL('./texture/Smoke-Element.png', import.meta.url).href);
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
  camera.position.set(0, 0, 1100)
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(-1, 0, 1);
  scene.add(light);
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


let cubeSineDriver = 0;
let smokeParticles: any;
let mesh: any;
onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  addTest()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    cubeSineDriver += 0.01

    if (smokeParticles) {
      let sp = smokeParticles.length;
      while (sp--) {
        smokeParticles[sp].rotation.z = (elapsedTime * 0.2);
      }
    };
    cubeSineDriver += .01;

    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})



function addTest() {
  const textGeo = new THREE.PlaneGeometry(300, 300);
  const textMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff, opacity: 1, map: textTexture, transparent: true, blending: THREE.AdditiveBlending })
  const text = new THREE.Mesh(textGeo, textMaterial);
  text.position.z = 800;
  scene.add(text);

  const smokeMaterial = new THREE.MeshLambertMaterial({ color: 0x00dddd, map: smokeTexture, transparent: true, depthTest: false });
  const smokeGeo = new THREE.PlaneGeometry(300, 300);
  smokeParticles = [];


  for (let p = 0; p < 150; p++) {
    var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
    particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100);
    particle.rotation.z = Math.random() * 360;
    scene.add(particle);
    smokeParticles.push(particle);
  }
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
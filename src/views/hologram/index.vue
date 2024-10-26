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
  camera.position.set(0, 0, 10)
  renderer.setClearColor('#1d1f2a')

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
  color: '#70c1ff'
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)

  gui.addColor(debug, 'color').onChange((color: any) => {
    material.uniforms.uColor.value = new THREE.Color(color)
  })
}


let material: any;

let sphere: any;
let torusKnot: any;
let model: any;

onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  addMaterial()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    if (model) {
      model.rotation.x = - elapsedTime * 0.1
      model.rotation.y = elapsedTime * 0.2
    }

    if (sphere) {
      sphere.rotation.x = - elapsedTime * 0.1
      sphere.rotation.y = elapsedTime * 0.2
    }

    if (torusKnot) {
      torusKnot.rotation.x = - elapsedTime * 0.1
      torusKnot.rotation.y = elapsedTime * 0.2
    }
    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})



function addMaterial() {
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uColor: new THREE.Uniform(new THREE.Color(debug.color)),
    }
  })
  
  torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
  )
  torusKnot.position.x = 3
  scene.add(torusKnot)

  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
  )
  sphere.position.x = - 3
  scene.add(sphere)

  gltfLoader.load(
    '/models/suzanne.glb',
    (gltf: any) => {
      model = gltf.scene
      model.traverse((child: any) => {
        if (child.isMesh)
          child.material = material
      })
      scene.add(model)
    }
  )


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
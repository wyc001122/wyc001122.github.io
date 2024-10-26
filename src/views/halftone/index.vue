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
  camera.position.set(1.5, 0, 6)
  renderer.setClearAlpha(0)
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
  color: '#ff794d',
  shadowColor: '#8e19b8',
  lightColor: '#e5ffe0',
  shadowRepetitions: 100,
  lightRepetitions: 130,
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
}


let material: any

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

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()
    if (material) {
      material.uniforms.uTime.value = elapsedTime
      material.uniforms.uResolution.value.set(viewPort.value.width, viewPort.value.height)
    }

    // update control 
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})



function gogogo() {
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uColor: { value: new THREE.Color().set(debug.color) },
      uResolution: { value: new THREE.Vector2(viewPort.value.width, viewPort.value.height) },
      uShadowRepetitions: new THREE.Uniform(debug.shadowRepetitions),
      uShadowColor: new THREE.Uniform(new THREE.Color(debug.shadowColor)),
      uLightRepetitions: new THREE.Uniform(debug.lightRepetitions),
      uLightColor: new THREE.Uniform(new THREE.Color(debug.lightColor))
    }
  })

  // TorusKnot
  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
  )
  torusKnot.position.x = 3
  scene.add(torusKnot)

  // Sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
  )
  sphere.position.x = - 3
  scene.add(sphere)

  // Add Suzanne
  gltfLoader.load(
    '/models/suzanne.glb',
    (gltf: any) => {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh)
          child.material = material
      })
      scene.add(gltf.scene)
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
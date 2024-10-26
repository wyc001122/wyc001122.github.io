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
  camera.position.set(1, 1, 1)
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
const debugObject: any = {
  depthColor: '#ff4000',
  surfaceColor: '#151c37',
  bigWavesElevation: 0.2,
  bigWavesFrequency: 4,
  bigWavesSpeed: 0.75,
  smallWavesElevation: 0.15,
  smallWavesFrequency: 3,
  smallWavesSpeed: 0.2,
  smallIterations: 4,
  colorOffset: 0.925,
  colorMultiplier: 1,
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy) 

  gui.addColor(debugObject, 'depthColor').name('深水颜色').onChange((value: any) => {
    if (water) {
      water.material.uniforms.uDepthColor.value = new THREE.Color(value)
    }
  })
  gui.addColor(debugObject, 'surfaceColor').name('表面颜色').onChange((value: any) => {
    if (water) {
      water.material.uniforms.uSurfaceColor.value = new THREE.Color(value)
    }
  })
  gui.add(debugObject, 'bigWavesElevation').name('整体浪高').min(0).max(1).step(0.001).onChange((value: any) => {
    if (water) {
      water.material.uniforms.uBigWavesElevation.value = value
    }
  })
  gui.add(debugObject, 'bigWavesFrequency').name('整体频率').min(0).max(10).step(0.001).onChange((value: any) => {
    if (water) {
      water.material.uniforms.uBigWavesFrequency.value = value
    }
  })
  gui.add(debugObject, 'bigWavesSpeed').name('整体速度').min(0).max(10).step(0.001).onChange((value: any) => {
    if (water) {
      water.material.uniforms.uBigWavesSpeed.value = value
    }
  })
  gui.add(debugObject, 'smallWavesElevation').name('噪音高度').min(0).max(1).step(0.001).onChange((value: any) => {
    if (water) {
      water.material.uniforms.uSmallWavesElevation.value = value
    }
  })
  gui.add(debugObject, 'smallWavesFrequency').name('噪音频率').min(0).max(10).step(0.001).onChange((value: any) => {
    if (water) {
      water.material.uniforms.uSmallWavesFrequency.value = value
    }
  })
  gui.add(debugObject, 'smallWavesSpeed').name('噪音速度').min(0).max(10).step(0.001).onChange((value: any) => {
    if (water) {
      water.material.uniforms.uSmallWavesSpeed.value = value
    }
  })
  gui.add(debugObject, 'smallIterations').name('噪音重复').min(0).max(10).step(0.001).onChange((value: any) => {
    if (water) {
      water.material.uniforms.uSmallIterations.value = value
    }
  })
  gui.add(debugObject, 'colorOffset').name('颜色偏移').min(0).max(1).step(0.001).onChange((value: any) => {
    if (water) {
      water.material.uniforms.uColorOffset.value = value
    }
  })
}


let water: any;



onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  addWater()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()
    if (water) {
      water.material.uniforms.uTime.value = elapsedTime
    }
    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})



function addWater() {
  // Geometry
  const geometry = new THREE.PlaneGeometry(2, 2, 512, 512)
  // geometry.deleteAttribute('normal')


  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:
    {
      uTime: { value: 0 },

      uBigWavesElevation: { value: 0.2 },
      uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
      uBigWavesSpeed: { value: 0.75 },

      uSmallWavesElevation: { value: 0.15 },
      uSmallWavesFrequency: { value: 3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallIterations: { value: 4 },

      uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
      uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },

      uColorOffset: { value: 0.925 },
      uColorMultiplier: { value: 1 }
    }
  })
  // Mesh
  water = new THREE.Mesh(geometry, material)

  water.rotation.x = - Math.PI * 0.5
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
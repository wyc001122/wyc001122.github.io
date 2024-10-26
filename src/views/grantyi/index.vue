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
import sphereVertexShader from './shaders/sphere/vertex.glsl'
import sphereFragmentShader from './shaders/sphere/fragment.glsl'

import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'

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
  camera.position.set(0, 0, 5)
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
  clearColor: '#000000'
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)
  gui.addColor(debug, 'clearColor').onChange(() => { renderer.setClearColor(debug.clearColor) })
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
  addSphere()
  addParticles()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    sphere.material.uniforms.uTime.value = elapsedTime
    particles.material.uniforms.uTime.value = elapsedTime
    particles.rotation.y = elapsedTime;
    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})


let sphere: any;
function addSphere() {
  const { width, height } = viewPort.value
  /**
 * sphere
 */
  const sphere_geometry = new THREE.SphereGeometry(1, 462, 462)
  const sphere_material = new THREE.ShaderMaterial({
    vertexShader: sphereVertexShader,
    fragmentShader: sphereFragmentShader,
    uniforms:
    {
      uSize: new THREE.Uniform(0.4),
      uTime: new THREE.Uniform(0.0),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
    }
  })
  sphere = new THREE.Mesh(sphere_geometry, sphere_material)
  scene.add(sphere)
}


let particles: any
function addParticles() {
  const { width, height } = viewPort.value

  let N = 10000;
  let positions = new Float32Array(N * 3);
  const particles_geometry = new THREE.BufferGeometry();
  let inc = Math.PI * (3 - Math.sqrt(5));
  let offset = 2 / N;
  let rad = 1.7;
  for (let i = 0; i < N; i++) {
    let y = i * offset - 1 + (offset / 2);
    let r = Math.sqrt(1 - y * y);
    let phi = i * inc;
    positions[i * 3] = rad * Math.cos(phi) * r;
    positions[i * 3 + 1] = rad * y;
    positions[i * 3 + 2] = rad * Math.sin(phi) * r;
  }
  particles_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles_material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    transparent: true,
    uniforms:
    {
      uSize: new THREE.Uniform(0.4),
      uTime: new THREE.Uniform(0.0),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height))
    }
  })
  particles = new THREE.Points(particles_geometry, particles_material)
  scene.add(particles)
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
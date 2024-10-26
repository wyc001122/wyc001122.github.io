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
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertexParticles.glsl";

import simFragment from "./shaders/simFragment.glsl";
import simVertex from "./shaders/simVertex.glsl";

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

  camera.position.set(0, 0, 4)

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


onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  setupEvents()
  setupFBO();
  addObjects();

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // update control
    control.update()

    material.uniforms.time.value = elapsedTime;
    fboMaterial.uniforms.time.value = elapsedTime;

    fboMaterial.uniforms.uPositions.value = fbo1.texture;
    material.uniforms.uPositions.value = fbo.texture;

    renderer.setRenderTarget(fbo);
    renderer.render(fboScene, fboCamera);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);


    // swap render targets
    let temp = fbo;
    fbo = fbo1;
    fbo1 = temp; 
  });
})

let raycaster: any;
let pointer: any;
let fboMaterial: any;
function setupEvents() {
  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  const dummy = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial()
  )
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x555555 })
  )
  // scene.add(ball)
  container.addEventListener('pointermove', (e) => {
    const { viewWidth, viewHeight } = viewPort.value
    pointer.x = (e.offsetX / viewWidth) * 2 - 1;
    pointer.y = - (e.offsetY / viewHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    let intersects = raycaster.intersectObject(dummy);
    if (intersects.length > 0) {
      let { x, y } = intersects[0].point;
      fboMaterial.uniforms.uMouse.value = new THREE.Vector2(x, y);
      console.log(x, y)
      ball.position.set(x, y, 0)
    }
  })
}


let fboScene: any;
let fboCamera: any;
let fboTexture: any;
let infoarray: any;
let info: any
let fboMesh: any

let size: any
let fbo: any
let fbo1: any

function setupFBO() {
  size = 256;
  fbo = getRenderTarget();
  fbo1 = getRenderTarget();

  fboScene = new THREE.Scene();
  fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  fboCamera.position.set(0, 0, 0.5);
  fboCamera.lookAt(0, 0, 0);
  let geometry = new THREE.PlaneGeometry(2, 2);

  const data = new Float32Array(size * size * 4);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let index = (i + j * size) * 4;
      let theta = Math.random() * Math.PI * 2;
      let r = 0.5 + 0.5 * Math.random()
      data[index + 0] = r * Math.cos(theta);
      data[index + 1] = r * Math.sin(theta);
      data[index + 2] = 1.;
      data[index + 3] = 1.;
    }
  }

  fboTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
  fboTexture.magFilter = THREE.NearestFilter;
  fboTexture.minFilter = THREE.NearestFilter;
  fboTexture.needsUpdate = true;




  fboMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPositions: { value: fboTexture },
      uInfo: { value: null },
      uMouse: { value: new THREE.Vector2(0, 0) },
      time: { value: 0 },
    },
    vertexShader: simVertex,
    fragmentShader: simFragment,
  })

  infoarray = new Float32Array(size * size * 4);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let index = (i + j * size) * 4;
      infoarray[index + 0] = 0.5 + Math.random();
      infoarray[index + 1] = 0.5 + Math.random();
      infoarray[index + 2] = 1.;
      infoarray[index + 3] = 1.;
    }
  }

  info = new THREE.DataTexture(infoarray, size, size, THREE.RGBAFormat, THREE.FloatType);
  info.magFilter = THREE.NearestFilter;
  info.minFilter = THREE.NearestFilter;
  info.needsUpdate = true;
  fboMaterial.uniforms.uInfo.value = info;



  fboMesh = new THREE.Mesh(geometry, fboMaterial);
  fboScene.add(fboMesh);

  control.update()
  renderer.setRenderTarget(fbo);
  renderer.render(fboScene, fboCamera);
  renderer.setRenderTarget(fbo1);
  renderer.render(fboScene, fboCamera);

}
function getRenderTarget() {
  const { width, height } = viewPort.value
  const renderTarget = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });
  return renderTarget;
}


let material: any;
let count: any;
let points: any;
function addObjects() {
  material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0 },
      uPositions: { value: null },
      resolution: { value: new THREE.Vector4() },
    },
    // wireframe: true,
    transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  count = size ** 2
  let geometry = new THREE.BufferGeometry()
  let positions = new Float32Array(count * 3)
  let uv = new Float32Array(count * 2)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let index = (i + j * size);
      positions[index * 3 + 0] = Math.random()
      positions[index * 3 + 1] = Math.random()
      positions[index * 3 + 2] = 0
      uv[index * 2 + 0] = i / size
      uv[index * 2 + 1] = j / size


    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

  material.uniforms.uPositions.value = fboTexture;
  points = new THREE.Points(geometry, material);
  scene.add(points);
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
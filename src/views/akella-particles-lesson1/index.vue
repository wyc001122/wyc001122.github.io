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
import vertexShader from "./shaders/particles/vertexShader.glsl";
import fragmentShader from "./shaders/particles/fragmentShader.glsl";

import simVertexShader from "./shaders/sim/vertexShader.glsl";
import simFragmentShader from "./shaders/sim/fragmentShader.glsl";

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
  camera.position.set(0, 0, 2)
  renderer.setClearColor(0x222222, 1);

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

let raycaster: any;
let pointer: any;

const fboSize = 32;
const fboNumber = fboSize * fboSize;

let simMesh: any;

let fboRenderTarget: any;
let fboRenderTarget1: any;
let fboDatatexture: any;
let fboScene: any;
let fboCamera: any;

let pointsMesh: any;


onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  initMouse()
  setupFBO()
  addObjects()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    pointsMesh.material.uniforms.uTime.value = elapsedTime
    // simMesh.material.uniforms.uMouse.value = pointer

    renderer.setRenderTarget(fboRenderTarget)
    renderer.render(fboScene, fboCamera)

    renderer.setRenderTarget(null)
    renderer.render(scene, camera);

    ;[fboRenderTarget, fboRenderTarget1] = [fboRenderTarget1, fboRenderTarget]

    pointsMesh.material.uniforms.uTexture.value = fboRenderTarget.texture;
    simMesh.material.uniforms.uCurrentPosition.value = fboRenderTarget1.texture;

    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})

// 线性插值
function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function initMouse() {
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0xffffff,
      opacity: 0.5,
    })
  )

  const curosrPoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 32, 32),
    new THREE.MeshNormalMaterial()
  )

  // scene.add(planeMesh)
  scene.add(curosrPoint)

  container.addEventListener('mousemove', (e) => {
    pointer.x = (e.offsetX / viewPort.value.viewWidth) * 2 - 1;
    pointer.y = -(e.offsetY / viewPort.value.viewHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera)

    const intersections = raycaster.intersectObject(planeMesh)
    if (intersections.length > 0) {
      curosrPoint.position.copy(intersections[0].point)
      simMesh.material.uniforms.uMouse.value = intersections[0].point
    }
  })
}

function setupFBO() {
  const dataArray = new Float32Array(fboNumber * 4);

  for (let i = 0; i < dataArray.length; i++) {
    for (let j = 0; j < fboSize; j++) {
      const index = i * fboSize + j;
      dataArray[4 * index] = lerp(-0.5, 0.5, j / (fboSize - 1));
      dataArray[4 * index + 1] = lerp(-0.5, 0.5, i / (fboSize - 1));
      dataArray[4 * index + 2] = 0;
      dataArray[4 * index + 3] = 1;
    }
  }

  const fboDatatexture = new THREE.DataTexture(dataArray, fboSize, fboSize, THREE.RGBAFormat, THREE.FloatType)
  fboDatatexture.needsUpdate = true

  fboScene = new THREE.Scene()
  fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2, 2);
  fboCamera.position.set(0, 0, 1)
  fboCamera.lookAt(0, 0, 0)

  const geo = new THREE.PlaneGeometry(2, 2, 2, 2);
  const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uMouse: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
      uTime: new THREE.Uniform(0),
      uCurrentPosition: new THREE.Uniform(fboDatatexture),
      uOriginalPosition: new THREE.Uniform(fboDatatexture),
    },
    vertexShader: simVertexShader,
    fragmentShader: simFragmentShader,
  })
  simMesh = new THREE.Mesh(geo, simMaterial)
  fboScene.add(simMesh)

  fboRenderTarget = new THREE.WebGLRenderTarget(fboSize, fboSize, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  fboRenderTarget1 = new THREE.WebGLRenderTarget(fboSize, fboSize, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

}

function addObjects() {
  const geometry = new THREE.BufferGeometry();
  const positionsArray = new Float32Array(fboNumber * 3);
  const uvsArray = new Float32Array(fboNumber * 2);

  for (let i = 0; i < fboSize; i++) {
    for (let j = 0; j < fboSize; j++) {
      const index = i * fboSize + j;

      positionsArray[3 * index + 0] = j / fboSize - 0.5;
      positionsArray[3 * index + 1] = i / fboSize - 0.5;
      positionsArray[3 * index + 2] = 0;

      uvsArray[2 * index + 0] = j / (fboSize - 1);
      uvsArray[2 * index + 1] = i / (fboSize - 1);
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvsArray, 2))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: new THREE.Uniform(0),
      uTexture: new THREE.Uniform(fboDatatexture),
    },
    vertexShader,
    fragmentShader,
  })

  pointsMesh = new THREE.Points(geometry, material)
  scene.add(pointsMesh)
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
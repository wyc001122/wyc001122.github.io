<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'

import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import PoissonDiskSampling from 'poisson-disk-sampling';


/**
 * custom shader 
 */
import fragment from "./shaders/fragment.glsl";
import fragmentShaderVelocity from "./shaders/fragmentShaderVelocity.glsl";
import fragmentShaderPosition from "./shaders/fragmentShaderPosition.glsl";
import vertex from "./shaders/vertexParticles.glsl";

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
  camera.position.set(0, 0, 3)
  renderer.setClearColor(0xeeeeee, 1);

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

let COUNT = 128;
let TEXTURE_WIDTH = COUNT ** 2;
onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  initAll()

  tick(() => {
    if (!gpuCompute) return
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // update control
    control.update()

    gpuCompute.compute();
    positionUniforms['time'].value = elapsedTime;
    velocityUniforms['time'].value = elapsedTime;

    material.uniforms.uPositions.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;

    material.uniforms.time.value = elapsedTime;
    renderer.render(scene, camera);
  });
})


let points1: any;
let points2: any;
function loadImage(path: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
    img.src = path
    img.onload = () => {
      resolve(img)
    }
    img.onerror = e => {
      reject(e)
    }
  })
}
async function initAll() {
  points1 = await getPoints(new URL('./texture/xiong.jpg', import.meta.url).href)
  points2 = await getPoints(new URL('./texture/logo.png', import.meta.url).href)

  initGPU()
  addObjects()
}
async function getPoints(url: string) {
  const image = await loadImage(url) as HTMLImageElement;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
  canvas.width = COUNT;
  canvas.height = COUNT;
  ctx.drawImage(image, 0, 0, COUNT, COUNT);
  let data = ctx.getImageData(0, 0, COUNT, COUNT).data;
  // 2 dimensional array
  let array = Array.from({ length: COUNT }, () => new Array(COUNT).fill(0));
  for (let i = 0; i < COUNT; i++) {
    for (let j = 0; j < COUNT; j++) {
      let position = (i + j * COUNT) * 4;
      let color = data[position] / 255;
      array[i][j] = color;
    }
  }


  var pds = new PoissonDiskSampling({
    shape: [1, 1],
    minDistance: 1 / 400,
    maxDistance: 4 / 400,
    tries: 20,
    distanceFunction: function (point) {
      let indX = Math.floor(point[0] * COUNT);
      let indY = Math.floor(point[1] * COUNT);
      return array[indX][indY];
    },
    bias: 0
  });

  let points = pds.fill();
  points.sort((a, b) => (Math.random() - 0.5));
  points = points.slice(0, TEXTURE_WIDTH);


  points = points.map((point) => {
    let indX = Math.floor(point[0] * COUNT);
    let indY = Math.floor(point[1] * COUNT);
    return [point[0], point[1], array[indX][indY]];
  })
  return points;
}


let gpuCompute: any;
let velocityVariable: any;
let positionVariable: any;
let positionUniforms: any;
let velocityUniforms: any;
function initGPU() {
  gpuCompute = new GPUComputationRenderer(COUNT, COUNT, renderer);

  const dtPosition = gpuCompute.createTexture();
  const dtPosition1 = gpuCompute.createTexture();
  const dtVelocity = gpuCompute.createTexture();
  fillPositionTextureFromPoints(dtPosition, points1);
  fillPositionTextureFromPoints(dtPosition1, points2);
  fillVelocityTexture(dtVelocity);


  const target1 = gpuCompute.createTexture();
  const target2 = gpuCompute.createTexture();
  fillPositionTextureFromPoints(target1, points1);
  fillPositionTextureFromPoints(target2, points2);


  velocityVariable = gpuCompute.addVariable(
    "textureVelocity",
    fragmentShaderVelocity,
    dtVelocity
  );
  positionVariable = gpuCompute.addVariable(
    "texturePosition",
    fragmentShaderPosition,
    dtPosition
  );

  gpuCompute.setVariableDependencies(velocityVariable, [
    positionVariable,
    velocityVariable,
  ]);
  gpuCompute.setVariableDependencies(positionVariable, [
    positionVariable,
    velocityVariable,
  ]);

  positionUniforms = positionVariable.material.uniforms;
  velocityUniforms = velocityVariable.material.uniforms;

  positionUniforms["time"] = { value: 0.0 };
  velocityUniforms["time"] = { value: 1.0 };
  velocityUniforms["uTarget"] = { value: target1 };
  velocityVariable.wrapS = THREE.RepeatWrapping;
  velocityVariable.wrapT = THREE.RepeatWrapping;
  positionVariable.wrapS = THREE.RepeatWrapping;
  positionVariable.wrapT = THREE.RepeatWrapping;

  let modul = 0;
  container.addEventListener("click", () => {
    if (modul == 0) {
      velocityUniforms["uTarget"] = { value: target2 };
      modul = 1;
    } else {
      velocityUniforms["uTarget"] = { value: target1 };
      modul = 0;
    }
  })

  gpuCompute.init();
}

function fillPositionTextureFromPoints(texture: any, points: any) {
  const theArray = texture.image.data;
  for (let k = 0, kl = theArray.length; k < kl; k += 4) {
    let i = k / 4;
    theArray[k + 0] = 2 * (points[i][0] - 0.5);
    theArray[k + 1] = -2 * (points[i][1] - 0.5);
    theArray[k + 2] = 0;
    theArray[k + 3] = points[i][2];
  }
}

function fillVelocityTexture(texture: any) {
  const theArray = texture.image.data;
  for (let k = 0, kl = theArray.length; k < kl; k += 4) {

    theArray[k + 0] = 0.01 * (Math.random() - 0.5);
    theArray[k + 1] = 0.01 * (Math.random() - 0.5);
    theArray[k + 2] = 0;
    theArray[k + 3] = 1;
  }
}

let material: any;
let geometry: any;
let plane: any;
function addObjects() {
  material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0 },
      uPositions: { value: null },
      resolution: { value: new THREE.Vector4() },
    },
    // wireframe: true,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  // geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

  geometry = new THREE.BufferGeometry();
  let count = TEXTURE_WIDTH;
  let positions = new Float32Array(count * 3);
  let reference = new Float32Array(count * 2);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = 5 * (Math.random() - 0.5);
    positions[i * 3 + 1] = 5 * (Math.random() - 0.5);
    positions[i * 3 + 2] = 0;
    reference[i * 2] = (i % COUNT) / COUNT;
    reference[i * 2 + 1] = ~ ~(i / COUNT) / COUNT;
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  geometry.setAttribute(
    "reference",
    new THREE.BufferAttribute(reference, 2)
  );

  // geometry = new THREE.PlaneGeometry(1,1,20,20);

  plane = new THREE.Points(geometry, material);
  scene.add(plane);
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
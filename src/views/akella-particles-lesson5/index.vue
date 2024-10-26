<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';


/**
 * custom shader 
 */

import vertexShader from "./shaders/vertex.glsl";
import vertexShaderInstanced from "./shaders/vertexInstanced.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import simFragmentPosition from "./shaders/simFragment.glsl";
import simFragmentVelocity from "./shaders/simFragmentVelocity.glsl";
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
  ({ container, renderer, scene, camera, clock, viewPort, tick } = useThree(document.querySelector('.webgl')!))
}

/**
 * setup preset
 */
function setupPreset() {
  camera.position.set(0, 0, 3.5)

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


  gogogo()
  /**
   * my code
   */
  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    if (mesh) {
      material.uniforms.time.value = elapsedTime;

      gpuCompute.compute();
      control.update()

      renderer.render(scene, camera);


      material.uniforms.uTexture.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
      material.uniforms.uVelocity.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;
      positionUniforms.uTime.value = elapsedTime;
    }
  });
})

const size = 128;
const number = size * size;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

const loadImage = (path: string) => {
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



let suzanne: any
let sampler: any
let data1: any
let data2: any

function gogogo() {
  Promise.all([
    gltfLoader.loadAsync(new URL('./models/suzanne.glb', import.meta.url).href),
  ]).then(([model]) => {
    suzanne = model.scene.children[0]
    suzanne.geometry.rotateX(-Math.PI / 2)
    suzanne.material = new THREE.MeshNormalMaterial()

    sampler = new MeshSurfaceSampler(suzanne)
      .build();

    // scene.add(suzanne)
    data1 = getPointsOnSphere()
    data2 = getPointsOnSphere()
    getPixelDataFromImage(new URL('/texture/logo.png', import.meta.url).href)
    mouseEvents()
    setupFBO()
    initGPGPU();
    addObjects();
  })
}

function getPointsOnSphere() {
  const data = new Float32Array(4 * number);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;

      // generate point on a sphere
      let theta = Math.random() * Math.PI * 2;
      let phi = Math.acos(Math.random() * 2 - 1); // 
      // let phi = Math.random()*Math.PI; // 
      let x = Math.sin(phi) * Math.cos(theta);
      let y = Math.sin(phi) * Math.sin(theta);
      let z = Math.cos(phi);

      data[4 * index] = x;
      data[4 * index + 1] = y;
      data[4 * index + 2] = z;
      data[4 * index + 3] = (Math.random() - 0.5) * 0.01;
    }
  }


  let dataTexture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  dataTexture.needsUpdate = true;

  return dataTexture
}

async function getPixelDataFromImage(url: string) {
  let img = await loadImage(url);
  let width = 200;
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = width;
  let ctx: any = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, width);
  let canvasData = ctx.getImageData(0, 0, width, width).data;

  let pixels = [];
  for (let i = 0; i < canvasData.length; i += 4) {
    let x = (i / 4) % width;
    let y = Math.floor((i / 4) / width);
    if (canvasData[i] < 5) {
      pixels.push({ x: x / width - 0.5, y: 0.5 - y / width })
    }
  }

  const data = new Float32Array(4 * number);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      let randomPixel = pixels[Math.floor(Math.random() * pixels.length)]
      if (Math.random() > 0.9) {
        randomPixel = { x: 3 * (Math.random() - 0.5), y: 3 * (Math.random() - 0.5) }
      }
      data[4 * index] = randomPixel.x + (Math.random() - 0.5) * 0.01;
      data[4 * index + 1] = randomPixel.y + (Math.random() - 0.5) * 0.01;
      data[4 * index + 2] = (Math.random() - 0.5) * 0.01;
      data[4 * index + 3] = (Math.random() - 0.5) * 0.01;
    }
  }

  let dataTexture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  dataTexture.needsUpdate = true;

  return dataTexture
}

let raycasterMesh: any
let dummy: any
let simMaterial: any
let positionUniforms: any
let velocityUniforms: any
function mouseEvents() {
  raycasterMesh = new THREE.Mesh(
    suzanne.geometry,
    new THREE.MeshBasicMaterial()
  )
  dummy = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 32, 32),
    new THREE.MeshNormalMaterial()
  )
  scene.add(dummy)
  container.addEventListener("mousemove", (e) => {
    console.log("%c Line:264 🍕 e", "color:#f5ce50", e);
    pointer.x = (e.offsetX / viewPort.value.width) * 2 - 1;
    pointer.y = -(e.offsetY / viewPort.value.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects([raycasterMesh]);
    if (intersects.length > 0) {
      // console.log(intersects[0].point)
      dummy.position.copy(intersects[0].point)
      simMaterial.uniforms.uMouse.value = intersects[0].point
      positionUniforms.uMouse.value = intersects[0].point
      velocityUniforms.uMouse.value = intersects[0].point
    }
  });
}

let positions: any
let sceneFBO: any
let cameraFBO: any
let simMesh: any
let renderTarget: any
let renderTarget1: any
function setupFBO() {
  // create data Texture
  const data = new Float32Array(4 * number);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      data[4 * index] = lerp(-0.5, 0.5, j / (size - 1));
      data[4 * index + 1] = lerp(-0.5, 0.5, i / (size - 1));
      data[4 * index + 2] = 0;
      data[4 * index + 3] = 1;
    }
  }

  positions = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  positions.needsUpdate = true;

  // create FBO scene
  sceneFBO = new THREE.Scene();
  cameraFBO = new THREE.OrthographicCamera(-1, 1, 1, -1, -2, 2);
  cameraFBO.position.z = 1;
  cameraFBO.lookAt(new THREE.Vector3(0, 0, 0));

  let geo = new THREE.PlaneGeometry(2, 2, 2, 2);
  simMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
  })
  simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uCurrentPosition: { value: data1 },
      uOriginalPosition: { value: data1 },
      uOriginalPosition1: { value: data2 },
    },
    vertexShader: simVertex,
    fragmentShader: simFragmentPosition,
  })
  simMesh = new THREE.Mesh(geo, simMaterial);
  sceneFBO.add(simMesh);

  renderTarget = new THREE.WebGLRenderTarget(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })

  renderTarget1 = new THREE.WebGLRenderTarget(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })
}


let gpuCompute: any
let pointsOnASphere: any
let positionVariable: any
let velocityVariable: any
function initGPGPU() {
  gpuCompute = new GPUComputationRenderer(size, size, renderer);

  pointsOnASphere = getPointsOnSuzanne()

  positionVariable = gpuCompute.addVariable('uCurrentPosition', simFragmentPosition, pointsOnASphere);
  velocityVariable = gpuCompute.addVariable('uCurrentVelocity', simFragmentVelocity, getVelocitiesOnSphere());

  gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

  gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);

  positionUniforms = positionVariable.material.uniforms;
  velocityUniforms = velocityVariable.material.uniforms;

  positionUniforms.uTime = { value: 0.0 };
  velocityUniforms.uTime = { value: 0.0 };
  positionUniforms.uMouse = { value: new THREE.Vector3(0, 0, 0) };
  velocityUniforms.uMouse = { value: new THREE.Vector3(0, 0, 0) };
  positionUniforms.uOriginalPosition = { value: pointsOnASphere };
  velocityUniforms.uOriginalPosition = { value: pointsOnASphere };

  gpuCompute.init();
}

const _position = new THREE.Vector3();
function getPointsOnSuzanne() {
  const data = new Float32Array(4 * number);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;

      sampler.sample(_position);

      data[4 * index] = _position.x;
      data[4 * index + 1] = _position.y;
      data[4 * index + 2] = _position.z;
      data[4 * index + 3] = (Math.random() - 0.5) * 0.01;
    }
  }


  let dataTexture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  dataTexture.needsUpdate = true;

  return dataTexture
}

function getVelocitiesOnSphere() {
  const data = new Float32Array(4 * number);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;

      // generate point on a sphere
      let theta = Math.random() * Math.PI * 2;
      let phi = Math.acos(Math.random() * 2 - 1); // 
      // let phi = Math.random()*Math.PI; // 
      let x = Math.sin(phi) * Math.cos(theta);
      let y = Math.sin(phi) * Math.sin(theta);
      let z = Math.cos(phi);

      data[4 * index] = 0;
      data[4 * index + 1] = 0;
      data[4 * index + 2] = 0;
      data[4 * index + 3] = 0;
    }
  }

  let dataTexture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  dataTexture.needsUpdate = true;

  return dataTexture
}


let geometry: any
let material: any
let mesh: any
let geometryInstanced: any
function addObjects() {

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(number * 3);
  const uvs = new Float32Array(number * 2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;

      positions[3 * index] = j / size - 0.5;
      positions[3 * index + 1] = i / size - 0.5;
      positions[3 * index + 2] = 0;
      uvs[2 * index] = j / (size - 1);
      uvs[2 * index + 1] = i / (size - 1);
    }
  }
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

  material = new THREE.MeshNormalMaterial();



  material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      // uTexture: { value: new THREE.TextureLoader().load(texture) },
      uTexture: { value: positions },
      uVelocity: { value: null },
      uMatcap: { value: new THREE.TextureLoader().load(new URL('./texture/matcap1.png', import.meta.url).href) },
    },
    vertexShader: vertexShaderInstanced,
    fragmentShader: fragmentShader,
    // depthWrite: false,
    // depthTest: false,
    // transparent: true,
  });

  // mesh = new THREE.Points(geometry, material);
  geometryInstanced = new THREE.BoxGeometry(0.1, 0.01, 0.01);
  mesh = new THREE.InstancedMesh(geometryInstanced, material, number);
  // create instance uv reference
  let uvInstanced = new Float32Array(number * 2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      uvInstanced[2 * index] = j / (size - 1);
      uvInstanced[2 * index + 1] = i / (size - 1);
    }
  }
  geometryInstanced.setAttribute("uvRef", new THREE.InstancedBufferAttribute(uvInstanced, 2));
  scene.add(mesh);
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
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
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

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


let init: boolean = false
let currentParticles = 0;
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

    if (!emitter) return

    control.update()
    if (!init) {
      init = true;
      // // DIRECTIONS
      simMaterial.uniforms.uRenderMode.value = 1;
      simMaterial.uniforms.uTime.value = -100;
      simMaterial.uniforms.uSource.value = new THREE.Vector3(0, -1, 0);
      renderer.setRenderTarget(directions);
      renderer.render(sceneFBO, cameraFBO);
      simMaterial.uniforms.uDirections.value = directions.texture;

      // // POSITIONS
      simMaterial.uniforms.uRenderMode.value = 2;
      simMaterial.uniforms.uSource.value = new THREE.Vector3(0, 0, 0);
      renderer.setRenderTarget(initPos);
      renderer.render(sceneFBO, cameraFBO);
      simMaterial.uniforms.uCurrentPosition.value = initPos.texture;
    }
    material.uniforms.time.value = elapsedTime;


    // SIMULATION
    simMaterial.uniforms.uDirections.value = directions.texture;
    simMaterial.uniforms.uRenderMode.value = 0;
    geo.setDrawRange(0, number);
    renderer.setRenderTarget(renderTarget);
    renderer.render(sceneFBO, cameraFBO);


    let emit = 15;
    renderer.autoClear = false;
    emitters.forEach((emitter) => {
      emitter.mesh.getWorldPosition(v);
      v1 = v.clone();
      let flip = Math.random() > 0.5;

      emitter.dir = v
        .clone()
        .sub(emitter.prev)
        .multiplyScalar(100);
      geo.setDrawRange(currentParticles, emit);

      // DIRECTIONS
      simMaterial.uniforms.uRenderMode.value = 1;
      simMaterial.uniforms.uDirections.value = null;
      simMaterial.uniforms.uCurrentPosition.value = null;
      if (flip) emitter.dir.x *= -1;
      simMaterial.uniforms.uSource.value = emitter.dir;
      renderer.setRenderTarget(directions);
      renderer.render(sceneFBO, cameraFBO);

      // POSITIONS
      simMaterial.uniforms.uRenderMode.value = 2;
      if (flip) v1.x *= -1;
      simMaterial.uniforms.uSource.value = v1;
      renderer.setRenderTarget(renderTarget);
      renderer.render(sceneFBO, cameraFBO);

      currentParticles += emit;
      if (currentParticles > number) {
        currentParticles = 0;
      }

      emitter.prev = v.clone();
    });


    renderer.autoClear = true;

    // END OF EMIITER

    // RENDER SCENE
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    // swap render targets
    const tmp = renderTarget;
    renderTarget = renderTarget1;
    renderTarget1 = tmp;

    material.uniforms.uTexture.value = renderTarget.texture;
    simMaterial.uniforms.uCurrentPosition.value =
      renderTarget1.texture;
    simMaterial.uniforms.uTime.value = elapsedTime;

    debugPlane.material.map = renderTarget.texture;

    if (mixer) mixer.update(0.01);


    // // update control
    // control.update()

    // // renderer render
    // renderer.render(scene, camera)
  });
})

let v = new THREE.Vector3(0, 0, 0)
let v1 = new THREE.Vector3(0, 0, 0)
let size = 512;
let number = size * size;

let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let emitters: any[] = [];

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}
const loadImage = (path: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // to avoid CORS if used with Canvas
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
};


let thismodel: any;
let mixer: any;
let data1: any;
let data2: any;

function gogogo() {
  Promise.all([
    gltfLoader.loadAsync(new URL('./models/bird.glb', import.meta.url).href),
  ]).then(([model]) => {
    thismodel = model.scene;

    scene.add(thismodel);

    thismodel.traverse((item: any) => {
      if (item.isMesh && item.geometry.attributes.position.array.length < 120) {
        emitters.push({
          mesh: item,
          prev: item.position.clone(),
          dir: new THREE.Vector3(0, 0, 0),
        });
        item.visible = false;
        item.material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
        });
      }
    });

    mixer = new THREE.AnimationMixer(thismodel);
    mixer.clipAction(model.animations[0]).play();

    data1 = getPointsOnSphere();
    data2 = getPointsOnSphere();
    getPixelDataFromImage(new URL('/texture/logo.png', import.meta.url).href);
    mouseEvents();
    setupFBO();
    addObjects();
  });
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

  return dataTexture;
}

async function getPixelDataFromImage(url: string) {
  let img = await loadImage(url);
  let width = 200;
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = width;
  let ctx: any = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, width);
  let canvasData = ctx.getImageData(0, 0, width, width).data;

  let pixels = [];
  for (let i = 0; i < canvasData.length; i += 4) {
    let x = (i / 4) % width;
    let y = Math.floor(i / 4 / width);
    if (canvasData[i] < 5) {
      pixels.push({ x: x / width - 0.5, y: 0.5 - y / width });
    }
  }

  const data = new Float32Array(4 * number);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      let randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      if (Math.random() > 0.9) {
        randomPixel = {
          x: 3 * (Math.random() - 0.5),
          y: 3 * (Math.random() - 0.5),
        };
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

  return dataTexture;
}


let planeMesh: any
let dummy: any

let simMaterial: any
function mouseEvents() {
  planeMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 30, 30),
    new THREE.MeshBasicMaterial()
  );
  dummy = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 32, 32),
    new THREE.MeshNormalMaterial()
  );
  scene.add(dummy);
  container.addEventListener("mousemove", (e) => {
    const { viewWidth, viewHeight } = viewPort.value
    pointer.x = (e.offsetX / viewWidth) * 2 - 1;
    pointer.y = -(e.offsetY / viewHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects([planeMesh]);
    if (intersects.length > 0) {
      console.log(intersects[0].point);
      dummy.position.copy(intersects[0].point);
      simMaterial.uniforms.uMouse.value = intersects[0].point;
    }
  });
}


let positions: any
let sceneFBO: any
let cameraFBO: any
let simMesh: any
let directions: any
let renderTarget: any
let initPos: any
let renderTarget1: any
let geo: any

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
  let viewArea = size / 2 + 0.01;
  cameraFBO = new THREE.OrthographicCamera(
    -viewArea,
    viewArea,
    viewArea,
    -viewArea,
    -2,
    2
  );
  cameraFBO.position.z = 1;
  cameraFBO.lookAt(new THREE.Vector3(0, 0, 0));

  geo = new THREE.BufferGeometry();
  let pos = new Float32Array(number * 3);
  let uv = new Float32Array(number * 2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;

      pos[3 * index] = size * lerp(-0.5, 0.5, j / (size - 1));
      pos[3 * index + 1] = size * lerp(-0.5, 0.5, i / (size - 1));
      pos[3 * index + 2] = 0;

      uv[2 * index] = j / (size - 1);
      uv[2 * index + 1] = i / (size - 1);
    }
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

  // geo.setDrawRange(3, 10);

  simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSource: { value: new THREE.Vector3(0, 0, 0) },
      uRenderMode: { value: 0 },
      uCurrentPosition: { value: data1 },
      uDirections: { value: null },
    },
    vertexShader: simVertex,
    fragmentShader: simFragment,
  });
  simMesh = new THREE.Points(geo, simMaterial);
  sceneFBO.add(simMesh);

  renderTarget = new THREE.WebGLRenderTarget(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });
  directions = new THREE.WebGLRenderTarget(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  initPos = new THREE.WebGLRenderTarget(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  renderTarget1 = new THREE.WebGLRenderTarget(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });
}

let geometry: any
let material: any
let mesh: any
let debugPlane: any
let emitter: any
let emitterDir: any
let emitterPrev: any
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
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });

  mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  debugPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(new URL('/textures/logo.png', import.meta.url).href),
    })
  );
  // scene.add(debugPlane);

  emitter = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.1),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
    })
  );
  // scene.add(emitter);

  emitterDir = new THREE.Vector3(0, 0, 0);
  emitterPrev = new THREE.Vector3(0, 0, 0);
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
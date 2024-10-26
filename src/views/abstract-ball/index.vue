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
  renderer.shadowMap.enabled = true;

  camera.fov = 20
  camera.updateProjectionMatrix()
  camera.position.set(0, 10, 120);

  scene.fog = new THREE.Fog(Theme._dark, 150, 320);
  scene.background = new THREE.Color(Theme._dark);
  scene.add(groupAbstract);

  const ambientLights = new THREE.HemisphereLight(Theme._cont, Theme._white, 1);
  const backlight = new THREE.PointLight(Theme._white, 1);
  backlight.position.set(-5, -20, -20);

  const rectAreaLight = new THREE.RectAreaLight(Theme._white, 20, 3, 3);
  rectAreaLight.position.set(0, 0, 2);

  const frontlight = new THREE.PointLight(Theme._white, 2);
  frontlight.position.set(20, 10, 0);

  scene.add(ambientLights, backlight, rectAreaLight, frontlight)
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

let skin: any;
let mat: any;
let geo: any;
const groupAbstract = new THREE.Object3D();
const Theme = {
  _gray: 0x222222,
  _dark: 0x000000,   // Background
  _cont: 0x444444,   // Lines
  _blue: 0x000FFF,
  _red: 0xF00000,    //
  _cyan: 0x00FFFF,   // Material
  _white: 0xF00589   // Lights
}

const uniforms = {
  time: {
    type: "f",
    value: 0.0
  },
  RGBr: {
    type: "f",
    value: 0.0
  },
  RGBg: {
    type: "f",
    value: 0.0
  },
  RGBb: {
    type: "f",
    value: 0.0
  },
  RGBn: {
    type: "f",
    value: 0.0
  },
  RGBm: {
    type: "f",
    value: 0.0
  },
  morph: {
    type: 'f',
    value: 0.0
  },
  dnoise: {
    type: 'f',
    value: 0.0
  },
  psize: {
    type: 'f',
    value: 3.0
  }
}
const options = {
  perlin: {
    time: 5.0,
    morph: 0.0,
    dnoise: 2.5
  },
  chroma: {
    RGBr: 4.5,
    RGBg: 0.0,
    RGBb: 3.0,
    RGBn: 0.3,
    RGBm: 1.0
  },
  camera: {
    zoom: 150,
    speedY: 0.6,
    speedX: 0.0,
    guide: false
  },
  sphere: {
    wireframe: false,
    points: false,
    psize: 3
  }
}

let gridHelper: any;


onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  createGrid()
  createGUI();
  createSkin()


  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    uniforms.time.value = (options.perlin.time / 10000) * elapsedTime;
    uniforms.morph.value = (options.perlin.morph);
    uniforms.dnoise.value = (options.perlin.dnoise);

    gsap.to(camera.position, {
      duration: 2,
      z: 300 - options.camera.zoom
    });

    skin.mesh.rotation.y += options.camera.speedY / 100;
    skin.mesh.rotation.z += options.camera.speedX / 100;

    skin.point.rotation.y = skin.mesh.rotation.y;
    skin.point.rotation.z = skin.mesh.rotation.z;
    gridHelper.rotation.y = skin.mesh.rotation.y;

    mat.uniforms['RGBr'].value = options.chroma.RGBr / 10;
    mat.uniforms['RGBg'].value = options.chroma.RGBg / 10;
    mat.uniforms['RGBb'].value = options.chroma.RGBb / 10;
    mat.uniforms['RGBn'].value = options.chroma.RGBn / 100;
    mat.uniforms['RGBm'].value = options.chroma.RGBm;
    mat.uniforms['psize'].value = options.sphere.psize;

    gridHelper.visible = options.camera.guide;

    skin.mesh.visible = !options.sphere.points;
    skin.point.visible = options.sphere.points;

    mat.wireframe = options.sphere.wireframe;

    camera.lookAt(scene.position);

    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})


function createGrid(_gridY = -20) {
  gridHelper = new THREE.GridHelper(200, 20, Theme._cont, Theme._gray);
  gridHelper.position.y = _gridY;
  scene.add(gridHelper);
}

function createGUI() {
  const camGUI = gui.addFolder('Camera');
  camGUI.add(options.camera, 'zoom', 50, 250).name('Zoom').listen();
  camGUI.add(options.camera, 'speedY', -1, 1).name('Speed Y').listen();
  camGUI.add(options.camera, 'speedX', 0, 1).name('Speed X').listen();
  camGUI.add(options.camera, 'guide', false).name('Guide').listen();


  const timeGUI = gui.addFolder('Setup');
  timeGUI.add(options.perlin, 'time', 0.0, 10.0).name('Speed').listen();
  timeGUI.add(options.perlin, 'morph', 0.0, 20.0).name('Morph').listen();
  timeGUI.add(options.perlin, 'dnoise', 0.0, 100.0).name('DNoise').listen();
  timeGUI.open();

  const rgbGUI = gui.addFolder('RGB');
  rgbGUI.add(options.chroma, 'RGBr', 0.0, 10.0).name('Red').listen();
  rgbGUI.add(options.chroma, 'RGBg', 0.0, 10.0).name('Green').listen();
  rgbGUI.add(options.chroma, 'RGBb', 0.0, 10.0).name('Blue').listen();
  rgbGUI.add(options.chroma, 'RGBn', 0.0, 3.0).name('Black').listen();
  rgbGUI.add(options.chroma, 'RGBm', 0.0, 1.0).name('Chroma').listen();
  rgbGUI.open();

  const wirGUI = gui.addFolder('Sphere');
  wirGUI.add(options.sphere, 'wireframe', true).name('Wireframe').listen();
  wirGUI.add(options.sphere, 'points', true).name('Points').listen();
  wirGUI.add(options.sphere, 'psize', 1.0, 10.0).name('Point Size').step(1);

  console.log('Create GUI');
}


function createSkin(geo_frag = 5) {
  const geo_size = 20;
  if (geo_frag >= 5) geo_frag = 5;
  geo = new THREE.IcosahedronGeometry(geo_size, geo_frag);
  mat = new THREE.ShaderMaterial({
    uniforms: uniforms,

    side: THREE.DoubleSide,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: options.sphere.wireframe
  });

  const point = new THREE.Points(geo, mat);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.morphTargetsNeedUpdate = true;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  groupAbstract.add(point, mesh);

  skin = {
    point,
    mesh
  }

  skin.mesh.scale.set(1, 1, 1);

  scene.add(skin.mesh);
}


</script>

<template>
  <DemoContainer>
    <div class="webgl">
      <div class="text">Abstract Ball</div>
    </div>
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


  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 56px;
    font-weight: bold;
    color: #fff;
    mix-blend-mode: difference;
  }
}

.debug {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
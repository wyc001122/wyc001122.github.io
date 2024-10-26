<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";


/**
 * custom shader 
 */
// import vertexShader from "./shaders/vertexShader.glsl";
// import fragmentShader from "./shaders/fragmentShader.glsl";

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
  camera.position.set(0, 0, 10)
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //
  renderer.toneMappingExposure = 1.; // 曝光
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
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
    if (bloomComposer) {
      bloomComposer.setSize(width, height);
    }
    if (finalComposer) {
      finalComposer.setSize(width, height);
    }
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

const BLOOM_SCENE = 1;

onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  loadModels()
  addCube()
  setLayers()
  initPostProcessing()
  scene.traverse(darkenNonBloomed);

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()
    if (animationMixer) {
      animationMixer.setTime(elapsedTime);
    }
    group.rotation.y = elapsedTime * 1.5;
    // update control
    control.update()

    scene.traverse(darkenNonBloomed);

    bloomComposer.render();

    scene.traverse(restoreMaterial);

    finalComposer.render();

  });
})


let animationMixer: any;
let sword: any;
function loadModels() {
  gltfLoader.loadAsync(new URL('./models/fantasy_sword.glb', import.meta.url).href).then((model) => {
    animationMixer = new THREE.AnimationMixer(model.scene);
    const animationAction = animationMixer.clipAction(model.animations[0]);
    animationAction.play();
    sword = model.scene;
    scene.add(sword);

    sword.traverse((item: any) => {
      if (item.isMesh) {
        if (item.name !== "背景") {
          item.layers.toggle(BLOOM_SCENE);
        }
      }
    });
  })
}

let group: any;
let sphere: any, spher2: any;
function addCube() {
  group = new THREE.Group();
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);

  const material1 = new THREE.MeshBasicMaterial({ color: 0x828fff });
  sphere = new THREE.Mesh(geometry, material1);
  sphere.position.x = -3;
  group.add(sphere);

  // 球体2
  const material2 = material1.clone();
  material2.color.set(0xffa500);
  spher2 = new THREE.Mesh(geometry, material2);
  group.add(spher2);
  spher2.position.x = 3;

  scene.add(group);
}

let bloomLayer: any
function setLayers() {
  const BLOOM_SCENE = 1;

  bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_SCENE);

  sphere.layers.toggle(BLOOM_SCENE);
  spher2.layers.toggle(BLOOM_SCENE);
}

let materialsMap: any = {};
const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
function darkenNonBloomed(obj: any) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materialsMap[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj: any) {
  if (materialsMap[obj.uuid]) {
    obj.material = materialsMap[obj.uuid];
    delete materialsMap[obj.uuid];
  }
}

let renderPass: any, finalComposer: any;
function initPostProcessing() {
  renderPass = new RenderPass(scene, camera);
  const outputPass = new OutputPass();

  createBloomComposer()

  const mixPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
      fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform sampler2D bloomTexture;
          varying vec2 vUv;
          void main() {
            gl_FragColor = ( texture2D( tDiffuse, vUv ) + vec4( 1. ) * texture2D( bloomTexture, vUv ) );
          }
        `,
    })
  );

  finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderPass);
  finalComposer.addPass(mixPass);
  finalComposer.addPass(outputPass);
}

let bloomComposer: any;
function createBloomComposer() {
  bloomComposer = new EffectComposer(renderer);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(viewPort.value.width, viewPort.value.height),
    1.5,
    0.4,
    0.85
  );
  bloomPass.strength = 0.55;
  bloomPass.threshold = 0.1;
  bloomPass.radius = 0.1;

  bloomComposer.addPass(renderPass);
  bloomComposer.addPass(bloomPass);
  bloomComposer.renderToScreen = false;

  gui.add(bloomPass, 'strength').min(0).max(2).step(0.01).name('强度');
  gui.add(bloomPass, 'threshold').min(0).max(2).step(0.01).name('阈值');
  gui.add(bloomPass, 'radius').min(0).max(2).step(0.01).name('半径');
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
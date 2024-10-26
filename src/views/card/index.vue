<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/Addons.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";


const cardtemplate = new URL("./texture/cardtemplate.png", import.meta.url).href
const cardtemplateback = new URL("./texture/cardtemplateback.png", import.meta.url).href
const flower = new URL("./texture/flower.png", import.meta.url).href
const noise2 = new URL("./texture/noise2.png", import.meta.url).href
const color11 = new URL("./texture/color11.png", import.meta.url).href
const backtexture = new URL("./texture/backtexture.png", import.meta.url).href
const skullmodel = new URL("./model/model.obj", import.meta.url).href
const voronoi = new URL("./texture/voronoi.png", import.meta.url).href
/**
 * custom shader 
 */
import vertext from "./shaders/vertext.glsl";
import fragPlane from "./shaders/fragPlane.glsl";
import fragPlaneback from "./shaders/fragPlaneback.glsl";
import vertskull from "./shaders/vertskull.glsl";
import fragskull from "./shaders/fragskull.glsl";

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
  camera.fov = 30;
  camera.near = 1;
  camera.far = 10000;
  camera.updateProjectionMatrix()
  camera.position.set(0, 0, 70)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

/**
 * init control
 */
function initControl() {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.enableZoom = false;
}

/**
 * auto resize
 */
function autoResize() {
  watch(viewPort, () => {
    const { width, height, } = viewPort.value
    camera.aspect = width / height
    cameraRTT.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
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

const options = {
  exposure: 2.8,
  bloomStrength: 0.8,
  bloomThreshold: 0,
  bloomRadius: 1.29,
  color0: [197, 81, 245],
  color1: [65, 0, 170],
  color2: [0, 150, 255],
  isanimate: false,
};


const matrix = new THREE.Matrix4();
const period = 5;
onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  initComposer()
  addPlane()
  addPlaneback()
  loadskull()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()
    // update control
    control.update()
    updateDraw(elapsedTime)
    composer.render();

    // renderer render
    renderer.render(scene, camera)
  });
})

let sceneRTT: any;
let cameraRTT: any;
let composer: any;
let bloomPass: any;
function initComposer() {
  sceneRTT = new THREE.Scene();
  cameraRTT = new THREE.PerspectiveCamera(
    30,
    viewPort.value.viewWidth / viewPort.value.viewHeight,
    1,
    10000
  );
  cameraRTT.position.z = 60;
  cameraRTT.position.y = -3.5;

  const renderScene = new RenderPass(sceneRTT, cameraRTT);
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(viewPort.value.viewWidth, viewPort.value.viewHeight),
    0.07,
    0.04,
    0.085
  );
  console.log("%c Line:420 🍬 bloomPass", "color:#93c0a4", bloomPass);
  // bloomPass.threshold = options.bloomThreshold;
  // bloomPass.strength = options.bloomStrength;
  // bloomPass.radius = options.bloomRadius;

  composer = new EffectComposer(renderer);
  composer.setSize(viewPort.value.viewWidth, viewPort.value.viewHeight);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.renderToScreen = false;
}


let frontcard: any;
let frontmaterial: any;
function addPlane() {
  const geometry = new THREE.PlaneGeometry(20, 30);
  frontmaterial = new THREE.ShaderMaterial({
    uniforms: {
      cardtemplate: {
        value: textureLoader.load(cardtemplate),
      },
      backtexture: {
        value: textureLoader.load(backtexture),
      },
      noise: {
        value: textureLoader.load(noise2),
      },
      skullrender: {
        value: composer.readBuffer.texture,
      },
      uResolution: {
        value: new THREE.Vector2(viewPort.value.viewWidth, viewPort.value.viewHeight),
      },
      noiseTex: {
        value: textureLoader.load(voronoi),
      },
      color: {
        value: textureLoader.load(color11),
      },
    },
    fragmentShader: fragPlane,
    vertexShader: vertext,
    transparent: true,
    depthWrite: false,
  });
  frontcard = new THREE.Mesh(geometry, frontmaterial);
  scene.add(frontcard);
}


let backcard: any;
let backmaterial: any;
function addPlaneback() {
  const geometry = new THREE.PlaneGeometry(20, 30);
  backmaterial = new THREE.ShaderMaterial({
    uniforms: {
      cardtemplate: {
        value: textureLoader.load(cardtemplateback),
      },
      backtexture: {
        value: textureLoader.load(backtexture),
      },
      noise: {
        value: textureLoader.load(noise2),
      },
      skullrender: {
        value: textureLoader.load(flower),
      },
      uResolution: {
        value: new THREE.Vector2(viewPort.value.viewWidth, viewPort.value.viewHeight),
      },
      noiseTex: {
        value: textureLoader.load(voronoi),
      },
      color: {
        value: textureLoader.load(color11),
      },
    },
    fragmentShader: fragPlaneback,
    vertexShader: vertext,
    transparent: true,
    depthWrite: false,
  });
  backcard = new THREE.Mesh(geometry, backmaterial);
  backcard.rotation.set(0, Math.PI, 0);
  scene.add(backcard);
}

let skullmaterial: any;
let modelgroup: any = new THREE.Group();
let eye: any;
let eye2: any;
function loadskull() {
  skullmaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0, },
      color1: {
        value: new THREE.Vector3(...options.color1),
      },
      color0: {
        value: new THREE.Vector3(...options.color0),
      },
      uResolution: {
        value: new THREE.Vector2(viewPort.value.viewWidth, viewPort.value.viewHeight),
      },
    },
    fragmentShader: fragskull,
    vertexShader: vertskull,
    // depthWrite: false,
  });

  const spheregeo = new THREE.SphereGeometry(1.5, 32, 32);
  const basicmat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(...options.color2),
  });
  eye = new THREE.Mesh(spheregeo, basicmat);
  eye2 = new THREE.Mesh(spheregeo, basicmat);
  eye.position.set(-2.2, -2.2, -6.6);
  eye2.position.set(2.2, -2.2, -6.6);
  modelgroup = new THREE.Object3D();
  modelgroup.add(eye);
  modelgroup.add(eye2);

  const objloader = new OBJLoader();
  objloader.load(skullmodel, (mesh2) => {

    mesh2.position.set(0, 0, -10);
    mesh2.rotation.set(Math.PI, 0, Math.PI);

    mesh2.children.forEach((val, key) => {
      val.traverse((child: any) => {
        child.geometry = mergeVertices(child.geometry)
        child.geometry.computeTangents()
        child.geometry.computeVertexNormals();
        child.material.flatShading = true;
        child.material = skullmaterial;
      })
    })
    mesh2.scale.set(10, 10, 10);
    modelgroup.add(mesh2);
    modelgroup.position.set(0, 1, 0);
    sceneRTT.add(modelgroup);
  })
}


function updateDraw(delta: any) {
  modelgroup.rotation.set(-camera.rotation.x, -camera.rotation.y, 0);

  if (skullmaterial) {
    skullmaterial.uniforms.time.value = delta / 10;
    eye2.material.color.setRGB(...options.color2);
    eye.material.color.setRGB(...options.color2);
  }
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
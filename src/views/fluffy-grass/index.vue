<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { GrassMaterial } from "./GrassMaterial";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";


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
// 标记

  ({ container,renderer, scene, camera, clock, viewPort, tick } = useThree(document.querySelector('.webgl')!))
  // renderer = new THREE.WebGLRenderer({
  //   antialias: true,
  //   alpha: true,
  //   precision: "highp", // Use high precision
  // });
}

/**
 * setup preset
 */
const sceneProps = {
  fogColor: "#eeeeee",
  terrainColor: "#5e875e",
  fogDensity: 0.02,
};
function setupPreset() {
  camera.position.set(-17, 12, -10)

  scene.background = new THREE.Color(sceneProps.fogColor);
  scene.fog = new THREE.FogExp2(
    sceneProps.fogColor,
    sceneProps.fogDensity
  );

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  scene.frustumCulled = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.castShadow = true;
  directionalLight.position.set(100, 100, 100);
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  directionalLight.shadow.mapSize.set(2048, 2048);

  scene.add(directionalLight);
}

/**
 * init control
 */
function initControl() {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.autoRotate = true;
  control.autoRotateSpeed = -0.5;
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
const Uniforms = {
  uTime: { value: 0 },
  color: { value: new THREE.Color("#0000ff") },
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
  gogogo()
  setupGUI()
  setupTextures()
  loadModels()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    control.update()

    Uniforms.uTime.value = elapsedTime;
    grassMaterial.update(Uniforms.uTime.value);
    // postProcessingManager.update();

    // update control 

    // renderer render
    renderer.render(scene, camera)
  });
})


let grassMaterial: any;
let terrainMat: any;
function gogogo() {
  grassMaterial = new GrassMaterial();
  terrainMat = new THREE.MeshPhongMaterial({
    color: sceneProps.terrainColor,
  });
}

let sceneGUI: any;
function setupGUI() {
  gui.close();
  const guiContainer = gui.domElement.parentElement as HTMLDivElement;
  guiContainer.style.zIndex = "9999";
  guiContainer.style.position = "fixed";
  guiContainer.style.top = "0";
  guiContainer.style.left = "0";
  guiContainer.style.right = "auto";
  guiContainer.style.display = "block";

  sceneGUI = gui.addFolder("Scene Properties");
  sceneGUI.add(control, "autoRotate").name("Auto Rotate");
  sceneGUI
    .add(sceneProps, "fogDensity", 0, 0.05, 0.000001)
    .onChange((value: any) => {
      (scene.fog as THREE.FogExp2).density = value;
    });
  sceneGUI.addColor(sceneProps, "fogColor").onChange((value: any) => {
    scene.fog?.color.set(value);
    scene.background = new THREE.Color(value);
  });

  grassMaterial.setupGUI(sceneGUI);

  sceneGUI.open();
}

let textures: any = {}
function setupTextures() {
  textures.perlinNoise = textureLoader.load(new URL("/texture/noise/perlinnoise.webp", import.meta.url).href);

  textures.perlinNoise.wrapS = textures.perlinNoise.wrapT =
    THREE.RepeatWrapping;

  textures.grassAlpha = textureLoader.load(new URL("./texture/grass.jpeg", import.meta.url).href);

  grassMaterial.setupTextures(
    textures.grassAlpha,
    textures.perlinNoise
  );
}


let grassGeometry: any;
function loadModels() {
  sceneGUI
    .addColor(sceneProps, "terrainColor")
    .onChange((value: any) => {
      terrainMat.color.set(value);
    });
  gltfLoader.load(new URL("./models/island.glb", import.meta.url).href, (gltf) => {
    let terrainMesh: THREE.Mesh;
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = terrainMat;
        child.receiveShadow = true;
        child.geometry.scale(3, 3, 3);
        terrainMesh = child;
      }
    });
    scene.add(gltf.scene);

    // load grass model
    gltfLoader.load(new URL("./models/grassLODs.glb", import.meta.url).href, (gltf) => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name.includes("LOD00")) {
            child.geometry.scale(5, 5, 5);
            grassGeometry = child.geometry;
          }
        }
      });

      addGrass(terrainMesh, grassGeometry);
    });
  });

  const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
  gltfLoader.load(new URL("./models/fluffy_grass_text.glb", import.meta.url).href, (gltf) => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.geometry.scale(3, 3, 3);
        child.position.y += 0.5;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);
  });
}


let surfaceMesh: any;
const grassCount = 8000;
function addGrass(
  surfaceMesh: THREE.Mesh,
  grassGeometry: THREE.BufferGeometry
) {
  // Create a sampler for a Mesh surface.
  const sampler = new MeshSurfaceSampler(surfaceMesh)
    .setWeightAttribute("color")
    .build();

  // Create a material for grass
  const grassInstancedMesh = new THREE.InstancedMesh(
    grassGeometry,
    grassMaterial.material,
    grassCount
  );
  grassInstancedMesh.receiveShadow = true;

  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);

  const normal = new THREE.Vector3();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const matrix = new THREE.Matrix4();

  // Sample randomly from the surface, creating an instance of the sample
  // geometry at each sample point.
  for (let i = 0; i < grassCount; i++) {
    sampler.sample(position, normal);

    // Align the instance with the surface normal
    quaternion.setFromUnitVectors(yAxis, normal);
    // Create a random rotation around the y-axis
    const randomRotation = new THREE.Euler(0, Math.random() * Math.PI * 2, 0);
    const randomQuaternion = new THREE.Quaternion().setFromEuler(
      randomRotation
    );

    // Combine the alignment with the random rotation
    quaternion.multiply(randomQuaternion);

    // Set the new scale in the matrix
    matrix.compose(position, quaternion, scale);

    grassInstancedMesh.setMatrixAt(i, matrix);
  }

  scene.add(grassInstancedMesh);
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
<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";

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

  ({ container, renderer, scene, camera, clock, viewPort, tick } = useThree(document.querySelector('.webgl')!))
}

/**
 * setup preset
 */
function setupPreset() {
  camera.position.set(8, 8, 8)
  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1.5);
  scene.add(ambientLight);

  // Spotlight
  const spotLight = new THREE.SpotLight(0xffffff, 2);
  spotLight.position.set(-10, 20, 20);
  spotLight.angle = 0.15;
  spotLight.penumbra = 1;
  spotLight.decay = 0;
  spotLight.castShadow = true;
  scene.add(spotLight);
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
  addTest()
  initEvent()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // update control
    control.update()
    cubes.forEach((cube: any) => {
      oPos.copy(cube.userData.originalPosition);
      dir.copy(oPos).sub(cursor).normalize();
      const dist = oPos.distanceTo(cursor);
      const distInv = displacement - dist;
      const col = Math.max(0.5, distInv) / 1.5;
      if (dist > displacement * 1.1) {
        cube.material.color.lerp(new THREE.Color("white"), 0.1);
      } else {
        cube.material.color.lerp(new THREE.Color(col / 2, col * 2, col * 4), 0.2);
      }
      if (dist > displacement) {
        cube.position.lerp(oPos, 0.2);
      } else {
        vec.copy(oPos).add(dir.multiplyScalar(distInv * intensity));
        cube.position.lerp(vec, 0.2);
      }
    });

    // renderer render
    renderer.render(scene, camera)
  });
})

let cubes: any = [];
const gap = 0.1;
const stride = 5;
const displacement = 3;
const intensity = 1;
const cursor = new THREE.Vector3();
const oPos = new THREE.Vector3();
const vec = new THREE.Vector3();
const dir = new THREE.Vector3();
function addTest() {
  const geometry = new RoundedBoxGeometry(1, 1, 1, 2, 0.15);
  const material = new THREE.MeshLambertMaterial();
  const center = stride / 2;
  for (let x = 0; x < stride; x++) {
    for (let y = 0; y < stride; y++) {
      for (let z = 0; z < stride; z++) {
        const cube = new THREE.Mesh(geometry, material.clone());
        const position = new THREE.Vector3(
          x + x * gap - center,
          y + y * gap - center,
          z + z * gap - center
        );
        cube.position.copy(position);
        cube.userData.originalPosition = position.clone();
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
        cubes.push(cube);
      }
    }
  }
}

function initEvent() {
  container.addEventListener('mousemove', (e) => {
    const mouse = new THREE.Vector2();
    mouse.x = (e.offsetX / viewPort.value.width) * 2 - 1;
    // Change this line
    mouse.y = -(e.offsetY / viewPort.value.height) * 2 + 1;

    cursor.set(mouse.x, mouse.y, 0.5).unproject(camera);
    dir.copy(cursor).sub(camera.position).normalize();
    cursor.add(dir.multiplyScalar(camera.position.length()));
  })
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
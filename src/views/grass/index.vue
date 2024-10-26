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
  camera.position.set(5, 10, 5)
  scene.background = new THREE.Color('#ffffff');
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

const BLADE_WIDTH = 0.1
const BLADE_HEIGHT = 0.8
const BLADE_HEIGHT_VARIATION = 0.6
const BLADE_VERTEX_COUNT = 5
const BLADE_TIP_OFFSET = 0.1

const cloudTexture = textureLoader.load(`https://z2586300277.github.io/3d-file-server/` + 'threeExamples/shader/cloud.jpg')
cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping

function interpolate(val: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
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

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()

    grass.material.uniforms.uTime.value = elapsedTime
    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})


function computeBlade(center: number[], index = 0) {
  const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION
  const vIndex = index * BLADE_VERTEX_COUNT

  // Randomize blade orientation and tip angle
  const yaw = Math.random() * Math.PI * 2
  const yawVec = [Math.sin(yaw), 0, -Math.cos(yaw)]
  const bend = Math.random() * Math.PI * 2
  const bendVec = [Math.sin(bend), 0, -Math.cos(bend)]

  // Calc bottom, middle, and tip vertices
  const bl = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * 1 + center[i])
  const br = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * -1 + center[i])
  const tl = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * 1 + center[i])
  const tr = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * -1 + center[i])
  const tc = bendVec.map((n, i) => n * BLADE_TIP_OFFSET + center[i])

  // Attenuate height
  tl[1] += height / 2
  tr[1] += height / 2
  tc[1] += height

  return {
    positions: [...bl, ...br, ...tr, ...tl, ...tc],
    indices: [
      vIndex,
      vIndex + 1,
      vIndex + 2,
      vIndex + 2,
      vIndex + 4,
      vIndex + 3,
      vIndex + 3,
      vIndex,
      vIndex + 2
    ]
  }
}

function createGrassGeometry(size: number, count: number) {
  const geometry = new THREE.BufferGeometry()

  const positions = []
  const uvs = []
  const indices = []

  for (let i = 0; i < count; i++) {
    const surfaceMin = (size / 2) * -1
    const surfaceMax = size / 2
    const radius = (size / 2) * Math.random()
    const theta = Math.random() * 2 * Math.PI

    const x = radius * Math.cos(theta)
    const y = radius * Math.sin(theta)

    uvs.push(
      ...Array.from({ length: BLADE_VERTEX_COUNT }).flatMap(() => [
        interpolate(x, surfaceMin, surfaceMax, 0, 1),
        interpolate(y, surfaceMin, surfaceMax, 0, 1)
      ])
    )

    const blade = computeBlade([x, 0, y], i)
    positions.push(...blade.positions)
    indices.push(...blade.indices)
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  )
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

function createGrassMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCloud: { value: cloudTexture },
      offsetX: { value: 0.5 },
      offsetY: { value: 0.3 },
      uTime: { value: 0 },
    },
    side: THREE.DoubleSide,
    vertexShader: `
      uniform float uTime;
      uniform float offsetX;
      uniform float offsetY;
    
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
    
      float wave(float waveSize, float tipDistance, float centerDistance) {
        bool isTip = (gl_VertexID + 1) % 5 == 0;
        float waveDistance = isTip ? tipDistance : centerDistance;
        return sin((uTime / 2.0) + waveSize) * waveDistance;
      }
    
      void main() {
        vPosition = position;
        vUv = uv;
        
        vUv.x += uTime * 0.0001 * offsetX;
        vUv.y += uTime * 0.0001 * offsetY;
    
        vNormal = normalize(normalMatrix * normal);
        if (vPosition.y < 0.0) {
          vPosition.y = 0.0;
        } else {
          vPosition.x += wave(uv.x * 10.0, 0.3, 0.1);      
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
 
      }
    `,
    fragmentShader: `
      uniform sampler2D uCloud;
      uniform float uTime;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
    
      vec3 green = vec3(0.2, 0.6, 0.3);
    
      void main() {
        vec3 color = mix(green * 0.7, green, vPosition.y);
        color = mix(color, texture2D(uCloud, vUv).rgb, 0.4);
        float lighting = normalize(dot(vNormal, vec3(10)));
        gl_FragColor = vec4(color + lighting * 0.03, 1.0);
      }
    `,
  })
}


function createGrass(size: number, count: number) {
  const geometry = createGrassGeometry(size, count)
  const material = createGrassMaterial()
  const grass = new THREE.Mesh(geometry, material)

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(size / 2, 8).rotateX(Math.PI / 2),
    material
  )
  floor.position.y = -Number.EPSILON
  grass.add(floor)

  return grass
}
// 在您的主代码中使用：
let grass: ReturnType<typeof createGrass>;

function addTest() {
  grass = createGrass(50, 100000);
  scene.add(grass);
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
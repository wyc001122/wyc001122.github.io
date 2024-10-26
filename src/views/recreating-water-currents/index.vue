<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const { sin, cos } = Math;


/**
 * custom shader 
 */
import particlesVertex from "./shaders/particles/vertexShader.glsl";
import particlesFragment from "./shaders/particles/fragmentShader.glsl";

import tubeVertex from "./shaders/tube/vertexShader.glsl";
import tubeFragment from "./shaders/tube/fragmentShader.glsl";
/**
 * Loaders
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/') // 设置Draco解码器路径
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader) // 设置GLTF加载器使用Draco解码器
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
  camera.position.set(0, 0, 6)
  renderer.setClearColor(0x05233c, 1);
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

let tube: any;
let tubeGeo: any;
let tubeMat: any;
let cau: any;
let quad: any;

let material: any;

onMounted(() => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  addObjects()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.time.value = elapsedTime
    tubeMat.uniforms.time.value = elapsedTime;
    cau.uniforms.time.value = elapsedTime;
    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})



function addObjects() {
  material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uNormals: { value: textureLoader.load(new URL("./texture/sphere-normal.jpeg", import.meta.url).href) },
    },
    // wireframe: true,
    transparent: true,
    depthTest: false,
    vertexShader: particlesVertex,
    fragmentShader: particlesFragment
  });

  let number = 20000;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(number * 3);
  const randoms = new Float32Array(number * 3);
  const sizes = new Float32Array(number * 1);

  for (let i = 0; i < number * 3; i += 3) {
    positions[i + 0] = (Math.random() - 0.5);
    positions[i + 1] = (Math.random() - 0.5);
    positions[i + 2] = (Math.random() - 0.5);

    randoms[i + 0] = Math.random();
    randoms[i + 1] = Math.random();
    randoms[i + 2] = Math.random();

    sizes[i + 0] = 0.5 + 0.5 * Math.random();

  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));




  const plane = new THREE.Points(geometry, material);
  scene.add(plane);

  let points = []

  for (let i = 0; i <= 100; i++) {
    let angle = 2 * Math.PI * i / 100;
    let x = sin(angle) + 2. * sin(2. * angle);
    let y = cos(angle) - 2. * cos(2. * angle);
    let z = -sin(3. * angle);
    points.push(new THREE.Vector3(x, y, z))
  }
  let curve = new THREE.CatmullRomCurve3(points);
  tubeGeo = new THREE.TubeGeometry(curve, 100, 0.4, 100, true);

  let dotsTexture = textureLoader.load(new URL("./texture/dots.png", import.meta.url).href);
  let stripeTexture = textureLoader.load(new URL("./texture/stripes.png", import.meta.url).href);

  dotsTexture.wrapS = THREE.RepeatWrapping;
  dotsTexture.wrapT = THREE.RepeatWrapping;
  stripeTexture.wrapS = THREE.RepeatWrapping;
  stripeTexture.wrapT = THREE.RepeatWrapping;


  tubeMat = new THREE.ShaderMaterial({
    side: THREE.FrontSide,
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uDots: { value: dotsTexture },
      uStripes: { value: stripeTexture },
    },
    // wireframe: true,
    // blending: THREE.No,
    transparent: true,
    depthTest: false,
    vertexShader: tubeVertex,
    fragmentShader: tubeFragment
  });

  tube = new THREE.Mesh(tubeGeo, tubeMat);
  scene.add(tube);

  let noiseTexture = textureLoader.load(new URL("./texture/noise.png", import.meta.url).href);
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;
  let geo = new THREE.PlaneGeometry(10, 10)
  cau = new THREE.ShaderMaterial({
    side: THREE.FrontSide,
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: noiseTexture },
    },
    // wireframe: true,
    transparent: true,
    vertexShader: `
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vWorldPosition = (modelMatrix * vec4( position, 1.0 )).xyz;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
      }
        `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      uniform sampler2D uTexture;
      uniform float time;
      void main() {
        vec2 newUV = vUv;
        vec4 tt = texture2D(uTexture, vUv);

        vec2 godray = vWorldPosition.xy - vec2(0.,6.);
        float uvDirection = atan(godray.y,godray.x);

        float c = texture2D(uTexture, vec2(uvDirection, 0.) + 0.02*time).x;
        float c1 = texture2D(uTexture, vec2(0.1, uvDirection) + 0.02*time*1.5).x;

        float alpha = min(c,c1);
        gl_FragColor = vec4(vUv,0.,1.);
        float fade = smoothstep(0.15,0.86,abs(vUv.y));
        gl_FragColor = vec4(vWorldPosition,1.);
        gl_FragColor = vec4(tt.rgb,1.);
        gl_FragColor = vec4(vec3(alpha),alpha*0.3*fade);
      }
        `
  });

  quad = new THREE.Mesh(geo, cau);
  scene.add(quad);
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
<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'


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
const u_noiseTexture = textureLoader.load("/texture/noise/noise8.jpg",);
u_noiseTexture.wrapS = THREE.RepeatWrapping;
u_noiseTexture.wrapT = THREE.RepeatWrapping;
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

  camera.position.set(0, 0, 1.2);
  // 为了让精度更加准确
  camera.near = 0.1;
  camera.far = 100;
  camera.updateProjectionMatrix();
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xeeeeee, 5);
  scene.add(ambientLight);
  // 点光源
  const pointLight = new THREE.PointLight(0x00a5ff, 1000, 0);
  pointLight.position.set(0, 0, 20);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0x00a5ff, 1000, 0);
  pointLight2.position.z = 5;
  pointLight2.position.y = 10;
  scene.add(pointLight2);

  scene.background = new THREE.Color(0xeeeeee)
}

/**
 * init control
 */
function initControl() {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.maxPolarAngle = Math.PI / 2;
  control.minAzimuthAngle = -Math.PI / 6;
  control.maxAzimuthAngle = Math.PI / 6;
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

    if (depthRender && depthRender) {
      depthRender.setSize(width, height);
      depthRender.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height)
      material2.uniforms.uResolution.value.set(width, height)
    }
  })
}

/**
 * debug
 */
let gui: any;
const debug: any = {
  uRimColor: '#00a5ff',
  uSpeedX: 0.2,
  uSpeedY: 0.4,
}
//  
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)


}

const depthMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec2 vHighPrecisionZW;
  void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vHighPrecisionZW = gl_Position.zw;
  }
  `,
  fragmentShader: `
  #include <packing>
  varying vec2 vHighPrecisionZW;
  vec4 depth_32bits(float depth){
    vec4 col = packDepthToRGBA(depth);
    return col;
  } 
  vec4 depth_8bits(float depth){
    vec4 col = vec4(depth, depth, depth, 1.0);
    return col;
  } 
  void main() {
    float depth = vHighPrecisionZW[0] * 0.5 / vHighPrecisionZW[1] + 0.5;
    gl_FragColor = depth_32bits(depth);
  }
  `,
})
onMounted(async () => {
  initCore()
  initDebug()
  initControl();
  autoResize()
  setupPreset()

  /**
   * my code
   */
  await initModel()
  addSphere()
  setupFBO()
  addTest()

  tick(() => {
    // get elapsedTime
    const elapsedTime = clock.getElapsedTime()
    // update control
    control.update()

    material.uniforms.uTime.value = elapsedTime;
    material2.uniforms.uTime.value = elapsedTime;
    futou_parent.rotation.y = elapsedTime;

    // 渲染场景深度
    sphere.visible = false;
    sphere2.visible = false;
    scene.overrideMaterial = depthMaterial
    renderer.setRenderTarget(depthRender)
    renderer.render(scene, camera)
    material.uniforms.uSceneDepthTexture.value = depthRender.texture
    material2.uniforms.uSceneDepthTexture.value = depthRender.texture

    // 渲染场景图
    scene.overrideMaterial = null;
    sphere2.visible = true;
    renderer.setRenderTarget(sceneDepthRender)
    renderer.render(scene, camera)
    material.uniforms.uSceneTexture.value = sceneDepthRender.texture

    sphere.visible = true;
    scene.overrideMaterial = null;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  });
})


let futou: any;
let futou_parent: any;
let room: any;
function initModel() {
  return new Promise((resolve, reject) => {
    Promise.all([
      gltfLoader.loadAsync(new URL('./models/futou.gltf', import.meta.url).href),
      gltfLoader.loadAsync(new URL('./models/futou_room2.glb', import.meta.url).href),
    ]).then(([gltf1, gltf2]) => {
      futou_parent = new THREE.Group();

      futou = gltf1.scene
      futou.rotation.z = -Math.PI / 4;
      futou_parent.scale.multiplyScalar(0.03);
      futou_parent.position.set(0, -0.2, -0.7)
      futou_parent.add(futou);
      room = gltf2.scene

      scene.add(room, futou_parent);
      resolve([gltf1, gltf2])
    })
  })
}

let sphere: any;
let sphere2: any;
let material: any
let material2: any
function addSphere() {
  const uniforms = {
    uNear: { value: camera.near }, // 相机位置
    uFar: { value: camera.far }, // 相机位置
    uResolution: { value: new THREE.Vector2(viewPort.value.width, viewPort.value.width) }, // 这就是FBO的分辨率
    uSceneTexture: { value: null }, // 场景图
    uSceneDepthTexture: { value: null }, // 场景深度图
    uNoiseTexture: { value: u_noiseTexture }, // 噪声图
    uTime: { value: 0 }, // 时间

    uRimColor: { value: new THREE.Color(debug.uRimColor) }, // 边缘光颜色
    uRimPow: { value: 6 }, // 边缘光范围指数
    uRimIntensity: { value: 10 }, // 边缘光强弱
    uIntersectPow: { value: 5 }, // 相交光强弱
    uSpeed: { value: new THREE.Vector2(debug.uSpeedX, debug.uSpeedY) }, // 扭曲速度
    uDistortIntensity: { value: 0.3 }, // 扭曲强度
  }
  gui.addColor(debug, 'uRimColor').name("能量罩颜色").onChange(() => {
    material.uniforms.uRimColor.value.set(debug.uRimColor)
  })

  gui.add(uniforms.uRimPow, "value").min(1).max(10).step(0.001).name("边缘光范围pow")
  gui.add(uniforms.uRimIntensity, "value").min(0).max(10).step(0.001).name("边缘光强弱")
  gui.add(uniforms.uIntersectPow, "value").min(1).max(10).step(0.001).name("相交光pow")

  gui.add(debug, "uSpeedX").min(0).max(1).step(0.001).name("扭曲速度X").onChange(() => {
    uniforms.uSpeed.value.set(debug.uSpeedX, uniforms.uSpeed.value.y)
  })
  gui.add(debug, "uSpeedY").min(0).max(1).step(0.001).name("扭曲速度Y").onChange(() => {
    uniforms.uSpeed.value.set(uniforms.uSpeed.value.x, debug.uSpeedY)
  })
  gui.add(uniforms.uDistortIntensity, "value").min(0).max(2).step(0.001).name("扭曲强度")



  const geometry = new THREE.SphereGeometry(0.6, 256, 256);
  material = new THREE.ShaderMaterial({
    defines: {
      IS_FRONT: 1
    },
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false,
  });
  material2 = new THREE.ShaderMaterial({
    defines: {
      IS_FRONT: 0
    },
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
  sphere = new THREE.Mesh(geometry, material);
  sphere2 = new THREE.Mesh(geometry, material2);


  sphere.position.copy(futou_parent.position)
  sphere2.position.copy(futou_parent.position)

  scene.add(sphere, sphere2);
}

let depthRender: any;
let sceneDepthRender: any;
let sceneDepthRender2: any;
function setupFBO() {
  const { width, height } = viewPort.value
  depthRender = new THREE.WebGLRenderTarget(width, height);

  // depthRender.depthTexture = new THREE.DepthTexture(width, height);
  // depthRender.depthTexture.type = THREE.FloatType;
  // depthRender.depthTexture.wrapS = THREE.RepeatWrapping;
  // depthRender.depthTexture.wrapT = THREE.RepeatWrapping;

  sceneDepthRender = new THREE.WebGLRenderTarget(width, height);
  sceneDepthRender2 = new THREE.WebGLRenderTarget(width, height);

  // sceneDepthRender.depthTexture = new THREE.DepthTexture(width, height);
  // sceneDepthRender.depthTexture.type = THREE.FloatType;
  // sceneDepthRender.depthTexture.wrapS = THREE.RepeatWrapping;
  // sceneDepthRender.depthTexture.wrapT = THREE.RepeatWrapping;
}

let diffPlane: any;
let testRender: any;
function addTest() {

  const width = viewPort.value.width / 10
  const height = viewPort.value.height / 10

  const canvas = document.createElement('canvas')
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.style.position = 'absolute'
  canvas.style.top = '0px'
  canvas.style.left = '0px'
  canvas.style.zIndex = '999'
  canvas.width = width
  canvas.height = height
  container.appendChild(canvas)

  testRender = new THREE.WebGLRenderer({ antialias: true, canvas });

  // const geo = new THREE.PlaneGeometry(0.1, 0.1)
  // const mat = new THREE.MeshBasicMaterial({
  //   map: depthRender.texture
  // })
  // diffPlane = new THREE.Mesh(geo, mat)
  // scene.add(diffPlane)
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
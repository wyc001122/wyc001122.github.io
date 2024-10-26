<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'


/**
 * custom shader 
 */
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
const textureLoader = new THREE.TextureLoader()
const rgbeLoader = new RGBELoader()

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

  camera.position.set(-5, 5, 12)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  rgbeLoader.load('/texture/hdr/aerodynamics_workshop.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.backgroundBlurriness = 0.5
    scene.environment = environmentMap
  })
  /**
       * Plane
       */
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 10),
    new THREE.MeshStandardMaterial({ color: '#aaaaaa' })
  )
  plane.receiveShadow = true
  plane.position.x = - 4
  plane.position.y = - 3
  plane.position.z = - 4
  plane.lookAt(new THREE.Vector3(0, 0, 0))
  scene.add(plane)

  /**
     * Lights
     */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 4)
  directionalLight.position.set(6.25, 3, 4)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 30
  directionalLight.shadow.normalBias = 0.05
  directionalLight.shadow.camera.top = 8
  directionalLight.shadow.camera.right = 8
  directionalLight.shadow.camera.bottom = -8
  directionalLight.shadow.camera.left = -8
  scene.add(directionalLight)
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
let debug: any = {
  uSliceStart: new THREE.Uniform(1.75),
  uSliceArc: new THREE.Uniform(1.25),
}
function initDebug() {
  gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
  onBeforeUnmount(() => gui.destroy)

  gui.add(debug.uSliceStart, 'value', - Math.PI, Math.PI, 0.001).name('剖切起始角度')
  gui.add(debug.uSliceArc, 'value', 0, Math.PI * 2, 0.001).name('剖切弧度')
}


let model: any;

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

    if (model){
      model.rotation.y = elapsedTime * 0.1
    }
    // update control
    control.update()

    // renderer render
    renderer.render(scene, camera)
  });
})



function addTest() {
  const patchMap = {
    csm_Slice:
    {
      '#include <colorspace_fragment>':
        `
            #include <colorspace_fragment>

            if(!gl_FrontFacing)
                gl_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
        `
    }
  }

  const material = new THREE.MeshStandardMaterial({
    metalness: 0.5,
    roughness: 0.25,
    envMapIntensity: 0.5,
    color: '#858080'
  })

  const slicedMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader,
    fragmentShader,
    uniforms: debug,
    patchMap: patchMap,

    // MeshStandardMaterial
    metalness: 0.5,
    roughness: 0.25,
    envMapIntensity: 0.5,
    color: '#858080',
    side: THREE.DoubleSide
  })

  const slicedDepthMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader,
    fragmentShader,
    uniforms: debug,
    patchMap: patchMap,

    // MeshDepthMaterial
    depthPacking: THREE.RGBADepthPacking
  })

  // Model
  gltfLoader.load('/models/gears.glb', (gltf) => {
    model = gltf.scene
    model.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name === 'outerHull') {
          child.material = slicedMaterial
          child.customDepthMaterial = slicedDepthMaterial
        }
        else {
          child.material = material
        }

        child.castShadow = true
        child.receiveShadow = true
      }
    })

    scene.add(model)
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
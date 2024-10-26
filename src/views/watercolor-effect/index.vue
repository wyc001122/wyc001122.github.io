<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


/**
 * custom shader 
 */
import fragment from "./shaders/fragment.glsl";
import fragmentFBO from "./shaders/fbo.glsl";
import vertex from "./shaders/vertex.glsl";

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
    camera.position.set(0, 0, 2);

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
    gogogo()
    setupPipeline();
    mouseEvents()
    addObjects();

    tick(() => {
        // get elapsedTime
        const elapsedTime = clock.getElapsedTime()
        control.update()

        material.uniforms.time.value = elapsedTime;

        // RENDERING THE SOURCE
        renderer.setRenderTarget(sourceTarget);
        renderer.render(scene, camera);


        // running PING PONG
        renderer.setRenderTarget(targetA);
        renderer.render(fboScene, fboCamera);

        fboMaterial.uniforms.tDiffuse.value = sourceTarget.texture;
        fboMaterial.uniforms.tPrev.value = targetA.texture;
        fboMaterial.uniforms.time.value = elapsedTime;

        // final OUTPUT
        finalQuad.material.map = targetA.texture;
        renderer.setRenderTarget(null);
        renderer.render(finalScene, fboCamera);

        // swap
        let temp = targetA;
        targetA = targetB;
        targetB = temp;
    });
})


let raycaster: any;
let pointer: any;
let pointerPos: any;
let whiteTarget: any;
let whiteScene: any;
let whitebg: any;
let box: any;

function gogogo() {
    const { width, height } = viewPort.value

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    pointerPos = new THREE.Vector3();
    whiteTarget = new THREE.WebGLRenderTarget(width, height);


    whiteScene = new THREE.Scene();

    whitebg = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    )

    whiteScene.add(whitebg)
    whitebg.position.z = -2;

    box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    )

    // whiteScene.add(box)
}

let sourceTarget: any;
let targetA: any;
let targetB: any;

let fboScene: any;
let fboCamera: any;
let fboMaterial: any;
let fboQuad: any;

let finalScene: any
let finalQuad: any

function setupPipeline() {
    const { width, height } = viewPort.value
    sourceTarget = new THREE.WebGLRenderTarget(width, height);
    targetA = new THREE.WebGLRenderTarget(width, height);
    targetB = new THREE.WebGLRenderTarget(width, height);

    renderer.setRenderTarget(whiteTarget);
    
    control.update()
    renderer.render(whiteScene, camera);

    fboScene = new THREE.Scene();
    fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    fboMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            tDiffuse: { value: null },
            tPrev: { value: whiteTarget.texture },
            resolution: { value: new THREE.Vector4(width, height, 1, 1) },
        },
        vertexShader: vertex,
        fragmentShader: fragmentFBO
    });

    fboQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fboMaterial);
    fboScene.add(fboQuad);

    finalScene = new THREE.Scene();
    finalQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: targetA.texture }));
    finalScene.add(finalQuad);
}


let raycastPlane: any;
let dummy: any;
function mouseEvents() {
    raycastPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    );

    dummy = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 30, 30),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
        })
    )

    scene.add(dummy)
    container.addEventListener('mousemove', (e) => {
        const { viewWidth, viewHeight } = viewPort.value
        pointer.x = (e.offsetX / viewWidth) * 2 - 1;
        pointer.y = -(e.offsetY / viewHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects([raycastPlane]);
        if (intersects.length > 0) {
            dummy.position.copy(intersects[0].point)
        }

    })
}

let material: any;
let geometry: any;
let plane: any;

function addObjects() {
    material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector4() },
        },
        vertexShader: vertex,
        fragmentShader: fragment
    });

    geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    plane = new THREE.Mesh(geometry, material);
    // scene.add(plane);
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
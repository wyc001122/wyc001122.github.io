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
    camera.position.set(0, 0, 2)

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
    progress: 0,
    triScale: 1,
    start: 0,
    translate: 0,
    mosaic: 4,
}
function initDebug() {
    gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
    onBeforeUnmount(() => gui.destroy)

    gui.add(debug, "progress", 0, 1, 0.01).onChange((val: any) => {
        material.uniforms.progress.value = val;
    })
    gui.add(debug, "mosaic", 0, 15, 0.01).onChange((val: any) => {
        material.uniforms.mosaic.value = val;
    })
    gui.add(debug, "triScale", 0, 1, 0.01).onChange((val: any) => {
        material.uniforms.triScale.value = val;
    })
    gui.add(debug, "start", 0, 1, 0.01).onChange((val: any) => {
        postQuad.material.uniforms.start.value = val;
    })
    gui.add(debug, "translate", 0, 1, 0.01).onChange((val: any) => {
        postQuad.material.uniforms.translate.value = val;
    })
}

let postQuad: any;
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
    loadModel()

    tick(() => {
        if (!model) return
        // get elapsedTime
        const elapsedTime = clock.getElapsedTime()

        control.update()


        model.rotation.x = 0.2 * Math.sin(elapsedTime * 0.1)
        model.rotation.y = 0.5 * Math.cos(elapsedTime * 0.1)
        postQuad.material.uniforms.time.value = elapsedTime
        material.uniforms.time.value = elapsedTime;

        renderer.setRenderTarget(sourceRenderTarget)
        renderer.render(scene, camera)


        postQuad.material.uniforms.current.value = sourceRenderTarget.texture
        postQuad.material.uniforms.prev.value = renderTarget1.texture
        renderer.setRenderTarget(renderTarget2)
        renderer.render(orthoScene, orthoCamera)

        finalQuad.material.map = renderTarget1.texture
        renderer.setRenderTarget(null)
        renderer.render(finalScene, orthoCamera)




        // swap render targets
        let temp = renderTarget1
        renderTarget1 = renderTarget2
        renderTarget2 = temp

    });
})


let sourceRenderTarget: any;
let renderTarget1: any;
let renderTarget2: any;
function gogogo() {
    const { width, height } = viewPort.value;
    sourceRenderTarget = new THREE.WebGLRenderTarget(width, height)
    renderTarget1 = new THREE.WebGLRenderTarget(width, height)
    renderTarget2 = new THREE.WebGLRenderTarget(width, height)
}


let model: any;
function loadModel() {

    gltfLoader.load(new URL('./models/face.glb', import.meta.url).href, (gltf: any) => {

        setupPostProcessing();
        addObjects();

        model = gltf.scene.getObjectByName("obj_50879273")
        model.geometry.scale(9, 9, 9)
        // convert to non indexed
        model.geometry = model.geometry.toNonIndexed()
        model.geometry.center()

        let pos = model.geometry.attributes.position.array
        // calculate center of each triangle
        let centers = []
        for (let i = 0; i < pos.length; i += 9) {
            let centerX = (pos[i] + pos[i + 3] + pos[i + 6]) / 3
            let centerY = (pos[i + 1] + pos[i + 4] + pos[i + 7]) / 3
            let centerZ = (pos[i + 2] + pos[i + 5] + pos[i + 8]) / 3

            centers.push(centerX, centerY, centerZ)
            centers.push(centerX, centerY, centerZ)
            centers.push(centerX, centerY, centerZ)

        }
        model.geometry.setAttribute('center', new THREE.BufferAttribute(new Float32Array(centers), 3))


        scene.add(model)
        model.material = material
    })
}


let orthoCamera: any;
let orthoScene: any;
let finalQuad: any;
let finalScene: any;
function setupPostProcessing() {
    orthoCamera = new THREE.OrthographicCamera(
        -1, 1, 1, -1, 0, 1
    )
    orthoCamera.position.z = 1
    orthoScene = new THREE.Scene()

    postQuad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
            uniforms: {
                current: { value: null },
                prev: { value: null },
                start: { value: 0 },
                time: { value: 0 },
                translate: { value: 0 }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
            fragmentShader: `
        uniform sampler2D current;
        uniform sampler2D prev;
        uniform float start;
        uniform float time;
        uniform float translate;
        varying vec2 vUv;
        
        void main() {
        float PI = 3.14159265359;
          vec2 uv = vUv;
          uv -= vec2(0.5);
          uv*=vec2(2.,1.);
          uv.y += translate;
          uv /= 4.;
          
          uv.x += sin(uv.y * PI*4. + translate*0.3)*0.15;
          uv.x += sin(uv.y * PI*16.  +translate*0.5)*0.15;

          
          
          uv += vec2(0.5);


          uv = mix(vUv, uv, start);


          vec4 currentColor = texture2D(current, uv);
          vec4 prevColor = texture2D(prev, vUv);
          prevColor.rgb -= 0.004;
          vec4 color = vec4(mix(prevColor.rgb,currentColor.rgb,  0.03), 1.);
          gl_FragColor = color;

        }
        `
        })
    )
    orthoScene.add(postQuad)


    finalScene = new THREE.Scene()
    finalQuad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: null
        })
    )
    finalScene.add(finalQuad)
}

let material: any;
let geometry: any;
function addObjects() {
    material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 0 },
            mosaic: { value: debug.mosaic },
            progress: { value: debug.progress },
            triScale: { value: debug.triScale },
            resolution: { value: new THREE.Vector4() },
        },
        // wireframe: true,
        // transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment
    });

    geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

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
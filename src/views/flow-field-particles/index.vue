<script lang='ts' setup>
import DemoContainer from '@/layout/DemoContainer.vue'
import * as THREE from 'three';
import GUI from "lil-gui"
import useThree from '@/hooks/useThree';

import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'

/**
 * custom shader 
 */
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import gpgpuParticlesShader from './shaders/gpgpu/particles.glsl'

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
    ({ container, renderer, scene, camera, clock, viewPort, tick } = useThree(document.querySelector('.webgl')!))
}

/**
 * setup preset
 */
function setupPreset() {
    camera.position.set(9, 5, 9)
    renderer.setClearColor('#29191f')
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
function initDebug() {
    gui = new GUI({ container: document.querySelector('.debug') as HTMLElement })
    onBeforeUnmount(() => gui.destroy)


}


let model: any;
const gpgpu: any = {}
const particles: any = {}


onMounted(() => {
    initCore()
    setupPreset()
    initControl();
    autoResize()
    initDebug()

    /**
     * my code
     */
    loadModel()

    let previousTime = 0

    tick(() => {
        // 获取当前时间和两帧之间的时间差
        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - previousTime
        previousTime = elapsedTime

        if (gpgpu.particlesVariable) {
            // 更新 GPGPU 计算着色器中的时间相关 uniform
            // 这些值将在着色器中用于更新粒子状态
            gpgpu.particlesVariable.material.uniforms.uTime.value = elapsedTime
            gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = deltaTime

            // 执行 GPGPU 计算
            // 这步会运行粒子更新着色器,更新所有粒子的状态
            gpgpu.computation.compute()
        }

        if (particles.points) {
            // 将计算结果传递给粒子渲染着色器
            // 这里我们获取最新的计算结果,并将其设置为粒子材质的纹理
            particles.material.uniforms.uParticlesTexture.value = gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture
        }

        // 更新控制器
        control.update()

        // 渲染场景
        renderer.render(scene, camera)
    });
})



function loadModel() {
    gltfLoader.load(new URL('./models/ship.glb', import.meta.url).href, (gltf) => {
        // 获取模型的几何体
        model = gltf.scene.children[0]
        const model_geometry = model.geometry
        const count = model_geometry.attributes.position.count

        // GPGPU 设置
        // 计算纹理的大小,取顶点数量的平方根并向下取整
        // 这是为了创建一个近似正方形的纹理,每个texel对应一个粒子
        const size = gpgpu.size = ~~(Math.sqrt(count))

        // 创建 GPUComputationRenderer,用于在 GPU 上进行通用计算
        // 这里我们创建一个与粒子数量相匹配的计算纹理
        const computation = gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer)

        // 创建用于存储粒子数据的纹理
        // 这个纹理将存储每个粒子的位置和生命周期
        const particlesTexture = computation.createTexture()

        // 将模型顶点数据填充到粒子纹理中
        // 每个texel的RGBA通道分别存储粒子的x,y,z位置和生命周期
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const i4 = i * 4
            const position = model_geometry.attributes.position.array
            particlesTexture.image.data[i4 + 0] = position[i3 + 0] // x
            particlesTexture.image.data[i4 + 1] = position[i3 + 1] // y
            particlesTexture.image.data[i4 + 2] = position[i3 + 2] // z
            particlesTexture.image.data[i4 + 3] = Math.random(); // w, 用作粒子的生命周期
        }

        // 添加 GPGPU 变量,用于更新粒子位置
        // 这里我们创建了一个变量,它使用自定义的gpgpuParticlesShader来更新粒子状态
        const particlesVariable = gpgpu.particlesVariable = computation.addVariable('uParticles', gpgpuParticlesShader, particlesTexture)

        // 设置变量依赖关系
        // 这里粒子只依赖自身,因为每次更新只基于粒子当前的状态
        computation.setVariableDependencies(particlesVariable, [particlesVariable])

        // 设置 GPGPU 着色器的 uniform 变量
        // 这些uniform变量可以在每帧中更新,用于控制粒子的行为
        particlesVariable.material.uniforms.uTime = new THREE.Uniform(0)
        particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
        particlesVariable.material.uniforms.uBase = new THREE.Uniform(particlesTexture)
        particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.5)
        particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(2)
        particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.5)
        const debug: any = {
            uFlowFieldInfluence: particlesVariable.material.uniforms.uFlowFieldInfluence,
            uFlowFieldStrength: particlesVariable.material.uniforms.uFlowFieldStrength,
            uFlowFieldFrequency: particlesVariable.material.uniforms.uFlowFieldFrequency
        }
        gui.add(debug.uFlowFieldInfluence, 'value').min(0).max(10).step(0.001).name('uFlowFieldInfluence')
        gui.add(debug.uFlowFieldStrength, 'value').min(0).max(10).step(0.001).name('uFlowFieldStrength')
        gui.add(debug.uFlowFieldFrequency, 'value').min(0).max(10).step(0.001).name('uFlowFieldFrequency')

        // 初始化 GPGPU 计算
        // 这步会检查是否有任何错误,并准备好进行计算
        computation.init()

        // 创建一个测试平面，用于显示粒子纹理（调试用）
        const test = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.MeshBasicMaterial({ map: computation.getCurrentRenderTarget(particlesVariable).texture })
        )
        test.position.x = 5
        // scene.add(test)

        // 粒子系统设置
        // 创建 UV 坐标数组和大小数组
        const particlesUvArray = new Float32Array(count * 2)
        const sizesArray = new Float32Array(count)

        // 填充 UV 坐标和大小数组
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x)
                const i2 = i * 2

                // 计算 UV 坐标
                const uvX = (x + 0.5) / size;
                const uvY = (y + 0.5) / size;

                particlesUvArray[i2 + 0] = uvX;
                particlesUvArray[i2 + 1] = uvY;

                // 设置随机大小
                sizesArray[i] = Math.random()
            }
        }

        // 创建粒子几何体
        const particles_geometry = particles.geometry = new THREE.BufferGeometry()

        // 设置几何体的绘制范围
        particles_geometry.setDrawRange(0, count)
        // 添加 UV 属性
        particles_geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particlesUvArray, 2))
        // 添加颜色属性（从原始模型获取）
        particles_geometry.setAttribute('aColor', model_geometry.attributes.color)
        // 添加大小属性
        particles_geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1))

        // 创建粒子材质
        // 这个材质使用自定义的顶点和片段着色器来渲染粒子
        const particles_material = particles.material = new THREE.ShaderMaterial({
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            uniforms:
            {
                uSize: new THREE.Uniform(0.07),
                uResolution: new THREE.Uniform(new THREE.Vector2(viewPort.value.width, viewPort.value.height)),
                uParticlesTexture: new THREE.Uniform('')
            }
        })

        // 创建粒子系统
        // 使用THREE.Points来高效地渲染大量粒子
        const points = particles.points = new THREE.Points(particles_geometry, particles_material)
        scene.add(points)
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
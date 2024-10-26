import { computed, watch, ref, type MaybeRefOrGetter, render } from 'vue';
import { unrefElement, useElementSize, useDevicePixelRatio, } from '@vueuse/core'
import * as THREE from 'three';
import eventBus, { TAKE_SCREEN_SHOT } from '@/utils/eventBus'
import ResourceTracker from '@/utils/ResourceTracker';
/**
 * 使用Three.js
 * @param container ELEMENT
 */

export const useCore = (container: HTMLElement, renderOptions: THREE.WebGLRendererParameters = {}) => {
    const resourceTracker = new ResourceTracker();
    const track = resourceTracker.track.bind(resourceTracker)
    const { width, height } = useElementSize(container);
    const { pixelRatio } = useDevicePixelRatio()
    const defaultW = container.offsetWidth
    const defaultH = container.offsetHeight
    const viewPort = computed(() => ({
        width: (width.value || defaultW) * pixelRatio.value,
        height: (height.value || defaultH) * pixelRatio.value,
        viewWidth: width.value || defaultW,
        viewHeight: height.value || defaultH,
    }))

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', ...renderOptions });
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container!.appendChild(renderer.domElement)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(1, 1, 1)

    const clock = new THREE.Clock()

    const _taskList: (() => void)[] = []
    function tick(callback: () => void) {
        _taskList.push(callback)
    }

    let requestID: number = 0
    function _runTask() {
        _taskList.forEach(task => task())
        requestID = requestAnimationFrame(_runTask)
    }
    function takeScreenshot(saveName: string) {
        _taskList.forEach(task => task())
        const canvas = renderer.domElement;
        if (canvas) {
            const link = document.createElement('a')
            link.download = `${saveName}-${Date.now()}.png`
            link.href = canvas.toDataURL()
            link.click()
        } else {
            console.warn('No canvas element found in demo-content')
        }
    }
    eventBus.on(TAKE_SCREEN_SHOT, takeScreenshot)

    _runTask()

    onBeforeUnmount(() => {
        cancelAnimationFrame(requestID);
        eventBus.off(TAKE_SCREEN_SHOT, takeScreenshot)
        console.log(renderer.info.memory);
    })

    return {
        /** 容器 */
        container,
        /** 渲染器 */
        renderer,
        /** 场景 */
        scene,
        /** 相机 */
        camera,
        /** 时钟 */
        clock,
        /** 画布尺寸 */
        viewPort,
        /** 添加帧循环 */
        tick,
        /** 手动调用，资源跟踪 */
        track
    }
}

export default useCore
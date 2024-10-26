<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useFps, useMemory } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Icon } from '@iconify/vue'
import eventBus, { TAKE_SCREEN_SHOT } from '@/utils/eventBus'


const router = useRouter()
const route = useRoute()

const goBack = () => {
    router.push('/')
}

const isDialogOpen = ref(false)
const isFullscreen = ref(false)
const demoContentRef = ref<HTMLElement | null>(null)

const toggleFullscreen = () => {
    if (!demoContentRef.value) return

    if (!isFullscreen.value) {
        if (demoContentRef.value.requestFullscreen) {
            demoContentRef.value.requestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
    }
}

const onFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange)
    window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    window.removeEventListener('keydown', handleKeyDown)
})

const takeScreenshot = () => {
    const saveName = route.name
    eventBus.emit(TAKE_SCREEN_SHOT, saveName)
}

const handleKeyDown = (event: KeyboardEvent) => {
    // 检查是否按下了 Ctrl+S
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault() // 阻止浏览器默认的保存行为
        takeScreenshot() // 触发截图
    }
}

const fps = useFps()
const fpsRange = ref([0, 0]);// 记录fps出现过的最大值和最小值
watch(fps, (newVal) => {
    fpsRange.value[0] = Math.min(fpsRange.value[0], newVal)
    fpsRange.value[1] = Math.max(fpsRange.value[1], newVal)
})
const { isSupported, memory } = useMemory()
const JSHeap = computed(() => {
    if (memory.value) {
        // jsHeapSizeLimit:上下文内可用堆的最大体积，以字节计算。
        // totalJSHeapSize:已分配的堆体积，以字节计算。。
        // usedJSHeapSize:当前 JS 堆活跃段（segment）的体积，以字节计算。

        return (memory.value.totalJSHeapSize / 1048576).toFixed(2)

    } else {
        return '0'
    }
})
</script>

<template>
    <div class="demo-container p-4 flex overflow-hidden flex-col h-full w-full relative gap-4 rounded-lg">
        <div class="flex justify-between items-center">
            <Button @click="goBack" variant="outline">
                <Icon icon="mdi:arrow-left" class="mr-2 h-4 w-4" />
                返回
            </Button>
            <h1 class="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
                {{ route.meta.title || route.name }}
            </h1>
            <div class="flex items-center space-x-2">
                <Button variant="outline" v-if="isSupported">
                    内存: {{ JSHeap }} MB
                </Button>
                <Button variant="outline">
                    帧数: {{ fps }}
                </Button>
                <Dialog v-model:open="isDialogOpen">
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Icon icon="mdi:information" class="mr-2 h-4 w-4" />
                            提示
                        </Button>
                    </DialogTrigger>
                    <DialogContent class="w-fit max-w-none">
                        <DialogHeader>
                            <DialogTitle>提示</DialogTitle>
                        </DialogHeader>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                <slot name="tutorial">暂无</slot>
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button @click="takeScreenshot" variant="outline">
                    <Icon icon="mdi:camera" class="mr-2 h-4 w-4" />
                    截图
                </Button>
                <Button @click="toggleFullscreen" variant="outline">
                    <Icon :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" class="mr-2 h-4 w-4" />
                    {{ isFullscreen ? '退出全屏' : '全屏' }}
                </Button>
            </div>
        </div>
        <div ref="demoContentRef" class="demo-content rounded-lg flex-1 overflow-hidden relative">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.demo-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.demo-content:fullscreen {
    background-color: var(--background);
    width: 100vw;
    height: 100vh;
}
</style>

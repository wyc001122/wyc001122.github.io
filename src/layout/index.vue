<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import ParticleBackground from './ParticleBackground.vue'

interface Route {
    path: string
    name: string
    description: string
    cover: string
}

const router = useRouter()
const routes = ref<Route[]>([])

const mode = useColorMode()
const isDark = computed(() => mode.value === 'dark')

const toggleTheme = () => {
    mode.value = isDark.value ? 'light' : 'dark'
}

const animatedTitle = ref('Three.js Demo')

onMounted(() => {
    routes.value = router.getRoutes()
        .filter(route => route.path.startsWith('/') && route.path !== '/' && route.path !== '/home' && route?.meta?.show !== false)
        .map(route => ({
            path: route.path,
            name: route.name as string || route.path.slice(1),
            description: route.meta?.description as string || '暂无描述',
            cover: route.meta?.cover as string || '',
        }))
    const titleText = 'Three.js Demo'
    let i = 0
    const interval = setInterval(() => {
        animatedTitle.value = titleText.slice(0, i)
        i++
        if (i > titleText.length) clearInterval(interval)
    }, 100)
})

const navigateTo = (path: string) => {
    router.push(path)
}

const handleMouseMove = (event: MouseEvent) => {
    const cardElement = event.currentTarget as HTMLElement
    if (cardElement) {
        const rect = cardElement.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        cardElement.style.setProperty('--mouse-x', `${x}px`)
        cardElement.style.setProperty('--mouse-y', `${y}px`)
    }
} 
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
        <ParticleBackground :particle-count="50" :particle-size="3" :particle-speed="0.5" :update-interval="16" />

        <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            <div class="flex justify-between items-center mb-8">
                <h1
                    class="animatedTitle text-4xl leading-normal font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {{ animatedTitle }}<span class="animate-blink">|</span>
                </h1>
                <Button variant="outline" size="icon" @click="toggleTheme"
                    class="rounded-full w-10 h-10 bg-background shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/20">
                    <Icon v-if="isDark" icon="radix-icons:sun" class="h-5 w-5 text-primary" />
                    <Icon v-else icon="radix-icons:moon" class="h-5 w-5 text-primary" />
                    <span class="sr-only">Toggle theme</span>
                </Button>
            </div>  
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <Card v-for="route in routes" :key="route.path"
                    class="w-full bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer card-hover-effect rounded-lg overflow-hidden border border-primary/10"
                    @click="navigateTo(route.path)" @mousemove="handleMouseMove">
                    <CardHeader class="p-3">
                        <CardTitle class="text-sm font-semibold text-primary">{{ route.name }}</CardTitle>
                        <CardDescription class="text-xs leading-relaxed line-clamp-2">{{ route.description }}</CardDescription>
                    </CardHeader>
                    <CardContent class="p-3 pt-0">
                        <div
                            class="h-24 bg-muted rounded-md flex items-center justify-center text-muted-foreground overflow-hidden group">
                            <img :src="route.cover" alt="cover" class="w-full h-full object-cover">
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-hover-effect {
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    transition: all 0.3s ease;
}

.card-hover-effect:hover {
    transform: translateY(-4px) scale(1.02);
}

.card-hover-effect::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(1000px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.1),
            transparent 40%);
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s;
}

.card-hover-effect:hover::before {
    opacity: 1;
}

.bg-gradient-to-br {
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;

    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes blink {

    0%,
    100% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }
}

.animate-blink {
    color: hsl(var(--primary));
    animation: blink 1s step-end infinite;
}
</style>
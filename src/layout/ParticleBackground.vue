<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useColorMode } from '@vueuse/core'

const props = defineProps({
    particleCount: { type: Number, default: 50 },
    particleSize: { type: Number, default: 3 },
    particleSpeed: { type: Number, default: 0.5 },
    updateInterval: { type: Number, default: 16 } // ~60fps
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const mode = useColorMode()
const isDark = computed(() => mode.value === 'dark')

let animationFrameId: number | null = null

onMounted(() => {
    if (canvasRef.value) {
        initParticles(canvasRef.value)
    }
})

onUnmounted(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
    }
})

watch(isDark, () => {
    if (canvasRef.value) {
        initParticles(canvasRef.value)
    }
})

function initParticles(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []

    class Particle {
        x: number = 0
        y: number = 0
        size: number = 0
        speedX: number = 0
        speedY: number = 0

        constructor() {
            this.reset()
        }

        reset() {
            this.x = Math.random() * canvas.width
            this.y = Math.random() * canvas.height
            this.size = Math.random() * props.particleSize + 1
            this.speedX = (Math.random() - 0.5) * props.particleSpeed
            this.speedY = (Math.random() - 0.5) * props.particleSpeed
        }

        update() {
            this.x += this.speedX
            this.y += this.speedY

            if (this.size > 0.2) this.size -= 0.01

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset()
            }
        }

        draw() {
            if (ctx) {
                ctx.fillStyle = isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fill()
            }
        }
    }

    function createParticles() {
        for (let i = 0; i < props.particleCount; i++) {
            particles.push(new Particle())
        }
    }

    function animateParticles() {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < particles.length; i++) {
                particles[i].update()
                particles[i].draw()
            }
        }
        animationFrameId = requestAnimationFrame(animateParticles)
    }

    createParticles()
    animateParticles()

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    })
}
</script>

<template>
    <canvas ref="canvasRef" class="absolute inset-0 z-0"></canvas>
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="absolute bottom-0 text-primary">
            <path fill="currentColor" fill-opacity="1"
                d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
        </svg>
    </div>
</template>
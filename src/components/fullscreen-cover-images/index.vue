<template>
    <div ref="container" class="container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, defineProps } from 'vue';
import * as THREE from 'three';
import useThree from '@/hooks/useThree';


const props = defineProps({
    src: {
        type: String,
        required: true
    },
    fit: {
        type: String,
        default: 'cover',
        validator: (value: string) => ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(value)
    }
});

const container = ref<HTMLElement | null>(null);
const T: any = {};

let material: THREE.ShaderMaterial;
let textures: THREE.Texture;

onMounted(async () => {
    if (!container.value) return;

    const { renderer, scene, camera, clock, viewPort, tick } = useThree(container.value);
    Object.assign(T, { renderer, scene, camera, clock, viewPort, tick });

    camera.position.set(0, 0, 10);

    watch(viewPort, () => {
        const { width, height } = viewPort.value;
        renderer.setSize(width, height, false);
    });

    T.camera2 = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10, 10);

    await loadTexture();
    await addMesh();

    tick(() => {
        const { width, height } = viewPort.value;
        updateTextureScale(width, height);
        renderer.render(scene, T.camera2);
    });
});

watch(() => props.src, async () => {
    await loadTexture();
    updateMaterial();
});

async function loadTexture() {
    const textureLoader = new THREE.TextureLoader();
    textures = await textureLoader.loadAsync(props.src);

    textures.magFilter = THREE.LinearFilter;
    textures.minFilter = THREE.LinearFilter;
    textures.repeat.set(0, 0);
}

function updateTextureScale(width: number, height: number) {
    const viewportAspect = width / height;
    const imageAspect = getImageAspect(textures);

    let scaleX = 1;
    let scaleY = 1;

    switch (props.fit) {
        case 'fill':
            break;
        case 'contain':
            if (imageAspect > viewportAspect) {
                scaleY = viewportAspect / imageAspect;
            } else {
                scaleX = imageAspect / viewportAspect;
            }
            break;
        case 'cover':
            if (imageAspect > viewportAspect) {
                scaleX = imageAspect / viewportAspect;
            } else {
                scaleY = viewportAspect / imageAspect;
            }
            break;
        case 'none':
            scaleX = imageAspect / viewportAspect;
            scaleY = 1;
            break;
        case 'scale-down':
            if (imageAspect > viewportAspect) {
                scaleY = Math.min(1, viewportAspect / imageAspect);
                scaleX = scaleY * imageAspect / viewportAspect;
            } else {
                scaleX = Math.min(1, imageAspect / viewportAspect);
                scaleY = scaleX * viewportAspect / imageAspect;
            }
            break;
    }

    material.uniforms.scale.value.set(scaleX, scaleY);
}

function getImageAspect(texture: THREE.Texture) {
    if (!texture.image) return 1;
    return texture.image.width / texture.image.height;
}

async function addMesh() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    material = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: textures },
            scale: { value: new THREE.Vector2(1, 1) }
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
        fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 scale;
        varying vec2 vUv;
        void main() {
          vec2 newUV = (vUv - vec2(0.5)) / scale + vec2(0.5); 
          gl_FragColor = texture2D(uTexture, newUV);
        }
      `
    });
    const mesh = new THREE.Mesh(geometry, material);
    T.scene.add(mesh);
}

function updateMaterial() {
    if (material && textures) {
        material.uniforms.uTexture.value = textures;
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
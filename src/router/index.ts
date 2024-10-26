import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/layout/index.vue'),
      meta: {
        description: '首页'
      }
    },
    {
      path: '/base',
      name: 'Base',
      component: () => import('@/views/base/index.vue'),
      meta: {
        description: '基础 Three.js 场景',
        show: false
      }
    },
    {
      path: '/coffee',
      name: 'coffee',
      component: () => import('@/views/coffee/index.vue'),
      meta: {
        description: '模拟咖啡雾气',
        cover: '/cover/coffee.png'
      }
    },
    {
      path: '/flow-field-particles',
      name: 'flow-field-particles',
      component: () => import('@/views/flow-field-particles/index.vue'),
      meta: {
        description: '流场粒子',
        cover: '/cover/flow-field-particles.png'
      }
    },
    {
      path: '/raging-sea',
      name: 'raging-sea',
      component: () => import('@/views/raging-sea/index.vue'),
      meta: {
        description: '汹涌的大海',
        cover: '/cover/raging-sea.png'
      }
    },
    {
      path: '/animated-galaxy',
      name: 'animated-galaxy',
      component: () => import('@/views/animated-galaxy/index.vue'),
      meta: {
        description: '粒子银河',
        cover: '/cover/animated-galaxy.png'
      }
    },
    {
      path: '/wobbly-sphere',
      name: 'wobbly-sphere',
      component: () => import('@/views/wobbly-sphere/index.vue'),
      meta: {
        description: '摇摆的球体',
        cover: '/cover/wobbly-sphere.png'
      }
    },
    {
      path: '/black-hole',
      name: 'black-hole',
      component: () => import('@/views/black-hole/index.vue'),
      meta: {
        description: '黑洞',
        cover: '/cover/black-hole.png'
      }
    },
    {
      path: '/halftone',
      name: 'halftone',
      component: () => import('@/views/halftone/index.vue'),
      meta: {
        description: '点阵着色',
        cover: '/cover/halftone.png'
      }
    },
    {
      path: '/sliced-model',
      name: 'sliced-model',
      component: () => import('@/views/sliced-model/index.vue'),
      meta: {
        description: '模型剖切',
        cover: '/cover/sliced-model.png'
      }
    },
    {
      path: '/procedural-terrain',
      name: 'procedural-terrain',
      component: () => import('@/views/procedural-terrain/index.vue'),
      meta: {
        description: '程序地形',
        cover: '/cover/procedural-terrain.png'
      }
    },
    {
      path: '/particles-morphing',
      name: 'particles-morphing',
      component: () => import('@/views/particles-morphing/index.vue'),
      meta: {
        description: '粒子变形',
        cover: '/cover/particles-morphing.png'
      }
    },
    {
      path: '/hologram',
      name: 'hologram',
      component: () => import('@/views/hologram/index.vue'),
      meta: {
        description: '全息材质',
        cover: '/cover/hologram.png'
      }
    },
    {
      path: '/smoke',
      name: 'smoke',
      component: () => import('@/views/smoke/index.vue'),
      meta: {
        description: '烟雾',
        cover: '/cover/smoke.png'
      }
    },
    {
      path: '/abstract-ball',
      name: 'abstract-ball',
      component: () => import('@/views/abstract-ball/index.vue'),
      meta: {
        description: '抽象球体',
        cover: '/cover/abstract-ball.png'
      }
    },
    {
      path: '/particles-cursor-animation',
      name: 'particles-cursor-animation',
      component: () => import('@/views/particles-cursor-animation/index.vue'),
      meta: {
        description: '鼠标交互粒子',
        cover: '/cover/particles-cursor-animation.png'
      }
    },
    {
      path: '/akella-particles-lesson1',
      name: 'akella-particles-lesson1',
      component: () => import('@/views/akella-particles-lesson1/index.vue'),
      meta: {
        description: 'Akella 粒子教程 1',
        cover: '/cover/akella-particles-lesson1.png'
      }
    },
    {
      path: '/akella-particles-lesson2',
      name: 'akella-particles-lesson2',
      component: () => import('@/views/akella-particles-lesson2/index.vue'),
      meta: {
        description: 'Akella 粒子教程 2',
        cover: '/cover/akella-particles-lesson2.png'
      }
    },
    {
      path: '/akella-particles-lesson3',
      name: 'akella-particles-lesson3',
      component: () => import('@/views/akella-particles-lesson3/index.vue'),
      meta: {
        description: 'Akella 粒子教程 3',
        cover: '/cover/akella-particles-lesson3.png'
      }
    },
    {
      path: '/akella-particles-lesson4',
      name: 'akella-particles-lesson4',
      component: () => import('@/views/akella-particles-lesson4/index.vue'),
      meta: {
        description: 'Akella 粒子教程 4',
        cover: '/cover/akella-particles-lesson4.png',
      }
    },
    {
      path: '/akella-particles-lesson5',
      name: 'akella-particles-lesson5',
      component: () => import('@/views/akella-particles-lesson5/index.vue'),
      meta: {
        description: 'Akella 粒子教程 5',
        cover: '/cover/akella-particles-lesson5.png',
      }
    },
    {
      path: '/convolution-shader',
      name: 'convolution-shader',
      component: () => import('@/views/convolution-shader/index.vue'),
      meta: {
        description: '后处理卷积描边',
        cover: '/cover/convolution-shader.png'
      }
    },
    {
      path: '/instanced-animations',
      name: 'instanced-animations',
      component: () => import('@/views/instanced-animations/index.vue'),
      meta: {
        description: '实例动画',
        cover: '/cover/instanced-animations.png'
      }
    },
    {
      path: '/recreating-water-currents',
      name: 'recreating-water-currents',
      component: () => import('@/views/recreating-water-currents/index.vue'),
      meta: {
        description: '水流',
        cover: '/cover/recreating-water-currents.png'
      }
    },
    {
      path: '/grass',
      name: 'grass',
      component: () => import('@/views/grass/index.vue'),
      meta: {
        description: '草地',
        cover: '/cover/grass.png',
      }
    },
    {
      path: '/fluffy-grass',
      name: 'fluffy-grass',
      component: () => import('@/views/fluffy-grass/index.vue'),
      meta: {
        description: '蓬松的草',
        cover: '/cover/fluffy-grass.png',
      }
    },
    {
      path: '/watercolor-effect',
      name: 'watercolor-effect',
      component: () => import('@/views/watercolor-effect/index.vue'),
      meta: {
        description: '鼠标交互水彩效果',
        cover: '/cover/watercolor-effect.png',
      }
    },
    {
      path: '/interactive-particles-loop',
      name: 'interactive-particles-loop',
      component: () => import('@/views/interactive-particles-loop/index.vue'),
      meta: {
        description: '交互式粒子环',
        cover: '/cover/interactive-particles-loop.png',
      }
    },
    {
      path: '/voxelized-transformation',
      name: 'voxelized-transformation',
      component: () => import('@/views/voxelized-transformation/index.vue'),
      meta: {
        description: '体素化着色器转换',
        cover: '/cover/voxelized-transformation.png',
      }
    },
    {
      path: '/smooth-particle-animation',
      name: 'smooth-particle-animation',
      component: () => import('@/views/smooth-particle-animation/index.vue'),
      meta: {
        description: '泊松圆盘采样',
        cover: '/cover/smooth-particle-animation.png',
      }
    },
    {
      path: '/tangents-bitangents',
      name: 'tangents-bitangents',
      component: () => import('@/views/tangents-bitangents/index.vue'),
      meta: {
        description: 'tangents,bitangents',
        cover: '/cover/tangents-bitangents.png',
      }
    },
    {
      path: '/cursor-cube',
      name: 'cursor-cube',
      component: () => import('@/views/cursor-cube/index.vue'),
      meta: {
        description: '交互方块',
        cover: '/cover/cursor-cube.png',
      }
    },
    {
      path: '/earth',
      name: 'earth',
      component: () => import('@/views/earth/index.vue'),
      meta: {
        description: '地球',
        cover: '/cover/earth.png',
      }
    },
    {
      path: '/energy-shield',
      name: 'energy-shield',
      component: () => import('@/views/energy-shield/index.vue'),
      meta: {
        description: '能量护盾',
        cover: '/cover/energy-shield.png',
      }
    },
    {
      path: '/grantyi',
      name: 'grantyi',
      component: () => import('@/views/grantyi/index.vue'),
      meta: {
        description: 'grantyi 复刻',
        cover: '/cover/grantyi.png',
      }
    },
    {
      path: '/getDepth',
      name: 'getDepth',
      component: () => import('@/views/getDepth/index.vue'),
      meta: {
        description: '相交效果',
        cover: '/cover/getDepth.png',
        show: false
      }
    },
    {
      path: '/light-sword',
      name: 'light-sword',
      component: () => import('@/views/light-sword/index.vue'),
      meta: {
        description: '光剑',
        cover: '/cover/light-sword.png',
      }
    },
    {
      path: '/hide-plane',
      name: 'hide-plane',
      component: () => import('@/views/hide-plane/index.vue'),
      meta: {
        description: '隐藏的面',
        cover: '/cover/hide-plane.png',
      }
    },
    {
      path: '/cartoon-water-surface',
      name: 'cartoon-water-surface',
      component: () => import('@/views/cartoon-water-surface/index.vue'),
      meta: {
        description: '卡通水面',
        cover: '/cover/cartoon-water-surface.png',
      }
    },
    {
      path: '/stylized-water',
      name: 'stylized-water',
      component: () => import('@/views/stylized-water/index.vue'),
      meta: {
        description: '风格化水体',
        cover: '/cover/stylized-water.png',
      }
    },
    {
      path: '/card',
      name: 'card',
      component: () => import('@/views/card/index.vue'),
      meta: {
        description: '卡片',
        cover: '/cover/card.png',
      }
    },
  ]
})

export default router

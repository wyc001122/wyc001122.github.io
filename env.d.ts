/// <reference types="vite/client" />

declare module '*.glsl' {
  const content: string
  export default content
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}
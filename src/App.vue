<script lang='ts' setup>
import { useColorMode } from '@vueuse/core'
const mode = useColorMode()
</script>

<template>
    <router-view></router-view>
</template>

<style>
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

#app {
    width: 100%;
    height: 100%;
}
</style>

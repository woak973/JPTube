<template>
  <YTCommonPlayer
    :key="videoId"
    :videoId="videoId"
    aspectRatio="fullscreen" />
</template>

<script setup lang="ts">

definePageMeta({
  layout: false,
});

const route = useRoute();
const videoId = ref<string>(route.params.v as string);
</script>

<style>
html, body {
  overflow: hidden;
}
</style>

<template>
  <v-card v-if="data" elevation="16" :image="getProxifiedUrl(data.thumbnail?.contents[0]?.url || '')">

    <v-card-title class="semi-transparent-background">{{ data.title.text }}</v-card-title>
    <v-card-text class="omit semi-transparent-background">{{ data.description.text
    }}</v-card-text>

  </v-card>
  <div v-else>
    データがありません
  </div>

</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.MusicImmersiveHeader,
});

</script>

<style scoped>
.omit {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    padding-bottom: 0;
    word-break: break-word;
}

.semi-transparent-background {
    background-color: rgba(255, 255, 255, 0.6);
    /* 白色の半透明背景 */
}
</style>

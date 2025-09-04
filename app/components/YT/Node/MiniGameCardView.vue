<template>
  <v-card v-if="data" elevation="16" :to="data.on_tap.innertube_command.metadata.url" link>
    <v-img :src="getProxifiedUrl(data.image.sources[0]?.url || '')">
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </div>
      </template>
    </v-img>
    <v-card-text class="omit">{{ data.title }}</v-card-text>
    <v-card-subtitle>{{ data.genre }}</v-card-subtitle>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.MiniGameCardView,
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
</style>

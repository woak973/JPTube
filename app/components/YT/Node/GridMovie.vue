<template>
  <v-card v-if="data" elevation="16" :to="data.endpoint?.metadata?.url" link>
    <v-img :src="getProxifiedUrl(data.thumbnails[0]?.url)">
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </div>
      </template>
      <div class="duration-overlay">{{ data.duration?.text }}</div>
    </v-img>
    <v-card-text class="omit">{{ data.title.text }}</v-card-text>
    <v-card-subtitle>{{ data.metadata.text }}</v-card-subtitle>
    <template v-if="data.badges">
      <v-slide-group>
        <template v-for="badge in data.badges">
          <v-chip>{{ badge.label }}</v-chip>
        </template>
      </v-slide-group>
    </template>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.GridMovie,
});
</script>

<style scoped>
.duration-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
}

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

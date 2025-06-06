<template>
  <v-card v-if="data" elevation="16" :to="generateUrl(data.endpoint)" link>
    <v-row>
      <v-col cols="4" class="d-flex align-center justify-center image">
        <v-img :src="getProxifiedUrl(data.thumbnails[0]?.url)" aspect-ratio="16/9" rounded>
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate />
            </div>
          </template>
          <div class="duration-overlay">{{ data.duration.text }}</div>
        </v-img>
      </v-col>
      <v-col cols="8" class="description">
        <v-card-title class="omit">{{ data.title }}</v-card-title>
        <v-card-subtitle>{{ data.author.name }}
          <template v-if="data.author.badges">
            <template v-for="badge in data.author.badges">
              <YTNode :data="badge" :attribute="'slide'" />
            </template>
          </template>
        </v-card-subtitle>
        <v-card-subtitle>{{ data.short_view_count?.text }}・{{ data.published?.text }}</v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.CompactVideo,
});

const generateUrl = (endpoint: YTNodes.NavigationEndpoint | undefined) => {
  if (endpoint?.payload?.videoId) {
    return `/kids/watch?v=${endpoint.payload.videoId}`;
  }
  return '';
};
</script>

<style scoped>
.duration-overlay {
    position: absolute;
    bottom: 0.5rem;
    /* 8px */
    right: 0.5rem;
    /* 8px */
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.125rem 0.25rem;
    /* 2px 4px */
    border-radius: 0.25rem;
    /* 4px */
    font-size: 0.75rem;
    /* 12px */
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

.description {
    padding-left: 0;
}

.image {
    padding-right: 0;
}
</style>

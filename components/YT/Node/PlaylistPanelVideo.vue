<template>
  <v-card v-if="data" elevation="16" :to="data.endpoint?.metadata?.url" link>
    <v-row>
      <v-col cols="12" sm="4" class="d-flex align-center justify-center image">
        <v-img :src="getProxifiedUrl(data.thumbnail[0]?.url)" aspect-ratio="16/9" rounded>
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div>
          </template>
          <div class="duration-overlay">{{ data.duration.text }}</div>
        </v-img>
      </v-col>
      <v-col cols="12" sm="8">
        <v-card-title class="small-text omit description">{{ data.title.text }}</v-card-title>
        <v-card-subtitle class="tiny-text" style="padding: 0;">
          <template v-for="artist in data.artists">
            {{ artist.name }}
          </template>
        </v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.PlaylistPanelVideo
});
</script>

<style scoped>
.small-text {
  font-size: 0.875rem;
  /* 14px */
}

.tiny-text {
  font-size: 0.75rem;
  /* 12px */
}

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
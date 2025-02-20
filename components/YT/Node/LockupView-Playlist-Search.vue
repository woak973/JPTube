<template>
  <v-card v-if="data" elevation="16" :to="`/watch?list=${data.content_id}`" link>
    <v-row>
      <v-col cols="12" sm="4" class="d-flex align-center justify-center">
        <v-img :src="getProxifiedUrl(data.content_image?.primary_thumbnail?.image[0].url || '')" aspect-ratio="16/9"
          rounded>
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div>
          </template>
          <div class="duration-overlay">
            <template v-for="overlay in data.content_image?.primary_thumbnail?.overlays">
              <template v-if="(overlay instanceof YTNodes.ThumbnailOverlayBadgeView)">
                <template v-for="badge in overlay.badges">
                  {{ badge.text }}
                </template>
              </template>
            </template>
          </div>
        </v-img>
      </v-col>
      <v-col cols="12" sm="8">
        <v-card-title>{{ data.metadata?.title.text }}</v-card-title>
        <template v-for="row in data.metadata?.metadata?.metadata_rows">
          <v-list-item style="min-height: 0px;" v-for="part in row.metadata_parts"
            :to="part.text?.endpoint?.metadata?.url">
            <v-list-item-subtitle>{{ part.text }}</v-list-item-subtitle>
          </v-list-item>
        </template>

      </v-col>
    </v-row>
  </v-card>
  <div v-else>
    データがありません
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';


const props = defineProps({
  data: YTNodes.LockupView
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
</style>
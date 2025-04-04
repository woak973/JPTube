<template>
  <v-card v-if="data" elevation="16" :to="data.renderer_context.command_context?.on_tap?.metadata?.url" link>
    <v-row>
      <v-col cols="12" sm="4" class="d-flex align-center justify-center">
        <v-img :src="getProxifiedUrl(getImageUrl(data.content_image))" aspect-ratio="16/9" rounded>
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate />
            </div>
          </template>
          <div class="duration-overlay">
            <template v-if="(data.content_image instanceof YTNodes.CollectionThumbnailView)">
              <template v-for="overlay in data.content_image.primary_thumbnail?.overlays">
                <template v-if="(overlay instanceof YTNodes.ThumbnailOverlayBadgeView)">
                  <template v-for="badge in overlay.badges">
                    {{ badge.text }}
                  </template>
                </template>
              </template>
            </template>
            <template v-else-if="(data.content_image instanceof YTNodes.ThumbnailView)">
              <template v-for="overlay in data.content_image.overlays">
                <template v-if="(overlay instanceof YTNodes.ThumbnailOverlayBadgeView)">
                  <template v-for="badge in overlay.badges">
                    {{ badge.text }}
                  </template>
                </template>
              </template>
            </template>
          </div>
        </v-img>
      </v-col>
      <v-col cols="12" sm="8">
        <v-card-title>{{ data.metadata?.title.text }}</v-card-title>
        <template v-for="row in data.metadata?.metadata?.metadata_rows">
          <v-list-item
            v-for="part in row.metadata_parts" style="min-height: 0px;"
            :to="part.text?.endpoint?.metadata?.url">
            <v-list-item-subtitle>{{ part.text }}</v-list-item-subtitle>
          </v-list-item>
        </template>

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
  data: YTNodes.LockupView,
});

const getImageUrl = (content_image: YTNodes.CollectionThumbnailView | YTNodes.ThumbnailView | null): string => {
  if ((content_image instanceof YTNodes.CollectionThumbnailView)) {
    return content_image.primary_thumbnail?.image[0]?.url || '';
  } else if (content_image instanceof YTNodes.ThumbnailView) {
    return content_image.image[0]?.url || '';
  } else {
    return '';
  }
};
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

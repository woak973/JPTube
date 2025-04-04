<template>
  <template v-if="data">
    <v-card>
      <template v-if="data.slim_video_metadata">
        <v-card-title class="titletext" style="padding-bottom: 0">{{ data.slim_video_metadata.title.text
        }}</v-card-title>
      </template>
      <v-card-actions>
        <v-row justify="space-between">
          <v-col cols="auto">
            <template v-if="data.slim_video_metadata">
              <template v-if="(data.slim_video_metadata.owner instanceof YTNodes.SlimOwner)">
                <YTKidsNodeSlimOwner :data="data.slim_video_metadata.owner" />
              </template>
            </template>
          </v-col>
          <v-col cols="auto">
            <v-list-item>
              <v-slide-group>
                <div>
                  <v-btn
                    :disabled="downloading" variant="tonal" class="rounded-pill mx-2"
                    @click="$emit('downloadVideo')">
                    <v-icon v-if="!downloading">mdi-download</v-icon>
                    <v-progress-circular v-else indeterminate size="20" />
                    Download
                  </v-btn>
                </div>
                <div>
                  <v-btn variant="tonal" class="rounded-pill mx-2" @click.stop="$emit('share')">
                    <v-icon>mdi-share</v-icon>
                    Share
                  </v-btn>
                </div>
              </v-slide-group>
            </v-list-item>
          </v-col>

        </v-row>
      </v-card-actions>
    </v-card>
  </template>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTKids, YTNodes } from 'youtubei.js';

defineProps({
  data: YTKids.VideoInfo,
  downloading: Boolean,
  showFullDescription: Boolean,
});

defineEmits(['downloadVideo', 'share']);
</script>

<style scoped>
.video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    /* 16:9 aspect ratio */
    height: 0;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.titletext {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.scrollable-component {
    height: 500px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 16px;
}
</style>

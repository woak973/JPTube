<template>
  <v-card v-if="data" elevation="16" :to="generateUrl(data.on_tap)" link>
    <v-row>
      <v-col cols="12" sm="4" class="d-flex align-center justify-center">
        <v-img :src="getProxifiedUrl(data.thumbnail?.contents[0]?.url || '')" aspect-ratio="16/9" rounded>
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate />
            </div>
          </template>
        </v-img>
      </v-col>
      <v-col cols="12" :sm="data.contents ? 4 : 8">
        <v-card-title>{{ data.title.text }}</v-card-title>
        <v-card-subtitle>{{ data.subtitle.text }}</v-card-subtitle>
      </v-col>
      <v-col cols="12" sm="4">
        <v-row>
          <template v-for="content in data.contents">
            <YTMusicNode :data="content" />
          </template>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
  <div v-else>
    データがありません
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';
defineProps({
  data: YTNodes.MusicCardShelf,
});

function generateUrl(onTap: YTNodes.NavigationEndpoint) {
  if (onTap.name === 'browseEndpoint') {
    const config = onTap.payload?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType;
    switch (config) {
      case 'MUSIC_PAGE_TYPE_ARTIST':
      case 'MUSIC_PAGE_TYPE_USER_CHANNEL':
      case 'MUSIC_PAGE_TYPE_LIBRARY_ARTIST':
        return `/music/channel/${onTap.payload.browseId}`;
      case 'MUSIC_PAGE_TYPE_PLAYLIST':
        return `/music/playlist?list=${onTap.payload.browseId}`;
      case 'MUSIC_PAGE_TYPE_ALBUM':
        return `/music/album?id=${onTap.payload.browseId}`;
      default:
        return '';
    }
  } else if (onTap.name === 'watchEndpoint') {
    const config = onTap.payload?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig?.musicVideoType;
    switch (config) {
      case 'MUSIC_VIDEO_TYPE_UGC':
      case 'MUSIC_VIDEO_TYPE_ATV':
      case 'MUSIC_VIDEO_TYPE_OMV':
        return `/music/watch?v=${onTap.payload.videoId}`;
      default:
        return '';
    }
  } else {
    return '';
  }
}
</script>

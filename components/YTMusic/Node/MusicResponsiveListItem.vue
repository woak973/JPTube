<template>
  <v-card v-if="data" elevation="16" :to="getLink()" link>
    <v-row>
      <v-col cols="4" class="d-flex align-center justify-center">
        <v-img :src="getProxifiedUrl(data.thumbnails[0]?.url)" max-width="50%">
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate />
            </div>
          </template>
        </v-img>
      </v-col>
      <v-col cols="8">
        <v-card-title>{{ data.title }}</v-card-title>
        <v-card-actions>
          <v-list-item
            :to="`/music/channel/${data?.artists?.[0]?.channel_id || data?.authors?.[0]?.channel_id}`" link>
            <v-list-item-title>{{ data?.artists?.[0]?.name || data?.authors?.[0]?.name
            }}</v-list-item-title>
          </v-list-item>
        </v-card-actions>
        <v-card-subtitle>{{ data?.flex_columns[1]?.title }}</v-card-subtitle>
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
  data: YTNodes.MusicResponsiveListItem,
  PLid: {
    type: String,
    default: '',
  },
});

const getLink = () => {
  if (props.data && props.data.item_type) {
    switch (props.data.item_type) {
      case 'playlist':
      case 'podcast_show':
        return `/music/playlist?list=${props.data.id}`;
      case 'album':
        return props.data ? `/music/album?id=${props.data.id}` : '';
      case 'artist':
      case 'library_artist':
        return props.data ? `/music/channel/${props.data.id}` : '';
      case 'video':
      case 'non_music_track':
      case 'song':
        return props.data ? `/music/watch?v=${props.data.id}${props.PLid ? `&list=${props.PLid}` : ''}` : '';
      default:
        return '/music';
    }
  } else {
    return '/music';
  }
};
</script>

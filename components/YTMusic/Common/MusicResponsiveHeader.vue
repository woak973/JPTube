<template>
  <v-card v-if="data" elevation="16">
    <v-img :src="getProxifiedUrl(data.thumbnail?.contents[0]?.url || '')" aspect-ratio="16/9" rounded>
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </div>
      </template>
    </v-img>

    <v-card-title>{{ data.title.text }}</v-card-title>
    <v-card-subtitle>{{ data.subtitle.text }}</v-card-subtitle>
    <v-card-subtitle>{{ data.second_subtitle.text }}</v-card-subtitle>
    <v-card-text>{{ data?.description?.description?.text }}</v-card-text>
    <v-btn v-if="!(data.buttons[1] instanceof YTNodes.Menu)" :to="`/music/watch?list=${data.buttons[1]?.endpoint?.payload.playlistId}`">Play All</v-btn>

  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.MusicResponsiveHeader,
});
</script>

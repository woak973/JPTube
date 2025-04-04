<template>
  <div>
    <v-dialog v-model="alert" max-width="500">
      <v-card>
        <v-card-title class="headline">Warning</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="alert = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <v-card v-if="data" elevation="16">
    <v-row>
      <v-col cols="12" sm="4" class="d-flex align-center justify-center">
        <div v-if="playerStore.player === 'embed'" class="video-container">
          <iframe
            id="youtubeiframechild"
            :src="`https://www.youtube-nocookie.com/embed/${data.id}?autoplay=1&modestbranding=1&enablejsapi=1`" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen />
        </div>

        <YTCommonPlayer
          v-else-if="playerStore.player === 'shaka-player'" ref="child" :key="data.id"
          :videoId="data.id" @errors="handleError" />

        <YTCommonVideoJS
          v-else-if="playerStore.player === 'VideoJS'" ref="child" :key="data.id + 'JS'"
          :videoId="data.id" @errors="handleError" />
      </v-col>
      <v-col cols="12" sm="8">
        <v-card-title>{{ data.title.text }}</v-card-title>
        <v-card-subtitle>{{ data.view_count.text }}・{{ data.published_time.text }}</v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
  <div v-else>
    データがありません
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const playerStore = usePlayerStore();
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

defineProps({
  data: YTNodes.ChannelVideoPlayer,
});

const handleError = inject('handleError') as (message: string) => void;
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
</style>

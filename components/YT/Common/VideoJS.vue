<template>
  <div class="videojs-container">
    <video id="videojs-player" class="video-js vjs-default-skin" controls preload="auto" width="640" height="264" />
  </div>
</template>

<script setup lang="ts">
import type { Types } from 'youtubei.js';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';

const props = defineProps({
  videoId: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['errors']);

let player: Player;

const seek = (seconds: number) => {
  if (player) {
    player.currentTime(seconds);
    console.log('Seeking to', seconds);
  } else {
    console.error('Video element is not found');
  }
};

onMounted(async () => {
  if (props.videoId) {
    player = videojs('videojs-player');
    const DLyt = await useInnertube('player');

    const DLResults = await DLyt.getInfo(props.videoId);
    try {
      const DLOption: Types.DownloadOptions = { quality: 'best' };
      const stream = await DLResults.download(DLOption);
      const reader = stream.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);

      player.src({
        src: url,
        type: 'video/webm',
      });
    } catch (e) {
      if (DLResults.streaming_data && DLResults.streaming_data.hls_manifest_url) {
        const uri = DLResults.streaming_data.hls_manifest_url;
        player.src({
          src: uri,
          type: 'application/x-mpegURL',
        });
      } else {
        console.error(e);
        emit('errors', e);
      }
    }
  }
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
});

defineExpose({ seek });

</script>

<style scoped>
.videojs-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%;

}

.video-js {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>

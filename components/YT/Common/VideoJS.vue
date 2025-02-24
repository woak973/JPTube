<template>
    <div>
      <video id="videojs-player" class="video-js vjs-default-skin" controls preload="auto" width="640" height="264"></video>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Innertube, UniversalCache } from 'youtubei.js'
  import videojs from 'video.js'
  import 'video.js/dist/video-js.css'
  
  const props = defineProps({
      route: String
  });
  
  if (props.route) {
      const langStore = useLangStore();
      const locationStore = useLocationStore();
  
      const DLlang = langStore.lang || 'ja';
      const DLlocation = locationStore.location || 'JP';
      const DLyt = await Innertube.create({
          fetch: PlayerfetchFn,
          cache: new UniversalCache(false),
          lang: DLlang,
          location: DLlocation
      });
  
      const DLResults = await DLyt.getInfo(props.route);
      const stream = await DLResults.download();
      const reader = stream.getReader();
      const chunks = [];
      let receivedLength = 0;
  
      while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
      }
  
      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);
  
      // Initialize Video.js player and set the source
      const player = videojs('videojs-player');
      player.src({
          src: url,
          type: 'video/mp4'
      });
  }
  </script>
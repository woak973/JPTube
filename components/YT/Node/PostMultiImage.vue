<template>
  <v-carousel v-if="data" hide-delimiters>
    <v-carousel-item v-for="img in data.images">
      <v-img :src="getProxifiedUrl(img.image[0]?.url)" />
    </v-carousel-item>
  </v-carousel>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.PostMultiImage,
});
</script>

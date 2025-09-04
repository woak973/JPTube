<template>
  <v-img v-if="data" :src="getProxifiedUrl(data.image[0]?.url || '')" rounded max-width="638">
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular color="grey-lighten-4" indeterminate />
      </div>
    </template>
  </v-img>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.BackstageImage,
});
</script>

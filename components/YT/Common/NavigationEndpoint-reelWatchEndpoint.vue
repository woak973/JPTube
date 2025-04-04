<template>
  <v-card v-if="data" elevation="16" :to="data.metadata?.url" link>
    <v-img :src="getProxifiedUrl(data.payload.thumbnail.thumbnails[0].url)" aspect-ratio="16/9" rounded>
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </div>
      </template>
    </v-img>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.NavigationEndpoint,
});
</script>

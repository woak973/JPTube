<template>
  <v-card v-if="data" :to="data.endpoint.metadata.url">
    <v-card-text>{{ data.text }}{{ data.corrected_query.text }}</v-card-text>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.DidYouMean,
});
</script>

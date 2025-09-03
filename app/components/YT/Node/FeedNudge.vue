<template>
  <v-card v-if="data">
    <v-card-title>{{ data.title }}</v-card-title>
    <v-card-subtitle>{{ data.subtitle }}</v-card-subtitle>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.FeedNudge,
});
</script>

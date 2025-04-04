<template>
  <v-card v-if="data">
    <v-img :src="getProxifiedUrl(data.illustration[0].url)" width="160" height="160" class="mx-auto" />
    <v-card-text class="text-center">{{ data.description.text }}</v-card-text>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.ChannelOwnerEmptyState,
});
</script>

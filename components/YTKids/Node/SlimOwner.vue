<template>
  <v-list-item
    v-if="data"
    :to="data.endpoint?.payload?.browseId ? `/kids/channel/${data.endpoint.payload.browseId}` : ''" link>
    <template #prepend>
      <v-avatar color="grey-darken-3" size="36" :image="getProxifiedUrl(data.thumbnail[0]?.url || '')" />
    </template>
    <v-list-item-title>{{ data.title
    }}</v-list-item-title>
  </v-list-item>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.SlimOwner,
});
</script>

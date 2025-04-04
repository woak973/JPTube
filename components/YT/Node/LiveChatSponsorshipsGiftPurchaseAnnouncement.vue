<template>
  <template v-if="data" elevation="16">
    <template v-if="data.header">
      <YTNodeLiveChatSponsorshipsHeader :data="data.header" />
    </template>
  </template>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.LiveChatSponsorshipsGiftPurchaseAnnouncement,
});
</script>

<template>
    <v-avatar v-if="data" :image="getProxifiedUrl(data.custom_thumbnail[0].url)" class="mr-2" rounded="0" size="14">
    </v-avatar>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.LiveChatAuthorBadge
});
</script>
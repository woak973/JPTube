<template>
    <v-card v-if="data">
        <v-card-title>{{ data.title.text }}</v-card-title>
        <v-card-subtitle>{{ data.subtitle.text }}</v-card-subtitle>
    </v-card>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.RichListHeader
});
</script>
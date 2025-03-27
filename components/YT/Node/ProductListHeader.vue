<template>
    <v-card v-if="data">
        <v-card-text>{{ data.title.text }}</v-card-text>
    </v-card>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.ProductListHeader
});
</script>

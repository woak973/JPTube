<template>
    <v-card v-if="data">
        <v-card-text>{{ data.including_results_for.text }}{{ data.corrected_query.text }}</v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.IncludingResultsFor
});
</script>

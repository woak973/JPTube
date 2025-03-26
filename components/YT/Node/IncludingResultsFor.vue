<template>
    <v-card v-if="data" :to="data.corrected_query_endpoint.metadata.url">
        <v-card-text>{{ data.including_results_for.text }}{{ data.corrected_query.text }}</v-card-text>
    </v-card>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.IncludingResultsFor
});
</script>

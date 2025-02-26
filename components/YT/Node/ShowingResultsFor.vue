<template>
    <v-card v-if="data">
        <v-card-text>{{ data.search_instead_for.text }}{{ data.original_query.text }}・{{
            data.showing_results_for.text }}{{
                data.corrected_query.text }}</v-card-text>
    </v-card>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.ShowingResultsFor
});
</script>
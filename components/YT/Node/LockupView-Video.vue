<template>
    <v-card v-if="data" elevation="16" :to="`/watch?v=${data.content_id}`" link>
        <v-row>
            <v-col cols="4" class="d-flex align-center justify-center image">
                <v-img :src="getProxifiedUrl(`https://i.ytimg.com/vi/${data.content_id}/hqdefault.jpg`)"
                    aspect-ratio="16/9" rounded>
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                    </template>
                </v-img>
            </v-col>
            <v-col cols="8" class="description">
                <v-card-title class="small-text omit">{{ data.metadata?.title.text }}</v-card-title>
                <template v-if="data.metadata?.metadata?.metadata_rows">
                    <template v-if="data.metadata?.metadata?.metadata_rows[1].metadata_parts">
                        <v-card-subtitle class="tiny-text">{{
                            data.metadata.metadata.metadata_rows[1].metadata_parts[0].text
                            }}・{{ data.metadata.metadata.metadata_rows[1].metadata_parts[1].text }}</v-card-subtitle>
                    </template>
                </template>
                <template v-if="data.metadata?.metadata?.metadata_rows">
                    <template v-if="data.metadata?.metadata?.metadata_rows[0].metadata_parts">
                        <v-card-subtitle class="tiny-text">{{
                            data.metadata.metadata.metadata_rows[0].metadata_parts[0].text }}</v-card-subtitle>
                    </template>
                </template>
            </v-col>
        </v-row>
    </v-card>
    <div v-else>
        データがありません
    </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.LockupView
});
</script>

<style scoped>
.small-text {
    font-size: 0.875rem;
    /* 14px */
}

.tiny-text {
    font-size: 0.75rem;
    /* 12px */
}

.duration-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
}

.omit {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    padding-bottom: 0;
    word-break: break-word;
}

.description {
    padding-left: 0;
}

.image {
    padding-right: 0;
}
</style>
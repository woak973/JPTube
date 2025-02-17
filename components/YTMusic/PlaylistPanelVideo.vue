<template>
    <v-card v-if="data" elevation="16" :to="`/music/watch?v=${data.video_id}`" link>
        <v-row>
            <v-col cols="4" class="d-flex align-center justify-center image">
                <v-img :src="getProxifiedUrl(data.thumbnail[0]?.url)" aspect-ratio="16/9" rounded>
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                    </template>
                </v-img>
            </v-col>
            <v-col cols="8" class="description">
                <v-card-title class="small-text omit">{{ data.title.text }}</v-card-title>
                <v-card-subtitle class="tiny-text">
                    <v-row>
                        <v-col class="d-flex justify-start">{{ data.author }}</v-col>
                        <v-col class="d-flex justify-end">{{ data.duration.text }}</v-col>
                    </v-row>
                </v-card-subtitle> </v-col>
        </v-row>
    </v-card>
    <div v-else>
        データがありません
    </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.PlaylistPanelVideo
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
<template>
    <v-card v-if="data" elevation="16" :to="data.endpoint.metadata.url" link>
        <template v-if="(data.small_form_factor_background_thumbnail instanceof YTNodes.ThumbnailLandscapePortrait)">
            <v-img
                :src="getProxifiedUrl((data.small_form_factor_background_thumbnail as YTNodes.ThumbnailLandscapePortrait).landscape[0]?.url)"
                aspect-ratio="16/9" rounded>
                <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                    </div>
                </template>
            </v-img>
        </template>
        <v-list-item>
            <v-row dense>
                <v-col>
                    <div class="omit">{{ data.title }}</div>
                    <v-card-subtitle class="subomit">{{ data.description
                    }}</v-card-subtitle>
                </v-col>
            </v-row>
        </v-list-item>
    </v-card>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js'

const props = defineProps({
    data: YTNodes.DefaultPromoPanel
});
</script>

<style scoped>
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

.subomit {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    padding: 0%;
    word-break: break-word;
}
</style>
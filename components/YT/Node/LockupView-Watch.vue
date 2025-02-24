<template>
    <v-card v-if="data" elevation="16" :to="data.renderer_context.command_context.on_tap?.metadata?.url" link>
        <v-row>
            <v-col cols="4" class="d-flex align-center justify-center image">
                <v-img :src="getProxifiedUrl(getImageUrl(data.content_image))" aspect-ratio="16/9" rounded>
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                    </template>
                    <div class="duration-overlay">
                        <template v-if="(data.content_image instanceof YTNodes.CollectionThumbnailView)">
                            <template v-for="overlay in data.content_image.primary_thumbnail?.overlays">
                                <template v-if="(overlay instanceof YTNodes.ThumbnailOverlayBadgeView)">
                                    <template v-for="badge in overlay.badges">
                                        {{ badge.text }}
                                    </template>
                                </template>
                            </template>
                        </template>
                        <template v-else-if="(data.content_image instanceof YTNodes.ThumbnailView)">
                            <template v-for="overlay in data.content_image.overlays">
                                <template v-if="(overlay instanceof YTNodes.ThumbnailOverlayBadgeView)">
                                    <template v-for="badge in overlay.badges">
                                        {{ badge.text }}
                                    </template>
                                </template>
                            </template>
                        </template>
                    </div>
                </v-img>
            </v-col>
            <v-col cols="8" class="description">
                <v-card-title class="small-text omit">{{ data.metadata?.title.text }}</v-card-title>
                <template v-for="(row, index) in data.metadata?.metadata?.metadata_rows">
                    <template v-if="index === 0">
                        <template style="min-height: 0px;" v-for="part in row.metadata_parts"
                            :to="part.text?.endpoint?.metadata?.url">
                            <v-card-subtitle class="tiny-text">{{ part.text }}</v-card-subtitle>
                        </template>
                    </template>
                    <template v-else-if="index === 1">
                        <template style="min-height: 0px;" v-for="(part, INDEX) in row.metadata_parts"
                            :to="part.text?.endpoint?.metadata?.url">
                            <template v-if="INDEX === 0">
                                <v-card-subtitle class="tiny-text"
                                    style="display: inline-block; padding-right: 0">{{ part.text +
                                    '・'}}</v-card-subtitle>
                            </template>
                            <template v-else-if="INDEX === 1">
                                <v-card-subtitle class="tiny-text"
                                    style="display: inline-block; padding-right: 0; padding-left: 0;">{{ part.text }}</v-card-subtitle>
                            </template>
                        </template>
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

const getImageUrl = (content_image: YTNodes.CollectionThumbnailView | YTNodes.ThumbnailView | null): string => {
    if ((content_image instanceof YTNodes.CollectionThumbnailView)) {
        return content_image.primary_thumbnail?.image[0]?.url || '';
    } else if (content_image instanceof YTNodes.ThumbnailView) {
        return content_image.image[0]?.url || '';
    } else {
        return '';
    }

};
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
<template>
    <template v-if="data">
        <v-card>
            <template v-if="data.primary_info">
                <v-card-title class="titletext" style="padding-bottom: 0">{{ data.primary_info.title.text
                }}</v-card-title>
            </template>
            <v-card-actions>
                <v-row justify="space-between">
                    <v-col cols="auto">
                        <template v-if="data.secondary_info">
                            <v-list-item :to="data.secondary_info.owner?.author.endpoint?.metadata?.url" link>
                                <template v-slot:prepend>
                                    <v-avatar color="grey-darken-3" size="36"
                                        :image="getProxifiedUrl(data.secondary_info.owner?.author.thumbnails[0]?.url || '')"></v-avatar>

                                </template>

                                <v-list-item-title>{{ data.secondary_info.owner?.author.name
                                    }}</v-list-item-title>
                                <v-list-item-subtitle>{{ data.secondary_info.owner?.subscriber_count.text
                                    }}</v-list-item-subtitle>

                            </v-list-item>
                        </template>
                    </v-col>
                    <v-col cols="auto">
                        <v-list-item>
                            <v-slide-group>
                                <div>
                                    <v-btn :disabled="downloading" @click="$emit('downloadVideo')" variant="tonal"
                                        class="rounded-pill mx-2">
                                        <v-icon v-if="!downloading">mdi-download</v-icon>
                                        <v-progress-circular v-else indeterminate size="20"></v-progress-circular>
                                        Download
                                    </v-btn>
                                </div>
                                <template v-if="data.basic_info">
                                    <div>
                                        <v-btn variant="tonal" class="rounded-pill mx-2" readonly>
                                            <v-icon>mdi-thumb-up</v-icon>
                                            {{ data.basic_info.like_count }}
                                        </v-btn>
                                    </div>
                                </template>
                                <div>
                                    <v-btn @click.stop="$emit('share')" variant="tonal" class="rounded-pill mx-2">
                                        <v-icon>mdi-share</v-icon>
                                        Share
                                    </v-btn>
                                </div>
                            </v-slide-group>
                        </v-list-item>
                    </v-col>

                </v-row>
            </v-card-actions>
            <template v-if="data.primary_info">
                <v-card-subtitle v-if="!showFullDescription">{{ data.primary_info.relative_date?.text
                }}・{{
                        data.primary_info.view_count?.short_view_count?.text ||
                        data.primary_info.view_count?.view_count?.text
                    }}</v-card-subtitle>
                <v-card-subtitle v-else>{{ data.primary_info.published?.text }}・{{
                    data.primary_info.view_count?.view_count?.text
                }}</v-card-subtitle>
            </template>
            <template v-if="data.secondary_info">
                <v-card-text>
                    <div :class="{ 'line-clamp': !showFullDescription }">
                        <template v-for="result in data.secondary_info.description.runs">
                            <template v-if="(result instanceof Misc.TextRun)">
                                <template v-if="result.endpoint">
                                    <span style="white-space: pre-wrap; word-break: break-all;">
                                        <NuxtLink :to="result.endpoint?.metadata?.url">{{ result.text }}</NuxtLink>
                                    </span>
                                </template>
                                <template v-else>
                                    <span style="white-space: pre-wrap; word-break: break-all;">{{ result.text }}</span>
                                </template>
                            </template>
                            <template v-else-if="(result instanceof Misc.EmojiRun)">
                                <span style="white-space: pre-wrap; word-break: break-all;">{{ result.text }}</span>
                            </template>
                        </template>
                    </div>


                    <template v-if="showFullDescription" v-for="result in data.secondary_info.metadata?.rows">
                        <v-row style="margin: 0;">
                            <template v-if="(result instanceof Helpers.YTNode)">
                                <YTNode :data="result" />
                            </template>
                        </v-row>
                    </template>

                    <v-btn @click="$emit('toggleDescription')">
                        {{ showFullDescription ? data.secondary_info.show_less_text :
                            data.secondary_info.show_more_text }}
                    </v-btn>
                </v-card-text>
            </template>
        </v-card>
    </template>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">

import { YT, Misc, Helpers } from 'youtubei.js';

const props = defineProps({
    data: YT.VideoInfo,
    downloading: Boolean,
    showFullDescription: Boolean
});
</script>

<style scoped>
.video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    /* 16:9 aspect ratio */
    height: 0;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.titletext {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.scrollable-component {
    height: 500px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 16px;
}
</style>
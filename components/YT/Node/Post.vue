<template>
    <template v-if="data">
        <v-card elevation="16" style="max-height: 500px;" :to="data.endpoint?.metadata.url" link>

            <v-list-item>
                <v-row dense>
                    <v-col cols="auto">
                        <v-list-item :to="`/channel/${data.author.id}/featured`" style="padding: 0;">
                            <v-avatar :image="getProxifiedUrl(data.author.thumbnails[0]?.url)" class="mr-2"></v-avatar>
                        </v-list-item>
                    </v-col>
                    <v-col>
                        <v-card-subtitle style="white-space: pre-wrap; word-break: break-all;">{{ data.author.name }}・{{
                            data.published.text }}</v-card-subtitle>

                        <v-row>
                            <v-col cols="8">
                                <v-card-text>
                                    <template v-for="result in data?.content?.runs">
                                        <template v-if="(result instanceof Misc.TextRun)">
                                            <template v-if="result.endpoint">
                                                <span style="white-space: pre-wrap; word-break: break-all;">
                                                    <NuxtLink :to="result.endpoint.metadata.url">{{ result.text }}
                                                    </NuxtLink>
                                                </span>
                                            </template>
                                            <template v-else>
                                                <span style="white-space: pre-wrap; word-break: break-all;">{{
                                                    result.text
                                                }}</span>
                                            </template>
                                        </template>
                                        <template v-else-if="(result instanceof Misc.EmojiRun)">
                                            <span style="white-space: pre-wrap; word-break: break-all;">{{ result.text
                                            }}</span>
                                        </template>
                                    </template>
                                </v-card-text>
                            </v-col>
                            <v-col cols="4">
                                <template v-if="data.attachment">
                                    <YTNode :data="data.attachment" />
                                </template>
                            </v-col>
                        </v-row>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon class="me-1" icon="mdi-thumb-up"></v-icon>
                                <v-list-item-subtitle>{{ data.vote_count?.text }}</v-list-item-subtitle>
                            </template>
                        </v-list-item>
                    </v-col>
                </v-row>
            </v-list-item>
        </v-card>
    </template>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">

import { YTNodes, Misc } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.Post
});
</script>
<template>
    <v-list-item v-if="data">
        <v-row dense>
            <v-col cols="auto">
                <v-list-item :to="data.author?.endpoint?.metadata?.url" style="padding: 0;">
                    <v-avatar :image="getProxifiedUrl(data.author?.thumbnails[0].url || '')" class="mr-2"></v-avatar>
                </v-list-item>
            </v-col>
            <v-col>
                <v-card-subtitle style="white-space: pre-wrap; word-break: break-all;">{{ data.author?.name
                }}・{{ data.published_time }}</v-card-subtitle>
                <v-card-text>
                    <template v-if="(data.content instanceof Misc.Text)">
                        <YTMiscText :data="data.content" />
                    </template>
                </v-card-text>
                <v-card-actions style="padding: 0">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon class="me-1" icon="mdi-thumb-up"></v-icon>
                            <v-list-item-subtitle>{{ data.like_count }}</v-list-item-subtitle>
                        </template>
                    </v-list-item>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-list-item>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">

import { YTNodes, Misc } from 'youtubei.js';



const props = defineProps({
    data: YTNodes.CommentView
});

</script>

<style scoped>
.hover-blue:hover {
    color: #065fd4;
}
</style>
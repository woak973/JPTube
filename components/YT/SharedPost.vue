<template>
    <v-card v-if="data" elevation="16">

        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <v-list-item :to="`/channel/${data.author.id}/featured`" style="padding: 0;">
                        <v-avatar :image="getProxifiedUrl(data.thumbnail[0].url)" class="mr-2"></v-avatar>
                    </v-list-item>
                </v-col>
                <v-col>
                    <v-card-subtitle>{{ data.author.name }}・{{ data.published.text }}</v-card-subtitle>
                    <span style="white-space: pre-wrap; word-break: break-all;"><v-card-text>{{ data.content.text }}</v-card-text></span>
                </v-col>
            </v-row>
        </v-list-item>
        <YTNode v-if="data.original_post" :data="data.original_post"/>
    </v-card>
    <div v-else>
        データがありません
    </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.SharedPost
});
</script>
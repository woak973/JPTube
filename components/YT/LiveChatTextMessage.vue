<template>
    <v-card v-if="data" elevation="16">

        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <v-list-item :to="`/channel/${data.author.id}/featured`" style="padding: 0;">
                        <v-avatar :image="getProxifiedUrl(data.author.thumbnails[0].url)" class="mr-2"></v-avatar>
                    </v-list-item>
                </v-col>
                <v-col>
                    <v-card-text style="word-break: break-all;">{{ data.author.name }} - {{ data.message.text
                        }}</v-card-text>
                </v-col>
            </v-row>
        </v-list-item>
    </v-card>
    <div v-else>
        データがありません
    </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.LiveChatTextMessage
});
</script>
<template>
    <v-card v-if="data" elevation="16" :to="`/music/watch?v=${data.on_tap.payload.videoId}`" link>
        <v-row>
            <v-col cols="12" sm="4" class="d-flex align-center justify-center">
                <v-img :src="getProxifiedUrl(data.thumbnail?.contents[0]?.url || '')" aspect-ratio="16/9" rounded>
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                    </template>
                </v-img>
            </v-col>
            <v-col cols="12" sm="8">
                <v-card-title>{{ data.title.text }}</v-card-title>
                <v-card-subtitle>{{ data.subtitle.text }}</v-card-subtitle>
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
    data: YTNodes.MusicCardShelf
});
</script>

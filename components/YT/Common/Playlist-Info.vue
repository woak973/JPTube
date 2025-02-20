<template>
    <v-card v-if="data" elevation="16">
        <v-img :src="getProxifiedUrl(data.info.thumbnails[0]?.url)" aspect-ratio="16/9" rounded>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
        </v-img>

        <v-card-title>{{ data.info.title }}</v-card-title>
        <v-card-actions>
            <v-list-item :to="`/channel/${data.info.author.id}/featured`" link>
                <template v-slot:prepend>
                    <v-avatar :image="getProxifiedUrl(data.info.author?.thumbnails[0]?.url)" size="24"></v-avatar>
                </template>
                <v-list-item-title>{{ data.info.author.name }}</v-list-item-title>
            </v-list-item>
        </v-card-actions>
        <v-card-subtitle>{{ data.info.total_items }}・{{ data.info.views }}</v-card-subtitle>
        <v-card-text>{{ data.info.description }}</v-card-text>
        <v-btn :to="data?.endpoint?.metadata.url">Play All</v-btn>

    </v-card>
    <div v-else>
        データがありません
    </div>
</template>

<script setup lang="ts">
import { YT } from 'youtubei.js';

const props = defineProps({
    data: YT.Playlist
});
</script>

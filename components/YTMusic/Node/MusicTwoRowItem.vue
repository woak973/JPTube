<template>
    <v-card v-if="data" elevation="16" :to="getLink()" link>
        <v-img :src="getProxifiedUrl(data.thumbnail[0]?.url)" aspect-ratio="16/9" rounded>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
        </v-img>
        <v-card-text class="omit">{{ data.title.text }}</v-card-text>
        <v-card-subtitle>{{ data.subtitle.text }}</v-card-subtitle>
    </v-card>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.MusicTwoRowItem
});

const getLink = () => {
    if (props.data && props.data.item_type) {
        switch (props.data.item_type) {
            case 'playlist':
            case 'podcast_show':
                return `/music/playlist?list=${props.data.id}`;
            case 'album':
                return props.data ? `/music/album?id=${props.data.id}` : '';
            case 'artist':
            case 'library_artist':
                return props.data ? `/music/channel/${props.data.id}` : '';
            case 'video':
            case 'non_music_track':
            case 'song':
                return props.data ? `/music/watch?v=${props.data.id}` : '';
            default:
                return '/music';
        }
    } else {
        return '/music';
    }
};
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
</style>
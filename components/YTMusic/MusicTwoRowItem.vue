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
        データがありません
    </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.MusicTwoRowItem
});

const getLink = () => {
    if (props.data && props.data.item_type) {
        if (['playlist', 'podcast_show'].includes(props.data.item_type)) {
            return `/music/playlist?list=${props.data.id}`;
        } else if (['album'].includes(props.data.item_type)) {
            return props.data ? `/music/album?id=${props.data.id}` : '';
        } else if (['artist', 'library_artist'].includes(props.data.item_type)) {
            return props.data ? `/channel/${props.data.id}` : '';
        } else if (['video', 'non_music_track', 'song'].includes(props.data.item_type)) {
            return props.data ? `/music/watch?v=${props.data.id}` : '';
        } else {
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
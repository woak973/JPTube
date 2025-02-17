<template>
    <v-card v-if="data" elevation="16" :to="getLink()" link>
        <v-row>
            <v-col cols="4" class="d-flex align-center justify-center">
                <v-img :src="getProxifiedUrl(data.thumbnails[0]?.url)" max-width="50%">
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                    </template>
                </v-img>
            </v-col>
            <v-col cols="8">
                <v-card-title>{{ data.title }}</v-card-title>
                <v-card-actions>
                    <v-list-item
                        :to="`/music/channel/${data?.artists?.[0]?.channel_id || data?.authors?.[0]?.channel_id}`" link>
                        <v-list-item-title>{{ data?.artists?.[0]?.name || data?.authors?.[0]?.name
                            }}</v-list-item-title>
                    </v-list-item>
                </v-card-actions>
                <v-card-subtitle>{{ data?.flex_columns[1]?.title }}</v-card-subtitle>
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
    data: YTNodes.MusicResponsiveListItem,
    PLid: String
});

const getLink = () => {
    if (props.data && props.data.item_type) {
        if (['playlist', 'podcast_show'].includes(props.data.item_type)) {
            return `/music/playlist?list=${props.data.id}`;
        } else if (['album'].includes(props.data.item_type)) {
            return props.data ? `/music/album?id=${props.data.id}` : '';
        } else if (['artist', 'library_artist'].includes(props.data.item_type)) {
            return props.data ? `/music/channel/${props.data.id}` : '';
        } else if (['video', 'non_music_track', 'song'].includes(props.data.item_type)) {
            return props.data ? `/music/watch?v=${props.data.id}${props.PLid ? `&list=${props.PLid}` : ''}` : '';
        } else {
            return '/music';
        }
    } else {
        return '/music';
    }
};
</script>

<template>
    <template v-if="data">
        <!-- Unity Components -->
        <template v-if="data.type === 'MusicCardShelf'">
            <template v-if="attribute === 'slide'">
                <strong>{{ (data as YTNodes.MusicCardShelf).header?.title.text }}</strong>
                <YTMusicNodeMusicCardShelf :data="(data as YTNodes.MusicCardShelf)" :page="page" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <strong>{{ (data as YTNodes.MusicCardShelf).header?.title.text }}</strong>
                    <YTMusicNodeMusicCardShelf :data="(data as YTNodes.MusicCardShelf)" :page="page" />
                </v-col>
            </template>
        </template>

        <template v-if="data.type === 'MusicResponsiveListItem'">
            <template v-if="attribute === 'slide'">
                <YTMusicNodeMusicResponsiveListItem :data="(data as YTNodes.MusicResponsiveListItem)" :PLid="PLid"
                    :page="page" />
            </template>
            <template v-else>
                <v-col cols="12" :md="isMS && page === 'Channel' ? 6 : 12">
                    <YTMusicNodeMusicResponsiveListItem :data="(data as YTNodes.MusicResponsiveListItem)" :PLid="PLid"
                        :page="page" />
                </v-col>
            </template>
        </template>

        <template v-if="data.type === 'MusicTwoRowItem'">
            <template v-if="attribute === 'slide'">
                <YTMusicNodeMusicTwoRowItem :data="(data as YTNodes.MusicTwoRowItem)" :page="page" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTMusicNodeMusicTwoRowItem :data="(data as YTNodes.MusicTwoRowItem)" :page="page" />
                </v-col>
            </template>
        </template>

        <template v-if="data.type === 'PlaylistPanelVideo'">
            <template v-if="attribute === 'slide'">
                <YTMusicNodePlaylistPanelVideo :data="(data as YTNodes.PlaylistPanelVideo)" :page="page" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTMusicNodePlaylistPanelVideo :data="(data as YTNodes.PlaylistPanelVideo)" :page="page" />
                </v-col>
            </template>
        </template>

        <!-- Recursion Components -->

        <!-- Loop Components -->
        <template v-else-if="data.type === 'MusicCarouselShelf'">
            <v-col cols="12">
                <strong>{{ (data as YTNodes.MusicCarouselShelf)?.header?.title }}</strong>
                <v-slide-group>
                    <div v-for="content in (data as YTNodes.MusicCarouselShelf).contents" class="ma-2"
                        v-bind:style="{ width: (content instanceof YTNodes.MusicResponsiveListItem) ? '500px' : '200px' }">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTMusicNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'MusicShelf'">
            <v-col cols="12">
                <strong>{{ (data as YTNodes.MusicShelf).title.text }}</strong>
                <v-row style="margin-bottom: 0;">
                    <template v-for="content in (data as YTNodes.MusicShelf).contents">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTMusicNode :data="content" :attribute="attribute" :page="page" :isMS="true" />
                        </template>
                    </template>
                </v-row>
                <v-btn v-if="(data as YTNodes.MusicShelf).bottom_text && page === 'Search'"
                    @click="emit('fetchData', (data as YTNodes.MusicShelf).title.text)" variant="tonal"
                    class="rounded-pill mx-2">{{
                        (data as YTNodes.MusicShelf).bottom_text?.text
                    }}</v-btn>
            </v-col>
        </template>

    </template>
</template>

<script setup lang="ts">
import { Helpers, YTNodes } from 'youtubei.js';

const props = defineProps({
    data: Helpers.YTNode,
    attribute: String,
    page: String,
    isMS: Boolean,
    PLid: String

});

const emit = defineEmits(['fetchData']);
</script>
<script setup lang="ts">
import { Innertube, UniversalCache, Helpers, YTNodes, YTMusic } from 'youtubei.js';
import YTNode from '~/components/YT/YTNode.vue';

const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();
const playerStore = usePlayerStore();
const { share } = useShare();


const videoId = ref<string>(route.query.v as string);

const results = ref<YTMusic.TrackInfo>();
const Nextresults = ref<YTNodes.PlaylistPanel>();
const Lyricsresults = ref<YTNodes.MusicDescriptionShelf>();
const Relatedresults = ref<Helpers.ObservedArray<YTNodes.MusicCarouselShelf | YTNodes.MusicDescriptionShelf>>();
const Playlistresults = ref<YTNodes.MusicResponsiveListItem[]>([]);
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const fatalError = ref<boolean>(false);


const downloading = ref<boolean>(false);
const child = ref<{ seek: (seconds: number) => void; destroyPlayer?: () => Promise<void> } | null>(null);

const tab = ref<string>('option-2');
const PLBtn = ref<boolean>(false);

watch(results, (newVal): void => {
    if (newVal) {
        useHead({
            title: `${newVal.basic_info.title} - JPTube Music` || "Watch - JPTube Music"
        });
    }
});

definePageMeta({
    layout: "music"
});

watch(() => route.query.v, async (newVideoId, oldVideoId): Promise<void> => {

    if (playerStore.player === 'shaka-player' && newVideoId !== oldVideoId) {
        const playerComponent = child.value;
        if (playerComponent && playerComponent.destroyPlayer) {
            await playerComponent.destroyPlayer();
        }
    }
    videoId.value = newVideoId as string;
    window.scrollTo(0, 0);
    await fetchData();

});

onBeforeRouteUpdate(async (to, from, next): Promise<void> => {
    if (playerStore.player === 'shaka-player' && to.query.v !== from.query.v) {
        const playerComponent = child.value;
        if (playerComponent && playerComponent.destroyPlayer) {
            await playerComponent.destroyPlayer();
        }
    }
    next();
});

onBeforeRouteLeave(async (to, from, next): Promise<void> => {
    if (playerStore.player === 'shaka-player') {
        const playerComponent = child.value;
        if (playerComponent && playerComponent.destroyPlayer) {
            await playerComponent.destroyPlayer();
        }
    }
    next();
});


const handleError = (message: string): void => {
    alert.value = true;
    errorMessage.value = message;
};

const downloadVideo = async (): Promise<void> => {
    downloading.value = true;
    try {
        const DLlang = langStore.lang || 'ja';
        const DLlocation = locationStore.location || 'JP';
        const DLyt = await Innertube.create({
            fetch: PlayerfetchFn,
            cache: new UniversalCache(false),
            lang: DLlang,
            location: DLlocation
        });
        const DLResults = await DLyt.getInfo(route.query.v as string);
        const stream = await DLResults.download();
        const reader = stream.getReader();
        const chunks = [];
        let receivedLength = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
        }

        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'videoplayback.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        alert.value = true;
        if (error instanceof Error) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = 'An unknown error occurred';
        }
    } finally {
        downloading.value = false;
    }
};


const fetchData = async (): Promise<void> => {
    try {
        const lang = langStore.lang || 'ja';
        const location = locationStore.location || 'JP';
        const yt = await Innertube.create({
            fetch: fetchFn,
            cache: new UniversalCache(false),
            lang: lang,
            location: location
        });

        const ytmusic = await yt.music;

        let searchResults: YTMusic.TrackInfo;


        if (route.query.list) {
            let PLvideoId: string = '';
            const PL = await ytmusic.getPlaylist(route.query.list as string);
            if (PL.items) {
                let PLcontents = PL;
                let flag = false;

                while (!flag) {
                    PLcontents.items.forEach((video) => {
                        if (video instanceof YTNodes.MusicResponsiveListItem) {
                            if (typeof video.id === 'string' && route.query.v === video.id) {
                                PLvideoId = video.id;
                                flag = true;
                            }
                            Playlistresults.value.push(video);
                        }
                    });

                    if (!flag && await PLcontents.has_continuation) {
                        const ContPL = await PLcontents.getContinuation();
                        PLcontents = await ContPL;
                    } else {
                        break;
                    }
                }

                if (PLvideoId === '') {
                    if ((PL.items[0] instanceof YTNodes.MusicResponsiveListItem)) {
                        PLvideoId = PL.items[0].id as string;
                    }
                }


            } else {
                throw new Error('No Contents Found');
            }
            PLBtn.value = true;

            videoId.value = PLvideoId;
            searchResults = await ytmusic.getInfo(PLvideoId);
        } else {
            PLBtn.value = false;
            searchResults = await ytmusic.getInfo(route.query.v as string);
        }



        results.value = searchResults;
        Nextresults.value = await searchResults?.getUpNext();
        Relatedresults.value = await searchResults?.getRelated();

        try {
            Lyricsresults.value = await searchResults?.getLyrics();
        } catch (error) {
            console.error(error);
            Lyricsresults.value = undefined;
        }



        fatalError.value = false;
    } catch (error) {
        alert.value = true;
        fatalError.value = true;
        if (error instanceof Error) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = 'An unknown error occurred';
        }
    }
};

await fetchData();
</script>
<template>
    <v-container :fluid="true">
        <div>
            <v-dialog v-model="alert" max-width="500">
                <v-card>
                    <v-card-title class="headline">Warning</v-card-title>
                    <v-card-text>{{ errorMessage }}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="alert = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <v-row wrap v-if="!fatalError">
            <v-col cols="12" md="8">
                <div v-if="playerStore.player !== 'shaka-player'" class="video-container">
                    <iframe
                        :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&enablejsapi=1`"
                        id="youtubeiframechild" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>

                <YTCommonPlayer v-else ref="child" :videoId="videoId" :key="videoId" @errors="handleError" />

                <YTMusicCommonTrackInfo :data="results" :downloading="downloading" @downloadVideo="downloadVideo"
                    @share="share" />
            </v-col>
            <v-col cols="12" md="4">
                <v-tabs v-model="tab">
                    <v-tab v-if="PLBtn" value="option-1">Playlist</v-tab>
                    <v-tab value="option-2">Next</v-tab>
                    <v-tab value="option-3">Lyrics</v-tab>
                    <v-tab value="option-4">Related</v-tab>
                </v-tabs>

                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="option-1">
                        <template v-if="Playlistresults">
                            <div class="scrollable-component">
                                <v-row style="width: 100%; margin-left: 0;">
                                    <template v-for="result in Playlistresults">
                                        <v-col v-if="(result instanceof YTNodes.MusicResponsiveListItem)" cols="12">
                                            <YTMusicCommonMusicResponsiveListItem :data="result"
                                                :PLid="(route.query.list as string)" />
                                        </v-col>
                                    </template>
                                </v-row>
                            </div>
                        </template>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="option-2">
                        <template v-if="Nextresults">
                            <v-row style="width: 100%; margin-left: 0;">
                                <template v-for="result in Nextresults.contents">
                                    <v-col v-if="(result instanceof YTNodes.PlaylistPanelVideo)" cols="12">
                                        <YTMusicCommonPlaylistPanelVideo :data="result" />
                                    </v-col>
                                </template>
                            </v-row>
                        </template>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="option-3">
                        <template v-if="Lyricsresults">
                            <v-card>
                                <v-card-text>{{ Lyricsresults.description.text }}</v-card-text>
                            </v-card>
                        </template>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="option-4">
                        <template v-if="Relatedresults">
                            <template v-for="result in Relatedresults">
                                <template v-if="(result instanceof YTNodes.MusicCarouselShelf)">
                                    <v-row style="width: 100%; margin-left: 0;">
                                        <template v-for="content in result.contents">
                                            <v-col v-if="(content instanceof YTNodes.MusicResponsiveListItem)"
                                                cols="12">
                                                <YTMusicCommonMusicResponsiveListItem :data="content" />
                                            </v-col>
                                        </template>
                                    </v-row>
                                </template>
                            </template>
                        </template>
                    </v-tabs-window-item>
                </v-tabs-window>

            </v-col>
        </v-row>

    </v-container>
</template>
<style scoped>
.video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    /* 16:9 aspect ratio */
    height: 0;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.titletext {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.scrollable-component {
    height: 500px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 16px;
}
</style>
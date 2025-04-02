<script setup lang="ts">
import { Innertube, UniversalCache, Helpers, YTNodes, YTKids, Types } from 'youtubei.js';

const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();
const playerStore = usePlayerStore();
const autoplayStore = useAutoPlayStore();
const { share } = useShare();


const videoId = ref<string>(route.query.v as string);

const results = ref<YTKids.VideoInfo>();
const Relatedresults = ref<Helpers.ObservedArray<Helpers.YTNode> | undefined>();

const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const fatalError = ref<boolean>(false);


const downloading = ref<boolean>(false);

watch(results, (newVal): void => {
    if (newVal) {
        useHead({
            title: `${newVal.basic_info.title} - JPTube Kids` || "Watch - JPTube Kids"
        });
    }
});

definePageMeta({
    layout: "kids"
});

watch(() => route.query.v, async (newVideoId): Promise<void> => {
    videoId.value = newVideoId as string;
    window.scrollTo(0, 0);
    await fetchData();

});




const handleError = (message: string): void => {
    alert.value = true;
    errorMessage.value = message;
};

const AutoPlay = () => {
    if (autoplayStore.autoplay) {
        if (Relatedresults.value && Relatedresults.value.length > 0) {
            const firstVideo = Relatedresults.value[0];
            if (firstVideo instanceof YTNodes.CompactVideo) {
                const videoId = firstVideo.video_id;
                if (videoId) {
                    const router = useRouter();
                    router.push({ query: { ...route.query, v: videoId } });
                }
            } else {
                console.error('AutoPlay has been cancelled.');
            }
        } else {
            console.error('RelatedVideos is empty or undefined.');
        }
    }
};

const downloadVideo = async (): Promise<void> => {
    downloading.value = true;
    try {
        const DLlang = langStore.lang || 'en';
        const DLlocation = locationStore.location || 'US';
        const DLyt = await Innertube.create({
            fetch: PlayerfetchFn,
            cache: new UniversalCache(false),
            lang: DLlang,
            location: DLlocation
        });
        const DLResults = await DLyt.getInfo(route.query.v as string);
        const DLOption: Types.DownloadOptions = { quality: 'best' }
        const stream = await DLResults.download(DLOption);
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
        const lang = langStore.lang || 'en';
        const location = locationStore.location || 'US';
        const yt = await Innertube.create({
            fetch: fetchFn,
            cache: new UniversalCache(false),
            lang: lang,
            location: location
        });

        const ytkids = await yt.kids;

        const searchResults = await ytkids.getInfo(videoId.value);

        results.value = searchResults;
        Relatedresults.value = await searchResults.watch_next_feed
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
                <div v-if="playerStore.player === 'embed'" class="video-container">
                    <iframe
                        :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&enablejsapi=1`"
                        id="youtubeiframechild" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>

                <YTCommonPlayer v-else-if="playerStore.player === 'shaka-player'" ref="child" :videoId="videoId"
                    :key="videoId" @errors="handleError" @complete="AutoPlay"/>

                <YTCommonVideoJS v-else-if="playerStore.player === 'VideoJS'" ref="child" :videoId="videoId"
                    :key="videoId + 'JS'" @errors="handleError" />

                <YTKidsCommonVideoInfo :data="results" :downloading="downloading" @downloadVideo="downloadVideo"
                    @share="share" />

            </v-col>
            <v-col cols="12" md="4">
                <v-row>
                    <v-col cols="12" v-for="result in Relatedresults">
                        <YTKidsNode :data="result" />
                    </v-col>
                </v-row>
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
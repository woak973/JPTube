<script setup lang="ts">
import { Innertube, UniversalCache, Helpers, YTNodes, YTMusic } from 'youtubei.js';

const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<YTNodes.MusicCarouselShelf | YTNodes.MusicShelf>>();
const HeaderResults = ref<YTNodes.MusicHeader | YTNodes.MusicImmersiveHeader | YTNodes.MusicVisualHeader | undefined>();
let sourceresults: YTMusic.Artist;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

watch(HeaderResults, (newVal): void => {
    if (newVal) {
        useHead({
            title: `${newVal?.title?.text} - JPTube Music` || "Channel - JPTube Music"
        });
    }
});

definePageMeta({
    layout: "music"
});


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

        const searchResults = await ytmusic.getArtist(route.params.id as string);
        sourceresults = searchResults;


        results.value = await searchResults?.sections;
        HeaderResults.value = searchResults.header;


    } catch (error) {
        alert.value = true;
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
    <v-container>
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

        <template v-if="HeaderResults">
            <template v-if="(HeaderResults instanceof YTNodes.MusicImmersiveHeader)">
                <YTMusicCommonMusicImmersiveHeader :data="HeaderResults" />
            </template>
            <template v-else-if="(HeaderResults instanceof YTNodes.MusicVisualHeader)">
                <YTMusicCommonMusicVisualHeader :data="HeaderResults" />
            </template>
        </template>

        <v-row>
            <template v-for="result in results">
                <YTMusicNode :data="result" :page="'Channel'"/>
            </template>
        </v-row>
    </v-container>
</template>
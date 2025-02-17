<script setup lang="ts">
import { Innertube, UniversalCache, Helpers, YTNodes, YTMusic } from 'youtubei.js';

const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<YTNodes.MusicCarouselShelf | YTNodes.MusicShelf>>();
const Headerresults = ref<YTNodes.MusicHeader | YTNodes.MusicImmersiveHeader | YTNodes.MusicVisualHeader | undefined>();
let sourceresults: YTMusic.Artist;
const alert = ref(false);
const errorMessage = ref<string>('');
const isEnd = ref(false);

watch(Headerresults, (newVal) => {
    if (newVal) {
        useHead({
            title: `${newVal?.title?.text} - JPTube Music` || "Channel - JPTube Music"
        });
    }
});

definePageMeta({
    layout: "music"
});


const fetchData = async () => {
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
        Headerresults.value = searchResults.header;


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

        <template v-if="Headerresults">
            <template v-if="(Headerresults instanceof YTNodes.MusicImmersiveHeader)">
                <MusicImmersiveHeader :data="Headerresults" />
            </template>
            <template v-else-if="(Headerresults instanceof YTNodes.MusicVisualHeader)">
                <MusicVisualHeader :data="Headerresults" />
            </template>
        </template>

        <v-row>
            <template v-for="result in results">
                <v-col v-if="(result instanceof YTNodes.MusicCarouselShelf)" cols="12">
                    <strong>{{ result?.header?.title }}</strong>
                    <v-slide-group>
                        <v-slide-item v-for="content in result.contents" class="ma-2"
                            v-bind:style="{ width: (content instanceof YTNodes.MusicResponsiveListItem) ? '500px' : '200px' }">
                            <template v-if="(content instanceof YTNodes.MusicResponsiveListItem)">
                                <MusicResponsiveListItem :data="content" />
                            </template>
                            <template v-else-if="(content instanceof YTNodes.MusicTwoRowItem)">
                                <MusicTwoRowItem :data="content" />
                            </template>
                        </v-slide-item>
                    </v-slide-group>
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>
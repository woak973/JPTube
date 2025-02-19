<script setup lang="ts">
import { Innertube, UniversalCache, Helpers, YTNodes, YTMusic } from 'youtubei.js';

const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<YTNodes.MusicCarouselShelf> | undefined>();
let sourceresults: YTMusic.Explore;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
    title: "Explore - JPTube Music"
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

        const searchResults = await ytmusic.getExplore();
        sourceresults = searchResults;


        results.value = await searchResults?.sections;


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

        <v-row>
            <template v-for="result in results">
                <v-col v-if="(result instanceof YTNodes.MusicCarouselShelf)" cols="12">
                    <strong>{{ result?.header?.title }}</strong>
                    <v-slide-group>
                        <div v-for="content in result.contents" class="ma-2"
                            v-bind:style="{ width: (content instanceof YTNodes.MusicResponsiveListItem) ? '500px' : '200px' }">
                            <template v-if="(content instanceof YTNodes.MusicResponsiveListItem)">
                                <MusicResponsiveListItem :data="content" />
                            </template>
                            <template v-else-if="(content instanceof YTNodes.MusicTwoRowItem)">
                                <MusicTwoRowItem :data="content" />
                            </template>
                        </div>
                    </v-slide-group>
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>
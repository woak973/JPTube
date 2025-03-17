<script setup lang="ts">
import { Innertube, UniversalCache, Helpers, YTNodes, YTMusic } from 'youtubei.js';

const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<YTNodes.MusicCarouselShelf | YTNodes.MusicTastebuilderShelf> | undefined>();
let sourceresults: YTMusic.HomeFeed;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
    title: "Home - JPTube Music"
});

definePageMeta({
    layout: "music"
});

const LoadMore = async ({ done }: any): Promise<void> => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            console.dir(continuationResults, { depth: null });
            if (continuationResults?.sections && results.value) {
                results.value.push(...continuationResults.sections);
            }
            sourceresults = continuationResults;
            done('ok');
        } else {
            done('empty');

        }
    } catch (error) {
        alert.value = true;
        if (error instanceof Error) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = 'An unknown error occurred';
        }
        done('error');
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

        const searchResults = await ytmusic.getHomeFeed();
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

        <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="results && results.length">
            <v-row style="width: 100%; margin-left: 0;">
                <template v-for="result in results">
                    <YTMusicNode :data="result" />
                </template>
            </v-row>
        </v-infinite-scroll>
    </v-container>
</template>
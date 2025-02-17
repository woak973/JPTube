<script setup lang="ts">
import { Innertube, UniversalCache, Mixins, APIResponseTypes, YTMusic } from 'youtubei.js';

const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref();
let sourceresults: YTMusic.HomeFeed;
const alert = ref(false);
const errorMessage = ref('');
const isEnd = ref(false);

useHead({
    title: "Home - JPTube Music"
});

const LoadMore = async ({ done }: any) => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            console.dir(continuationResults, { depth: null });
            if (continuationResults?.sections) {
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
            <v-row>
                <template v-for="result in results" :key="result.id">
                    <v-col v-if="result.type === 'MusicCarouselShelf'" cols="12">
                        <strong>{{ result.header.title }}</strong>
                        <v-slide-group>
                            <v-slide-item v-for="content in result.contents" :key="content.id" class="ma-2"
                                v-bind:style="{ width: content.type === 'MusicResponsiveListItem' ? '500px' : '200px' }">
                                <template v-if="content.type === 'MusicResponsiveListItem'">
                                    <MusicResponsiveListItem :data="content" />
                                </template>
                                <template v-else-if="content.type === 'MusicTwoRowItem'">
                                    <MusicTwoRowItem :data="content" />
                                </template>
                            </v-slide-item>
                        </v-slide-group>
                    </v-col>
                </template>
            </v-row>
        </v-infinite-scroll>
    </v-container>
</template>
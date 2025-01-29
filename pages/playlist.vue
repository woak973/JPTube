<script setup lang="ts">
import { Innertube, UniversalCache, YT, YTNodes } from 'youtubei.js';


const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref();
const Headerresults = ref();
let sourceresults: YT.Playlist;
const alert = ref(false);
const errorMessage = ref('');

watch(Headerresults, (newVal: YT.Playlist) => {
    if (newVal) {
        useHead({
            title: `${newVal.info.title} - JPTube` || "Playlist - JPTube"
        });
    }
});

try {
    const lang = langStore.lang || 'ja';
    const location = locationStore.location || 'JP';
    const yt = await Innertube.create({
        fetch: fetchFn,
        cache: new UniversalCache(false),
        lang: lang,
        location: location
    });

    const searchResults: YT.Playlist = await yt.getPlaylist(route.query.list as string);
    sourceresults = searchResults;
    Headerresults.value = searchResults;
    if (searchResults.page_contents instanceof YTNodes.SectionList) {
        results.value = await searchResults.items;
    } else {
        throw new Error('No Contents Found');
    }
} catch (error) {
    alert.value = true;
    if (error instanceof Error) {
        errorMessage.value = error.message;
    } else {
        errorMessage.value = 'An unknown error occurred';
    }
}

const LoadMore = async ({ done }: any) => {
    console.log(sourceresults.has_continuation)
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            results.value.push(...await continuationResults.items);
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
            <v-col cols="12" md="2">
                <template v-if="Headerresults">
                    <Playlistinfo :data="Headerresults" />
                </template>

            </v-col>

            <v-col cols="12" md="10">
                <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="results && results.length">
                    <v-row style="width: 100%; margin-left: 0;">
                        <template v-for="result in results" :key="result.id">
                            <template v-if="result.type === 'PlaylistVideo'">
                                <v-col cols="12">
                                    <PlaylistVideo :data="result" />
                                </v-col>
                            </template>
                        </template>
                    </v-row>
                </v-infinite-scroll>
            </v-col>
        </v-row>
    </v-container>
</template>
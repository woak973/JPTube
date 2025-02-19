<script setup lang="ts">
import { Innertube, UniversalCache, YT, Mixins, Helpers, YTNodes } from 'youtubei.js';


const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<Helpers.YTNode>>();
const HeaderResults = ref<YT.HashtagFeed>();
let sourceresults: YT.HashtagFeed | Mixins.Feed;
const alert = ref(false);
const errorMessage = ref<string>('');

useHead({
    title: `${route.params.q as string} - JPTube` || "HashTag - JPTube"
})





const LoadMore = async ({ done }: any) => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            if (results.value) {
                results.value.push(...await continuationResults.videos);
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

        const searchResults: YT.HashtagFeed = await yt.getHashtag(route.params.q as string);
        sourceresults = searchResults;
        HeaderResults.value = searchResults;
        results.value = await searchResults.contents.contents;


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
        <template v-if="HeaderResults && HeaderResults.header">
            <template v-if="(HeaderResults.header instanceof YTNodes.PageHeader)">
                <PageHeader :data="HeaderResults.header"/>
            </template>
        </template>


        <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="results && results.length">
            <v-row style="width: 100%; margin-left: 0;">
                <template v-for="result in results">
                    <template v-if="(result instanceof Helpers.YTNode)">
                        <YTNode :data="result" />
                    </template>
                </template>
            </v-row>
        </v-infinite-scroll>
    </v-container>
</template>
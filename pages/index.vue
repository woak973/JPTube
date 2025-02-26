<script setup lang="ts">
import { Innertube, UniversalCache, Mixins, APIResponseTypes, Helpers, YTNodes, ReloadContinuationItemsCommand } from 'youtubei.js';

const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Array<YTNodes.SectionList | YTNodes.MusicQueue | YTNodes.RichGrid | ReloadContinuationItemsCommand>>();
let sourceresults: Mixins.Feed<APIResponseTypes.IBrowseResponse>;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const TitleResult = ref<Mixins.TabbedFeed<APIResponseTypes.IBrowseResponse>>();
const StrongResult = ref<string>();

useHead({
    title: "Home - JPTube"
});

const LoadMore = async ({ done }: any) => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults: Mixins.Feed<APIResponseTypes.IBrowseResponse> = await sourceresults.getContinuation();
            if (continuationResults.page_contents) {
                if (results.value) {
                    results.value.push(continuationResults.page_contents);
                }
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

        const searchResults = await yt.getTrending();
        TitleResult.value = searchResults;
        StrongResult.value = await searchResults.title;


        results.value = await [searchResults.page_contents];
        sourceresults = searchResults;


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

        <template v-if="StrongResult">
            <v-card>
                <v-card-title>{{ StrongResult }}</v-card-title>
            </v-card>
        </template>

        <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="results">
            <template v-for="result in results">
                <template v-if="(result instanceof Helpers.YTNode)">
                    <YTNode :data="result" />
                </template>
            </template>
        </v-infinite-scroll>
    </v-container>
</template>
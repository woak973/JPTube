<script setup lang="ts">
import { Innertube, UniversalCache, Mixins, APIResponseTypes, Helpers, YTNodes } from 'youtubei.js';

const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<YTNodes.Video | YTNodes.CompactVideo | YTNodes.GridVideo | YTNodes.PlaylistPanelVideo | YTNodes.PlaylistVideo | YTNodes.ReelItem | YTNodes.ShortsLockupView | YTNodes.WatchCardCompactVideo>>();
const alert = ref(false);
const errorMessage = ref<string>('');
const TitleResult = ref<Mixins.TabbedFeed<APIResponseTypes.IBrowseResponse>>();
const StrongResult = ref<string>();

watch(TitleResult, (newVal) => {
    if (newVal) {
        useHead({
            title: "Home - JPTube"
        });
    }
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

        const searchResults = await yt.getTrending();
        TitleResult.value = searchResults;
        StrongResult.value = await searchResults.title;


        results.value = await searchResults.videos;


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
            <strong>{{ StrongResult }}</strong>
        </template>

        <v-row>
            <template v-for="result in results">
                <v-col v-if="result.type === 'Video'" cols="12" md="3" lg="2" sm="6">
                    <template v-if="(result instanceof YTNodes.Video)">
                        <HomeFeed :data="result" />
                    </template>
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>
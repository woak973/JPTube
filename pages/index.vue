<script setup lang="ts">
import { Innertube, UniversalCache, Mixins, APIResponseTypes } from 'youtubei.js';

const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref();
const alert = ref(false);
const errorMessage = ref('');
const isEnd = ref(false);
const TitleResult = ref();
const StrongResult = ref();

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

        const searchResults: Mixins.TabbedFeed<APIResponseTypes.IBrowseResponse> = await yt.getTrending();
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
            <template v-for="result in results" :key="result.id">
                <v-col v-if="result.type === 'Video'" cols="12" md="3" lg="2" sm="6">
                    <template v-if="result.type === 'Video'">
                        <HomeFeed :data="result" />
                    </template>
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>
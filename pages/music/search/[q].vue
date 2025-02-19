<script setup lang="ts">
import { Innertube, UniversalCache, Helpers, YTNodes, YTMusic } from 'youtubei.js';
import MusicCardShelf from '~/components/YTMusic/MusicCardShelf.vue';

const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<YTNodes.MusicShelf | YTNodes.MusicCardShelf | YTNodes.ItemSection>>();
const Headerresults = ref<YTNodes.ChipCloud | undefined>();

let sourceresults: YTMusic.Search;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
    title: `${route.params.q as string} - JPTube Music` || "Search - JPTube Music"
})

definePageMeta({
    layout: "music"
});




const fetchData = async (filter?: string): Promise<void> => {
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

        let searchResults = await ytmusic.search(route.params.q as string);
        if (filter && filter !== "N/A") {
            searchResults = await searchResults.applyFilter(filter);
        }
        if (filter) {
            window.scrollTo(0, 0);
        }
        sourceresults = searchResults;


        results.value = await searchResults.contents;
        Headerresults.value = await searchResults.header;


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
            <v-chip-group>
                <v-chip v-for="chip in Headerresults?.chips" :key="chip.text" :text="chip.text"
                    @click="fetchData(chip.text)">

                </v-chip>
            </v-chip-group>

            <template v-for="result in results">
                <v-col v-if="(result instanceof YTNodes.MusicShelf)" cols="12">
                    <strong>{{ result.title.text }}</strong>
                    <v-row>
                        <template v-for="content in result.contents">
                            <v-col cols="12" v-if="(content instanceof YTNodes.MusicResponsiveListItem)">
                                <MusicResponsiveListItem :data="content" />
                            </v-col>
                        </template>
                    </v-row>
                    <v-btn @click="fetchData(result.title.text)" variant="tonal" class="rounded-pill mx-2">{{
                        result.bottom_text?.text
                        }}</v-btn>
                </v-col>
                <v-col v-else-if="(result instanceof YTNodes.MusicCardShelf)" cols="12">
                    <strong>{{ result.header?.title.text }}</strong>
                    <MusicCardShelf :data="result" />
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>
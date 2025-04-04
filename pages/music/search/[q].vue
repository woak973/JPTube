<script setup lang="ts">
import { Helpers, YTNodes, YTMusic } from 'youtubei.js';

const route = useRoute();

const results = ref<Helpers.ObservedArray<YTNodes.MusicShelf | YTNodes.MusicCardShelf | YTNodes.ItemSection>>();
const HeaderResults = ref<YTNodes.ChipCloud | undefined>();

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
        const yt = await useInnertube('common');

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
        HeaderResults.value = await searchResults.header;


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
                <v-chip v-for="chip in HeaderResults?.chips" :key="chip.text" :text="chip.text"
                    @click="fetchData(chip.text)">
                </v-chip>
            </v-chip-group>

            <template v-for="result in results">
                <YTMusicNode :data="result" @fetchData="fetchData" :page="'Search'" />
            </template>
        </v-row>
    </v-container>
</template>
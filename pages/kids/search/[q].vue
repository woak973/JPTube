<script setup lang="ts">
import { Helpers, YTKids } from 'youtubei.js';

const route = useRoute();


const results = ref<Helpers.ObservedArray<Helpers.YTNode> | null>();
let sourceresults: YTKids.Search;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
    title: `${route.params.q as string} - JPTube Kids` || "Search - JPTube Kids"
})

definePageMeta({
    layout: "kids"
});

const fetchData = async (): Promise<void> => {
    try {
        const yt = await useInnertube('common');

        const ytkids = await yt.kids;

        const searchResults = await ytkids.search(route.params.q as string);
        sourceresults = searchResults;


        results.value = await searchResults.contents;


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

        <v-row style="width: 100%; margin-left: 0;">
            <template v-for="result in results">
                <YTKidsNode :data="result" />
            </template>
        </v-row>
    </v-container>
</template>
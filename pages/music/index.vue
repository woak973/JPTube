<script setup lang="ts">
import { Innertube, UniversalCache, Mixins, APIResponseTypes } from 'youtubei.js';

const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref();
const alert = ref(false);
const errorMessage = ref('');
const isEnd = ref(false);

useHead({
    title: "Home - JPTube Music"
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

        const ytmusic = await yt.music;

        const searchResults = await ytmusic.getHomeFeed();


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


        <v-row>
            <template v-for="result in results" :key="result.id">
                <v-col v-if="result.type === 'MusicCarouselShelf'" cols="12">
                    <template v-for="content in result.contents" :key="content.id">
                        <v-row>
                            <template v-if="content.type === 'MusicResponsiveListItem'">
                                <v-col cols="4">
                                    <MusicResponsiveListItem :data="content" />
                                </v-col>
                            </template>
                        </v-row>
                    </template>
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>
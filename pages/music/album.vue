<script setup lang="ts">
import { Innertube, UniversalCache, YTMusic, YTNodes, Helpers } from 'youtubei.js';


const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<YTNodes.MusicResponsiveListItem>>();
const HeaderResults = ref<YTNodes.MusicResponsiveHeader | YTNodes.MusicDetailHeader | undefined>();
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

watch(HeaderResults, (newVal): void => {
    if (newVal) {
        useHead({
            title: `${newVal.title.text} - JPTube Music` || "Album - JPTube Music"
        });
    }
});

definePageMeta({
    layout: "music"
});



const fetchData = async (): Promise<void> => {
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

        const searchResults: YTMusic.Album = await ytmusic.getAlbum(route.query.id as string);
        HeaderResults.value = searchResults.header;
        if (searchResults.contents) {
            results.value = await searchResults.contents;
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
            <v-col cols="12" md="2">
                <template v-if="HeaderResults">
                    <template v-if="(HeaderResults instanceof YTNodes.MusicResponsiveHeader)">
                        <YTMusicCommonMusicResponsiveHeader :data="HeaderResults" />
                    </template>
                </template>

            </v-col>

            <v-col cols="12" md="10">
                <v-row style="width: 100%; margin-left: 0;">
                    <template v-for="result in results" :key="result.id">
                        <YTMusicNode :data="result" />
                    </template>
                </v-row>

            </v-col>
        </v-row>
    </v-container>
</template>
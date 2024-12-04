<script setup lang="ts">
import { ref } from 'vue';
import { Innertube, UniversalCache } from 'youtubei.js';
import { fetchFn } from '@/composables/useYouTube';
import HomeFeedComponent from '~/components/homefeed.vue';

const route = useRoute();
const results = ref();
const alert = ref(false);
const errorMessage = ref('');
const Fulfill = ref(false);
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
const snackbar = ref(false);

try {
    const lang = route.query.lang as string || 'ja';
    const location = route.query.location as string || 'JP';
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
} finally {
    Fulfill.value = true;
}

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

            <v-snackbar v-model="snackbar" :timeout="4000">
                No more Results
            </v-snackbar>
        </div>

        <template v-if="StrongResult">
            <strong>{{ StrongResult }}</strong>
        </template>
        
        <v-row>
            <template v-for="result in results" :key="result.id">
                <v-col v-if="result.type === 'Video'" cols="12" md="3" lg="2" sm="6">
                    <template v-if="result.type === 'Video'">
                        <HomeFeedComponent :data="result" />
                    </template>
                </v-col>
            </template>
        </v-row>
        <div class="text-center">
            <v-progress-circular color="primary" :size="70" :width="7" indeterminate
                v-if="!Fulfill && !isEnd"></v-progress-circular>
        </div>
    </v-container>
</template>
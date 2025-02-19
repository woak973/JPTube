<script setup lang="ts">
import { Innertube, UniversalCache, YT, Types, Helpers } from 'youtubei.js';

const route = useRoute();
const router = useRouter();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref();
let sourceresults: YT.Search;
const alert = ref(false);
const errorMessage = ref('');
const filterDialog = ref(false);
const uploadDateOptions = ['all', 'hour', 'today', 'week', 'month', 'year'];
const durationOptions = ['all', 'short', 'medium', 'long'];
const sortOptions = ['relevance', 'rating', 'upload_date', 'view_count'];
const typeOptions = ['all', 'video', 'channel', 'playlist', 'movie'];
const featureOptions = ['hd', 'subtitles', 'creative_commons', '3d', 'live', 'purchased', '4k', '360', 'location', 'hdr', 'vr180'];
const applyFilters: any = () => {
    const query = {
        ...route.query,
        upload_date: selectedFilter.value.upload_date,
        duration: selectedFilter.value.duration,
        sort: selectedFilter.value.sort_by,
        type: selectedFilter.value.type,
        features: selectedFilter.value.features
    };
    router.replace({ query }).then(() => {
        location.reload();
    });
    filterDialog.value = false;
};

const selectedFilter = ref({
    upload_date: route.query.upload_date || 'all',
    duration: route.query.duration || 'all',
    sort_by: route.query.sort || 'relevance',
    type: route.query.type || 'all',
    features: route.query.features || ''
});

useHead({
    title: `${route.params.q as string} - JPTube` || "Search - JPTube"
})




const LoadMore = async ({ done }: any) => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            results.value.push(...continuationResults.results);
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

        const sortData = route.query.sort as Types.SortBy || 'relevance';
        const durationData = route.query.duration as Types.Duration || 'all';
        const uploadDateData = route.query.upload_date as Types.UploadDate || 'all';
        const typeData = route.query.type as Types.SearchType || 'all';
        const featureData = route.query.features as Types.Feature[] || '';

        let filter: Types.SearchFilters = {
            upload_date: uploadDateData,
            duration: durationData,
            sort_by: sortData,
            type: typeData
        };

        if (featureData) {
            filter.features = featureData;
        }

        const yt = await Innertube.create({
            fetch: fetchFn,
            cache: new UniversalCache(false),
            lang: lang,
            location: location
        });
        const searchResults: YT.Search = await yt.search(route.params.q as string, filter as Types.SearchFilters);
        results.value = searchResults.results;
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
        <v-btn color="primary" @click="filterDialog = true">Configure Filters</v-btn>

        <!-- フィルタダイアログ -->
        <v-dialog v-model="filterDialog" max-width="500">
            <v-card>
                <v-card-title class="headline">Configure Filters</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-card-text class="headline">Upload date</v-card-text>
                        <v-chip-group v-model="selectedFilter.upload_date" column>
                            <v-chip v-for="option in uploadDateOptions" :key="option" :value="option">{{ option
                            }}</v-chip>
                        </v-chip-group>
                        <v-card-text class="headline">Duration</v-card-text>
                        <v-chip-group v-model="selectedFilter.duration" column>
                            <v-chip v-for="option in durationOptions" :key="option" :value="option">{{ option
                            }}</v-chip>
                        </v-chip-group>
                        <v-card-text class="headline">Sort by</v-card-text>
                        <v-chip-group v-model="selectedFilter.sort_by" column>
                            <v-chip v-for="option in sortOptions" :key="option" :value="option">{{ option }}</v-chip>
                        </v-chip-group>
                        <v-card-text class="headline">Type</v-card-text>
                        <v-chip-group v-model="selectedFilter.type" column>
                            <v-chip v-for="option in typeOptions" :key="option" :value="option">{{ option }}</v-chip>
                        </v-chip-group>
                        <v-card-text class="headline">Features</v-card-text>
                        <v-chip-group v-model="selectedFilter.features" column>
                            <v-chip v-for="option in featureOptions" :key="option" :value="option">{{ option }}</v-chip>
                        </v-chip-group>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="applyFilters">Apply</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="results && results.length">
            <v-row :items="results" style="width: 100%; margin-left: 0;">
                <template v-for="result in results">
                    <template v-if="(result instanceof Helpers.YTNode)">
                        <YTNode :data="result" :page="'Search'"/>
                    </template>
                </template>
            </v-row>
        </v-infinite-scroll>
    </v-container>
</template>
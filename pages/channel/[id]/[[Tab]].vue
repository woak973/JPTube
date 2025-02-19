<script setup lang="ts">
import { Innertube, UniversalCache, YT, YTNodes, ReloadContinuationItemsCommand, Helpers } from 'youtubei.js';





const route = useRoute();
const router = useRouter();
const langStore = useLangStore();
const locationStore = useLocationStore();
const results = ref<Helpers.ObservedArray<Helpers.YTNode> | null>();
const Tabresults = ref();
const filter = ref();
const HeaderResults = ref();
const about = ref();
let sourceresults: YT.Channel | YT.ChannelListContinuation;
let sourceTab: YT.Channel;
let sourcefilter: YT.Channel | undefined;
const alert = ref(false);
const errorMessage = ref('');
const has_contents = ref(true);
const tab = ref(route.params.Tab || 'featured');
const selectedFilters = ref([]);
const searchDialog = ref(false);
const searchQuery = ref('');

const applyFilters = async (filter: never[]) => {
    try {
        if (sourcefilter && filter) {
            const filteredResults = await sourcefilter.applyFilter(filter as unknown as string);
            results.value = filteredResults?.contents?.contents;
            sourceresults = filteredResults;
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

const performSearch = () => {
    if (searchQuery.value) {
        router.push({ path: 'search', query: { query: searchQuery.value } });
        searchDialog.value = false;
    }
};

watch(selectedFilters, (newValue: never[]) => {
    applyFilters(newValue);
});

watch(() => route.params.Tab, (newTab) => {
    tab.value = newTab || 'featured';
});

watch(has_contents, (newValue) => {
    if (!newValue) {
        updateTab('featured');
    }
});

const updateTab = (newTab: string) => {
    router.push({ params: { ...route.params, Tab: newTab } });
};

watch(HeaderResults, (newVal) => {
    if (newVal) {
        switch (newVal.header.type) {
            case 'PageHeader':
                useHead({
                    title: `${newVal.header.page_title} - JPTube` || "Watch"
                });
                break;
            case 'CarouselHeader':
                useHead({
                    title: `${newVal.header.contents[1].title.text} - JPTube` || "Watch"
                });
                break;
            case 'InteractiveTabbedHeader':
                useHead({
                    title: `${newVal.header.title.text} - JPTube` || "Watch"
                });
                break;
        }
    }
});

const LoadMore = async ({ done }: any) => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            if (continuationResults.contents && continuationResults.contents.contents) {
                if (results.value) {
                    results.value.push(...continuationResults.contents.contents);
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

        let getID: string = route.params.id as string;
        getID = getID.startsWith('@') ? `https://m.youtube.com/${getID}` : `https://m.youtube.com/channel/${getID}`;
        let searchID = await yt.resolveURL(getID);
        if (!searchID.payload.browseId) {
            searchID = await yt.resolveURL(searchID.payload.url);
        }

        const searchResults: YT.Channel = await yt.getChannel(searchID.payload.browseId);

        HeaderResults.value = searchResults;
        sourceTab = searchResults;
        if (searchResults.has_about) {
            about.value = await searchResults.getAbout();
        }


        let AddResults: YT.Channel | undefined;
        switch (route.params.Tab) {
            case 'videos':
                if (searchResults.has_videos) {
                    AddResults = await searchResults.getVideos();
                } else {
                    has_contents.value = false;
                }
                break;

            case 'playlists':
                if (searchResults.has_playlists) {
                    AddResults = await searchResults.getPlaylists();
                } else {
                    has_contents.value = false;
                }
                break;

            case 'streams':
                if (searchResults.has_live_streams) {
                    AddResults = await searchResults.getLiveStreams();
                } else {
                    has_contents.value = false;
                }
                break;

            case 'community':
                if (searchResults.has_community) {
                    AddResults = await searchResults.getCommunity();
                } else {
                    has_contents.value = false;
                }
                break;
            case 'shorts':
                if (searchResults.has_shorts) {
                    AddResults = await searchResults.getShorts();
                } else {
                    has_contents.value = false;
                }
                break;

            case 'search':
                if (searchResults.has_search) {
                    AddResults = await searchResults.search(route.query.query as string || '');
                } else {
                    has_contents.value = false;
                }
                break;

            case 'podcasts':
                if (searchResults.has_podcasts) {
                    AddResults = await searchResults.getPodcasts();
                } else {
                    has_contents.value = false;
                }
                break;

            default:
                if (searchResults.has_home) {
                    AddResults = await searchResults.getHome();
                } else {
                    has_contents.value = false;
                }
                break;

        }
        if (AddResults) {
            filter.value = await AddResults.filters;
            if (AddResults?.current_tab?.content && 'contents' in AddResults.current_tab.content) {
                results.value = AddResults.current_tab.content.contents;
            }
            sourceresults = AddResults;
        } else if (!has_contents.value) {
            const AddResultsPage: YTNodes.SectionList | YTNodes.MusicQueue | YTNodes.RichGrid | ReloadContinuationItemsCommand = await searchResults.page_contents;
            if ('contents' in AddResultsPage) {
                results.value = AddResultsPage.contents;
            } else {
                results.value = null;
            }
            sourceresults = searchResults;
        }
        sourcefilter = AddResults;

    } catch (error) {
        alert.value = true;
        if (error instanceof Error) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = 'An unknown error occurred';
        }
    }
};

const handleError = (message: string) => {
    alert.value = true;
    errorMessage.value = message;
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

            <v-dialog v-model="searchDialog" max-width="500">
                <v-card>
                    <v-card-title class="headline">Search</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="searchQuery" label="SearchWord"
                            @keyup.enter="performSearch"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="performSearch">Search</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <template v-if="HeaderResults">
            <template v-if="HeaderResults.header.type === 'PageHeader'">
                <ChannelHeader :data="HeaderResults" :about="about" />
            </template>
            <template v-else-if="HeaderResults.header.type === 'CarouselHeader'">
                <CarouselHeader :data="HeaderResults" />
            </template>
            <template v-else-if="HeaderResults.header.type === 'InteractiveTabbedHeader'">
                <InteractiveTabbedHeader :data="HeaderResults" />
            </template>

        </template>

        <v-tabs v-model="tab" background-color="primary" dark @change="updateTab">
            <v-tab v-if="sourceTab && sourceTab.has_home" :to="`/channel/${route.params.id}/featured`"
                value="featured">Home</v-tab>
            <v-tab v-if="sourceTab && sourceTab.has_videos" :to="`/channel/${route.params.id}/videos`"
                value="videos">Videos</v-tab>
            <v-tab v-if="sourceTab && sourceTab.has_shorts" :to="`/channel/${route.params.id}/shorts`"
                value="shorts">Shorts</v-tab>
            <v-tab v-if="sourceTab && sourceTab.has_live_streams" :to="`/channel/${route.params.id}/streams`"
                value="streams">Live</v-tab>
            <v-tab v-if="sourceTab && sourceTab.has_podcasts" :to="`/channel/${route.params.id}/podcasts`"
                value="podcasts">Podcasts</v-tab>
            <v-tab v-if="sourceTab && sourceTab.has_playlists" :to="`/channel/${route.params.id}/playlists`"
                value="playlists">Playlists</v-tab>
            <v-tab v-if="sourceTab && sourceTab.has_community" :to="`/channel/${route.params.id}/community`"
                value="community">Community</v-tab>
            <v-btn v-if="sourceTab && sourceTab.has_search" icon @click="searchDialog = true">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
        </v-tabs>
        <template v-if="filter">
            <v-chip-group column v-model="selectedFilters">
                <v-chip v-for="(item, index) in filter" :key="index" :value="item">
                    {{ item }}
                </v-chip>
            </v-chip-group>
        </template>

        <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="results && results.length">
            <v-row style="width: 100%; margin-left: 0;">
                <template v-for="result in results">
                    <template v-if="(result instanceof Helpers.YTNode)">
                        <YTNode :data="result" />
                    </template>
                </template>
            </v-row>
        </v-infinite-scroll>
    </v-container>
</template>
<script setup lang="ts">
import { Innertube, UniversalCache, YT, YTNodes, ReloadContinuationItemsCommand } from 'youtubei.js';





const route = useRoute();
const router = useRouter();
const langStore = useLangStore();
const locationStore = useLocationStore();
const results = ref();
const Tabresults = ref();
const filter = ref();
const Headerresults = ref();
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

watch(Headerresults, (newVal) => {
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

    Headerresults.value = searchResults;
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
            results.value = [];
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

const LoadMore = async ({ done }: any) => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            if (continuationResults.contents && continuationResults.contents.contents) {
                results.value.push(...continuationResults.contents.contents);
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
                    <v-card-title class="headline">検索</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="searchQuery" label="検索ワード" @keyup.enter="performSearch"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="performSearch">検索</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <template v-if="Headerresults">
            <template v-if="Headerresults.header.type === 'PageHeader'">
                <ChannelHeader :data="Headerresults" :about="about" />
            </template>
            <template v-else-if="Headerresults.header.type === 'CarouselHeader'">
                <CarouselHeader :data="Headerresults" />
            </template>
            <template v-else-if="Headerresults.header.type === 'InteractiveTabbedHeader'">
                <InteractiveTabbedHeader :data="Headerresults" />
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
                <template v-for="result in results" :key="result.id">

                    <v-col v-if="result.type === 'RichItem'" cols="12" md="3" lg="2" sm="6">
                        <template v-if="result.content?.type === 'Video'">
                            <FeedVideo :data="result?.content" />
                        </template>
                        <template v-else-if="result.content?.type === 'ShortsLockupView'">
                            <Shorts :data="result?.content" />
                        </template>
                        <template v-else-if="result.content?.type === 'LockupView'">
                            <FeedPlaylists :data="result?.content" />
                        </template>
                    </v-col>

                    <v-col v-if="result.type === 'ItemSection'" cols="12">
                        <template v-for="content in result.contents" :key="content.id">
                            <template v-if="content.type === 'Video'">
                                <Video :data="content" />
                            </template>
                            <template v-if="content.type === 'Shelf'">
                                <strong>{{ content.title.text }}</strong>
                                <v-slide-group >
                                    <v-slide-item v-for="innerresult in content.content.items" :key="innerresult.id"
                                        class="ma-2" style="width: 200px;">
                                        <template v-if="innerresult.type === 'GridVideo'">
                                            <GridVideoFeed :data="innerresult" />
                                        </template>
                                        <template v-else-if="innerresult.type === 'LockupView'">
                                            <FeedPlaylists :data="innerresult" />
                                        </template>
                                        <template v-else-if="innerresult.type === 'GridChannel'">
                                            <FeedChannel :data="innerresult" />
                                        </template>
                                    </v-slide-item>
                                </v-slide-group>
                            </template>
                            <template v-if="content.type === 'ReelShelf'">
                                <strong>{{ content.title.text }}</strong>
                                <v-slide-group >
                                    <v-slide-item v-for="innerresult in content.items" :key="innerresult.id"
                                        class="ma-2" style="width: 200px;">
                                        <template v-if="innerresult.type === 'ShortsLockupView'">
                                            <Shorts :data="innerresult" />
                                        </template>
                                    </v-slide-item>
                                </v-slide-group>
                            </template>
                            <template v-if="content.type === 'Grid'">
                                <v-row>
                                    <template v-for="inresult in content.items">
                                        <v-col v-if="inresult.type === 'LockupView'" cols="12" md="3" lg="2" sm="6">
                                            <FeedPlaylists :data="inresult" />
                                        </v-col>
                                    </template>
                                </v-row>
                            </template>
                            <v-col v-if="content.type === 'HorizontalCardList'">
                                <strong>{{ content.header.title.text }}</strong>
                                <v-slide-group >
                                    <v-slide-item v-for="innerresult in content.cards" :key="innerresult.id"
                                        class="ma-2" style="width: 200px;">
                                        <template v-if="innerresult.type === 'GameCard'">
                                            <GameCard :data="innerresult" />
                                        </template>
                                        <template v-if="innerresult.type === 'VideoCard'">
                                            <FeedVideoCard :data="innerresult" />
                                        </template>
                                    </v-slide-item>
                                </v-slide-group>
                            </v-col>
                        </template>
                    </v-col>
                    <v-col v-if="result.type === 'ItemSection'" cols="12" style="padding: 0%">
                        <template v-for="content in result.contents" :key="content.id">
                            <template v-if="content.type === 'BackstagePostThread'">
                                <v-col v-if="content.post.type === 'BackstagePost'" cols="12">
                                    <Community :data="content.post" />
                                </v-col>
                                <v-col v-else-if="content.post.type === 'SharedPost'" cols="12">
                                    <SharedPost :data="content.post" />
                                </v-col>
                            </template>
                        </template>
                    </v-col>

                    <v-col v-if="result.type === 'GridPlaylist'" cols="12" md="3" lg="2" sm="6">
                        <ContFeedPlaylists :data="result" />
                    </v-col>

                    <template v-if="result.type === 'BackstagePostThread'">
                        <v-col v-if="result.post.type === 'BackstagePost'" cols="12">
                            <Community :data="result.post" />
                        </v-col>
                        <v-col v-if="result.post.type === 'SharedPost'" cols="12">
                            <SharedPost :data="result.post" />
                        </v-col>
                    </template>

                    <v-col v-if="result.type === 'RichSection'" cols="12">
                        <template v-if="result.content.type === 'RichShelf'">
                            <strong>{{ result.content.title.text }}</strong>
                            <v-slide-group >
                                <v-slide-item v-for="content in result.content.contents" :key="content.id" class="ma-2"
                                    style="width: 200px;">
                                    <template v-if="content.type === 'RichItem'">
                                        <template v-if="content.content.type === 'Video'">
                                            <HomeFeed :data="content.content" />
                                        </template>

                                    </template>
                                </v-slide-item>
                            </v-slide-group>
                        </template>
                    </v-col>

                    <v-col v-if="result.type === 'ChannelOwnerEmptyState'">
                        <Empty :data="result" />
                    </v-col>
                </template>
            </v-row>
        </v-infinite-scroll>
    </v-container>
</template>
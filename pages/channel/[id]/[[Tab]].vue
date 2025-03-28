<script setup lang="ts">
import { Innertube, UniversalCache, YT, YTNodes, ReloadContinuationItemsCommand, Helpers, NavigateAction, ShowMiniplayerCommand } from 'youtubei.js';




const route = useRoute();
const router = useRouter();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<Helpers.YTNode> | null>();
const filter = ref<Array<string>>();
const HeaderResults = ref<YTNodes.C4TabbedHeader | YTNodes.CarouselHeader | YTNodes.InteractiveTabbedHeader | YTNodes.PageHeader | undefined>();
const MetaResults = ref<YTNodes.ChannelMetadata & Partial<YTNodes.MicroformatData>>();
const about = ref<YTNodes.ChannelAboutFullMetadata | YTNodes.AboutChannel>();
const TabResults = ref<Array<Helpers.YTNode>>();
let sourceresults: YT.Channel | YT.ChannelListContinuation;
let sourceTab: YT.Channel;
let sourcefilter: YT.Channel | undefined;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const has_contents = ref<boolean>(true);
const selectedTab = ref<string>(route.params.Tab as string || 'featured');
const selectedFilters = ref<string>();
const searchDialog = ref<boolean>(false);
const searchQuery = ref<string>('');

const applyFilters = async (filter: string) => {
    try {
        if (sourcefilter && filter) {
            const filteredResults = await sourcefilter.applyFilter(filter);
            if (!(filteredResults?.contents instanceof YTNodes.OpenPopupAction) && !(filteredResults?.contents instanceof NavigateAction) && !(filteredResults?.contents instanceof ShowMiniplayerCommand)) {
                results.value = filteredResults?.contents?.contents;
            }
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

watch(selectedFilters, (newValue) => {
    if (newValue !== undefined) {
        applyFilters(newValue);
    }
});

watch(() => route.params.Tab as string, (newTab) => {
    selectedTab.value = newTab;
});

watch(() => route.query.bp as string, async (bp) => {
    await fetchData(bp);
});

watch(has_contents, (newValue) => {
    if (!newValue) {
        updateTab();
    }
});

const updateTab = () => {
    router.push({ params: { ...route.params } });
};

watch(HeaderResults, (newVal) => {
    if (newVal) {
        if (newVal instanceof YTNodes.PageHeader) {
            useHead({
                title: `${newVal.page_title} - JPTube` || "Watch"
            });
        } else if (newVal instanceof YTNodes.CarouselHeader) {
            useHead({
                title: `${(newVal.contents[1] as YTNodes.TopicChannelDetails).title.text} - JPTube` || "Watch"
            });
        } else if (newVal instanceof YTNodes.InteractiveTabbedHeader) {
            useHead({
                title: `${newVal.title.text
                    } - JPTube` || "Watch"
            });
        }
    }
}
);

const getLastParam = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
};

const LoadMore = async ({ done }: any) => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            if (continuationResults.contents && !(continuationResults?.contents instanceof YTNodes.OpenPopupAction) && !(continuationResults?.contents instanceof NavigateAction) && !(continuationResults?.contents instanceof ShowMiniplayerCommand)) {
                if (results.value && continuationResults.contents.contents) {
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

const getSearchResults = async (yt: Innertube, bp?: string): Promise<YT.Channel> => {
    if (bp) {
        const nav = new YTNodes.NavigationEndpoint({ browseEndpoint: { browseId: "FEstorefront", params: bp } });
        const CallResults = await nav.call(yt.actions, { parse: true });
        return new YT.Channel(yt.actions, CallResults, true);
    } else {
        let getID: string = route.params.id as string;
        getID = getID.startsWith('@') ? `https://m.youtube.com/${getID}` : `https://m.youtube.com/channel/${getID}`;
        let searchID = await yt.resolveURL(getID);
        if (!searchID.payload.browseId) {
            searchID = await yt.resolveURL(searchID.payload.url);
        }
        return await yt.getChannel(searchID.payload.browseId);
    }
};

const fetchData = async (bp?: string) => {
    try {

        const lang = langStore.lang || 'ja';
        const location = locationStore.location || 'JP';
        const yt = await Innertube.create({
            fetch: fetchFn,
            cache: new UniversalCache(false),
            lang: lang,
            location: location
        });
        const searchResults = await getSearchResults(yt, bp);

        HeaderResults.value = searchResults.header;
        MetaResults.value = searchResults.metadata as YTNodes.ChannelMetadata & Partial<YTNodes.MicroformatData>;
        TabResults.value = await searchResults.page.contents_memo?.get('Tab');
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

            case 'courses':
                if (searchResults.has_courses) {
                    AddResults = await searchResults.getCourses();
                } else {
                    has_contents.value = false;
                }
                break;

            case 'store':
                if (searchResults.hasTabWithURL('store')) {
                    const tab = await searchResults.getTabByURL('store');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'home':
                if (searchResults.hasTabWithURL('home')) {
                    const tab = await searchResults.getTabByURL('home');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'letsplay':
                if (searchResults.hasTabWithURL('letsplay')) {
                    const tab = await searchResults.getTabByURL('letsplay');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'recent':
                if (searchResults.hasTabWithURL('recent')) {
                    const tab = await searchResults.getTabByURL('recent');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'official':
                if (searchResults.hasTabWithURL('official')) {
                    const tab = await searchResults.getTabByURL('official');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'live':
                if (searchResults.hasTabWithURL('live')) {
                    const tab = await searchResults.getTabByURL('live');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'sports':
                if (searchResults.hasTabWithURL('sports')) {
                    const tab = await searchResults.getTabByURL('sports');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'entertainment':
                if (searchResults.hasTabWithURL('entertainment')) {
                    const tab = await searchResults.getTabByURL('entertainment');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'business':
                if (searchResults.hasTabWithURL('business')) {
                    const tab = await searchResults.getTabByURL('business');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'technology':
                if (searchResults.hasTabWithURL('technology')) {
                    const tab = await searchResults.getTabByURL('technology');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'world':
                if (searchResults.hasTabWithURL('world')) {
                    const tab = await searchResults.getTabByURL('world');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'national':
                if (searchResults.hasTabWithURL('national')) {
                    const tab = await searchResults.getTabByURL('national');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'science':
                if (searchResults.hasTabWithURL('science')) {
                    const tab = await searchResults.getTabByURL('science');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'health':
                if (searchResults.hasTabWithURL('health')) {
                    const tab = await searchResults.getTabByURL('health');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
                } else {
                    has_contents.value = false;
                }
                break;

            case 'about':
                if (searchResults.hasTabWithURL('about')) {
                    const tab = await searchResults.getTabByURL('about');
                    AddResults = new YT.Channel(yt.actions, tab.page, true);
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
            const AddResultsPage = await searchResults.current_tab?.content;
            if (AddResultsPage && 'contents' in AddResultsPage) {
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
            <template v-if="(HeaderResults instanceof YTNodes.PageHeader)">
                <YTCommonPageHeader :data="HeaderResults" :about="about" :metadata="MetaResults" />
            </template>
            <template v-else-if="(HeaderResults instanceof YTNodes.CarouselHeader)">
                <YTCommonCarouselHeader :data="HeaderResults" />
            </template>
            <template v-else-if="(HeaderResults instanceof YTNodes.InteractiveTabbedHeader)">
                <YTCommonInteractiveTabbedHeader :data="HeaderResults" />
            </template>

        </template>

        <v-tabs v-model="selectedTab" background-color="primary" dark>
            <template v-for="Tab in TabResults">
                <template v-if="(Tab instanceof YTNodes.Tab) && Tab.title !== 'N/A'">
                    <v-tab :to="Tab.endpoint.metadata.url" :value="getLastParam(Tab.endpoint.metadata.url ?? '')">{{
                        Tab.title
                        }}</v-tab>
                </template>
            </template>
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
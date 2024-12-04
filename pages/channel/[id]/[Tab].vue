<script setup lang="ts">
import { ref } from 'vue';
import { Innertube, UniversalCache } from 'youtubei.js';
import type Channel from 'youtubei.js';
import { fetchFn } from '@/composables/useYouTube';
import VideoComponent from '~/components/video.vue';
import ChannelComponent from '~/components/channel.vue';
import PlayListsComponent from '~/components/playlists.vue';
import FeedComponent from '~/components/feed.vue';
import GridVideoComponent from '~/components/gridvideofeed.vue';
import GridShortsComponent from '~/components/shorts.vue';
import ChannelHeaderComponent from '~/components/channelheader.vue';
import FeedPlayListsComponent from '~/components/feedplaylists.vue';
import FeedChannelComponent from '~/components/feedchannel.vue';
import ContPlayListsComponent from '~/components/contfeedplaylists.vue';
import FeedCommunityComponent from '~/components/community.vue';
import EmptyComponent from '~/components/empty.vue';
import CarouselHeaderComponent from '~/components/carouselheader.vue';
import GameCardComponent from '~/components/gamecard.vue';
import InteractiveTabbedHeaderComponent from '~/components/interactivetabbedheader.vue';




const route = useRoute();
const router = useRouter();
const results = ref();
const Tabresults = ref();
const filter = ref();
const Headerresults = ref();
const about = ref();
let sourceresults: any;
let sourcefilter: any;
const alert = ref(false);
const errorMessage = ref('');
const snackbar = ref(false);
const has_contents = ref(true);
const tab = ref(route.params.Tab || 'featured');
const selectedFilters = ref([]);

const applyFilters = async (filter: any) => {
    try {
        if (sourcefilter && filter) {
            console.log(sourcefilter)
            const filteredResults = await sourcefilter.applyFilter(filter);
            results.value = filteredResults.contents.contents;
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

watch(selectedFilters, (newValue) => {
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
    const lang = route.query.lang as string || 'ja';
    const location = route.query.location as string || 'JP';
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

    const searchResults = await yt.getChannel(searchID.payload.browseId);

    Headerresults.value = searchResults;
    if (searchResults.has_about) {
        about.value = await searchResults.getAbout();
    }


    let AddResults: any = null;
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
        results.value = AddResults.current_tab.content.contents;
        sourceresults = AddResults;
    } else if (!has_contents.value) {
        AddResults = await searchResults.page_contents;
        results.value = AddResults.contents;
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
            results.value.push(...continuationResults.contents.contents);
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

            <v-snackbar v-model="snackbar" :timeout="4000">
                No more Results
            </v-snackbar>
        </div>
        <template v-if="Headerresults">
            <template v-if="Headerresults.header.type === 'PageHeader'">
                <ChannelHeaderComponent :data="Headerresults" :about="about" />
            </template>
            <template v-else-if="Headerresults.header.type === 'CarouselHeader'">
                <CarouselHeaderComponent :data="Headerresults" />
            </template>
            <template v-else-if="Headerresults.header.type === 'InteractiveTabbedHeader'">
                <InteractiveTabbedHeaderComponent :data="Headerresults" />
            </template>

        </template>

        <v-tabs v-model="tab" background-color="primary" dark @change="updateTab">
            <v-tab href="./featured" value="featured">ホーム</v-tab>
            <v-tab href="./videos" value="videos">動画</v-tab>
            <v-tab href="./shorts" value="shorts">ショート</v-tab>
            <v-tab href="./streams" value="streams">ライブ</v-tab>
            <v-tab href="./playlists" value="playlists">再生リスト</v-tab>
            <v-tab href="./community" value="community">コミュニティ</v-tab>
        </v-tabs>
        <template v-if="filter">
            <v-chip-group column v-model="selectedFilters">
                <v-chip v-for="(item, index) in filter" :key="index" :value="item">
                    {{ item }}
                </v-chip>
            </v-chip-group>
        </template>

        <v-infinite-scroll mode="intersect" @load="LoadMore">
            <v-row style="width: 100%; margin-left: 0;">
                <template v-for="result in results" :key="result.id">

                    <v-col v-if="result.type === 'RichItem'" cols="12" md="3" lg="2" sm="6">
                        <template v-if="result.content?.type === 'Video'">
                            <FeedComponent :data="result?.content" />
                        </template>
                        <template v-else-if="result.content?.type === 'ShortsLockupView'">
                            <GridShortsComponent :data="result?.content" />
                        </template>
                    </v-col>

                    <v-col v-if="result.type === 'ItemSection'" cols="12">
                        <template v-for="content in result.contents" :key="content.id">
                            <template v-if="content.type === 'Shelf'">
                                <strong>{{ content.title.text }}</strong>
                                <v-slide-group show-arrows>
                                    <v-slide-item v-for="innerresult in content.content.items" :key="innerresult.id"
                                        class="ma-2" style="width: 200px;">
                                        <template v-if="innerresult.type === 'GridVideo'">
                                            <GridVideoComponent :data="innerresult" />
                                        </template>
                                        <template v-else-if="innerresult.type === 'LockupView'">
                                            <FeedPlayListsComponent :data="innerresult" />
                                        </template>
                                        <template v-else-if="innerresult.type === 'GridChannel'">
                                            <FeedChannelComponent :data="innerresult" />
                                        </template>
                                    </v-slide-item>
                                </v-slide-group>
                            </template>
                            <template v-if="content.type === 'ReelShelf'">
                                <strong>{{ content.title.text }}</strong>
                                <v-slide-group show-arrows>
                                    <v-slide-item v-for="innerresult in content.items" :key="innerresult.id"
                                        class="ma-2" style="width: 200px;">
                                        <template v-if="innerresult.type === 'ShortsLockupView'">
                                            <GridShortsComponent :data="innerresult" />
                                        </template>
                                    </v-slide-item>
                                </v-slide-group>
                            </template>
                            <template v-if="content.type === 'Grid'">
                                <v-row>
                                    <template v-for="inresult in content.items">
                                        <v-col v-if="inresult.type === 'LockupView'" cols="12" md="3" lg="2" sm="6">
                                            <FeedPlayListsComponent :data="inresult" />
                                        </v-col>
                                    </template>
                                </v-row>
                            </template>
                            <v-col v-if="content.type === 'HorizontalCardList'">
                                <strong>{{ content.header.title.text }}</strong>
                                <v-slide-group show-arrows>
                                    <v-slide-item v-for="innerresult in content.cards" :key="innerresult.id"
                                        class="ma-2" style="width: 200px;">
                                        <template v-if="innerresult.type === 'GameCard'">
                                            <GameCardComponent :data="innerresult" />
                                        </template>
                                        <template v-if="innerresult.type === 'VideoCard'">
                                            <FeedComponent :data="innerresult" />
                                        </template>
                                    </v-slide-item>
                                </v-slide-group>
                            </v-col>
                        </template>
                    </v-col>
                    <v-col v-if="result.type === 'ItemSection'" cols="12" style="padding: 0%">
                        <template v-for="content in result.contents" :key="content.id">
                            <template v-if="content.type === 'BackstagePostThread'">
                                <v-col cols="12">
                                    <FeedCommunityComponent :data="content.post" />
                                </v-col>
                            </template>
                        </template>
                    </v-col>

                    <v-col v-if="result.type === 'GridPlaylist'" cols="12" md="3" lg="2" sm="6">
                        <ContPlayListsComponent :data="result" />
                    </v-col>

                    <v-col v-if="result.type === 'BackstagePostThread'" cols="12">
                        <FeedCommunityComponent :data="result.post" />
                    </v-col>

                    <v-col v-if="result.type === 'RichSection'" cols="12">
                        <template v-if="result.content.type === 'RichShelf'">
                            <strong>{{ result.content.title.text }}</strong>
                            <v-slide-group show-arrows>
                                <v-slide-item v-for="content in result.content.contents" :key="content.id" class="ma-2"
                                    style="width: 200px;">
                                    <template v-if="content.type === 'RichItem'">
                                        <template v-if="content.content.type === 'Video'">
                                            <FeedComponent :data="content.content" />
                                        </template>

                                    </template>
                                </v-slide-item>
                            </v-slide-group>
                        </template>
                    </v-col>

                    <v-col v-if="result.type === 'ChannelOwnerEmptyState'">
                        <EmptyComponent :data="result" />
                    </v-col>
                </template>
            </v-row>
        </v-infinite-scroll>
    </v-container>
</template>
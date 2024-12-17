<script setup lang="ts">
import { Innertube, UniversalCache, YT, Mixins } from 'youtubei.js';


const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref();
const Headerresults = ref();
let sourceresults: YT.HashtagFeed | Mixins.Feed;
const alert = ref(false);
const errorMessage = ref('');

useHead({
    title: `${route.params.q as string} - JPTube` || "HashTag - JPTube"
})



try {
    const lang = langStore.lang || 'ja';
    const location = locationStore.location || 'JP';
    const yt = await Innertube.create({
        fetch: fetchFn,
        cache: new UniversalCache(false),
        lang: lang,
        location: location
    });

    const searchResults:YT.HashtagFeed = await yt.getHashtag(route.params.q as string);
    sourceresults = searchResults;
    Headerresults.value = searchResults;
    results.value = await searchResults.contents.contents;


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
            results.value.push(...await continuationResults.videos);
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

        </div>
        <template v-if="Headerresults && Headerresults.header">
            <template v-if="Headerresults.header.type === 'PageHeader'">
                <ChannelHeader :data="Headerresults" />
            </template>
            <template v-else-if="Headerresults.header.type === 'CarouselHeader'">
                <CarouselHeader :data="Headerresults" />
            </template>

        </template>


        <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="results && results.length">
            <v-row style="width: 100%; margin-left: 0;">
                <template v-for="result in results" :key="result.id">

                    <template v-if="result.type === 'Video'">
                        <v-col cols="12" md="3" lg="2" sm="6">
                            <HomeFeed :data="result" />
                        </v-col>
                    </template>
                    <template v-else-if="result.type === 'ShortsLockupView'">
                        <v-col cols="12" md="3" lg="2" sm="6">
                            <Shorts :data="result" />
                        </v-col>
                    </template>

                    <v-col v-if="result.type === 'RichItem'" cols="12" md="3" lg="2" sm="6">
                        <template v-if="result.content.type === 'Video'">
                            <HomeFeed :data="result.content" />
                        </template>
                        <template v-else-if="result.content.type === 'ShortsLockupView'">
                            <Shorts :data="result.content" />
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
                                <v-slide-group show-arrows>
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
                        </template>
                    </v-col>
                    <v-col v-if="result.type === 'ItemSection'" cols="12" style="padding: 0%">
                        <template v-for="content in result.contents" :key="content.id">
                            <template v-if="content.type === 'BackstagePostThread'">
                                <v-col cols="12">
                                    <Community :data="content.post" />
                                </v-col>
                            </template>
                        </template>
                    </v-col>

                    <v-col v-if="result.type === 'GridPlaylist'" cols="12" md="3" lg="2" sm="6">
                        <ContFeedPlaylists :data="result" />
                    </v-col>

                    <v-col v-if="result.type === 'BackstagePostThread'" cols="12">
                        <Community :data="result.post" />
                    </v-col>

                    <v-col v-if="result.type === 'RichSection'" cols="12">
                        <template v-if="result.content && result.content.type === 'RichShelf'">
                            <strong>{{ result.content.title.text }}</strong>
                            <v-slide-group show-arrows>
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
<script setup lang="ts">
import { Innertube, UniversalCache, YT, Mixins, Helpers, YTNodes } from 'youtubei.js';


const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();

const results = ref<Helpers.ObservedArray<Helpers.YTNode>>();
const HeaderResults = ref<YTNodes.C4TabbedHeader | YTNodes.CarouselHeader | YTNodes.InteractiveTabbedHeader | YTNodes.PageHeader | undefined>();
const MetaResults = ref<YTNodes.ChannelMetadata & Partial<YTNodes.MicroformatData>>();
const about = ref<YTNodes.ChannelAboutFullMetadata | YTNodes.AboutChannel>();
let sourceresults: YT.Channel | YT.ChannelListContinuation;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

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





const LoadMore = async ({ done }: any) => {
    try {
        if (sourceresults && sourceresults.has_continuation) {
            const continuationResults = await sourceresults.getContinuation();
            if (results.value) {
                results.value.push(...await continuationResults.videos);
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
        const nav = await yt.resolveURL(`https://www.youtube.com/shopcollection/${route.params.id as string}`);
        const ParsedResults = await nav.call(yt.actions, { parse: true });
        const SearchResults = new YT.Channel(yt.actions, ParsedResults);
        sourceresults = SearchResults;
        HeaderResults.value = SearchResults.header;
        MetaResults.value = SearchResults.metadata as YTNodes.ChannelMetadata & Partial<YTNodes.MicroformatData>;
        if (SearchResults.has_about) {
            about.value = await SearchResults.getAbout();
        }
        if (SearchResults.current_tab?.content && 'contents' in SearchResults.current_tab.content) {
            results.value = await SearchResults.current_tab.content.contents;
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
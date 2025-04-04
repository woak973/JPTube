<script setup lang="ts">
import { YT, Utils, Helpers, YTNodes } from 'youtubei.js';
import { BinaryWriter } from '@bufbuild/protobuf/wire';

const route = useRoute();

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
        title: `${newVal.page_title ? newVal.page_title : 'Channel'} - JPTube`,
      });
    } else if (newVal instanceof YTNodes.CarouselHeader) {
      useHead({
        title: `${(newVal.contents[1] as YTNodes.TopicChannelDetails).title.text ? (newVal.contents[1] as YTNodes.TopicChannelDetails).title.text : 'Channel'} - JPTube`,
      });
    } else if (newVal instanceof YTNodes.InteractiveTabbedHeader) {
      useHead({
        title: `${newVal.title.text ? newVal.title.text : 'Channel'} - JPTube`,
      });
    }
  }
},
);

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
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
    const yt = await useInnertube('common');

    const writer = new BinaryWriter();
    writer.uint32(1090).fork();
    writer.uint32(10).string(route.params.id as string);
    writer.join();
    const Uint8 = writer.finish();
    let params = encodeURIComponent(Utils.u8ToBase64(Uint8));
    if (route.query.scp) {
      params += route.query.scp;
    }

    const nav = new YTNodes.NavigationEndpoint({ browseEndpoint: { browseId: 'FEshopping_collection', params: params } });
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
            <v-spacer />
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

    <v-infinite-scroll v-if="results && results.length" mode="intersect" @load="LoadMore">
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

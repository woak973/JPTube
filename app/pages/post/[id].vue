<script setup lang="ts">
import { Innertube, YT, Utils, Helpers, YTNodes } from 'youtubei.js';
import { BinaryWriter } from '@bufbuild/protobuf/wire';

const route = useRoute();
const results = ref<Helpers.ObservedArray<Helpers.YTNode> | null>();
const Commentresults = ref<Helpers.ObservedArray<YTNodes.CommentThread> | null>();
const MetaResults = ref<Partial<YTNodes.MicroformatData>>();
let sourceresults: YT.Channel | YT.ChannelListContinuation;
let yt: Innertube;
// const selectedSort = ref<'TOP_COMMENTS' | 'NEWEST_FIRST'>('TOP_COMMENTS');
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

watch(MetaResults, (newVal) => {
  useHead({
    title: `${newVal?.title ? newVal.title : 'Post'} - JPTube`,
  });
},

);

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
  try {
    if (sourceresults && sourceresults.has_continuation) {
      const continuationResults = await sourceresults.getContinuation();
      if (results.value) {
        results.value.push(...(continuationResults.memo.get('CommentThread') as YTNodes.CommentThread[]) || []);
      }
      sourceresults = continuationResults;
      done('ok');
    } else {
      done('empty');
    }
  } catch (error) {
    console.error(error);
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
    const writer = new BinaryWriter();
    writer.uint32(450).fork();
    writer.uint32(18).string('NOLONGERUSED');
    writer.uint32(26).string(route.params.id as string);
    writer.uint32(90).string('NOLONGERUSED');
    writer.join();
    const Uint8 = writer.finish();
    const params = encodeURIComponent(Utils.u8ToBase64(Uint8));
    yt = await useInnertube('common');
    const nav = new YTNodes.NavigationEndpoint({ browseEndpoint: { browseId: 'FEpost_detail', params: params } });
    const ParsedResults = await nav.call(yt.actions, { parse: true });
    const SearchResults = new YT.Channel(yt.actions, ParsedResults);

    if (SearchResults.page_contents && 'contents' in SearchResults.page_contents) {
      results.value = SearchResults.page_contents.contents;
      MetaResults.value = SearchResults.metadata;
      sourceresults = SearchResults;
    } else {
      results.value = null;
    }
  } catch (error) {
    Commentresults.value = null;
    console.error('Error fetching comments:', error);
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
          <v-card-title class="headline">{{ $t('common.Error') }}</v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="alert = false">{{ $t('common.close') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>

    <v-infinite-scroll v-if="results && results.length" mode="intersect" @load="LoadMore">
      <v-row style="width: 100%; margin-left: 0;">
        <template v-for="result in results">
          <v-col v-if="(result instanceof YTNodes.CommentThread)" cols="12">
            <YTCommonCommentThread :data="result" :yt="yt" />
          </v-col>
          <template v-else-if="(result instanceof Helpers.YTNode)">
            <YTNode :data="result" />
          </template>
        </template>
      </v-row>
    </v-infinite-scroll>
  </v-container>
</template>

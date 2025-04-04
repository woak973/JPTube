<script setup lang="ts">
import type { YT, Mixins } from 'youtubei.js';
import { Helpers, YTNodes } from 'youtubei.js';

const route = useRoute();

const results = ref<Helpers.ObservedArray<Helpers.YTNode>>();
const HeaderResults = ref<YT.HashtagFeed>();
let sourceresults: YT.HashtagFeed | Mixins.Feed;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
  title: `${route.params.q as string} - JPTube` || 'HashTag - JPTube',
});

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
    const yt = await useInnertube('common');

    const searchResults: YT.HashtagFeed = await yt.getHashtag(route.params.q as string);
    sourceresults = searchResults;
    HeaderResults.value = searchResults;
    results.value = await searchResults.contents.contents;
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
    <template v-if="HeaderResults && HeaderResults.header">
      <template v-if="(HeaderResults.header instanceof YTNodes.PageHeader)">
        <YTCommonPageHeader :data="HeaderResults.header" />
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

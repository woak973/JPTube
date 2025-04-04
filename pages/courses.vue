<script setup lang="ts">
import type { Mixins, APIResponseTypes, ReloadContinuationItemsCommand } from 'youtubei.js';
import { Helpers, YTNodes } from 'youtubei.js';

const results = ref<Array<YTNodes.RichGrid | ReloadContinuationItemsCommand | YTNodes.SectionList | YTNodes.MusicQueue>>([]);
const HeaderResult = ref<Array<Helpers.YTNode>>();
let sourceresults: Mixins.Feed<APIResponseTypes.IBrowseResponse>;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
  title: 'Courses - JPTube',
});

const LoadMore = async ({ done }: any) => {
  try {
    if (sourceresults && sourceresults.has_continuation) {
      const continuationResults: Mixins.Feed<APIResponseTypes.IBrowseResponse> = await sourceresults.getContinuation();
      if (continuationResults.page_contents) {
        if (results.value) {
          results.value.push(continuationResults.page_contents);
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
    const yt = await useInnertube('common');

    const searchResults = await yt.getCourses();

    results.value = await [searchResults.page_contents];
    sourceresults = searchResults;
    HeaderResult.value = await searchResults.page.header_memo?.get('PageHeader');
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

    <template v-if="HeaderResult">
      <template v-for="Header in HeaderResult">
        <template v-if="(Header instanceof YTNodes.PageHeader)">
          <YTCommonPageHeader :data="Header" />
        </template>
      </template>
    </template>

    <v-infinite-scroll v-if="results" mode="intersect" @load="LoadMore">
      <template v-for="result in results">
        <template v-if="(result instanceof Helpers.YTNode)">
          <YTNode :data="result" />
        </template>
      </template>
    </v-infinite-scroll>
  </v-container>
</template>

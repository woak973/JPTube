<script setup lang="ts">
import type { YTKids, ItemSectionContinuation } from 'youtubei.js';
import { YTNodes } from 'youtubei.js';

const route = useRoute();

const results = ref<Array<YTNodes.ItemSection | ItemSectionContinuation | undefined>>();
const HeaderResults = ref<YTNodes.C4TabbedHeader | undefined>();
let sourceresults: YTKids.Channel;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

watch(HeaderResults, (newVal): void => {
  if (newVal) {
    useHead({
      title: `${newVal?.author.name ? newVal?.author.name : 'Channel'} - JPTube Kids`,
    });
  }
});

definePageMeta({
  layout: 'kids',
});

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
  try {
    if (sourceresults && sourceresults.has_continuation) {
      const continuationResults = await sourceresults.getContinuation();
      if (continuationResults.contents) {
        if (results.value) {
          results.value.push(continuationResults.contents);
        }
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

const fetchData = async (): Promise<void> => {
  try {
    const yt = await useInnertube('common');

    const ytkids = await yt.kids;

    const searchResults = await ytkids.getChannel(route.params.id as string);
    sourceresults = searchResults;

    results.value = await [searchResults.contents];
    HeaderResults.value = searchResults.header;
  } catch (error) {
    console.error(error);
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
          <v-card-title class="headline">{{ $t('common.Error') }}</v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="alert = false">{{ $t('common.close') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <template v-if="HeaderResults">
      <template v-if="(HeaderResults instanceof YTNodes.C4TabbedHeader)">
        <YTKidsCommonC4TabbedHeader :data="HeaderResults" />
      </template>

    </template>

    <v-infinite-scroll v-if="results && results.length" mode="intersect" @load="LoadMore">
      <v-row style="width: 100%; margin-left: 0;">
        <template v-for="result in results">
          <YTKidsNode :data="result" />
        </template>
      </v-row>
    </v-infinite-scroll>
  </v-container>
</template>

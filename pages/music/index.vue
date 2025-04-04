<script setup lang="ts">
import type { Helpers, YTNodes, YTMusic } from 'youtubei.js';

const results = ref<Helpers.ObservedArray<YTNodes.MusicCarouselShelf | YTNodes.MusicTastebuilderShelf> | undefined>();
let sourceresults: YTMusic.HomeFeed;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
  title: 'Home - JPTube Music',
});

definePageMeta({
  layout: 'music',
});

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }): Promise<void> => {
  try {
    if (sourceresults && sourceresults.has_continuation) {
      const continuationResults = await sourceresults.getContinuation();
      if (continuationResults?.sections && results.value) {
        results.value.push(...continuationResults.sections);
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

const fetchData = async (): Promise<void> => {
  try {
    const yt = await useInnertube('common');

    const ytmusic = await yt.music;

    const searchResults = await ytmusic.getHomeFeed();
    sourceresults = searchResults;

    results.value = await searchResults?.sections;
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

    <v-infinite-scroll v-if="results && results.length" mode="intersect" @load="LoadMore">
      <v-row style="width: 100%; margin-left: 0;">
        <template v-for="result in results">
          <YTMusicNode :data="result" />
        </template>
      </v-row>
    </v-infinite-scroll>
  </v-container>
</template>

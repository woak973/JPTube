<script setup lang="ts">
import type { YTMusic, Helpers } from 'youtubei.js';
import { YTNodes } from 'youtubei.js';

const route = useRoute();

const results = ref<Helpers.ObservedArray<YTNodes.MusicResponsiveListItem | YTNodes.ContinuationItem>>();
const HeaderResults = ref<YTNodes.MusicResponsiveHeader | YTNodes.MusicDetailHeader | YTNodes.MusicEditablePlaylistDetailHeader | undefined>();
let sourceresults: YTMusic.Playlist;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

watch(HeaderResults, (newVal): void => {
  if (newVal && !(newVal instanceof YTNodes.MusicEditablePlaylistDetailHeader)) {
    useHead({
      title: `${newVal.title.text ? newVal.title.text : 'Playlist'} - JPTube Music`,
    });
  }
});

definePageMeta({
  layout: 'music',
});

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }): Promise<void> => {
  try {
    if (sourceresults && sourceresults.has_continuation) {
      const continuationResults = await sourceresults.getContinuation();
      if (results.value) {
        results.value.push(...continuationResults.items);
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
    const ytmusic = yt.music;

    const searchResults: YTMusic.Playlist = await ytmusic.getPlaylist(route.query.list as string);
    sourceresults = searchResults;
    HeaderResults.value = searchResults.header;
    if (searchResults.items) {
      results.value = searchResults.items;
    } else {
      throw new Error('No Contents Found');
    }
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
    <v-row>
      <v-col cols="12" md="2">
        <template v-if="HeaderResults">
          <template v-if="(HeaderResults instanceof YTNodes.MusicResponsiveHeader)">
            <YTMusicCommonMusicResponsiveHeader :data="HeaderResults" />
          </template>
        </template>

      </v-col>

      <v-col cols="12" md="10">
        <v-infinite-scroll v-if="results && results.length" mode="intersect" @load="LoadMore">
          <v-row style="width: 100%; margin-left: 0;">
            <template v-for="result in results">
              <YTMusicNode :data="result" />
            </template>
          </v-row>
        </v-infinite-scroll>
      </v-col>
    </v-row>
  </v-container>
</template>

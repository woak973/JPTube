<script setup lang="ts">
import type { Helpers, YTNodes } from 'youtubei.js';

const results = ref<Helpers.ObservedArray<YTNodes.MusicCarouselShelf> | undefined>();
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
  title: 'Explore - JPTube Music',
});

definePageMeta({
  layout: 'music',
});

const fetchData = async (): Promise<void> => {
  try {
    const yt = await useInnertube('common');

    const ytmusic = await yt.music;

    const searchResults = await ytmusic.getExplore();

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
      <template v-for="result in results">
        <YTMusicNode :data="result" />
      </template>
    </v-row>
  </v-container>
</template>

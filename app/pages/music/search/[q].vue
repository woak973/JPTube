<script setup lang="ts">
import type { Helpers, YTNodes } from 'youtubei.js';

const route = useRoute();
const goTo = useGoTo();

const results = ref<Helpers.ObservedArray<YTNodes.MusicShelf | YTNodes.MusicCardShelf | YTNodes.ItemSection>>();
const HeaderResults = ref<YTNodes.ChipCloud | undefined>();

const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
  title: `${route.params.q as string ? route.params.q as string : 'Search'} - JPTube Music`,
});

definePageMeta({
  layout: 'music',
});

const fetchData = async (filter?: string): Promise<void> => {
  try {
    const yt = await useInnertube('common');

    const ytmusic = await yt.music;

    let searchResults = await ytmusic.search(route.params.q as string);
    if (filter && filter !== 'N/A') {
      searchResults = await searchResults.applyFilter(filter);
    }
    if (filter) {
      goTo(0);
    }

    results.value = await searchResults.contents;
    HeaderResults.value = await searchResults.header;
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
      <v-chip-group>
        <v-chip
          v-for="chip in HeaderResults?.chips" :key="chip.text" :text="chip.text"
          @click="fetchData(chip.text)" />
      </v-chip-group>

      <template v-for="result in results">
        <YTMusicNode :data="result" :page="'Search'" @fetchData="fetchData" />
      </template>
    </v-row>
  </v-container>
</template>

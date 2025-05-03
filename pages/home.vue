<script setup lang="ts">
import type { Mixins, APIResponseTypes } from 'youtubei.js';
import { Helpers, YTNodes, ReloadContinuationItemsCommand, YT } from 'youtubei.js';

const results = ref<Array<YTNodes.SectionList | YTNodes.MusicQueue | YTNodes.RichGrid | ReloadContinuationItemsCommand>>();
let sourceresults: Mixins.Feed<APIResponseTypes.IBrowseResponse>;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const HeaderResult = ref<Array<Helpers.YTNode>>();
const chipOptions = ref<YTNodes.FeedFilterChipBar | null | undefined>();
const selectedChip = ref<string>();

useHead({
  title: 'HomeFeed - JPTube',
});

const applyChips = async () => {
  const chip = selectedChip.value;
  await fetchData(chip);
};

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
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

const fetchData = async (chip?: string) => {
  try {
    const yt = await useInnertube('common');
    if (chip) {
      const nav = await yt.actions.execute('/browse', { continuation: chip, parse: true });
      const actions = nav.on_response_received_actions;
      actions?.every((item) => {
        if (item instanceof ReloadContinuationItemsCommand) {
          results.value = [item];
          return false;
        }
        return true;
      });
      sourceresults = new YT.HomeFeed(yt.actions, nav, true);

      console.log(sourceresults);
    } else {
      const searchResults = await yt.getHomeFeed();
      results.value = await [searchResults.page_contents];
      sourceresults = searchResults;
      HeaderResult.value = await searchResults.page.header_memo?.get('FeedTabbedHeader');
      if (searchResults.page_contents instanceof YTNodes.RichGrid) {
        chipOptions.value = (searchResults.page_contents.header instanceof YTNodes.FeedFilterChipBar) ? searchResults.page_contents.header : null;
      }
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
    <template v-if="HeaderResult">
      <template v-for="Header in HeaderResult">
        <template v-if="(Header instanceof YTNodes.FeedTabbedHeader)">
          <YTCommonFeedTabbedHeader :data="Header" />
        </template>
      </template>
    </template>

    <v-chip-group v-if="chipOptions" v-model="selectedChip" color="primary" @update:modelValue="applyChips">
      <v-chip v-for="chip in chipOptions.contents" :key="chip.text" :value="chip.endpoint?.payload?.token">
        {{ chip.text }}
      </v-chip>
    </v-chip-group>

    <v-infinite-scroll v-if="results" mode="intersect" @load="LoadMore">
      <template v-for="result in results">
        <template v-if="(result instanceof Helpers.YTNode)">
          <YTNode :data="result" />
        </template>
      </template>
    </v-infinite-scroll>
  </v-container>
</template>

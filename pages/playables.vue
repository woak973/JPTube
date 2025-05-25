<script setup lang="ts">
import { Helpers, YTNodes, YT, NavigateAction, ShowMiniplayerCommand } from 'youtubei.js';

const results = ref<Helpers.ObservedArray<Helpers.YTNode> | null>();
let sourceresults: YT.Channel | YT.ChannelListContinuation;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const HeaderResults = ref<YTNodes.C4TabbedHeader | YTNodes.CarouselHeader | YTNodes.InteractiveTabbedHeader | YTNodes.PageHeader | undefined>();
const chipOptions = ref<Helpers.YTNode>();
const selectedChip = ref<string>();

useHead({
  title: 'Playables - JPTube',
});

const applyChips = async () => {
  const chip = selectedChip.value;
  await fetchData(chip);
};

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
  try {
    if (sourceresults && sourceresults.has_continuation) {
      const continuationResults = await sourceresults.getContinuation();
      if (continuationResults.contents && !(continuationResults?.contents instanceof YTNodes.OpenPopupAction) && !(continuationResults?.contents instanceof NavigateAction) && !(continuationResults?.contents instanceof ShowMiniplayerCommand)) {
        if (results.value && continuationResults.contents.contents) {
          results.value.push(...continuationResults.contents.contents);
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
    let nav: YTNodes.NavigationEndpoint;
    if (chip) {
      nav = new YTNodes.NavigationEndpoint({ browseEndpoint: { browseId: 'FEmini_app_destination', params: chip } });
    } else {
      nav = new YTNodes.NavigationEndpoint({ browseEndpoint: { browseId: 'FEmini_app_destination' } });
    }
    const result = new YT.Channel(yt.actions, await nav.call(yt.actions, { parse: true }), true);
    if (result?.current_tab?.content && 'contents' in result.current_tab.content) {
      results.value = await result.current_tab?.content.contents;
    };
    sourceresults = result;
    HeaderResults.value = result.header;
    if (result?.current_tab?.content && 'header' in result.current_tab.content) {
      chipOptions.value = result.current_tab?.content.header;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
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
        <YTCommonPageHeader :data="HeaderResults" />
      </template>
      <template v-else-if="(HeaderResults instanceof YTNodes.CarouselHeader)">
        <YTCommonCarouselHeader :data="HeaderResults" />
      </template>
      <template v-else-if="(HeaderResults instanceof YTNodes.InteractiveTabbedHeader)">
        <YTCommonInteractiveTabbedHeader :data="HeaderResults" />
      </template>

    </template>

    <v-chip-group v-if="chipOptions && (chipOptions instanceof YTNodes.ChipBarView)" v-model="selectedChip" color="primary" @update:modelValue="applyChips">
      <v-chip v-for="chip in chipOptions.chips" :key="chip.text" :value="chip.endpoint?.payload?.params">
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

<script setup lang="ts">
import type { Innertube } from 'youtubei.js';
import { Helpers, YTNodes, ClientType } from 'youtubei.js';

const TabResults = ref<Helpers.ObservedArray<YTNodes.AnchoredSection> | undefined>();
const Results = ref<YTNodes.SectionList | null | undefined>();
let yt: Innertube;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');

useHead({
  title: 'Home - JPTube Kids',
});

definePageMeta({
  layout: 'kids',
});

const fetchData = async (Z?: number): Promise<void> => {
  try {
    if (!yt) {
      yt = await useInnertube('common', ClientType.KIDS);
    }

    const ytkids = await yt.kids;

    const searchResults = await ytkids.getHomeFeed();

    if (!Z) {
      TabResults.value = await searchResults?.contents?.anchors;
      Results.value = await searchResults?.contents?.anchors[0].content;
    } else {
      const C = await searchResults?.contents?.anchors[Z].endpoint.call(yt.actions, { parse: true });
      await C?.contents_memo?.forEach(async (value: Helpers.YTNode[], key: string) => {
        if (key === 'SectionList') {
          value.forEach(async (value: Helpers.YTNode) => {
            if ((value instanceof YTNodes.SectionList)) {
              Results.value = value;
            }
          });
        }
      });
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

    <v-row style="width: 100%; margin-left: 0;">
      <template v-for="(result, index) in TabResults">
        <v-col cols="12" md="6" lg="4" xl="3">
          <v-card @click="fetchData(index)">
            <v-card-title>{{ result.title }}</v-card-title>
          </v-card>
        </v-col>
      </template>

      <template v-if="(Results instanceof Helpers.YTNode)">
        <YTKidsNode :data="Results" />
      </template>
    </v-row>

  </v-container>
</template>

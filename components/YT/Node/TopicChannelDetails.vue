<template>
  <v-row v-if="data">
    <v-col cols="4" class="d-flex align-center justify-center">
      <v-img
        v-if="data.avatar && data.avatar[0]?.url" :src="getProxifiedUrl(data.avatar[0]?.url)" max-width="50%"
        style="border-radius: 50%;">
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular color="grey-lighten-4" indeterminate />
          </div>
        </template>
      </v-img>
    </v-col>
    <v-col cols="8">
      <v-card-title>{{ data.title.text }}</v-card-title>
      <v-card-subtitle>{{ data.subtitle.text }}</v-card-subtitle>
    </v-col>
  </v-row>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.TopicChannelDetails,
});

</script>

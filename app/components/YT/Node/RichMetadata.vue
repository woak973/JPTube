<template>
  <v-card v-if="data" elevation="16" :to="data.endpoint?.metadata?.url" link>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center justify-center image">
        <v-img :src="getProxifiedUrl(data.thumbnail[0]?.url || '')">
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate />
            </div>
          </template>
        </v-img>
      </v-col>
      <v-col cols="12" md="8" class="description">
        <v-card-title class="small-text omit">{{
          data.title?.text
        }}</v-card-title>
        <v-card-subtitle class="tiny-text">{{
          data.subtitle?.text
        }}</v-card-subtitle>
        <v-card-subtitle class="tiny-text">{{
          data.call_to_action?.text
        }}</v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.RichMetadata,
});
</script>

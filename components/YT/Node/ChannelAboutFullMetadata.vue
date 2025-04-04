<template>
  <template v-if="data">
    <v-card elevation="16">
      <v-row dense>
        <v-col cols="12" md="8">
          <v-card-text>{{ data.description.text }}</v-card-text>
        </v-col>
        <v-col cols="12" md="4">
          <v-card-text>
            <template v-if="(data.joined_date instanceof Misc.Text)">
              <YTMiscText :data="data.joined_date" />
            </template>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </template>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes, Misc } from 'youtubei.js';

defineProps({
  data: YTNodes.ChannelAboutFullMetadata,
});
</script>

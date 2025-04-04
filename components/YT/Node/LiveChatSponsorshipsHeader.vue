<template>
  <v-card v-if="data" elevation="16">

    <v-list-item>
      <v-row dense>
        <v-col cols="auto">
          <v-list-item style="padding: 0;">
            <v-avatar :image="getProxifiedUrl(data.author_photo[0].url)" class="mr-2" />
          </v-list-item>
        </v-col>
        <v-col>
          <v-card-title style="white-space: pre-wrap; word-break: break-all;">
            {{ data.author_name }}
            <template v-if="data.author_badges">
              <template v-for="badge in data.author_badges">
                <YTNode :data="badge" :attribute="'slide'" />
              </template>
            </template>
          </v-card-title>
          <v-card-text style="word-break: break-all;">
            <template v-if="(data.primary_text instanceof Misc.Text)">
              <YTMiscText :data="data.primary_text" />
            </template>
          </v-card-text>
        </v-col>
      </v-row>
    </v-list-item>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes, Misc } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.LiveChatSponsorshipsHeader,
});
</script>

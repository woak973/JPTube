<template>
  <template v-if="data">
    <v-card
      v-if="data" elevation="16"
      :image="data.header_overlay_image && data.header_overlay_image.length > 0 ? getProxifiedUrl(data.header_overlay_image[0].url) : ''">
      <v-list-item>
        <v-row dense>
          <v-col cols="auto">
            <v-list-item :to="data.author.endpoint?.metadata?.url" style="padding: 0;">
              <v-avatar :image="getProxifiedUrl(data.author.thumbnails[0].url)" class="mr-2" />
            </v-list-item>
          </v-col>
          <v-col>
            <v-card-title style="white-space: pre-wrap; word-break: break-all;">
              {{ data.author.name }}
              <template v-if="data.author.badges">
                <template v-for="badge in data.author.badges">
                  <YTNode :data="badge" :attribute="'slide'" />
                </template>
              </template>
              - {{ data.purchase_amount }}
            </v-card-title>
            <v-card-text style="word-break: break-all;">
              <template v-if="(data.message instanceof Misc.Text)">
                <YTMiscText :data="data.message" />
              </template>
            </v-card-text>
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
  </template>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes, Misc } from 'youtubei.js';

defineProps({
  data: YTNodes.LiveChatPaidMessage,
});
</script>

<template>
  <v-card v-if="data" elevation="16">

    <v-list-item>
      <v-row dense>
        <v-col cols="auto">
          <v-list-item :to="data.author.endpoint?.metadata?.url" style="padding: 0;">
            <v-avatar :image="getProxifiedUrl(data.author.thumbnails[0]?.url)" class="mr-2" />
          </v-list-item>
        </v-col>
        <v-col>
          <v-card-subtitle style="white-space: pre-wrap; word-break: break-all;">{{ data.author.name }}
            <template v-if="data.author.badges">
              <template v-for="badge in data.author.badges">
                <YTNode :data="badge" :attribute="'slide'" />
              </template>
            </template>・{{ data.published.text }}
          </v-card-subtitle>

          <v-card-text>
            <template v-if="(data.content instanceof Misc.Text)">
              <YTMiscText :data="data.content" />
            </template>
          </v-card-text>

          <template v-if="data.attachment">
            <YTNode :data="data.attachment" />
          </template>
          <v-card-actions>
            <v-list-item>
              <template #prepend>
                <v-icon class="me-1" icon="mdi-thumb-up" />
                <v-list-item-subtitle>{{ data.vote_count?.text }}</v-list-item-subtitle>
              </template>
            </v-list-item>
            <v-list-item
              v-if="data.action_buttons?.reply_button"
              :to="data.action_buttons?.reply_button?.endpoint.metadata.url">
              <template #prepend>
                <v-icon class="me-1" icon="mdi-comment-text-outline" />
                <v-list-item-subtitle>
                  {{ data.action_buttons?.reply_button?.text }}
                </v-list-item-subtitle>
              </template>
            </v-list-item>
          </v-card-actions>
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

defineProps({
  data: YTNodes.BackstagePost,
});
</script>

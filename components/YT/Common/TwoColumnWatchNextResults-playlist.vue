<template>
  <v-card v-if="data" :title="data?.title" flat link :to="`/playlist?list=${data?.id}`">
    <template #append>
      <v-btn icon @click.stop.prevent ="$emit('togglePLComponent')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card-subtitle>
      <template v-if="(data?.author instanceof Misc.Author)">
        <v-row>
          <v-col cols="auto">
            <v-list-item :to="data?.author.endpoint?.metadata?.url" link>
              <template #prepend>
                <v-avatar
                  color="grey-darken-3" size="36"
                  :image="getProxifiedUrl(data?.author.thumbnails[0]?.url || '')" />
              </template>

              <v-list-item-title>{{ data?.author.name }}
                <template v-if="data?.author.badges">
                  <template v-for="badge in data?.author.badges">
                    <YTNode :data="badge" :attribute="'slide'" />
                  </template>
                </template>
              </v-list-item-title>
            </v-list-item>
          </v-col>
        </v-row>
      </template>
      <template v-else-if="(data?.author instanceof Misc.Text)">
        {{ data.author.text }}
      </template>
    </v-card-subtitle>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import type { YTNodes } from 'youtubei.js';
import { Misc } from 'youtubei.js';

defineProps<{
  data: YTNodes.TwoColumnWatchNextResults['playlist'];
}>();

defineEmits(['togglePLComponent']);
</script>

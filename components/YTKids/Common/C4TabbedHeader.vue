<template>
  <template v-if="data">
    <v-card elevation="16" :image="data.banner && data.banner[0] ? getProxifiedUrl(data.banner[0].url) : ''">
      <v-row>
        <v-col cols="4" class="d-flex align-center justify-center">
          <v-img
            :src="getProxifiedUrl(data.author.thumbnails[0]?.url || '')" max-width="50%"
            style="border-radius: 50%;">
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate />
              </div>
            </template>
          </v-img>
        </v-col>
        <v-col cols="8">
          <v-card-title class="semi-transparent-background">{{ data.author.name }}</v-card-title>
          <v-card-subtitle class="semi-transparent-background">{{ data.subscribers?.text }}</v-card-subtitle>
        </v-col>
      </v-row>

    </v-card>
  </template>
  <div v-else>
    No data was provided
  </div>

</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.C4TabbedHeader,
});

</script>

<style scoped>
.omit {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    padding-bottom: 0;
    word-break: break-word;
}

.semi-transparent-background {
    background-color: rgba(255, 255, 255, 0.6);
    /* 白色の半透明背景 */
}
</style>

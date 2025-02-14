<template>
    <v-card v-if="data" elevation="16" :to="`/music/watch?v=${data.id}`" link>
      <v-row>
        <v-col cols="auto" class="d-flex align-center justify-center">
          <v-img :src="getProxifiedUrl(data.thumbnails[0].url)" max-width="50%" style="border-radius: 50%;">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-col>
        <v-col>
          <v-card-title>{{ data.title }}</v-card-title>
          <v-card-actions>
            <v-list-item :to="`/music/channel/${data?.artists[0]?.channel_id}/featured`" link>
              <v-list-item-title>{{ data?.artists[0]?.name }}</v-list-item-title>
            </v-list-item>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
    <div v-else>
      データがありません
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    data: Object
  });
  </script>

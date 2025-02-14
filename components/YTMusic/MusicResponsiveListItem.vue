<template>
    <v-card v-if="data" elevation="16" :to="`/music/watch?v=${data.id}`" link>
      <v-row>
        <v-col cols="12" sm="4" class="d-flex align-center justify-center">
          <v-avatar :image="getProxifiedUrl(data.thumbnails[0].url)" size="24">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card-title>{{ data.title }}</v-card-title>
          <v-card-actions>
            <v-list-item :to="`/channel/${data?.artists[0]?.channel_id}/featured`" link>
              <v-list-item-title>{{ data?.artists[0]?.name }}</v-list-item-title>
            </v-list-item>
          </v-card-actions>
          <v-card-subtitle>{{ data?.flex_columns[1]?.title }}</v-card-subtitle>
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

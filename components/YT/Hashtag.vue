<template>
    <v-card v-if="data" elevation="16" :to="data.endpoint.metadata.url" link>
      <v-row>
        <v-col cols="4" class="d-flex align-center justify-center">
          <v-img :src="getProxifiedUrl(data.hashtag_thumbnail[0].url)" max-width="50%" style="background-color: rgb(175, 58, 0); max-width: 128px;" rounded>
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-col>
        <v-col cols="8">
          <v-card-title>{{ data.hashtag.text }}</v-card-title>
          <v-card-subtitle>{{ data.hashtag_info_text.text }}</v-card-subtitle> 
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
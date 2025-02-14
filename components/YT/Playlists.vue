<template>
    <v-card v-if="data" elevation="16" :to="`/watch?list=${data.content_id}`" link>
      <v-row>
        <v-col cols="12" sm="4" class="d-flex align-center justify-center">
          <v-img :src="getProxifiedUrl(data.content_image.primary_thumbnail.image[0].url)" aspect-ratio="16/9" rounded>
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
            <div class="duration-overlay">{{ data.content_image.primary_thumbnail.overlays[0].badges[0].text }}</div>
          </v-img>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card-title>{{ data.metadata.title.text }}</v-card-title>
          <v-card-subtitle>{{ data.metadata.metadata.metadata_rows[0].metadata_parts[0].text }}</v-card-subtitle>

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
  
  <style scoped>
  .duration-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
  }
  </style>
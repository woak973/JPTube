<template>
  <v-card v-if="data" elevation="16" :to="data.endpoint?.metadata?.url" link>
    <v-row>
      <v-col cols="12" sm="4" class="d-flex align-center justify-center">
        <v-img :src="getProxifiedUrl(data.thumbnails[0]?.url || '')" aspect-ratio="16/9" rounded>
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate />
            </div>
          </template>
          <div class="duration-overlay">{{ data.duration.text }}</div>
        </v-img>
      </v-col>
      <v-col cols="12" sm="8">
        <v-card-title>{{ data.title }}</v-card-title>
        <v-card-subtitle>{{ data.short_view_count?.text }}・{{ data.published?.text }}</v-card-subtitle>
        <v-card-actions>
          <v-list-item :to="data.author.endpoint?.metadata?.url" link>
            <template #prepend>
              <v-avatar :image="getProxifiedUrl(data.author.thumbnails[0]?.url || '')" size="24" />
            </template>
            <v-list-item-title>{{ data.author.name }}</v-list-item-title>
          </v-list-item>
        </v-card-actions>
        <v-card-text v-if="$vuetify.display.smAndUp">{{ data.description }}</v-card-text>
      </v-col>
    </v-row>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.Video,
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

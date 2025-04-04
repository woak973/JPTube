<template>
  <v-card v-if="data">
    <v-card-title class="titletext" style="padding-bottom: 0">{{ data.basic_info.title
    }}</v-card-title>
    <v-card-actions>
      <v-row justify="space-between">
        <v-col cols="auto">
          <v-list-item :to="`/music/channel/${data.basic_info.channel_id}`" link>
            <v-list-item-title>{{ data.basic_info.author
            }}</v-list-item-title>
          </v-list-item>
        </v-col>
        <v-col cols="auto">
          <v-list-item>
            <v-slide-group>
              <div>
                <v-btn
                  :disabled="downloading" variant="tonal" class="rounded-pill mx-2"
                  @click="$emit('downloadVideo')">
                  <v-icon v-if="!downloading">mdi-download</v-icon>
                  <v-progress-circular v-else indeterminate size="20" />
                  Download
                </v-btn>
              </div>
              <div>
                <v-btn variant="tonal" class="rounded-pill mx-2" @click.stop="$emit('share')">
                  <v-icon>mdi-share</v-icon>
                  Share
                </v-btn>
              </div>
            </v-slide-group>
          </v-list-item>
        </v-col>

      </v-row>
    </v-card-actions>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import { YTMusic } from 'youtubei.js';

defineProps({
  data: YTMusic.TrackInfo,
  downloading: Boolean,
});

defineEmits(['downloadVideo', 'share']);
</script>

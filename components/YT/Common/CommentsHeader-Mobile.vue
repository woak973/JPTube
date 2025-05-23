<template>
  <v-card v-if="data" :title="data.title.text">
    <template #append>
      <v-btn icon @click="$emit('toggleCommentComponent')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card-text>{{ data.count.text }}</v-card-text>
    <v-card-actions>
      <v-chip-group mandatory>
        <v-chip
          color="primary"
          @click="$emit('update:selectedSort', 'TOP_COMMENTS'); $emit('apply-com-sort')"
        >
          <v-icon left>mdi-sort</v-icon>
          {{ data.sort_menu?.sub_menu_items?.[0]?.title || 'Top Comments' }}
        </v-chip>
        <v-chip
          color="primary"
          @click="$emit('update:selectedSort', 'NEWEST_FIRST'); $emit('apply-com-sort')"
        >
          <v-icon left>mdi-sort</v-icon>
          {{ data.sort_menu?.sub_menu_items?.[1]?.title || 'Newest First' }}
        </v-chip>
      </v-chip-group>
    </v-card-actions>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.CommentsHeader,
});

defineEmits(['update:selectedSort', 'apply-com-sort', 'toggleCommentComponent']);
</script>

<template>
  <v-card v-if="data" @click="$emit('toggleCommentComponent')">
    <v-card-title>{{ data.title }}</v-card-title>
    <v-card-subtitle>{{ data.count.text }}</v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

defineEmits(['toggleCommentComponent']);

defineProps({
  data: YTNodes.CommentsHeader,
});
</script>

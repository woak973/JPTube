<template>
  <v-card v-if="data">
    <v-card-text>{{ data.title.text }}</v-card-text>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import type { EmptyProductDetails } from './CustomNode';

const props = defineProps<{
  data: EmptyProductDetails;
}>();
</script>

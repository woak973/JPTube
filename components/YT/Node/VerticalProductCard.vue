<template>
  <v-card v-if="data" elevation="16" :href="data.endpoint?.payload?.commands?.[1]?.urlEndpoint?.url" link>
    <v-img :src="getProxifiedUrl(data.thumbnail[0]?.url)">
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </div>
      </template>
    </v-img>
    <v-card-text class="omit">{{ data.title }}</v-card-text>
    <v-card-subtitle>{{ data.price }}{{ data.additional_fees_text }}</v-card-subtitle>
    <v-card-subtitle><s>{{ data.deals_data.sales?.original_price }}</s></v-card-subtitle>
    <v-card-subtitle>{{ data.merchant_name }}</v-card-subtitle>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">
import type { VerticalProductCard } from './CustomNode';

defineProps<{
  data: VerticalProductCard;
}>();

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
</style>

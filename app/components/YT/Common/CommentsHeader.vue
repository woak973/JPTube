<template>
  <v-col v-if="data">
    <strong>{{ data.count.text }}</strong>
    <v-menu transition="scale-transition">
      <template #activator="{ props }">
        <v-btn color="primary" dark v-bind="props" v-on="props">
          <v-icon left>mdi-sort</v-icon>
          {{ data.sort_menu?.title }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$emit('update:selectedSort', 'TOP_COMMENTS'); $emit('apply-com-sort')">
          <v-list-item-title v-if="data.sort_menu?.sub_menu_items">{{
            data.sort_menu.sub_menu_items[0]?.title
          }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$emit('update:selectedSort', 'NEWEST_FIRST'); $emit('apply-com-sort')">
          <v-list-item-title v-if="data.sort_menu?.sub_menu_items">{{
            data.sort_menu.sub_menu_items[1]?.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-col>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.CommentsHeader,
});

defineEmits(['update:selectedSort', 'apply-com-sort']);
</script>

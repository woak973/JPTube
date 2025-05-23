<template>
  <v-card title="Toggle Playlist" color="rgba(235,221,221,0.949)" @click="$emit('togglePLComponent')">
    <template #append>
      <v-btn icon color="rgba(235,221,221,0.949)">
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
  </v-card>
</template>

<script setup lang="ts">
defineEmits(['togglePLComponent']);
</script>

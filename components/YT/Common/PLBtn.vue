<template>
  <v-card title="Toggle Playlist" @click="$emit('togglePLComponent')">
    <template #append>
      <v-btn icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-card>
</template>

<script setup lang="ts">
defineEmits(['togglePLComponent']);
</script>

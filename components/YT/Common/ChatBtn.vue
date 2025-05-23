<template>
  <v-card @click="$emit('toggleChatComponent')">
    <v-card-title>Open Chat</v-card-title>
  </v-card>
</template>

<script setup lang="ts">
defineEmits(['toggleChatComponent']);
</script>

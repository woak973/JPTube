<template>
  <v-window show-arrows="hover">
    <v-window-item>
      <v-card @click="$emit('toggleCommentComponent')">
        <v-card-title>Comment</v-card-title>
        <v-card-subtitle>toggle comment</v-card-subtitle>
      </v-card>
    </v-window-item>
    <v-window-item>
      <v-card @click="$emit('toggleChatComponent')">
        <v-card-title>Chat</v-card-title>
        <v-card-subtitle>toggle chat</v-card-subtitle>
      </v-card>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
defineEmits(['toggleChatComponent', 'toggleCommentComponent']);
</script>

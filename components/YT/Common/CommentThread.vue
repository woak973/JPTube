<template>
  <v-card v-if="data" elevation="16">
    <template v-if="data.comment">
      <YTCommonCommentView :data="data.comment" />
    </template>
    <div v-if="data.has_replies && data.replies" class="reply-container">
      <details>
        <summary class="hover-blue">{{ data.comment_replies_data?.view_replies?.text }}</summary>
        <v-row>
          <v-col cols="12">
            <template v-for="reply in data.replies">
              <YTCommonCommentView :data="reply" />
            </template>
          </v-col>
        </v-row>
      </details>
    </div>
  </v-card>
  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { YTNodes } from 'youtubei.js';

defineProps({
  data: YTNodes.CommentThread,
});
</script>

<style scoped>
.hover-blue:hover {
    color: #065fd4;
}

.reply-container {
    margin-left: 72px;
}
</style>

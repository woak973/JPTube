<template>
  <v-card v-for="post in posts" :key="post.id" class="mt-4" density="compact">
    <v-row>
      <v-col cols="auto">
        <v-list-item :to="`/firebase/channel/${post.authorId}`" link style="padding: 0;">
          <v-card-item density="compact">
            <v-card-title>
              {{ post.displayName }}
              <v-icon v-if="post.role === 'Admin'" color="blue">mdi-check-decagram</v-icon>
              <v-icon v-else-if="post.role === 'Moderator'" color="teal">mdi-check-circle</v-icon>
              <v-icon v-else-if="post.role === 'Punished'" color="red">mdi-lock</v-icon>
            </v-card-title>

            <v-card-subtitle>{{ `@${post.authorId}` }}</v-card-subtitle>
          </v-card-item>
        </v-list-item>
      </v-col>
      <v-spacer />
    </v-row>

    <v-card-text>{{ post.text }}</v-card-text>
    <v-card-subtitle>
      {{ post.timestamp ? post.timestamp.toDate().toLocaleString() : 'No timestamp available' }}
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col>
          <v-chip v-for="tag in post.tags" :key="tag" class="ma-1" :to="`/firebase/tags/${tag}`" link>{{ tag }}</v-chip>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :color="post.likes.includes(auth.currentUser?.uid) ? 'pink' : 'primary'"
        @click="() => $emit('like-post', post.id)">
        <v-icon>{{ post.likes.includes(auth.currentUser?.uid) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        Like ({{ post.likes.length }})
      </v-btn>
      <v-btn
        v-if="post.authorId === auth.currentUser?.uid" color="error"
        class="ml-auto" @click="() => $emit('delete-post', post.id)">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import auth from '~/plugins/firebase';
import type { DocumentData } from 'firebase/firestore';
defineProps({
  posts: {
    type: Array as () => Array<{
      id: string;
      displayName: unknown;
      role: unknown;
    } & DocumentData>,
    default: () => [],
  },
});

defineEmits(['like-post', 'delete-post']);
</script>

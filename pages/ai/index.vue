<script setup lang="ts">
import { useChat } from '@ai-sdk/vue';
import Shiki from '@shikijs/markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import { bundledLanguages } from 'shiki';

const { messages, input, handleSubmit } = useChat();
const OPT = await Shiki({
  themes: {
    light: 'github-light',
    dark: 'vitesse-dark',
  },
  langs: Object.keys(bundledLanguages) as (keyof typeof bundledLanguages)[],
});

/* const customRenderers = {
  bullet_list_open: () => '<v-table><tbody>', // ← _open
  ol_open: () => '<v-list class="my-2" density="compact" type="ol">', // ← _open
  bullet_list_close: () => '</tbody></v-table>',
  ol_close: () => '</v-list>',
  list_item_open: () => '<tr>', // ← _open
  list_item_close: () => '</tr>',
};
*/
</script>

<template>
  <v-container>
    <div>
      <v-sheet
        v-for="m in messages"
        :key="m.id" class="bg-grey-lighten-2 my-4 d-flex" :style="{
          position: 'relative',
        }">
        <v-avatar :color="m.role === 'user' ? 'primary' : 'secondary'" class="mr-2">
          <v-icon>{{ m.role === 'user' ? 'mdi-account' : 'mdi-robot' }}</v-icon>
        </v-avatar>
        <v-card :color="m.role === 'user' ? 'primary' : 'secondary'">
          <v-card-title>{{ m.role === 'user' ? 'User: ' : 'AI: ' }}</v-card-title>
          <div v-for="(part, partindex) in m.parts" :key="partindex">
            <div v-if="part.type === 'text'">
              <v-card-text>
                <MarkDown :source="part.text" :plugins="[OPT, MarkdownItAnchor]" />
              </v-card-text>
            </div>
            <div v-else-if="part.type === 'tool-invocation'">
              <v-card-text>I'm invoking the tool</v-card-text>
            </div>
          </div>
        </v-card>
      </v-sheet>

      <v-form :style="{ position: 'fixed', bottom: '20px', width: '92.8%' }" @submit="handleSubmit">
        <v-text-field
          v-model="input"
          placeholder="Say something..."
          hide-details
          density="comfortable"
          variant="solo"
        />
      </v-form>
    </div>
  </v-container>
</template>

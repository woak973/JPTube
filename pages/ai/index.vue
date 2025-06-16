<script setup lang="ts">
import { useChat } from '@ai-sdk/vue';

const { messages, input, handleSubmit } = useChat();
</script>

<template>
  <div>
    <div
      v-for="(m, index) in messages"
      :key="m.id ? m.id : index"
    >
      {{ m.role === 'user' ? 'User: ' : 'AI: ' }}
      <div v-for="(part, partindex) in m.parts" :key="partindex">
        <div v-if="part.type === 'text'">
          <span>{{ part.text }}</span>
          <MDC :key="part.text.length" :value="part.text" />
        </div>
      </div>
    </div>

    <form @submit="handleSubmit">
      <input
        v-model="input"
        placeholder="Say something..."
      >
    </form>
  </div>
</template>

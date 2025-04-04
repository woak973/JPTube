<template>
  <template v-for="result in data.runs" v-if="data">
    <template v-if="(result instanceof Misc.TextRun)">
      <template v-if="result.attachment">
        <template v-for="source in result.attachment?.element?.type?.imageType?.image?.sources">
          <v-avatar
            :image="getProxifiedUrl(source.url)"
            class="mr-2" rounded="0" size="14" />
        </template>
      </template>
      <template v-if="result.endpoint">
        <span style="white-space: pre-wrap; word-break: break-all;">
          <NuxtLink :to="result.endpoint?.metadata?.url">{{ result.text }}</NuxtLink>
        </span>
      </template>
      <template v-else>
        <span style="white-space: pre-wrap; word-break: break-all;">{{ result.text }}</span>
      </template>
    </template>
    <template v-else-if="(result instanceof Misc.EmojiRun)">
      <template v-if="result.emoji.image">
        <template v-for="img in result.emoji.image">
          <v-avatar :image="getProxifiedUrl(img.url)" class="mr-2" rounded="0" size="14" />
        </template>
      </template>
      <template v-else>
        <span style="white-space: pre-wrap; word-break: break-all;">{{ result.text }}</span>
      </template>
    </template>
  </template>

  <div v-else>
    No data was provided
  </div>
</template>

<script setup lang="ts">

import { Misc } from 'youtubei.js';

const props = defineProps({
  data: Misc.Text,
});

</script>

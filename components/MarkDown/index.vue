<script lang="ts" setup>
import MarkdownIt, {
  type Options as MarkdownItOptions,
  type PluginSimple,
} from 'markdown-it';
import { computed, shallowRef, toRefs } from 'vue';

const props = defineProps<{
  source: string;
  options?: MarkdownItOptions;
  plugins?: PluginSimple[];
  rendererRules?: object;
}>();

const { source, options, plugins, rendererRules } = toRefs(props);

const md = shallowRef(new MarkdownIt(options?.value ?? {}));

if (plugins?.value) {
  for (const plugin of plugins.value) {
    md.value.use(plugin);
  }
}

// --- カスタムレンダラー制御部分 ---
if (rendererRules?.value) {
  Object.assign(md.value.renderer.rules, rendererRules.value);
}
// ---------------------------------

const content = computed(() => md.value.render(source.value));
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="content" />
</template>

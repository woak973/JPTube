<script setup lang="ts">
const theme = useTheme();

onMounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.global.name.value = 'dark';
  }
});

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

  </div>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

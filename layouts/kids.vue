<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const drawer = ref<boolean>(false);
const searchQuery = ref<string>('');
const value = ref<string>('');
const suggestions = ref<string[]>([]);
const langDialog = ref<HTMLElement | null>(null);
const child = ref<string>(uuidv4());

watch(searchQuery, (newQuery): void => {
  if (newQuery) {
    fetchSuggestions(newQuery);
  } else {
    suggestions.value = [];
  }
});

const search = async (): Promise<void> => {
  if (searchQuery.value) {
    const yt = await useInnertube('common');
    try {
      const resolvedURL = await yt.resolveURL(searchQuery.value);
      if (resolvedURL.metadata.page_type !== 'WEB_PAGE_TYPE_UNKNOWN' && !searchQuery.value.startsWith('#')) {
        navigateTo(resolvedURL.metadata?.url);
        return;
      }
    } catch (error) {
      console.error('Error resolving URL:', error);
    }

    const encodedQuery = encodeURIComponent(searchQuery.value);
    navigateTo(`/kids/search/${encodedQuery}`);
  }
};

const clearSearch = (): void => {
  searchQuery.value = '';
};

const fetchSuggestions = async (query: string): Promise<void> => {
  try {
    const yt = await useInnertube('common');
    const response = await yt.getSearchSuggestions(query);
    suggestions.value = response.map((suggestion: string) => suggestion);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
};

const openLangDialog = (): void => {
  if (langDialog.value) {
    (langDialog.value as unknown as { open: () => void }).open();
  }
};

const Refresh = (): void => {
  child.value = uuidv4();
};
</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <router-link to="/kids" style="text-decoration: none; color: inherit;">
        <v-app-bar-title>JPTube Kids</v-app-bar-title>
      </router-link>
      <v-spacer />
      <v-combobox
        v-model="searchQuery" :items="suggestions" label="Search" single-line hide-details clearable
        :filter="() => { return true; }" prepend-inner-icon="mdi-magnify" clear-icon="mdi-close-circle"
        @keyup.enter="search" @click:prepend-inner="search" @click:clear="clearSearch" />
      <v-btn icon @click="openLangDialog">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item title="JPTube Kids" subtitle="Welcome" />
      <v-divider />
      <v-list-item prepend-icon="mdi-home" link title="Home" to="/kids" />
      <v-divider />
      <v-list-item title="Other Services" subtitle="Welcome" />
      <v-list-item prepend-icon="mdi-play-box" link title="JPTube" to="/" />
      <v-list-item prepend-icon="mdi-music-circle" link title="JPTube Music" to="/music" />

    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <slot :key="child" :value="value" />
    </v-main>

    <YTCommonLangDialog ref="langDialog" @Refresh="Refresh" />
  </v-app>
</template>

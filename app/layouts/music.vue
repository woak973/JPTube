<script setup lang="ts">
import { Helpers, YTNodes } from 'youtubei.js';
import { v4 as uuidv4 } from 'uuid';

const drawer = ref<boolean>(false);
const searchQuery = ref<string>('');
const value = ref<string>('');
const suggestions = ref<string[] | undefined>([]);
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
    const encodedQuery = encodeURIComponent(searchQuery.value);
    navigateTo(`/music/search/${encodedQuery}`);
  }
};

const clearSearch = (): void => {
  searchQuery.value = '';
};

const fetchSuggestions = async (query: string): Promise<void> => {
  try {
    const yt = await useInnertube('common');
    const music = await yt.music;
    const response = await music.getSearchSuggestions(query);
    suggestions.value = response[0]?.contents
      .filter((suggestion: Helpers.YTNode) => suggestion instanceof YTNodes.SearchSuggestion)
      .map(suggestion => suggestion.suggestion.text)
      .filter((text): text is string => text !== undefined);
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
      <router-link to="/music" style="text-decoration: none; color: inherit;">
        <v-app-bar-title>JPTube Music</v-app-bar-title>
      </router-link>
      <v-spacer />
      <v-combobox
        v-model="searchQuery" :items="suggestions" :label="$t('guide.SearchMusic')" single-line hide-details clearable
        :filter="() => { return true; }" prepend-inner-icon="mdi-magnify" clear-icon="mdi-close-circle"
        @keyup.enter="search" @click:prepend-inner="search" @click:clear="clearSearch" />
      <v-btn icon @click="openLangDialog">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item title="JPTube Music" :subtitle="$t('guide.Welcome')" />
      <v-divider />
      <v-list-item prepend-icon="mdi-home" link :title="$t('guide.Home')" to="/music" />
      <v-list-item prepend-icon="mdi-compass" link :title="$t('guide.Explore')" to="/music/explore" />
      <v-divider />
      <v-list-item :title="$t('guide.OtherServices')" :subtitle="$t('guide.Welcome')" />
      <v-list-item prepend-icon="mdi-play-box" link title="JPTube" to="/" />
      <v-list-item prepend-icon="mdi-play-protected-content" link title="JPTube Kids" to="/kids" />

    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <slot :key="child" :value="value" />
    </v-main>

    <YTCommonLangDialog ref="langDialog" @Refresh="Refresh" />
  </v-app>
</template>

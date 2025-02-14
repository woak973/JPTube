<script setup lang="ts">
import { Innertube, UniversalCache } from 'youtubei.js';

const drawer = ref(false);
const searchQuery = ref('');
const value = ref('');
const suggestions = ref<string[]>([]);
const langDialog = ref<HTMLElement | null>(null);
const langStore = useLangStore();
const locationStore = useLocationStore();

const createYTInstance = async () => {
  const lang = langStore.lang || 'ja';
  const location = locationStore.location || 'JP';
  return await Innertube.create({
    fetch: fetchFn,
    cache: new UniversalCache(false),
    lang: lang,
    location: location
  });
};

watch(searchQuery, (newQuery) => {
  if (newQuery) {
    fetchSuggestions(newQuery);
  } else {
    suggestions.value = [];
  }
});

const search = async () => {
  if (searchQuery.value) {
    const yt = await createYTInstance();
    try {
      const resolvedURL = await yt.resolveURL(searchQuery.value);
      if (resolvedURL.metadata.page_type !== 'WEB_PAGE_TYPE_UNKNOWN' && !searchQuery.value.startsWith('#')) {
        console.log("resolvedURL", resolvedURL);
        navigateTo(resolvedURL.metadata.url);
        return;
      }
    } catch (error) {
      console.error('Error resolving URL:', error);
    }

    const encodedQuery = encodeURIComponent(searchQuery.value);
    navigateTo(`/search/${encodedQuery}`);
  }
};

const clearSearch = () => {
  searchQuery.value = '';
};

const fetchSuggestions = async (query: string): Promise<void> => {
  try {
    const yt = await createYTInstance();
    const response = await yt.getSearchSuggestions(query);
    suggestions.value = response.map((suggestion: any) => suggestion);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
};

const openLangDialog = () => {
  if (langDialog.value) {
    (langDialog.value as any).open();
  }
};
</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link to="/" style="text-decoration: none; color: inherit;">
        <v-app-bar-title>JPTube</v-app-bar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-combobox v-model="searchQuery" :items="suggestions" label="Search" single-line hide-details clearable
        :filter="() => { return true; }" prepend-inner-icon="mdi-magnify" clear-icon="mdi-close-circle"
        @keyup.enter="search" @click:prepend-inner="search" @click:clear="clearSearch" />
      <v-btn icon @click="openLangDialog">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item title="JPTube" subtitle="Welcome"></v-list-item>
      <v-divider></v-divider>
      <v-list-item prepend-icon="mdi-home" link title="Home(Trending)" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-music" link title="Music"
        to="/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ/featured"></v-list-item>
      <v-list-item prepend-icon="mdi-access-point" link title="Live"
        to="/channel/UC4R8DWoMoI7CAwX8_LjQHig/featured"></v-list-item>
      <v-list-item prepend-icon="mdi-gamepad-variant" link title="Gaming"
        to="/channel/UCOpNcN46UbXVtpKMrmU4Abg/featured"></v-list-item>
      <v-list-item prepend-icon="mdi-newspaper" link title="News"
        to="/channel/UCYfdidRxbB8Qhf0Nx7ioOYw/featured"></v-list-item>
      <v-list-item prepend-icon="mdi-trophy-variant" link title="Sports"
        to="/channel/UCEgdi0XIXXZ-qJOFPf4JSKw/featured"></v-list-item>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <slot :value="value" />
    </v-main>

    <LangDialog ref="langDialog" />
  </v-app>
</template>
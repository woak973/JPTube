<script setup lang="ts">
import { Innertube, UniversalCache } from 'youtubei.js';
import { v4 as uuidv4 } from 'uuid';

const drawer = ref<boolean>(false);
const searchQuery = ref<string>('');
const value = ref<string>('');
const suggestions = ref<string[]>([]);
const langDialog = ref<HTMLElement | null>(null);
const langStore = useLangStore();
const locationStore = useLocationStore();
const child = ref<string>(uuidv4());

const createYTInstance = async (): Promise<Innertube> => {
  const lang = langStore.lang || 'ja';
  const location = locationStore.location || 'JP';
  return await Innertube.create({
    fetch: fetchFn,
    cache: new UniversalCache(false),
    lang: lang,
    location: location
  });
};

watch(searchQuery, (newQuery): void => {
  if (newQuery) {
    fetchSuggestions(newQuery);
  } else {
    suggestions.value = [];
  }
});

const search = async (): Promise<void> => {
  if (searchQuery.value) {
    const yt = await createYTInstance();
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
    navigateTo(`/search/${encodedQuery}`);
  }
};

const clearSearch = (): void => {
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

const openLangDialog = (): void => {
  if (langDialog.value) {
    (langDialog.value as any).open();
  }
};

const Refresh = (): void => {
  child.value = uuidv4();
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
      <v-list-item prepend-icon="mdi-music" link title="Music" to="/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ"></v-list-item>
      <v-list-item prepend-icon="mdi-movie-open" link title="Movies & TV" to="/channel/UClgRkhTL3_hImCAmdLfDE4g"></v-list-item>
      <v-list-item prepend-icon="mdi-access-point" link title="Live"
        to="/channel/UC4R8DWoMoI7CAwX8_LjQHig"></v-list-item>
      <v-list-item prepend-icon="mdi-gamepad-variant" link title="Gaming"
        to="/channel/UCOpNcN46UbXVtpKMrmU4Abg"></v-list-item>
      <v-list-item prepend-icon="mdi-newspaper" link title="News" to="/channel/UCYfdidRxbB8Qhf0Nx7ioOYw"></v-list-item>
      <v-list-item prepend-icon="mdi-trophy-variant" link title="Sports"
        to="/channel/UCEgdi0XIXXZ-qJOFPf4JSKw"></v-list-item>
      <v-list-item prepend-icon="mdi-school" link title="Courses" to="/courses"></v-list-item>
      <v-divider></v-divider>
      <v-list-item title="Other Services" subtitle="Welcome"></v-list-item>
      <v-list-item prepend-icon="mdi-music-circle" link title="JPTube Music" to="/music"></v-list-item>
      <v-list-item prepend-icon="mdi-play-protected-content" link title="JPTube Kids" to="/kids"></v-list-item>
      <v-list-item prepend-icon="mdi-forum" link title="JPTube Forum" to="/firebase/"></v-list-item>


    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <slot :value="value" :key="child" />
    </v-main>

    <YTCommonLangDialog ref="langDialog" @Refresh="Refresh" />
  </v-app>
</template>
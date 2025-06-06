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
    navigateTo(`/search/${encodedQuery}`);
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
    ((langDialog.value as unknown) as { open(): void }).open();
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
      <router-link to="/" style="text-decoration: none; color: inherit;">
        <v-app-bar-title>JPTube</v-app-bar-title>
      </router-link>
      <v-spacer />
      <v-combobox
        v-model="searchQuery" :items="suggestions" :label="$t('guide.Search')" single-line hide-details clearable
        :filter="() => { return true; }" prepend-inner-icon="mdi-magnify" clear-icon="mdi-close-circle"
        @keyup.enter="search" @click:prepend-inner="search" @click:clear="clearSearch" />
      <v-btn icon @click="openLangDialog">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item title="JPTube" :subtitle="$t('guide.Welcome')" />
      <v-divider />
      <v-list-item prepend-icon="mdi-home" link :title="$t('guide.Home(Trending)')" to="/" />
      <v-list-item prepend-icon="mdi-home-account" link :title="$t('guide.HomeFeed')" to="/home" />
      <v-list-item prepend-icon="mdi-music" link :title="$t('guide.Music')" to="/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ" />
      <v-list-item prepend-icon="mdi-movie-open" link :title="$t('guide.Movies&TV')" to="/channel/UClgRkhTL3_hImCAmdLfDE4g" />
      <v-list-item
        prepend-icon="mdi-access-point" link :title="$t('guide.Live')"
        to="/channel/UC4R8DWoMoI7CAwX8_LjQHig" />
      <v-list-item
        prepend-icon="mdi-gamepad-variant" link :title="$t('guide.Gaming')"
        to="/channel/UCOpNcN46UbXVtpKMrmU4Abg" />
      <v-list-item prepend-icon="mdi-newspaper" link :title="$t('guide.News')" to="/channel/UCYfdidRxbB8Qhf0Nx7ioOYw" />
      <v-list-item
        prepend-icon="mdi-trophy-variant" link :title="$t('guide.Sports')"
        to="/channel/UCEgdi0XIXXZ-qJOFPf4JSKw" />
      <v-list-item prepend-icon="mdi-lightbulb-outline" link :title="$t('guide.Learning')" to="/channel/UCtFRv9O2AHqOZjjynzrv-xg" />
      <v-list-item prepend-icon="mdi-school" link :title="$t('guide.Courses')" to="/courses" />
      <v-list-item prepend-icon="mdi-hanger" link :title="$t('guide.Fashion&Beauty')" to="/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ" />
      <v-list-item prepend-icon="mdi-dots-grid" link :title="$t('guide.Playables')" to="/playables" />
      <v-divider />
      <v-list-item :title="$t('guide.OtherServices')" :subtitle="$t('guide.Welcome')" />
      <v-list-item prepend-icon="mdi-music-circle" link title="JPTube Music" to="/music" />
      <v-list-item prepend-icon="mdi-play-protected-content" link title="JPTube Kids" to="/kids" />

    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <slot :key="child" :value="value" />
    </v-main>

    <YTCommonLangDialog ref="langDialog" @Refresh="Refresh" />
  </v-app>
</template>

<script lang="ts">
import { Innertube, UniversalCache } from 'youtubei.js';
import { fetchFn } from '@/composables/useYouTube';

export default {
  data: () => ({
    drawer: false,
    searchQuery: '', // 検索内容を保持するプロパティを追加
    value: '', // 'value' プロパティを追加
    suggestions: [] as string[], // オートコンプリートの候補を保持するプロパティを追加
  }),
  watch: {
    searchQuery(newQuery) {
      if (newQuery) {
        this.fetchSuggestions(newQuery);
      } else {
        this.suggestions = [];
      }
    },
  },
  methods: {
    search() {
      if (this.searchQuery) {
        const encodedQuery = encodeURIComponent(this.searchQuery);
        navigateTo(`/search/${encodedQuery}`);
      }
    },
    clearSearch() {
      this.searchQuery = '';
    },
    async fetchSuggestions(query: string): Promise<void> {
      try {
        const yt = await Innertube.create({
          fetch: fetchFn,
          cache: new UniversalCache(false),
          lang: 'ja',
          location: 'JP'
        });
        const response = await yt.getSearchSuggestions(query);
        this.suggestions = response.map((suggestion: any) => suggestion);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    },
  },
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
      <v-combobox v-model="searchQuery" :items="suggestions" label="検索" single-line hide-details clearable
        :filter="() => { return true; }" append-inner-icon="mdi-magnify" clear-icon="mdi-close-circle"
        @keyup.enter="search" @click:append-inner="search" @click:clear="clearSearch" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item title="JPTube" subtitle="ようこそ"></v-list-item>
      <v-divider></v-divider>
      <v-list-item prepend-icon="mdi-home" link title="ホーム" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-music" link title="Music" to="/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ/featured"></v-list-item>
      <v-list-item prepend-icon="mdi-access-point" link title="Live" to="/channel/UC4R8DWoMoI7CAwX8_LjQHig/featured"></v-list-item>
      <v-list-item prepend-icon="mdi-gamepad-variant" link title="Gaming" to="/channel/UCOpNcN46UbXVtpKMrmU4Abg/featured"></v-list-item>
      <v-list-item prepend-icon="mdi-newspaper" link title="News" to="/channel/UCYfdidRxbB8Qhf0Nx7ioOYw/featured"></v-list-item>
      <v-list-item prepend-icon="mdi-trophy-variant" link title="Sports" to="/channel/UCEgdi0XIXXZ-qJOFPf4JSKw/featured"></v-list-item>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <slot :value="value" />
    </v-main>
  </v-app>
</template>
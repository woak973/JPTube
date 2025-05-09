<template>
  <v-container>
    <div>
      <h1>{{ $t('helps.title') }}</h1>
      <p>{{ $t('helps.description') }}</p>
      <div class="text-center d-flex pb-4">
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" color="primary">{{ $t('helps.changeLang') }}</v-btn>
          </template>
          <v-list>
            <v-list-item @click="setLocale('en')">English</v-list-item>
            <v-list-item @click="setLocale('ja')">日本語</v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-tabs v-model="activeTab" background-color="primary" dark>
        <v-tab value="about">{{ $t('helps.tabs.about') }}</v-tab>
        <v-tab value="usage">{{ $t('helps.tabs.usage') }}</v-tab>
        <v-tab value="settings">{{ $t('helps.tabs.settings') }}</v-tab>
        <v-tab value="errors">{{ $t('helps.tabs.errors') }}</v-tab>
        <v-tab value="deployment">{{ $t('helps.tabs.deployment') }}</v-tab>
      </v-tabs>
      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="about">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.aboutT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.aboutD1') }}<a href="https://github.com/LuanRT/YouTube.js" target="_blank">LuanRT/YouTube.js</a>{{ $t('helps.items.aboutD2') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.CorsT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.CorsD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.CreditT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.CreditD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.RepoT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <a href="https://github.com/woak973/JPTube" target="_blank">woak973/JPTube</a>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tabs-window-item>

        <v-tabs-window-item value="usage">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.shareT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.shareD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.downloadT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.downloadD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.MusicT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.MusicD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.KidsT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.KidsD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tabs-window-item>
        <v-tabs-window-item value="settings">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.playerT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.playerD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.selfT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.selfD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.backendT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.backendD1') }}<a href="https://github.com/woak973/JPTube-Server" target="_blank">woak973/JPTube-Server</a>{{ $t('or') }}<a href="https://github.com/woak973/JPTube-Server-node" target="_blank">woak973/JPTube-Server-node</a>{{ $t('helps.items.backendD2') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.directT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.directD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.exportT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.exportD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.cookieT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.cookieD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.howToGetCookieT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.howToGetCookieD1') }}<a href="https://github.com/patrickkfkan/Volumio-YouTube.js/wiki/How-to-obtain-Cookie" target="_blank">How-to-obtain-Cookie</a>{{ $t('helps.items.howToGetCookieD2') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tabs-window-item>
        <v-tabs-window-item value="errors">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.errors.NoStreamDataT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.errors.NoStreamDataD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.errors.shakaErrorT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.errors.shakaErrorD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.errors.FailedToFetchT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.errors.FailedToFetchD') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tabs-window-item>
        <v-tabs-window-item value="deployment">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('helps.items.deployT') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>{{ $t('helps.items.deployD1') }}<a href="https://nuxt.com/deploy" target="_blank">Deploy a Nuxt App</a>{{ $t('helps.items.deployD2') }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const { setLocale } = useI18n();
const activeTab = ref<string>('');
useHead({
  title: 'Help - JPTube',
});
</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon />
      <router-link to="/login" style="text-decoration: none; color: inherit;">
        <v-app-bar-title>{{ $t('common.Login') }}</v-app-bar-title>
      </router-link>
      <template #append>
        <v-select
          v-model="selectedLanguage"
          :items="languages"
          item-title="title"
          item-value="value"
          @update:modelValue="changeLanguage"
        />
      </template>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
const { setLocale, locale } = useI18n();
const selectedLanguage = ref<typeof locale.value>(locale.value);
const changeLanguage = (lang: string) => {
  setLocale(lang as typeof locale.value);
};

const languages = [
  { title: 'Afrikaans', value: 'af' },
  { title: 'Dansk', value: 'da' },
  { title: 'Deutsch', value: 'de' },
  { title: 'English (India)', value: 'en-IN' },
  { title: 'English (UK)', value: 'en-GB' },
  { title: 'English (US)', value: 'en' },
  { title: 'Español (España)', value: 'es' },
  { title: 'Español (Latinoamérica)', value: 'es-419' },
  { title: 'Español (US)', value: 'es-US' },
  { title: 'Français', value: 'fr' },
  { title: 'Français (Canada)', value: 'fr-CA' },
  { title: 'Italiano', value: 'it' },
  { title: 'Nederlands', value: 'nl' },
  { title: 'Português', value: 'pt-PT' },
  { title: 'Português (Brasil)', value: 'pt' },
  { title: '中文 (简体)', value: 'zh-CN' },
  { title: '中文 (繁體)', value: 'zh-TW' },
  { title: '中文 (香港)', value: 'zh-HK' },
  { title: '日本語', value: 'ja' },
  { title: '한국어', value: 'ko' },

];
</script>

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,

    timeline: {
      enabled: false,
    },
  },
  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
  ],
  plugins: [
    '~/plugins/firebase.ts',
  ],
  vite: {
    server: {
      hmr: false,
    },
  },
  runtimeConfig: {
    public: {
      backendHost: process.env.BACKEND_HOST || 'jptube-companion.deno.dev',
      playerbackendHost: process.env.PLAYER_BACKEND_HOST || 'jptube-companion.deno.dev',
      loginPassword: process.env.LOGIN_PASSWORD || '20531',
      cookie: process.env.COOKIE || '',
      self: process.env.SELF === 'false' ? false : true,
      direct: process.env.DIRECT === 'true' ? true : false,
    },
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en-US.ts' },
      { code: 'ja', iso: 'ja-JP', file: 'ja-JP.ts' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    lazy: true,
    langDir: 'locales/',
  },
});

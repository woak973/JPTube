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
  vite: {
    server: {
      hmr: false,
    },
  },
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
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
});

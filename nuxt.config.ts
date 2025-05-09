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
});

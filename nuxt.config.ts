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
    '@vite-pwa/nuxt',
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
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'JPTube',
      description: 'A alternative YouTube frontend',
      theme_color: '#00DC82',
      lang: 'ja',
      short_name: 'JPTube',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: null,
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
  },
});

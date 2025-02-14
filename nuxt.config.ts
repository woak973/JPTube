// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,

    timeline: {
      enabled: false
    }
  },
  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate'
  ],
  components: [
    {
      path: '~/components/YT',
      pathPrefix: false,
    },
    {
      path: '~/components/YTMusic',
      pathPrefix: false,
    },
  ],
  vite: {
    server: {
      hmr: false
    }
  },
  runtimeConfig: {
    public: {
      backendHost: process.env.BACKEND_HOST || 'jptube-server.onrender.com',
      playerbackendHost: process.env.PLAYER_BACKEND_HOST || 'official-jptube-proxy.onrender.com',
      loginPassword: process.env.LOGIN_PASSWORD || '20531'
    }
  }
})
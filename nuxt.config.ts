// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,

    timeline: {
      enabled: false
    }
  },
  modules: ['vuetify-nuxt-module', '@pinia/nuxt'],
  vite: {
    server: {
      hmr: false
    }
  }
})
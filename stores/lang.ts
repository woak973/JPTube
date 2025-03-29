export const useLangStore = defineStore('lang', {
  state: () => ({
    lang: 'en',
  }),
  actions: {
    setLang(this: { lang: string }, newLang: string) {
      this.lang = newLang;
    },
    resetLang(this: { lang: string }) {
      this.lang = 'en';
    },
  },
  persist: true,
});
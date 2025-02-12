export const useLangStore = defineStore('lang', {
  state: () => ({
    lang: 'ja',
  }),
  actions: {
    setLang(this: { lang: string }, newLang: string) {
      this.lang = newLang;
    },
    resetLang(this: { lang: string }) {
      this.lang = 'ja';
    },
  },
  persist: true,
});
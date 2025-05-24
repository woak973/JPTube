export type SupportedLangs =
  | 'af' | 'da' | 'de' | 'en-IN' | 'en-GB' | 'en' | 'es' | 'es-419' | 'es-US'
  | 'fr' | 'fr-CA' | 'it' | 'nl' | 'pt-PT' | 'pt' | 'zh-CN' | 'zh-TW' | 'zh-HK'
  | 'ja' | 'ko';

export const useLangStore = defineStore('lang', {
  state: () => ({
    lang: 'en' as SupportedLangs,
  }),
  actions: {
    setLang(this: { lang: SupportedLangs }, newLang: SupportedLangs) {
      this.lang = newLang;
    },
    resetLang(this: { lang: SupportedLangs }) {
      this.lang = 'en' as SupportedLangs;
    },
  },
  persist: true,
});

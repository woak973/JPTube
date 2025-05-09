export type SupportedLangs =
  | 'af' | 'da' | 'de' | 'en-IN' | 'en-GB' | 'en' | 'es' | 'es-419' | 'es-US'
  | 'fr' | 'fr-CA' | 'it' | 'nl' | 'pt-PT' | 'pt' | 'zh-CN' | 'zh-TW' | 'zh-HK'
  | 'ja' | 'ko';

function getDefaultLang(): SupportedLangs {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language;
    const supportedLangs: SupportedLangs[] = [
      'af', 'da', 'de', 'en-IN', 'en-GB', 'en', 'es', 'es-419', 'es-US',
      'fr', 'fr-CA', 'it', 'nl', 'pt-PT', 'pt', 'zh-CN', 'zh-TW', 'zh-HK',
      'ja', 'ko',
    ];
    return supportedLangs.includes(browserLang as SupportedLangs)
      ? (browserLang as SupportedLangs)
      : 'en';
  }
  return 'en';
}

export const useLangStore = defineStore('lang', {
  state: () => ({
    lang: getDefaultLang(),
  }),
  actions: {
    setLang(this: { lang: string }, newLang: SupportedLangs) {
      this.lang = newLang;
    },
    resetLang(this: { lang: string }) {
      this.lang = getDefaultLang();
    },
  },
  persist: true,
});

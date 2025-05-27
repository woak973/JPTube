import en from './locales/en/';
import ja from './locales/ja/';

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    messages: {
      en,
      ja,
    },
  };
});

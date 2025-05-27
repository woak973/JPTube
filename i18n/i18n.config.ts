import af from './locales/af/';
import da from './locales/da/';
import de from './locales/de/';
import enIN from './locales/en-IN/';
import enGB from './locales/en-GB/';
import en from './locales/en/';
import es from './locales/es/';
import es419 from './locales/es-419/';
import esUS from './locales/es-US/';
import fr from './locales/fr/';
import frCA from './locales/fr-CA/';
import it from './locales/it/';
import nl from './locales/nl/';
import ptPT from './locales/pt-PT/';
import pt from './locales/pt/';
import zhCN from './locales/zh-CN/';
import zhTW from './locales/zh-TW/';
import zhHK from './locales/zh-HK/';
import ja from './locales/ja/';
import ko from './locales/ko/';

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    messages: {
      af,
      da,
      de,
      'en-IN': enIN,
      'en-GB': enGB,
      en,
      es,
      'es-419': es419,
      'es-US': esUS,
      fr,
      'fr-CA': frCA,
      it,
      nl,
      'pt-PT': ptPT,
      pt,
      'zh-CN': zhCN,
      'zh-TW': zhTW,
      'zh-HK': zhHK,
      ja,
      ko,
    },
  };
});

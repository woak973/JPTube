<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('settings.Settings')}}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <v-tabs v-model="activeTab" background-color="primary" dark>
          <v-tab value="Language/Region">{{ $t('settings.tabs.Language/Region') }}</v-tab>
          <v-tab value="Player">{{ $t('settings.tabs.Player') }}</v-tab>
          <v-tab value="Backends">{{ $t('settings.tabs.Backends') }}</v-tab>
          <v-tab value="Export/Import">{{ $t('settings.tabs.Export/Import') }}</v-tab>
          <v-tab value="Experiment">{{ $t('settings.tabs.Experimental')}}</v-tab>
          <v-tab value="Credits">Credits</v-tab>
        </v-tabs>

        <v-tabs-window v-model="activeTab">
          <!-- Language/Region Tab -->
          <v-tabs-window-item value="Language/Region">
            <v-card-title><v-icon left>mdi-web</v-icon>{{ $t('settings.LanguageT') }}</v-card-title>
            <v-select v-model="selectedLang" :items="languages" :label="$t('settings.SelectLanguage')" item-title="title" item-value="value" />
            <v-card-title><v-icon left>mdi-earth</v-icon>{{ $t('settings.RegionT') }}</v-card-title>
            <v-select v-model="selectedLocation" :items="regions" :label="$t('settings.SelectRegion')" item-title="title" item-value="value" />
          </v-tabs-window-item>

          <!-- Player Tab -->
          <v-tabs-window-item value="Player">
            <v-card-title><v-icon left>mdi-play-box-multiple</v-icon>{{ $t('settings.PlayerT') }}</v-card-title>
            <v-select v-model="selectedPlayer" :items="players" :label="$t('settings.SelectPlayer')" item-title="title" item-value="value" />
            <template v-if="selectedPlayer === 'shaka-player'">
              <v-switch v-model="selectedAutoPlay" color="primary" :label="$t('settings.EnableAP')" />
              <v-switch v-model="selectedInvidious" color="primary" :label="$t('settings.EnableInvidious')" />
              <template v-if="selectedInvidious">
                <v-text-field
                  v-model="selectedInvidiousUrl"
                  v-text-field
                  :label="$t('settings.InvidiousUrl')"
                  :placeholder="$t('settings.InvidiousUrlPlaceholder')"
                  outlined />
              </template>
            </template>
          </v-tabs-window-item>

          <!-- Backends Tab -->
          <v-tabs-window-item value="Backends">
            <v-card-title><v-icon left>mdi-server-network</v-icon>{{ $t('settings.BackendsT') }}</v-card-title>
            <span>{{ $t('settings.EnableSMD') }}</span>
            <v-switch v-model="selectedSelf" color="primary" :label="$t('settings.EnableSM')" />
            <template v-if="!selectedSelf">
              <v-combobox v-model="selectedBackend" :label="$t('settings.Backend')" :items="backendHistoryStore.history">
                <template #item="{ props, item }">
                  <v-list-item @click="props.onClick!">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <template #append>
                      <v-btn
                        icon color="error"
                        @click.stop="backendHistoryStore.removeBackend(item.title)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item>
                </template>
              </v-combobox>
              <v-combobox
                v-model="selectedPlayerBackend" :label="$t('settings.PlayerBackend')"
                :items="backendHistoryStore.history">
                <template #item="{ props, item }">
                  <v-list-item @click="props.onClick!">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <template #append>
                      <v-btn
                        icon color="error"
                        @click.stop="backendHistoryStore.removeBackend(item.title)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item>
                </template>
              </v-combobox>
              <span>{{ $t('settings.EnableDMD') }}</span>
              <v-switch v-model="selectedDirect" color="primary" :label="$t('settings.EnableDM')" />
              <v-select v-model="selectedProtocol" :items="protocols" :label="$t('settings.Protocol')" item-title="title" item-value="value" />
              <v-card-actions>
                <v-btn color="error" @click="backendHistoryStore.clearHistory();">{{ $t('settings.ClearBackendHistory') }}</v-btn>
              </v-card-actions>
            </template>
          </v-tabs-window-item>

          <!-- Export/Import Tab -->
          <v-tabs-window-item value="Export/Import">
            <v-card-title><v-icon left>mdi-file-export</v-icon>{{ $t('settings.ExportImportST') }}</v-card-title>
            <v-card-actions>
              <v-btn color="primary" @click="exportSettings">{{ $t('settings.ExportCurrent') }}</v-btn>
            </v-card-actions>
            <v-file-input :label="$t('settings.ImportSettings')" accept=".json" @change="importSettings" />
          </v-tabs-window-item>

          <v-tabs-window-item value="Experiment">
            <v-card-title><v-icon left>mdi-cookie</v-icon>{{ $t('settings.CookieT') }}</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="selectedCookie"
                :label="$t('settings.CustomCookie')"
                outlined
                rows="5"
              />
            </v-card-text>
            <span>{{ $t('settings.CookieWarning') }}</span>
          </v-tabs-window-item>

          <!-- Credits Tab -->
          <v-tabs-window-item value="Credits">
            <v-card-title><v-icon left>mdi-information</v-icon>Credits</v-card-title>
            <v-card-text>
              <p>Author: Woak973/JPTubeDev</p>
              <p>Repository: <a
                href="https://github.com/woak973/JPTube"
                target="_blank">woak973/JPTube</a></p>
              <p>Copyright © 2025 Woak973. All rights reserved.</p>
            </v-card-text>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="openConfirmDialog">{{ $t('common.reset') }}</v-btn>
        <v-btn color="primary" @click="save">{{ $t('common.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="ResetConfirmDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">{{ $t('common.Warning') }}</v-card-title>
      <v-card-text>{{ $t('settings.ResetConfirm') }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="confirmReset">{{ $t('common.Yes') }}</v-btn>
        <v-btn color="error" @click="ResetConfirmDialog = false">{{ $t('common.No') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { SupportedLocations } from '~/stores/location';

const { setLocale, t, getBrowserLocale, locale } = useI18n();

const dialog = ref<boolean>(false);
const ResetConfirmDialog = ref<boolean>(false);
const activeTab = ref<string>('Language/Region');

const selectedLang = ref<typeof locale.value>('en');
const selectedLocation = ref<SupportedLocations>('US');
const selectedPlayer = ref<'shaka-player' | 'embed' | 'VideoJS'>('shaka-player');
const selectedBackend = ref<string>('');
const selectedPlayerBackend = ref<string>('');
const selectedProtocol = ref<'http' | 'https'>('https');
const selectedAutoPlay = ref<boolean>(false);
const selectedInvidious = ref<boolean>(false);
const selectedInvidiousUrl = ref<string>('');
const selectedDirect = ref<boolean>(false);
const selectedSelf = ref<boolean>(true);
const selectedCookie = ref<string>('');

const languages = [
  { title: 'Afrikaans', value: 'af' },
  { title: 'Dansk', value: 'da' },
  { title: 'Deutsch', value: 'de' },
  { title: 'English (India)', value: 'en-IN' },
  { title: 'English (UK)', value: 'en-GB' },
  { title: 'English (US)', value: 'en' },
  { title: 'Español (España)', value: 'es' },
  { title: 'Español (Latinoamérica)', value: 'es-419' },
  { title: 'Español (US)', value: 'es-US' },
  { title: 'Français', value: 'fr' },
  { title: 'Français (Canada)', value: 'fr-CA' },
  { title: 'Italiano', value: 'it' },
  { title: 'Nederlands', value: 'nl' },
  { title: 'Português', value: 'pt-PT' },
  { title: 'Português (Brasil)', value: 'pt' },
  { title: '中文 (简体)', value: 'zh-CN' },
  { title: '中文 (繁體)', value: 'zh-TW' },
  { title: '中文 (香港)', value: 'zh-HK' },
  { title: '日本語', value: 'ja' },
  { title: '한국어', value: 'ko' },

];

const regions = computed(() => [
  { title: t('settings.Regions.AU'), value: 'AU' },
  { title: t('settings.Regions.BR'), value: 'BR' },
  { title: t('settings.Regions.CA'), value: 'CA' },
  { title: t('settings.Regions.FR'), value: 'FR' },
  { title: t('settings.Regions.DE'), value: 'DE' },
  { title: t('settings.Regions.IN'), value: 'IN' },
  { title: t('settings.Regions.ID'), value: 'ID' },
  { title: t('settings.Regions.IT'), value: 'IT' },
  { title: t('settings.Regions.NL'), value: 'NL' },
  { title: t('settings.Regions.PT'), value: 'PT' },
  { title: t('settings.Regions.RU'), value: 'RU' },
  { title: t('settings.Regions.KR'), value: 'KR' },
  { title: t('settings.Regions.ES'), value: 'ES' },
  { title: t('settings.Regions.JP'), value: 'JP' },
  { title: t('settings.Regions.GB'), value: 'GB' },
  { title: t('settings.Regions.US'), value: 'US' },
]);

const players = computed(() => [
  { title: t('settings.PlayerItems.embed'), value: 'embed' },
  { title: 'shaka-player', value: 'shaka-player' },
  { title: 'VideoJS(Blob)', value: 'VideoJS' },
]);

const protocols = [
  { title: 'http', value: 'http' },
  { title: 'https', value: 'https' },
];

const locationStore = useLocationStore();
const playerStore = usePlayerStore();
const backendStore = useBackendStore() as { backend: string; setBackend: (newBackend: string) => void; resetBackend: () => void };
const playerBackendStore = usePlayerBackendStore() as { playerbackend: string; setPlayerBackend: (newPlayerBackend: string) => void; resetPlayerBackend: () => void };
const protocolStore = useProtocolStore();
const autoplayStore = useAutoPlayStore();
const invidiousStore = useInvidiousStore();
const backendHistoryStore = useBackendHistoryStore();
const directStore = useDirectStore();
const cookieStore = useCookieStore();

const emit = defineEmits(['Refresh']);

const open = () => {
  initialize();
  dialog.value = true;
};

const close = () => {
  dialog.value = false;
};

const openConfirmDialog = () => {
  ResetConfirmDialog.value = true;
};

const confirmReset = () => {
  ResetConfirmDialog.value = false;
  reset();
};

const save = async () => {
  await setLocale(selectedLang.value);
  locationStore.setLocation(selectedLocation.value);
  playerStore.setPlayer(selectedPlayer.value);
  backendStore.setBackend(selectedBackend.value);
  playerBackendStore.setPlayerBackend(selectedPlayerBackend.value);
  protocolStore.setProtocol(selectedProtocol.value);
  autoplayStore.setAutoPlay(selectedAutoPlay.value);
  invidiousStore.setInvidious(selectedInvidious.value);
  invidiousStore.setInvURL(selectedInvidiousUrl.value);
  directStore.setDirect(selectedDirect.value);
  directStore.setSelf(selectedSelf.value);
  cookieStore.setCookie(selectedCookie.value);

  if (selectedBackend.value) {
    backendHistoryStore.addBackend(selectedBackend.value);
  }
  if (selectedPlayerBackend.value) {
    backendHistoryStore.addBackend(selectedPlayerBackend.value);
  }
  emit('Refresh');
  close();
};

const reset = async () => {
  const BL = getBrowserLocale();
  if (languages.some(lang => lang.value === BL)) {
    await setLocale(BL as typeof locale.value);
  } else {
    await setLocale('en');
  }
  locationStore.resetLocation();
  playerStore.resetPlayer();
  backendStore.resetBackend();
  playerBackendStore.resetPlayerBackend();
  protocolStore.resetProtocol();
  autoplayStore.resetAutoPlay();
  invidiousStore.resetInvidious();
  invidiousStore.resetInvURL();
  directStore.resetDirect();
  directStore.resetSelf();
  cookieStore.resetCookie();
  backendHistoryStore.clearHistory();
  emit('Refresh');
  close();
};

const initialize = () => {
  selectedLang.value = locale.value;
  selectedLocation.value = locationStore.location;
  selectedPlayer.value = playerStore.player;
  selectedBackend.value = backendStore.backend;
  selectedPlayerBackend.value = playerBackendStore.playerbackend;
  selectedProtocol.value = protocolStore.protocol;
  selectedAutoPlay.value = autoplayStore.autoplay;
  selectedInvidious.value = invidiousStore.invidious;
  selectedInvidiousUrl.value = invidiousStore.invURL;
  selectedDirect.value = directStore.direct;
  selectedSelf.value = directStore.self;
  selectedCookie.value = cookieStore.cookie;
};

const exportSettings = () => {
  const settings = {
    lang: locale.value,
    location: locationStore.location,
    player: playerStore.player,
    selfmode: directStore.self,
    backend: backendStore.backend,
    playerBackend: playerBackendStore.playerbackend,
    directmode: directStore.direct,
    protocol: protocolStore.protocol,
    autoPlay: autoplayStore.autoplay,
    invidious: invidiousStore.invidious,
    invidiousUrl: invidiousStore.invURL,
    backendHistory: backendHistoryStore.history,
  };
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'settings.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const importSettings = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const settings = JSON.parse(e.target?.result as string);
      if (settings.lang !== undefined) selectedLang.value = settings.lang;
      if (settings.location !== undefined) selectedLocation.value = settings.location;
      if (settings.player !== undefined) selectedPlayer.value = settings.player;
      if (settings.selfmode !== undefined) selectedSelf.value = settings.selfmode;
      if (settings.backend !== undefined) selectedBackend.value = settings.backend;
      if (settings.playerBackend !== undefined) selectedPlayerBackend.value = settings.playerBackend;
      if (settings.directmode !== undefined) selectedDirect.value = settings.directmode;
      if (settings.protocol !== undefined) selectedProtocol.value = settings.protocol;
      if (settings.autoPlay !== undefined) selectedAutoPlay.value = settings.autoPlay;
      if (settings.invidious !== undefined) selectedInvidious.value = settings.invidious;
      if (settings.invidiousUrl !== undefined) selectedInvidiousUrl.value = settings.invidiousUrl;
      if (settings.backendHistory !== undefined) {
        backendHistoryStore.history = settings.backendHistory;
      }
    } catch (error) {
      console.error('Invalid settings file:', error);
    }
  };
  reader.readAsText(file);
};

defineExpose({ open });
</script>

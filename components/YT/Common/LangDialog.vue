<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-tabs v-model="activeTab" background-color="primary" dark>
                    <v-tab value="Language/Region">Language/Region</v-tab>
                    <v-tab value="Player">Player</v-tab>
                    <v-tab value="Backends">Backends</v-tab>
                    <v-tab value="Export/Import">Export/Import</v-tab>
                    <v-tab value="Credits">Credits</v-tab>
                </v-tabs>

                <v-tabs-window v-model="activeTab">
                    <!-- Language/Region Tab -->
                    <v-tabs-window-item value="Language/Region">
                        <v-card-title><v-icon left>mdi-web</v-icon>Language</v-card-title>
                        <v-select v-model="selectedLang" :items="languages" label="Select Language"></v-select>
                        <v-card-title><v-icon left>mdi-earth</v-icon>Region</v-card-title>
                        <v-select v-model="selectedLocation" :items="regions" label="Select Region"></v-select>
                    </v-tabs-window-item>

                    <!-- Player Tab -->
                    <v-tabs-window-item value="Player">
                        <v-card-title><v-icon left>mdi-play-box-multiple</v-icon>Player</v-card-title>
                        <v-select v-model="selectedPlayer" :items="players" label="Select Player"></v-select>
                        <template v-if="selectedPlayer === 'shaka-player'">
                            <v-switch v-model="selectedAutoPlay" color="primary" label="Enable Auto Play"></v-switch>
                        </template>
                    </v-tabs-window-item>

                    <!-- Backends Tab -->
                    <v-tabs-window-item value="Backends">
                        <v-card-title><v-icon left>mdi-server-network</v-icon>Backends</v-card-title>
                        <v-combobox v-model="selectedBackend" label="Backend" :items="backendHistoryStore.history">
                            <template v-slot:item="{ props, item }">
                                <v-list-item @click="props.onClick!">
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    <template v-slot:append>
                                        <v-btn icon color="error"
                                            @click.stop="backendHistoryStore.removeBackend(item.title)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-list-item>
                            </template>
                        </v-combobox>
                        <v-combobox v-model="selectedPlayerBackend" label="PlayerBackend"
                            :items="backendHistoryStore.history">
                            <template v-slot:item="{ props, item }">
                                <v-list-item @click="props.onClick!">
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    <template v-slot:append>
                                        <v-btn icon color="error"
                                            @click.stop="backendHistoryStore.removeBackend(item.title)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-list-item>
                            </template>
                        </v-combobox>
                        <v-card-actions>
                            <v-btn color="error" @click="backendHistoryStore.clearHistory();">Clear Backend
                                History</v-btn>
                        </v-card-actions>
                    </v-tabs-window-item>

                    <!-- Export/Import Tab -->
                    <v-tabs-window-item value="Export/Import">
                        <v-card-title><v-icon left>mdi-file-export</v-icon>Export/Import Settings</v-card-title>
                        <v-card-actions>
                            <v-btn color="primary" @click="exportSettings">Export Current Settings</v-btn>
                        </v-card-actions>
                        <v-file-input label="Import Settings" @change="importSettings" accept=".json"></v-file-input>
                    </v-tabs-window-item>

                    <!-- Credits Tab -->
                    <v-tabs-window-item value="Credits">
                        <v-card-title><v-icon left>mdi-information</v-icon>Credits</v-card-title>
                        <v-card-text>
                            <p>Author: Woak973/JPTubeDev</p>
                            <p>Repository: <a href="https://github.com/woak973/JPTube"
                                    target="_blank">woak973/JPTube</a></p>
                            <p>Copyright © 2025 Woak973. All rights reserved.</p>
                        </v-card-text>
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="openConfirmDialog">Reset</v-btn>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="ResetConfirmDialog" max-width="400">
        <v-card>
            <v-card-title class="headline">Warning</v-card-title>
            <v-card-text>Are you sure you want to reset the settings?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="confirmReset">Yes</v-btn>
                <v-btn color="error" @click="ResetConfirmDialog = false">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">

const dialog = ref<boolean>(false);
const ResetConfirmDialog = ref<boolean>(false);
const activeTab = ref<string>('Language/Region');

const selectedLang = ref<string>('en');
const selectedLocation = ref<string>('US');
const selectedPlayer = ref<string>('shaka-player');
const selectedBackend = ref<string>('');
const selectedPlayerBackend = ref<string>('');
const selectedAutoPlay = ref<boolean>(false);

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
    { title: '한국어', value: 'ko' }

];

const regions = [
    { title: 'Australia', value: 'AU' },
    { title: 'Brazil', value: 'BR' },
    { title: 'Canada', value: 'CA' },
    { title: 'France', value: 'FR' },
    { title: 'Germany', value: 'DE' },
    { title: 'India', value: 'IN' },
    { title: 'Indonesia', value: 'ID' },
    { title: 'Italy', value: 'IT' },
    { title: 'Netherlands', value: 'NL' },
    { title: 'Portugal', value: 'PT' },
    { title: 'Russia', value: 'RU' },
    { title: 'South Korea', value: 'KR' },
    { title: 'Spain', value: 'ES' },
    { title: 'Japan', value: 'JP' },
    { title: 'United Kingdom', value: 'GB' },
    { title: 'United States', value: 'US' }
];

const players = [
    { title: 'embed', value: 'embed' },
    { title: 'shaka-player', value: 'shaka-player' },
    { title: 'VideoJS(Blob)', value: 'VideoJS' }
];

const langStore = useLangStore();
const locationStore = useLocationStore();
const playerStore = usePlayerStore();
const backendStore = useBackendStore() as { backend: string; setBackend: (newBackend: string) => void; resetBackend: () => void };
const playerBackendStore = usePlayerBackendStore() as { playerbackend: string; setPlayerBackend: (newPlayerBackend: string) => void; resetPlayerBackend: () => void };
const autoplayStore = useAutoPlayStore();
const backendHistoryStore = useBackendHistoryStore();

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

const save = () => {
    langStore.setLang(selectedLang.value);
    locationStore.setLocation(selectedLocation.value);
    playerStore.setPlayer(selectedPlayer.value);
    backendStore.setBackend(selectedBackend.value);
    playerBackendStore.setPlayerBackend(selectedPlayerBackend.value);
    autoplayStore.setAutoPlay(selectedAutoPlay.value);
    if (selectedBackend.value) {
        backendHistoryStore.addBackend(selectedBackend.value);
    }
    if (selectedPlayerBackend.value) {
        backendHistoryStore.addBackend(selectedPlayerBackend.value);
    }
    emit('Refresh');
    close();

};

const reset = () => {
    langStore.resetLang();
    locationStore.resetLocation();
    playerStore.resetPlayer();
    backendStore.resetBackend();
    playerBackendStore.resetPlayerBackend();
    autoplayStore.resetAutoPlay();
    backendHistoryStore.clearHistory();
    emit('Refresh');
    close();
};

const initialize = () => {
    selectedLang.value = langStore.lang;
    selectedLocation.value = locationStore.location;
    selectedPlayer.value = playerStore.player;
    selectedBackend.value = backendStore.backend;
    selectedPlayerBackend.value = playerBackendStore.playerbackend;
    selectedAutoPlay.value = autoplayStore.autoplay;
};

const exportSettings = () => {
    const settings = {
        lang: langStore.lang,
        location: locationStore.location,
        player: playerStore.player,
        backend: backendStore.backend,
        playerBackend: playerBackendStore.playerbackend,
        autoPlay: autoplayStore.autoplay,
        backendHistory: backendHistoryStore.history
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
            if (settings.backend !== undefined) selectedBackend.value = settings.backend;
            if (settings.playerBackend !== undefined) selectedPlayerBackend.value = settings.playerBackend;
            if (settings.autoPlay !== undefined) selectedAutoPlay.value = settings.autoPlay;
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
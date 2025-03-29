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
                <v-card-title><v-icon left>mdi-web</v-icon>Language</v-card-title>
                <v-select v-model="selectedLang" :items="languages" label="Select Language"></v-select>

                <v-card-title><v-icon left>mdi-earth</v-icon>Region</v-card-title>
                <v-select v-model="selectedLocation" :items="regions" label="Select Region"></v-select>

                <v-card-title><v-icon left>mdi-play-box-multiple</v-icon>Player</v-card-title>
                <v-select v-model="selectedPlayer" :items="players" label="Select Player"></v-select>
                <v-text-field v-model="selectedBackend" label="Backend"></v-text-field>
                <v-text-field v-model="selectedPlayerBackend" label="PlayerBackend"></v-text-field>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="reset">Reset</v-btn>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">

const dialog = ref(false);

const selectedLang = ref('en');
const selectedLocation = ref('US');
const selectedPlayer = ref('shaka-player');
const selectedBackend = ref('');
const selectedPlayerBackend = ref('');

const languages = [
    { title: 'Japanese', value: 'ja' },
    { title: 'English', value: 'en' }
];

const regions = [
    { title: 'Japan', value: 'JP' },
    { title: 'US', value: 'US' }
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

const router = useRouter();
const emit = defineEmits(['Refresh']);

const open = () => {
    selectedLang.value = langStore.lang;
    selectedLocation.value = locationStore.location;
    selectedPlayer.value = playerStore.player;
    selectedBackend.value = backendStore.backend as string;
    selectedPlayerBackend.value = playerBackendStore.playerbackend as string;
    dialog.value = true;
};

const close = () => {
    dialog.value = false;
};

const save = () => {
    langStore.setLang(selectedLang.value);
    locationStore.setLocation(selectedLocation.value);
    playerStore.setPlayer(selectedPlayer.value);
    backendStore.setBackend(selectedBackend.value);
    playerBackendStore.setPlayerBackend(selectedPlayerBackend.value);
    emit('Refresh');
    close();

};

const reset = () => {
    langStore.resetLang();
    locationStore.resetLocation();
    playerStore.resetPlayer();
    backendStore.resetBackend();
    playerBackendStore.resetPlayerBackend();
    selectedLang.value = langStore.lang;
    selectedLocation.value = locationStore.location;
    selectedPlayer.value = playerStore.player;
    selectedBackend.value = backendStore.backend as string;
    selectedPlayerBackend.value = playerBackendStore.playerbackend as string;
};

defineExpose({ open });
</script>
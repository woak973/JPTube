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
                <v-radio-group v-model="selectedLang" column>
                    <v-radio label="Japanese" value="ja"></v-radio>
                    <v-radio label="English" value="en"></v-radio>
                </v-radio-group>
                <v-radio-group v-model="selectedLocation" column>
                    <v-radio label="Japan" value="JP"></v-radio>
                    <v-radio label="US" value="US"></v-radio>
                </v-radio-group>
                <v-btn @click="toggleTheme">Toggle Theme(β)</v-btn>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dialog = ref(false);
const selectedLang = ref('ja');
const selectedLocation = ref('JP');
const langStore = useLangStore();
const locationStore = useLocationStore();
const theme = useTheme();

const open = () => {
    selectedLang.value = langStore.lang;
    selectedLocation.value = locationStore.location;
    dialog.value = true;
};

const close = () => {
    dialog.value = false;
};

const save = () => {
    langStore.setLang(selectedLang.value);
    locationStore.setLocation(selectedLocation.value);
    close();
    window.location.reload();
};

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

defineExpose({ open });
</script>
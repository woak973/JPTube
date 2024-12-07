<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card>
                    <v-card-title class="headline">Login</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="login">
                            <v-text-field v-model="password" label="Password" type="password" outlined
                                dense></v-text-field>
                            <v-btn type="submit" color="primary" block>Login</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="headline">Error</v-card-title>
                <v-card-text>Incorrect password</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { setCookie } from 'nookies';

definePageMeta({
    layout: false
});

const password = ref('');
const dialog = ref(false);
const router = useRouter();
const config = useRuntimeConfig();

const login = () => {
    if (password.value === config.public.loginPassword) {
        const token = 'your-secure-token'; // ここに実際のトークンを設定
        setCookie(null, 'authToken', token, { path: '/' });
        router.push('/');
    } else {
        dialog.value = true;
    }
};
</script>
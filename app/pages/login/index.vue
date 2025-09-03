<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="headline">{{ $t('common.Login') }}</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="password" :label="$t('common.Password')" type="password" outlined
                dense />
              <v-btn type="submit" color="primary" block>{{ $t('common.Login') }}</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">{{ $t('common.Error') }}</v-card-title>
        <v-card-text>{{ $t('common.IncorrectPassword') }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog = false">{{ $t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n();
definePageMeta({
  layout: 'login',
});

useHead({
  title: computed(() => t('common.Login')),
});

const password = ref('');
const dialog = ref(false);
const router = useRouter();
const config = useRuntimeConfig();

const login = () => {
  if (password.value === config.public.loginPassword) {
    const token = 'your-secure-token';
    const authtoken = useCookie('authToken', { path: '/', maxAge: 2147483647 });
    authtoken.value = token;
    router.push('/');
  } else {
    dialog.value = true;
  }
};
</script>

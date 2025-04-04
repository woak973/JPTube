<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const drawer = ref<boolean>(false);
const value = ref<string>('');
const child = ref<string>(uuidv4());

</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <router-link to="/" style="text-decoration: none; color: inherit;">
        <v-app-bar-title>JPTube Forum</v-app-bar-title>
      </router-link>
      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item title="JPTube Forum" subtitle="Welcome" />
      <v-divider />
      <v-list-item prepend-icon="mdi-home" link title="Home" to="/firebase/" />
      <v-divider />
      <v-list-item title="Other Services" subtitle="Welcome" />
      <v-list-item prepend-icon="mdi-play-box" link title="JPTube" to="/" />
      <v-list-item prepend-icon="mdi-music-circle" link title="JPTube Music" to="/music" />
      <v-list-item prepend-icon="mdi-play-protected-content" link title="JPTube Kids" to="/kids" />

    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <slot :key="child" :value="value" />
    </v-main>

  </v-app>
</template>

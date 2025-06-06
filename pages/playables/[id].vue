<script setup lang="ts">
import { Utils, YTNodes } from 'youtubei.js';
import { BinaryWriter } from '@bufbuild/protobuf/wire';

const route = useRoute();
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
// const baseUrl = `/api/playables/v/assets/index.html?__host=${route.params.id}.playables.usercontent.goog&__isSelf=true`;
const waitingMessage = ref<string>('Setting up...');

const fetchData = async () => {
  try {
    const yt = await useInnertube('common');

    const writer = new BinaryWriter();
    writer.uint32(1066).fork();
    writer.uint32(10).string(route.params.id as string);
    writer.join();
    const Uint8 = writer.finish();
    const params = encodeURIComponent(Utils.u8ToBase64(Uint8));

    const nav = new YTNodes.NavigationEndpoint({ browseEndpoint: { browseId: 'FEmini_app_container', params: params } });
    const ParsedResults = await nav.call(yt.actions, { parse: true });
    console.log('SearchResults', ParsedResults);
  } catch (error) {
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  }
};

/* onMounted(async () => {
  if (!route.params.id) return;

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/api/playables' });
      if (registration && registration.active) {
        registration.active.postMessage({ id: route.params.id });
        waitingMessage.value = 'Loading game...';
        window.location.href = baseUrl;
      } else {
        navigator.serviceWorker.ready.then((reg) => {
          if (reg.active) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      alert.value = true;
      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = 'An unknown error occurred';
      }
    }
  }
});
*/

await fetchData();
</script>

<template>
  <v-container>
    <v-card v-if="route.query.id">
      <v-card-title>{{ waitingMessage }}</v-card-title>
    </v-card>
    <v-card v-else>
      <v-card-title>No id was provided</v-card-title>
    </v-card>
    <div>
      <v-dialog v-model="alert" max-width="500">
        <v-card>
          <v-card-title class="headline">{{ $t('common.Error') }}</v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="alert = false">{{ $t('common.close') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Utils, YTNodes } from 'youtubei.js';
import { BinaryWriter } from '@bufbuild/protobuf/wire';

const route = useRoute();
const { t } = useI18n();
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const basedUrl = ref<URL>();
const InitUrl = ref<string>('');
const UrlHost = ref<string>('');
const results = ref<YTNodes.MiniAppContainerView | undefined>();
const waitingMessage = ref<string>(t('common.SetupGame'));

useHead({
  title: 'Playables - JPTube',
});

watch(results, (newVal) => {
  if (newVal) {
    useHead({
      title: `${newVal.splash_screen?.title} - JPTube`,
    });
  }
});

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
    const AppContainer = ParsedResults.contents_memo?.get('MiniAppContainerView');
    results.value = AppContainer?.[0] as YTNodes.MiniAppContainerView;
    const GameUrl = (AppContainer?.[0] as YTNodes.MiniAppContainerView).url.private_do_not_access_or_else_trusted_resource_url_wrapped_value;
    basedUrl.value = new URL(GameUrl);
    InitUrl.value = `/api/playables/${basedUrl.value.host}${basedUrl.value.pathname}`;
    UrlHost.value = basedUrl.value.host;
  } catch (error) {
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  }
};

onMounted(async () => {
  if (!route.params.id || !InitUrl.value) return;

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(`/sw.js?globalhost=${basedUrl.value?.host}`, { scope: `/api/playables/${basedUrl.value?.host}` });

      if (registration) {
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.onstatechange = () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'activated') {
                    window.location.reload();
                  }
                });
              }
            };
          }
        };
      }
      if (registration && registration.active) {
        registration.active.postMessage({ id: UrlHost.value });
        waitingMessage.value = t('common.LoadGame');
        window.location.href = InitUrl.value;
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
if (route.params.id) {
  await fetchData();
}

</script>

<template>
  <v-container>
    <v-card v-if="route.params.id">
      <v-card-title>{{ waitingMessage }}</v-card-title>
    </v-card>
    <v-card v-else>
      <v-card-title>{{ $t('common.NoID') }}</v-card-title>
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

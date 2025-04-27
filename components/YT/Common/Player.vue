<script setup lang="ts">
import { BG } from 'bgutils-js';
import GoogleVideo, { PART, Protos } from 'googlevideo';
import { ProtoUtils, Utils } from 'youtubei.js';
import type shaka from 'shaka-player/dist/shaka-player.ui';

import 'shaka-player/dist/controls.css';

const props = defineProps({
  videoId: {
    type: String,
    default: '',
  },
  aspectRatio: {
    type: String,
    default: '16:9',
  },
});
const emit = defineEmits(['errors', 'complete']);
const playerbackendStore = usePlayerBackendStore().playerbackend;
const proxyhost = typeof playerbackendStore === 'string' ? playerbackendStore : 'jptube-player-server.onrender.com';
const protocolStore = useProtocolStore().protocol;

let player: shaka.Player | undefined;
let ui: shaka.ui.Overlay | undefined;

onMounted(async () => {
  const shaka = await import('shaka-player/dist/shaka-player.ui').then(module => module.default);
  async function main() {
    let poToken: string | undefined;
    const visitorData = ProtoUtils.encodeVisitorData(Utils.generateRandomString(11), Math.floor(Date.now() / 1000));

    // Immediately mint a cold start token so we can start playback without delays.
    const coldStartToken = BG.PoToken.generateColdStartToken(visitorData);
    getPo(visitorData).then(webPo => poToken = webPo);

    const yt = await useInnertube('player', undefined, { po_token: poToken || coldStartToken, visitor_data: visitorData }, true);

    player = undefined as shaka.Player | undefined;
    ui = undefined as shaka.ui.Overlay | undefined;

    if (player) {
      await player.destroy();
    }

    if (!props.videoId) {
      console.error('Video ID is undefined');
      return;
    }
    const info = await yt.getInfo(props.videoId, 'WEB_EMBEDDED');

    try {
      let uri;
      try {
        const dash = await info.toDash(undefined, undefined, { captions_format: 'vtt', include_thumbnails: true });
        uri = `data:application/dash+xml;charset=utf-8;base64,${btoa(unescape(encodeURIComponent(dash)))}`;
      } catch (e) {
        if (info.streaming_data && info.streaming_data.hls_manifest_url) {
          uri = info.streaming_data.hls_manifest_url;
        } else {
          throw e;
        }
      }

      if (player) {
        await player.destroy();
        player = undefined;
      }

      if (ui) {
        await ui.destroy();
        ui = undefined;
      }

      const videoEl = document.getElementById('videoel') as HTMLVideoElement;
      const shakaContainer = document.getElementById('shaka-container') as HTMLDivElement;

      shakaContainer
        .querySelectorAll('div')
        .forEach(node => node.remove());

      shaka.polyfill.installAll();

      if (shaka.Player.isBrowserSupported()) {
        videoEl.poster = info.basic_info.thumbnail![0].url;

        player = new shaka.Player();
        await player.attach(videoEl);
        ui = new shaka.ui.Overlay(player, shakaContainer, videoEl);

        const config = {
          seekBarColors: {
            base: 'rgba(255,255,255,.2)',
            buffered: 'rgba(255,255,255,.4)',
            played: 'rgb(255,0,0)',
          },
          fadeDelay: 0,
          preferDocumentPictureInPicture: false,
          overflowMenuButtons: ['quality', 'language', 'captions', 'picture_in_picture', 'playback_rate', 'loop', 'statistics', 'save_video_frame'],
        };

        ui.configure(config);

        const overflowMenuButton = document.querySelector('.shaka-overflow-menu-button');
        if (overflowMenuButton) {
          overflowMenuButton.innerHTML = 'settings';
        }

        const backToOverflowButton = document.querySelector('.shaka-back-to-overflow-button .material-icons-round');
        if (backToOverflowButton) {
          backToOverflowButton.innerHTML = 'arrow_back_ios_new';
        }

        player.configure({
          streaming: {
            bufferingGoal: (info.page[0].player_config?.media_common_config.dynamic_readahead_config.max_read_ahead_media_time_ms || 0) / 1000,
            rebufferingGoal: (info.page[0].player_config?.media_common_config.dynamic_readahead_config.read_ahead_growth_rate_ms || 0) / 1000,
            bufferBehind: 300,
            lowLatencyMode: true,
          },
          abr: {
            enabled: true,
            restrictions: {
              maxBandwidth: Number(info.page[0].player_config?.stream_selection_config.max_bitrate),
            },
          },
        });

        player.addEventListener('error', (event) => {
          console.error('Error', event);
          emit('errors', (event as unknown as { detail: string }).detail);
        });

        player.addEventListener('complete', () => {
          emit('complete');
        });

        const networkingEngine = player.getNetworkingEngine();

        if (!networkingEngine) return;

        networkingEngine.registerRequestFilter(async (type, request) => {
          const uri = request.uris[0];
          const url = new URL(uri);
          const headers = request.headers;

          // For local development.
          if ((url.host.endsWith('.googlevideo.com') || url.href.includes('drm'))) {
            url.searchParams.set('__host', url.host);
            url.searchParams.set('__proxyhost', proxyhost);
            url.searchParams.set('__proxyschema', protocolStore);
            url.host = window.location.host;
            url.pathname = `/api/proxy${url.pathname}`;
            url.protocol = window.location.protocol;
          }

          if (type === shaka.net.NetworkingEngine.RequestType.SEGMENT) {
            if (url.pathname.includes('videoplayback')) {
              if (headers.Range) {
                url.searchParams.set('range', headers.Range.split('=')[1]);
                url.searchParams.set('ump', '1');
                url.searchParams.set('srfvp', '1');
                url.searchParams.set('pot', (poToken ?? coldStartToken) ?? '');
                request.headers = {};
                delete headers.Range;
              }
            }

            request.method = 'POST';
            request.body = new Uint8Array([120, 0]);
          }

          request.uris[0] = url.toString();
        });

        const RequestType = shaka.net.NetworkingEngine.RequestType;

        networkingEngine.registerResponseFilter(async (type, response) => {
          let mediaData = new Uint8Array(0);

          const handleRedirect = async (redirectData: Protos.SabrRedirect) => {
            const redirectRequest = shaka.net.NetworkingEngine.makeRequest([redirectData.url!], player!.getConfiguration().streaming.retryParameters);
            const requestOperation = player!.getNetworkingEngine()!.request(type, redirectRequest);
            const redirectResponse = await requestOperation.promise;

            response.data = redirectResponse.data;
            response.headers = redirectResponse.headers;
            response.uri = redirectResponse.uri;
          };

          const handleMediaData = async (data: Uint8Array) => {
            const combinedLength = mediaData.length + data.length;
            const tempMediaData = new Uint8Array(combinedLength);

            tempMediaData.set(mediaData);
            tempMediaData.set(data, mediaData.length);

            mediaData = tempMediaData;
          };

          if (type == RequestType.SEGMENT) {
            const googUmp = new GoogleVideo.UMP(new GoogleVideo.ChunkedDataBuffer([new Uint8Array(response.data as ArrayBuffer)]));

            let redirect: Protos.SabrRedirect | undefined;

            googUmp.parse((part) => {
              try {
                const data = part.data.chunks[0];
                switch (part.type) {
                  case PART.MEDIA: {
                    handleMediaData(part.data.split(1).remainingBuffer.chunks[0]);
                    break;
                  }
                  case PART.SABR_REDIRECT: {
                    redirect = Protos.SabrRedirect.decode(data);
                    break;
                  }
                }
              } catch (error) {
                console.error('An error occurred while processing the part:', error);
              }
            });

            if (redirect)
              return handleRedirect(redirect);

            if (mediaData.length)
              response.data = mediaData;
          }
        });

        try {
          await player.load(uri);
        } catch (e) {
          console.error('Could not load manifest', e);
          emit('errors', e);
        }
      } else {
        console.error('Browser not supported!');
      }
    } catch (error) {
      console.error(error);
      emit('errors', error);
    }
  }

  main().catch(console.error);

  const route = useRoute();
  const router = useRouter();

  if (route.query.t) {
    let timeString = route.query.t.toString();
    if (timeString.endsWith('s')) {
      timeString = timeString.slice(0, -1);
    }
    seek(Number(timeString));
    const { t, ...remainingQuery } = route.query;
    router.replace({
      query: remainingQuery,
    });
  }
});

const seek = (seconds: number) => {
  try {
    const video = document.getElementById('videoel') as HTMLVideoElement;
    if (video) {
      video.currentTime = seconds;
      console.log('Seeking to', seconds);
    } else {
      console.error('Video element is not found');
    }
  } catch (error) {
    console.error('Error seeking video:', error);
  }
};

const aspectRatioClass = computed(() => {
  return props.aspectRatio === '9:16' ? 'aspect-9-16' : 'aspect-16-9';
});

const destroyPlayer = async () => {
  if (player) {
    await player.destroy();
    player = undefined;
  }
  if (ui) {
    await ui.destroy();
    ui = undefined;
  }
};

onBeforeUnmount(async () => {
  await destroyPlayer();
});

defineExpose({ seek });

</script>
<template>
  <div id="shaka-container" :class="['shaka-container', aspectRatioClass]" data-shaka-player-container>
    <video id="videoel" class="videoel" data-shaka-player autoplay />
  </div>
</template>

<style scoped>
.shaka-container {
    position: relative;
    width: 100%;
}

.aspect-16-9 {
    padding-top: 56.25%;
    /* 16:9 aspect ratio */
}

.aspect-9-16 {
    padding-top: 177.78%;
    /* 9:16 aspect ratio */
}

.videoel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>

<script setup lang="ts">
import type { Helpers, YTMusic, Types } from 'youtubei.js';
import { YTNodes } from 'youtubei.js';

const route = useRoute();
const playerStore = usePlayerStore();
const autoplayStore = useAutoPlayStore();
const { share } = useShare();
const goTo = useGoTo();

const videoId = ref<string>(route.query.v as string);

const results = ref<YTMusic.TrackInfo>();
const Nextresults = ref<YTNodes.PlaylistPanel>();
const Lyricsresults = ref<YTNodes.MusicDescriptionShelf>();
const Relatedresults = ref<Helpers.ObservedArray<YTNodes.MusicCarouselShelf | YTNodes.MusicDescriptionShelf>>();
const Playlistresults = ref<Array<YTNodes.MusicResponsiveListItem>>([]);
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const fatalError = ref<boolean>(false);

const downloading = ref<boolean>(false);
const child = ref<{ seek: (seconds: number) => void } | null>(null);

const tab = ref<string>('option-2');
const PLBtn = ref<boolean>(false);
const autoplaySnackbar = ref<boolean>(false);

watch(results, (newVal): void => {
  if (newVal) {
    useHead({
      title: `${newVal.basic_info.title ? newVal.basic_info.title : 'Watch'} - JPTube Music`,
    });
  }
});

definePageMeta({
  layout: 'music',
});

watch(() => route.query.v, async (newVideoId): Promise<void> => {
  videoId.value = newVideoId as string;
  goTo(0);
  await fetchData();
});

onBeforeRouteUpdate(() => {
  if (autoplaySnackbar.value) {
    autoplaySnackbar.value = false;
  }
});

onBeforeRouteLeave(() => {
  if (autoplaySnackbar.value) {
    autoplaySnackbar.value = false;
  }
});

const handleError = (message: string): void => {
  console.error(message);
  alert.value = true;
  errorMessage.value = message;
};

const AutoPlay = () => {
  if (autoplayStore.autoplay) {
    if (Nextresults.value && Nextresults.value.contents.length > 1) {
      const nextVideo = Nextresults.value.contents[1];
      if (nextVideo instanceof YTNodes.PlaylistPanelVideo) {
        autoplaySnackbar.value = true;
        setTimeout(() => {
          if (autoplaySnackbar.value) {
            const videoId = nextVideo.video_id;
            if (videoId) {
              const router = useRouter();
              router.push({ query: { v: videoId } });
            }
          }
        }, 5000);
      } else {
        console.error('AutoPlay has been cancelled.');
      }
    } else {
      console.error('RelatedVideos is empty or undefined.');
    }
  }
};

const downloadVideo = async (): Promise<void> => {
  downloading.value = true;
  try {
    const DLyt = await useInnertube('player');
    const DLResults = await DLyt.getInfo(route.query.v as string);
    const DLOption: Types.DownloadOptions = { quality: 'best' };
    const stream = await DLResults.download(DLOption);
    const reader = stream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const fixedChunks = chunks.map(chunk => new Uint8Array(chunk));
    const blob = new Blob(fixedChunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'videoplayback.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  } finally {
    downloading.value = false;
  }
};

const fetchData = async (): Promise<void> => {
  try {
    const yt = await useInnertube('common');

    const ytmusic = yt.music;

    let searchResults: YTMusic.TrackInfo;

    if (route.query.list) {
      let PLvideoId = '';
      const PL = await ytmusic.getPlaylist(route.query.list as string);
      if (PL.items) {
        let PLcontents = PL;
        let flag = false;

        while (!flag) {
          PLcontents.items.forEach((video) => {
            if (video instanceof YTNodes.MusicResponsiveListItem) {
              if (typeof video.id === 'string' && route.query.v === video.id) {
                PLvideoId = video.id;
                flag = true;
              }
              Playlistresults.value.push(video);
            }
          });

          if (!flag && PLcontents.has_continuation) {
            const ContPL = await PLcontents.getContinuation();
            PLcontents = ContPL;
          } else {
            break;
          }
        }

        if (PLvideoId === '') {
          if ((PL.items[0] instanceof YTNodes.MusicResponsiveListItem)) {
            PLvideoId = PL.items[0].id as string;
          }
        }
      } else {
        throw new Error('No Contents Found');
      }
      PLBtn.value = true;

      videoId.value = PLvideoId;
      searchResults = await ytmusic.getInfo(PLvideoId);
    } else {
      PLBtn.value = false;
      searchResults = await ytmusic.getInfo(route.query.v as string);
    }

    results.value = searchResults;
    Nextresults.value = await searchResults?.getUpNext();
    Relatedresults.value = await searchResults?.getRelated();

    try {
      Lyricsresults.value = await searchResults?.getLyrics();
    } catch (error) {
      console.error(error);
      Lyricsresults.value = undefined;
    }

    fatalError.value = false;
  } catch (error) {
    console.error(error);
    alert.value = true;
    fatalError.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  }
};

await fetchData();
</script>
<template>
  <v-container :fluid="true">
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

    <v-snackbar v-model="autoplaySnackbar" timeout="5000" top right>
      Navigate to the next video in 5 seconds.
      <template #actions>
        <v-btn color="red" @click="autoplaySnackbar = false">
          Cancel
        </v-btn>
      </template>
    </v-snackbar>

    <v-row v-if="!fatalError" wrap>
      <v-col cols="12" md="8">
        <div v-if="playerStore.player === 'embed'" class="video-container">
          <iframe
            id="youtubeiframechild"
            :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&enablejsapi=1`" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen />
        </div>

        <YTCommonPlayer
          v-else-if="playerStore.player === 'shaka-player'" ref="child" :key="videoId"
          :videoId="videoId" @errors="handleError" @complete="AutoPlay" />

        <YTCommonVideoJS
          v-else-if="playerStore.player === 'VideoJS'" ref="child" :key="videoId + 'JS'"
          :videoId="videoId" @errors="handleError" />

        <YTMusicCommonTrackInfo
          :data="results" :downloading="downloading" @downloadVideo="downloadVideo"
          @share="share" />
      </v-col>
      <v-col cols="12" md="4">
        <v-tabs v-model="tab">
          <v-tab v-if="PLBtn" value="option-1">Playlist</v-tab>
          <v-tab value="option-2">Next</v-tab>
          <v-tab value="option-3">Lyrics</v-tab>
          <v-tab value="option-4">Related</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item v-if="PLBtn" value="option-1">
            <template v-if="Playlistresults">
              <div class="scrollable-component">
                <v-row style="width: 100%; margin-left: 0;">
                  <template v-for="result in Playlistresults">
                    <YTMusicNode
                      :data="(result as unknown as Helpers.YTNode)"
                      :PLid="(route.query.list as string)" />
                  </template>
                </v-row>
              </div>
            </template>
          </v-tabs-window-item>
          <v-tabs-window-item value="option-2">
            <template v-if="Nextresults">
              <v-row style="width: 100%; margin-left: 0;">
                <template v-for="result in Nextresults.contents">
                  <YTMusicNode :data="result" />
                </template>
              </v-row>
            </template>
          </v-tabs-window-item>
          <v-tabs-window-item value="option-3">
            <template v-if="Lyricsresults">
              <v-card>
                <v-card-text>{{ Lyricsresults.description.text }}</v-card-text>
              </v-card>
            </template>
          </v-tabs-window-item>
          <v-tabs-window-item value="option-4">
            <template v-if="Relatedresults">
              <v-row style="width: 100%; margin-left: 0;">
                <template v-for="result in Relatedresults">
                  <YTMusicNode :data="result" />
                </template>
              </v-row>
            </template>
          </v-tabs-window-item>
        </v-tabs-window>

      </v-col>
    </v-row>

  </v-container>
</template>
<style scoped>
.video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    /* 16:9 aspect ratio */
    height: 0;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.titletext {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.scrollable-component {
    height: 500px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 16px;
}
</style>

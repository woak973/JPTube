<script setup lang="ts">
import type { Innertube, YT, YTShorts, Types } from 'youtubei.js';
import { Helpers, YTNodes } from 'youtubei.js';

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();
const autoplayStore = useAutoPlayStore();
const { share } = useShare();

const Relatedresults = ref<YTNodes.NavigationEndpoint[] | undefined>();
const HeaderResults = ref<YT.VideoInfo>();
const RelatedTypicalresults = ref<Helpers.ObservedArray<Helpers.YTNode> | null | undefined>();
const Commentresults = ref<Helpers.ObservedArray<YTNodes.CommentThread> | null>();
const tab = ref<string>('option-1');

const videoId = ref<string>(route.params.v as string);

let sourceresults: YTShorts.ShortFormVideoInfo;
let comsource: YT.Comments;
let typicalsource: YT.VideoInfo;
let yt: Innertube;

const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const fatalError = ref<boolean>(false);

const downloading = ref<boolean>(false);
const child = ref<{ seek: (seconds: number) => void } | null>(null);

const selectedSort = ref<'TOP_COMMENTS' | 'NEWEST_FIRST'>('TOP_COMMENTS');

const showFullDescription = ref<boolean>(false);
const autoplaySnackbar = ref<boolean>(false);

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

watch(HeaderResults, (newVal) => {
  if (newVal) {
    useHead({
      title: `${newVal.primary_info?.title.text ? newVal.primary_info.title.text : 'Shorts'} - JPTube`,
    });
  }
});

watch(() => route.query.t, (newTime) => {
  if (newTime) {
    let timeString = newTime.toString();
    if (timeString.endsWith('s')) {
      timeString = timeString.slice(0, -1);
    }
    seekToTime(Number(timeString));
    const { t, ...remainingQuery } = route.query;
    router.replace({
      query: remainingQuery,
    });
    window.scrollTo(0, 0);
  }
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

const seekToTime = (time: number) => {
  if (!isFinite(time)) {
    console.error('Invalid seek time:', time);
    return;
  }

  if (child.value) {
    child.value.seek(time);
  } else if (playerStore.player === 'embed') {
    moveseek(time);
  } else {
    console.error('Component is not available');
  }
};

// 親ページから子ページへのメッセージを送信する関数
function postMessageToChild(action: string, arg: string | number | object | null = null) {
  const message = {
    event: 'command',
    func: action,
    args: arg,
  };
  const iframe = document.getElementById('youtubeiframechild') as HTMLIFrameElement;
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(JSON.stringify(message), '*');
    console.log('Message sent:', message);
  }
}

// 各関数を実行するための親ページの関数
function moveseek(timer: number) {
  postMessageToChild('seekTo', [timer, true]);
}

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
  try {
    if (sourceresults && sourceresults.wn_has_continuation) {
      const continuationResults: YTShorts.ShortFormVideoInfo = await sourceresults.getWatchNextContinuation();
      if (continuationResults.watch_next_feed) {
        if (Relatedresults.value) {
          Relatedresults.value.push(...continuationResults.watch_next_feed);
        }
      }
      sourceresults = continuationResults;
      done('ok');
    } else {
      done('empty');
    }
  } catch (error) {
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
    done('error');
  }
};

const TypicalLoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
  try {
    if (typicalsource && typicalsource.wn_has_continuation) {
      const continuationResults = await typicalsource.getWatchNextContinuation();
      if (continuationResults.watch_next_feed) {
        if (RelatedTypicalresults.value) {
          RelatedTypicalresults.value.push(...continuationResults.watch_next_feed);
        }
      }
      typicalsource = continuationResults;
      done('ok');
    } else {
      done('empty');
    }
  } catch (error) {
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
    done('error');
  }
};

const ComLoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
  try {
    if (comsource && comsource.has_continuation) {
      const continuationResults = await comsource.getContinuation();
      for (const comment of continuationResults.contents) {
        if (comment.has_replies) {
          await comment.getReplies();
        }
      }
      if (Commentresults.value) {
        Commentresults.value.push(...await continuationResults.contents);
      }
      comsource = continuationResults;
      done('ok');
    } else {
      done('empty');
    }
  } catch (error) {
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
    done('error');
  }
};

const handleError = (message: string) => {
  alert.value = true;
  errorMessage.value = message;
};

const downloadVideo = async () => {
  downloading.value = true;
  try {
    const DLyt = await useInnertube('player');
    const DLResults = await DLyt.getInfo(route.params.v as string);
    const DLOption: Types.DownloadOptions = { quality: 'best' };
    const stream = await DLResults.download(DLOption);
    const reader = stream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const blob = new Blob(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'videoplayback.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
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

const ApplyComSort = async () => {
  try {
    const SortResults = await yt.getComments(route.params.v as string, selectedSort.value);
    Commentresults.value = await SortResults.contents;
    comsource = SortResults;
  } catch (error) {
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  }
};

const fetchData = async () => {
  try {
    yt = await useInnertube('common');

    const searchResults: YTShorts.ShortFormVideoInfo = await yt.getShortsVideoInfo(route.params.v as string);
    const typicalsearchResults: YT.VideoInfo = await yt.getInfo(route.params.v as string);
    sourceresults = searchResults;
    Relatedresults.value = await searchResults.watch_next_feed;

    typicalsource = typicalsearchResults;
    RelatedTypicalresults.value = await typicalsearchResults.watch_next_feed;
    HeaderResults.value = await typicalsearchResults;

    try {
      const searchcommentResults = await yt.getComments(route.params.v as string);
      for (const comment of searchcommentResults.contents) {
        if (comment.has_replies) {
          await comment.getReplies();
        }
      }
      Commentresults.value = await searchcommentResults.contents;
      comsource = searchcommentResults;
    } catch (error) {
      Commentresults.value = null;
      console.error('Error fetching comments:', error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = 'An unknown error occurred';
      }
    }
  } catch (error) {
    alert.value = true;
    fatalError.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  }
};

const AutoPlay = () => {
  if (autoplayStore.autoplay) {
    if (Relatedresults.value && Relatedresults.value.length > 1) {
      const nextVideo = Relatedresults.value[0];
      if (nextVideo instanceof YTNodes.NavigationEndpoint) {
        autoplaySnackbar.value = true;
        setTimeout(() => {
          if (autoplaySnackbar.value) {
            navigateTo(nextVideo.metadata.url);
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

await fetchData();

</script>
<template>
  <v-container :fluid=true>
    <div>
      <v-dialog v-model="alert" max-width="500">
        <v-card>
          <v-card-title class="headline">Warning</v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="alert = false">Close</v-btn>
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

        <YTCommonVideoInfo
          :data="HeaderResults" :downloading="downloading"
          :showFullDescription="showFullDescription" @downloadVideo="downloadVideo" @share="share"
          @toggleDescription="toggleDescription" />
      </v-col>
      <v-col cols="12" md="4">
        <v-tabs v-model="tab">
          <v-tab value="option-1">Comments</v-tab>
          <v-tab value="option-2">RelatedShorts</v-tab>
          <v-tab value="option-3">RelatedVideos</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="option-1">
            <template v-if="Commentresults">
              <template v-if="comsource.header">
                <YTCommonCommentsHeader
                  :data="comsource.header"
                  @update:selectedSort="selectedSort = $event" @apply-com-sort="ApplyComSort" />
              </template>

              <v-infinite-scroll v-if="Commentresults.length" mode="intersect" @load="ComLoadMore">
                <v-row style="width: 100%; margin-left: 0;">
                  <template v-for="result in Commentresults">
                    <v-col v-if="(result instanceof YTNodes.CommentThread)" cols="12">
                      <YTCommonCommentThread :data="result" />
                    </v-col>
                  </template>
                </v-row>
              </v-infinite-scroll>
            </template>
          </v-tabs-window-item>
          <v-tabs-window-item value="option-2">
            <template v-if="Relatedresults">
              <v-infinite-scroll v-if="Relatedresults.length" mode="intersect" @load="LoadMore">
                <v-row style="width: 100%; margin-left: 0;">
                  <template v-for="result in Relatedresults">
                    <v-col
                      v-if="(result instanceof YTNodes.NavigationEndpoint) && result.name === 'reelWatchEndpoint'"
                      cols="4">
                      <YTCommonNavigationEndpointReelWatchEndpoint :data="result" />
                    </v-col>
                  </template>
                </v-row>
              </v-infinite-scroll>
            </template>
          </v-tabs-window-item>
          <v-tabs-window-item value="option-3">
            <template v-if="RelatedTypicalresults">
              <v-infinite-scroll
                v-if="RelatedTypicalresults.length" mode="intersect"
                @load="TypicalLoadMore">
                <v-row style="width: 100%; margin-left: 0;">
                  <template v-for="result in RelatedTypicalresults">
                    <template v-if="(result instanceof Helpers.YTNode)">
                      <YTNode :data="result" :page="'Watch'" />
                    </template>
                  </template>
                </v-row>
              </v-infinite-scroll>
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

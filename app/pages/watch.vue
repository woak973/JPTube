<script setup lang="ts">
import type { Innertube, YT, Types } from 'youtubei.js';
import { YTNodes, Helpers } from 'youtubei.js';

const route = useRoute();
const playerStore = usePlayerStore();
const autoplayStore = useAutoPlayStore();
const { share } = useShare();
const goTo = useGoTo();

const Relatedresults = ref<Helpers.ObservedArray<Helpers.YTNode> | null | undefined>();
const ChipResults = ref<Helpers.ObservedArray<Helpers.YTNode> | null | undefined>();
const chipOptions = ref<YTNodes.ChipCloud | null | undefined>();
const HeaderResults = ref<YT.VideoInfo>();
const Commentresults = ref<Helpers.ObservedArray<YTNodes.CommentThread> | null>();
const Chatresults = ref<Array<Helpers.YTNode>>([]);
const ChatBannerResults = ref<Array<Helpers.YTNode>>([]);
const PLResults = ref<YTNodes.TwoColumnWatchNextResults['playlist']>();
const AutoPlayResults = ref<YTNodes.TwoColumnWatchNextResults['autoplay']>();

const videoId = ref(route.query.v as string);

watch(HeaderResults, (newVal) => {
  if (newVal) {
    useHead({
      title: `${newVal.primary_info?.title.text ? newVal.primary_info?.title.text : 'Watch'} - JPTube`,
    });
  }
});

watch(() => route.query.v, async (newVideoId) => {
  videoId.value = newVideoId as string;
  goTo(0);
  await fetchVideoData();
  selectedChip.value = undefined;
  ischipselected.value = false;
});

watch(() => route.query.list, async () => {
  goTo(0);
  await fetchVideoData();
});

onBeforeRouteUpdate((to, from, next) => {
  if (autoplaySnackbar.value) {
    autoplaySnackbar.value = false;
  }
  if (to.query.v === from.query.v) {
    if (to.query.t) {
      const timeString = to.query.t.toString();
      const seekTime = timeString.endsWith('s') ? timeString.slice(0, -1) : timeString;
      seekToTime(Number(seekTime));
      next(false);
    } else {
      next();
    }
    goTo(0);
  } else {
    if (livechat) {
      livechat.stop();
    }
    next();
  }
});

onBeforeRouteLeave((to, from, next) => {
  if (autoplaySnackbar.value) {
    autoplaySnackbar.value = false;
  }
  if (to.query.v === from.query.v) {
    if (to.query.t) {
      const timeString = to.query.t.toString();
      const seekTime = timeString.endsWith('s') ? timeString.slice(0, -1) : timeString;
      seekToTime(Number(seekTime));
      next(false);
    } else {
      next();
    }
    goTo(0);
  } else {
    if (livechat) {
      livechat.stop();
    }
    next();
  }
});

let livechat: YT.LiveChat;
const selectedSort = ref<'TOP_COMMENTS' | 'NEWEST_FIRST'>('TOP_COMMENTS');
let sourceresults: YT.VideoInfo;
let comsource: YT.Comments;
let yt: Innertube;
const alert = ref<boolean>(false);
const errorMessage = ref<string>('');
const fatalError = ref<boolean>(false);
const showFullDescription = ref<boolean>(false);
const autoplaySnackbar = ref<boolean>(false);
const selectedChip = ref<string>();
const ischipselected = ref<boolean>(false);
const mobilecom = ref<'related' | 'comments'>('related');

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

const infiniteScrollKey = ref<string>(route.query.v as string);
const ChatBtn = ref<boolean>(false);
const PLBtn = ref<boolean>(false);

const ChatComponent = ref<boolean>(false);
const PLComponent = ref<boolean>(false);

const downloading = ref<boolean>(false);
const child = ref<{ seek: (seconds: number) => void } | null>(null);

const toggleChatComponent = () => {
  ChatComponent.value = !ChatComponent.value;
  if (ChatComponent.value) {
    livechat.start();
  } else {
    livechat.stop();
    Chatresults.value = [];
  }
};

const togglePLComponent = () => {
  PLComponent.value = !PLComponent.value;
};

const toggleCommentComponent = () => {
  if (mobilecom.value === 'comments') {
    mobilecom.value = 'related';
  } else {
    mobilecom.value = 'comments';
  }
};

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

const fetchVideoData = async () => {
  try {
    yt = await useInnertube('common');

    const nav = new YTNodes.NavigationEndpoint({ watchEndpoint: { videoId: route.query.v as string, playlistId: route.query.list as string, playlistIndex: route.query.index as string } });

    if (route.query.list) {
      PLBtn.value = true;
      PLComponent.value = true;
    } else {
      PLBtn.value = false;
      PLComponent.value = false;
    }

    const searchResults = await yt.getInfo(nav);
    infiniteScrollKey.value = route.query.v as string;

    Relatedresults.value = await searchResults.watch_next_feed;
    chipOptions.value = searchResults.related_chip_cloud;
    HeaderResults.value = searchResults;
    PLResults.value = searchResults.playlist;
    AutoPlayResults.value = searchResults.autoplay;
    sourceresults = searchResults;

    try {
      const searchcommentResults = await yt.getComments(route.query.v as string);
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

    ChatComponent.value = false;
    Chatresults.value = [];
    if (searchResults.livechat) {
      console.log('This video has a live chat.');
      livechat = await searchResults.getLiveChat();

      livechat.on('start', (initial_data) => {
        initial_data.actions.forEach((action) => {
          if (action instanceof YTNodes.AddChatItemAction) {
            const items = action.item;
            Chatresults.value.unshift(items);
          } else if (action instanceof YTNodes.ReplayChatItemAction) {
            action.actions.forEach((replayAction) => {
              if (replayAction instanceof YTNodes.AddChatItemAction) {
                const replayItems = replayAction.item;
                Chatresults.value.unshift(replayItems);
              }
            });
          } else if (action instanceof YTNodes.AddBannerToLiveChatCommand) {
            const banner = action.banner;
            if (banner) {
              ChatBannerResults.value = [banner];
            }
          }
        });
      });
      livechat.on('end', () => console.info('This live stream has ended.'));
      livechat.on('error', error => console.error('An error occurred:', error));
      livechat.on('metadata-update', (metadata) => {
        if (HeaderResults.value?.primary_info?.view_count?.view_count) {
          HeaderResults.value.primary_info.view_count.view_count.text = metadata.views?.view_count.text;
        }
        if (HeaderResults.value?.primary_info?.published) {
          HeaderResults.value.primary_info.published.text = metadata.date?.date_text;
        }
      });
      livechat.on('chat-update', (message) => {
        if (message instanceof YTNodes.AddChatItemAction) {
          const items = message.item;
          Chatresults.value.unshift(items);
        } else if (message instanceof YTNodes.ReplayChatItemAction) {
          message.actions.forEach((replayAction) => {
            if (replayAction instanceof YTNodes.AddChatItemAction) {
              const replayItems = replayAction.item;
              Chatresults.value.unshift(replayItems);
            }
          });
        } else if (message instanceof YTNodes.AddBannerToLiveChatCommand) {
          const banner = message.banner;
          if (banner) {
            ChatBannerResults.value = [banner];
          }
        }

        if (Chatresults.value.length > 50) {
          Chatresults.value.splice(50);
        }
      });
      ChatBtn.value = true;
    } else {
      ChatBtn.value = false;
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

const LoadMore = async ({ done }: { done: (status: 'ok' | 'empty' | 'error') => void }) => {
  try {
    if (sourceresults && sourceresults.wn_has_continuation) {
      const continuationResults = await sourceresults.getWatchNextContinuation();
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
    console.error(error);
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
      } else {
        Commentresults.value = await continuationResults.contents;
      }
      comsource = continuationResults;
      done('ok');
    } else {
      done('empty');
    }
  } catch (error) {
    console.error(error);
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
    done('error');
  }
};

const ApplyComSort = async () => {
  try {
    const SortResults = await yt.getComments(route.query.v as string, selectedSort.value);
    Commentresults.value = await SortResults.contents;
    comsource = SortResults;
  } catch (error) {
    console.error(error);
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  }
};

const applyChips = async () => {
  const chip = selectedChip.value;
  if (chip) {
    ChipResults.value = null;
    ischipselected.value = true;
    const nav = await yt.actions.execute('/next', { continuation: chip, parse: true });
    ChipResults.value = nav?.on_response_received_endpoints ? nav.on_response_received_endpoints : null;
  } else {
    ischipselected.value = false;
    ChipResults.value = null;
  }
};

const downloadVideo = async () => {
  downloading.value = true;
  try {
    const DLyt = await useInnertube('player');
    const DLResults = await DLyt.getInfo(route.query.v as string);
    const DLOption: Types.DownloadOptions = { quality: 'best' };
    const Format = await DLResults.chooseFormat(DLOption);
    const format_url = `${Format.decipher(DLResults.actions.session.player)}&cpn=${DLResults.cpn}`;
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = getProxifiedUrl(format_url);
      a.download = 'videoplayback.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(format_url);
      downloading.value = false;
    }, 3500);
  } catch (error) {
    console.error(error);
    alert.value = true;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
    downloading.value = false;
  }
};

const handleError = (message: string) => {
  console.error(message);
  alert.value = true;
  errorMessage.value = message;
};

const AutoPlay = () => {
  if (autoplayStore.autoplay) {
    if (AutoPlayResults.value && AutoPlayResults.value.sets) {
      autoplaySnackbar.value = true;
      setTimeout(() => {
        if (autoplaySnackbar.value && AutoPlayResults.value) {
          navigateTo(AutoPlayResults.value.sets[0]?.autoplay_video.metadata.url);
        }
      }, (AutoPlayResults.value.count_down_secs ?? 5) * 1000);
    } else {
      console.error('RelatedVideos is empty or undefined.');
    }
  }
};

await fetchVideoData();

</script>

<template>

  <v-container :fluid=true>
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
      Navigate to the next video in {{ AutoPlayResults?.count_down_secs ?? 5 }} seconds.
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

        <template v-if="!isMobile && Commentresults">
          <template v-if="comsource.header">
            <YTCommonCommentsHeader
              :data="comsource.header"
              @update:selectedSort="selectedSort = $event" @apply-com-sort="ApplyComSort" />
          </template>

          <v-infinite-scroll v-if="Commentresults.length" :key="infiniteScrollKey" mode="intersect" @load="ComLoadMore">
            <v-row style="width: 100%; margin-left: 0;">
              <template v-for="result in Commentresults">
                <v-col v-if="(result instanceof YTNodes.CommentThread)" cols="12">
                  <YTCommonCommentThread :data="result" :yt="yt" />
                </v-col>
              </template>
            </v-row>
          </v-infinite-scroll>
        </template>

      </v-col>
      <v-col cols="12" md="4">
        <v-row>
          <v-col v-if="ChatBtn && !ChatComponent" cols="12">
            <YTCommonChatBtn @toggleChatComponent="toggleChatComponent" />
          </v-col>

          <v-expand-transition>
            <div v-if="ChatComponent" class="scrollable-component">
              <v-row justify="end">
                <v-btn icon @click="toggleChatComponent">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-row>
              <v-row>
                <template v-for="BannerResult in ChatBannerResults">
                  <template v-if="(BannerResult instanceof Helpers.YTNode)">
                    <YTNode :data="BannerResult" />
                  </template>
                </template>
              </v-row>
              <v-row>
                <template v-for="result in Chatresults">
                  <template v-if="(result instanceof Helpers.YTNode)">
                    <YTNode :data="result" />
                  </template>
                </template>
              </v-row>
            </div>
          </v-expand-transition>

          <v-col v-if="PLBtn && !PLComponent" cols="12">

            <YTCommonPLBtn @togglePLComponent="togglePLComponent" />
          </v-col>

          <v-expand-transition>
            <div v-if="PLComponent" class="scrollable-component">
              <template v-if="PLResults">
                <YTCommonTwoColumnWatchNextResultsPlaylist :data="PLResults" @togglePLComponent="togglePLComponent" />
              </template>
              <v-row style="margin-top: 0;">
                <template v-for="result in PLResults?.contents">
                  <template v-if="(result instanceof Helpers.YTNode)">
                    <YTNode :data="result" />
                  </template>
                </template>
              </v-row>
            </div>
          </v-expand-transition>

          <v-col v-if="Commentresults && isMobile && mobilecom === 'related'" cols="12">

            <YTCommonCommentBtn :data="comsource.header" @toggleCommentComponent="toggleCommentComponent" />
          </v-col>

          <template v-if="isMobile">
            <v-col cols="12">
              <v-window v-model="mobilecom">
                <v-window-item value="related">
                  <v-chip-group v-if="chipOptions" v-model="selectedChip" color="primary" @update:modelValue="applyChips">
                    <v-chip v-for="chip in chipOptions.chips" :key="chip.text" :value="chip.endpoint?.payload?.token">
                      {{ chip.text }}
                    </v-chip>
                  </v-chip-group>
                  <template v-if="Relatedresults && !ischipselected">
                    <v-infinite-scroll v-if="Relatedresults.length" :key="infiniteScrollKey" mode="intersect" @load="LoadMore">
                      <v-row style="width: 100%; margin-left: 0;">
                        <template v-for="result in Relatedresults">
                          <template v-if="(result instanceof Helpers.YTNode)">
                            <YTNode :data="result" :page="'Watch'" />
                          </template>
                        </template>
                      </v-row>
                    </v-infinite-scroll>
                  </template>
                  <template v-else-if="ChipResults && ischipselected">
                    <v-row style="width: 100%; margin-left: 0;">
                      <template v-for="result in ChipResults">
                        <template v-if="(result instanceof Helpers.YTNode)">
                          <YTNode :data="result" :page="'Watch'" />
                        </template>
                      </template>
                    </v-row>
                  </template>
                  <template v-else-if="!ChipResults && ischipselected">
                    <div style="display: flex; justify-content: center; align-items: center; height: 100px;">
                      <v-progress-circular indeterminate color="primary" />
                    </div>
                  </template>
                </v-window-item>

                <v-window-item value="comments">
                  <template v-if="Commentresults">
                    <template v-if="comsource.header">
                      <YTCommonCommentsHeaderMobile
                        :data="comsource.header"
                        @update:selectedSort="selectedSort = $event" @apply-com-sort="ApplyComSort" @toggleCommentComponent="toggleCommentComponent" />
                    </template>

                    <v-infinite-scroll v-if="Commentresults.length" :key="infiniteScrollKey" mode="intersect" @load="ComLoadMore">
                      <v-row style="width: 100%; margin-left: 0;">
                        <template v-for="result in Commentresults">
                          <v-col v-if="(result instanceof YTNodes.CommentThread)" cols="12">
                            <YTCommonCommentThread :data="result" :yt="yt" />
                          </v-col>
                        </template>
                      </v-row>
                    </v-infinite-scroll>
                  </template>
                </v-window-item>
              </v-window>
            </v-col>
          </template>

          <template v-else>
            <v-chip-group v-if="chipOptions" v-model="selectedChip" color="primary" @update:modelValue="applyChips">
              <v-chip v-for="chip in chipOptions.chips" :key="chip.text" :value="chip.endpoint?.payload?.token">
                {{ chip.text }}
              </v-chip>
            </v-chip-group>
            <template v-if="Relatedresults && !ischipselected">
              <v-infinite-scroll v-if="Relatedresults.length" :key="infiniteScrollKey" mode="intersect" @load="LoadMore">
                <v-row style="width: 100%; margin-left: 0;">
                  <template v-for="result in Relatedresults">
                    <template v-if="(result instanceof Helpers.YTNode)">
                      <YTNode :data="result" :page="'Watch'" />
                    </template>
                  </template>
                </v-row>
              </v-infinite-scroll>
            </template>
            <template v-else-if="ChipResults && ischipselected">
              <v-row style="width: 100%; margin-left: 0;">
                <template v-for="result in ChipResults">
                  <template v-if="(result instanceof Helpers.YTNode)">
                    <YTNode :data="result" :page="'Watch'" />
                  </template>
                </template>
              </v-row>
            </template>
            <template v-else-if="!ChipResults && ischipselected">
              <v-row justify="center">
                <v-col cols="auto">
                  <v-progress-circular indeterminate color="primary" />
                </v-col>
              </v-row>
            </template>
          </template>
        </v-row>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Watch',
  computed: {
    isMobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

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

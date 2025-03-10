<script setup lang="ts">
import { Innertube, UniversalCache, YT, YTNodes, Helpers, Types } from 'youtubei.js';

const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();
const playerStore = usePlayerStore();
const { share } = useShare();

const Relatedresults = ref<Helpers.ObservedArray<Helpers.YTNode> | null | undefined>();
const HeaderResults = ref<YT.VideoInfo>();
const Commentresults = ref<Helpers.ObservedArray<YTNodes.CommentThread> | null>();
const Chatresults = ref<Array<Helpers.YTNode>>([]);
const ChatBannerResults = ref<Array<Helpers.YTNode>>([]);
const PLResults = ref<Array<YTNodes.PlaylistVideo>>([]);
const PLInfo = ref<YT.Playlist>();


const videoId = ref(route.query.v as string);

watch(HeaderResults, (newVal) => {
    if (newVal) {
        useHead({
            title: `${newVal.primary_info?.title.text} - JPTube` || "Watch - JPTube"
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
        window.scrollTo(0, 0);

    }
});

watch(() => route.query.v, async (newVideoId) => {
    videoId.value = newVideoId as string;
    window.scrollTo(0, 0);
    await fetchVideoData();

});

watch(() => route.query.list, async () => {
    window.scrollTo(0, 0);
    await fetchVideoData();

});

onBeforeRouteUpdate(() => {
    if (livechat) {
        livechat.stop();
    }
});

onBeforeRouteLeave(() => {
    if (livechat) {
        livechat.stop();
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


const toggleDescription = () => {
    showFullDescription.value = !showFullDescription.value;
};

const ChatBtn = ref<boolean>(false);
const PLBtn = ref<boolean>(false);

const ChatComponent = ref<boolean>(false);
const PLComponent = ref<boolean>(false);

const downloading = ref<boolean>(false);
const child = ref<{ seek: (seconds: number) => void; } | null>(null);

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
function postMessageToChild(action: string, arg: any = null) {
    const message = {
        event: 'command',
        func: action,
        args: arg
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
        const lang = langStore.lang || 'ja';
        const location = locationStore.location || 'JP';
        yt = await Innertube.create({
            fetch: fetchFn,
            cache: new UniversalCache(false),
            lang: lang,
            location: location
        });

        let searchResults: YT.VideoInfo;

        if (route.query.list) {
            let PLvideoId: string = '';
            const PL = await yt.getPlaylist(route.query.list as string);
            if (PL.page_contents instanceof YTNodes.SectionList) {
                PLInfo.value = PL;
                let PLcontents = PL;
                let flag = false;
                PLResults.value = [];

                while (!flag) {
                    PLcontents.items.forEach((video) => {
                        if ((video instanceof YTNodes.PlaylistVideo)) {
                            if (route.query.index === video.index.text) {
                                PLvideoId = video.id;
                                flag = true;
                            } else if (route.query.v === video.id) {
                                PLvideoId = video.id;
                                flag = true;
                            }
                            PLResults.value.push(video);
                        }
                    });

                    if (!flag && await PLcontents.has_continuation) {
                        const ContPL = await PLcontents.getContinuation();
                        PLcontents = await ContPL;
                    } else {
                        break;
                    }
                }

                if (PLvideoId === '') {
                    PLvideoId = (PL.items[0] as YTNodes.PlaylistVideo).id;
                }


            } else {
                throw new Error('No Contents Found');
            }
            PLBtn.value = true;
            PLComponent.value = true;

            videoId.value = PLvideoId;
            searchResults = await yt.getInfo(PLvideoId);
        } else {
            PLBtn.value = false;
            PLComponent.value = false;
            searchResults = await yt.getInfo(route.query.v as string);
        }



        Relatedresults.value = await searchResults.watch_next_feed;
        HeaderResults.value = searchResults;
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

        if (searchResults.livechat) {
            console.log('This video has a live chat.');
            livechat = await searchResults.getLiveChat();

            livechat.on('start', (initial_data) => {
                if (!Chatresults.value) {
                    Chatresults.value = [];
                }

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
            livechat.on('error', (error) => console.error('An error occurred:', error));
            livechat.on('metadata-update', (metadata) => {
                if (HeaderResults.value?.primary_info?.view_count?.view_count) {
                    HeaderResults.value.primary_info.view_count.view_count.text = metadata.views?.view_count.text;
                }
                if (HeaderResults.value?.primary_info?.published) {
                    HeaderResults.value.primary_info.published.text = metadata.date?.date_text;
                }
            });
            livechat.on('chat-update', (message) => {
                if (!Chatresults.value) {
                    Chatresults.value = [];
                }

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
            ChatComponent.value = false;
        }
        fatalError.value = false;
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

const LoadMore = async ({ done }: any) => {
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
        alert.value = true;
        if (error instanceof Error) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = 'An unknown error occurred';
        }
        done('error');
    }

};

const ComLoadMore = async ({ done }: any) => {
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
        alert.value = true;
        if (error instanceof Error) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = 'An unknown error occurred';
        }
    }
};

const downloadVideo = async () => {
    downloading.value = true;
    try {
        const DLlang = langStore.lang || 'ja';
        const DLlocation = locationStore.location || 'JP';
        const DLyt = await Innertube.create({
            fetch: PlayerfetchFn,
            cache: new UniversalCache(false),
            lang: DLlang,
            location: DLlocation
        });
        const DLResults = await DLyt.getInfo(route.query.v as string);
        const DLOption: Types.DownloadOptions = { quality: 'best' }
        const stream = await DLResults.download(DLOption);
        const reader = stream.getReader();
        const chunks = [];
        let receivedLength = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
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

const handleError = (message: string) => {
    alert.value = true;
    errorMessage.value = message;
};

await fetchVideoData();


</script>

<template>

    <v-container :fluid=true>
        <div>
            <v-dialog v-model="alert" max-width="500">
                <v-card>
                    <v-card-title class="headline">Warning</v-card-title>
                    <v-card-text>{{ errorMessage }}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="alert = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>

        <v-row wrap v-if="!fatalError">
            <v-col cols="12" md="8">
                <div v-if="playerStore.player === 'embed'" class="video-container">
                    <iframe
                        :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&enablejsapi=1`"
                        id="youtubeiframechild" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>

                <YTCommonPlayer v-else-if="playerStore.player === 'shaka-player'" ref="child" :videoId="videoId"
                    :key="videoId" @errors="handleError" />

                <YTCommonVideoJS v-else-if="playerStore.player === 'VideoJS'" ref="child" :videoId="videoId"
                    :key="videoId + 'JS'" @errors="handleError" />

                <YTCommonVideoInfo :data="HeaderResults" :downloading="downloading"
                    :showFullDescription="showFullDescription" @downloadVideo="downloadVideo" @share="share"
                    @toggleDescription="toggleDescription" />

                <template v-if="isMobile">
                    <template v-if="Relatedresults">
                        <v-infinite-scroll :mode="mode" @load="LoadMore" v-if="Relatedresults.length">
                            <v-row style="width: 100%; margin-left: 0;">
                                <template v-for="result in Relatedresults">
                                    <template v-if="(result instanceof Helpers.YTNode)">
                                        <YTNode :data="result" :page="'Watch'" />
                                    </template>
                                </template>
                            </v-row>
                        </v-infinite-scroll>
                    </template>
                </template>
                <template v-else>
                    <template v-if="Commentresults">
                        <template v-if="comsource.header">
                            <YTCommonCommentsHeader :data="comsource.header"
                                @update:selectedSort="selectedSort = $event" @apply-com-sort="ApplyComSort" />
                        </template>

                        <v-infinite-scroll mode="intersect" @load="ComLoadMore" v-if="Commentresults.length">
                            <v-row style="width: 100%; margin-left: 0;">
                                <template v-for="result in Commentresults">
                                    <v-col v-if="(result instanceof YTNodes.CommentThread)" cols="12">
                                        <YTCommonCommentThread :data="result" />
                                    </v-col>
                                </template>
                            </v-row>
                        </v-infinite-scroll>
                    </template>
                </template>



            </v-col>
            <v-col cols="12" md="4">

                <v-btn v-if="ChatBtn" @click="toggleChatComponent">Toggle Chat</v-btn>
                <v-expand-transition>
                    <div v-if="ChatComponent" class="scrollable-component">
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

                <v-btn v-if="PLBtn" @click="togglePLComponent">Toggle Playlist</v-btn>


                <v-expand-transition>
                    <div v-if="PLComponent" class="scrollable-component">
                        <v-card flat link :to="`/playlist?list=${PLInfo?.endpoint?.payload?.playlistId}`">
                            <v-card-text>{{ PLInfo?.info?.title }}・{{ PLInfo?.info?.total_items }}</v-card-text>
                        </v-card>
                        <v-row>
                            <template v-for="result in PLResults" :key="result.id">
                                <template v-if="(result instanceof YTNodes.PlaylistVideo)">
                                    <v-col cols="12">
                                        <YTCommonPlaylistVideoWatch :data="result" />
                                    </v-col>
                                </template>
                            </template>
                        </v-row>
                    </div>
                </v-expand-transition>


                <template v-if="isMobile">
                    <template v-if="Commentresults">
                        <template v-if="comsource.header">
                            <YTCommonCommentsHeader :data="comsource.header"
                                @update:selectedSort="selectedSort = $event" @apply-com-sort="ApplyComSort" />
                        </template>

                        <v-infinite-scroll :mode="mode" @load="ComLoadMore" v-if="Commentresults.length">
                            <v-row style="width: 100%; margin-left: 0;">
                                <template v-for="result in Commentresults">
                                    <v-col v-if="(result instanceof YTNodes.CommentThread)" cols="12">
                                        <YTCommonCommentThread :data="result" />
                                    </v-col>
                                </template>
                            </v-row>
                        </v-infinite-scroll>
                    </template>
                </template>
                <template v-else>
                    <template v-if="Relatedresults">
                        <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="Relatedresults.length">
                            <v-row style="width: 100%; margin-left: 0;">
                                <template v-for="result in Relatedresults">
                                    <template v-if="(result instanceof Helpers.YTNode)">
                                        <YTNode :data="result" :page="'Watch'" />
                                    </template>
                                </template>
                            </v-row>
                        </v-infinite-scroll>
                    </template>
                </template>

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

<script lang="ts">
export default {
    data(): { mode: "manual" | "intersect" | undefined } {
        return {
            mode: this.$vuetify.display.smAndDown ? 'manual' : 'intersect'
        }
    },
    name: 'Watch',
    computed: {
        isMobile() {
            return this.$vuetify.display.smAndDown
        }
    },
    watch: {
        isMobile(val) {
            this.mode = val ? 'manual' : 'intersect'
        }
    }
}
</script>

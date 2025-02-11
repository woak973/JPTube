<script setup lang="ts">
import { Innertube, UniversalCache, YT, YTNodes } from 'youtubei.js';
import Chat from '~/components/Chat.vue';


const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();
const playerStore = usePlayerStore();
const Relatedresults = ref();
const Primary_Informationresults = ref();
const videoId = ref(route.query.v as string);

watch(Primary_Informationresults, (newVal) => {
    if (newVal) {
        useHead({
            title: `${newVal.title.text} - JPTube` || "Watch - JPTube"
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


const Secondary_Informationresults = ref();
const Basic_Informationresults = ref();
const Commentresults = ref();
const Chatresults = ref();
const PLResults = ref<YTNodes.PlaylistVideo[]>([]);
let livechat: YT.LiveChat;
const selectedSort = ref<'TOP_COMMENTS' | 'NEWEST_FIRST'>('TOP_COMMENTS');
let sourceresults: YT.VideoInfo;
let comsource: YT.Comments;
let yt: Innertube;
const alert = ref(false);
const errorMessage = ref('');
const fatalError = ref(false);
const showFullDescription = ref(false);


const toggleDescription = () => {
    showFullDescription.value = !showFullDescription.value;
};

const ChatBtn = ref(false);
const PLBtn = ref(false);

const ChatComponent = ref(false);
const PLComponent = ref(false);

const downloading = ref(false);
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
                let PLcontents = PL;
                let flag = false;
                PLResults.value = [];

                while (!flag) {
                    PLcontents.items.forEach((video) => {
                        if (video.type === 'PlaylistVideo') {
                            if (route.query.index === (video as YTNodes.PlaylistVideo).index.text) {
                                PLvideoId = (video as YTNodes.PlaylistVideo).id;
                                flag = true;
                            } else if (route.query.v === (video as YTNodes.PlaylistVideo).id) {
                                PLvideoId = (video as YTNodes.PlaylistVideo).id;
                                flag = true;
                            }
                            PLResults.value.push(video as YTNodes.PlaylistVideo);
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
                    PLvideoId = (PLcontents.items[0] as YTNodes.PlaylistVideo).id;
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
        Primary_Informationresults.value = await searchResults.primary_info;
        Secondary_Informationresults.value = await searchResults.secondary_info;
        Basic_Informationresults.value = await searchResults.basic_info;
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

            livechat.on('start', (initial_data) => console.log(initial_data));
            livechat.on('end', () => console.info('This live stream has ended.'));
            livechat.on('error', (error) => console.error('An error occurred:', error));
            livechat.on('chat-update', (message) => {
                if (!Chatresults.value) {
                    Chatresults.value = [];
                }
                switch (message.type) {
                    case 'AddChatItemAction':
                        const items = message.as(YTNodes.AddChatItemAction).item;
                        Chatresults.value.unshift(items);
                        break;
                    case 'ReplayChatItemAction':
                        message.as(YTNodes.ReplayChatItemAction).actions.forEach((action) => {
                            const replayItems = action.as(YTNodes.AddChatItemAction).item;
                            Chatresults.value.unshift(replayItems);
                        });
                        break;
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
                Relatedresults.value.push(...continuationResults.watch_next_feed);
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
            Commentresults.value.push(...await continuationResults.contents);
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
        const stream = await sourceresults.download();
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
                <div v-if="playerStore.player !== 'shaka-player'" class="video-container">
                    <iframe
                        :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&enablejsapi=1`"
                        id="youtubeiframechild" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>

                <Player v-else ref="child" :videoId="videoId" :key="videoId" @errors="handleError" />

                <v-card v-if="Primary_Informationresults && Secondary_Informationresults">
                    <v-card-title class="titletext" style="padding-bottom: 0">{{ Primary_Informationresults.title.text
                        }}</v-card-title>
                    <v-card-actions>
                        <v-row justify="space-between">
                            <v-col cols="auto">
                                <v-list-item :to="`/channel/${Secondary_Informationresults.owner.author.id}/featured`"
                                    link>
                                    <template v-slot:prepend>
                                        <v-avatar color="grey-darken-3" size="36"
                                            :image="Secondary_Informationresults.owner.author.thumbnails[0].url"></v-avatar>

                                    </template>

                                    <v-list-item-title>{{ Secondary_Informationresults.owner.author.name
                                        }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ Secondary_Informationresults.owner.subscriber_count.text
                                        }}</v-list-item-subtitle>

                                </v-list-item>
                            </v-col>
                            <v-col cols="auto">
                                <v-list-item>
                                    <v-slide-group>
                                        <v-slide-item>
                                            <v-btn :disabled="downloading" @click="downloadVideo" variant="tonal"
                                                class="rounded-pill mx-2">
                                                <v-icon v-if="!downloading">mdi-download</v-icon>
                                                <v-progress-circular v-else indeterminate
                                                    size="20"></v-progress-circular>
                                                Download
                                            </v-btn>
                                        </v-slide-item>
                                        <v-slide-item>
                                            <v-btn variant="tonal" class="rounded-pill mx-2" readonly>
                                                <v-icon>mdi-thumb-up</v-icon>
                                                {{ Basic_Informationresults.like_count }}
                                            </v-btn>
                                        </v-slide-item>
                                        <v-slide-item>
                                            <v-btn @click.stop="share" variant="tonal" class="rounded-pill mx-2">
                                                <v-icon>mdi-share</v-icon>
                                                Share
                                            </v-btn>
                                        </v-slide-item>
                                    </v-slide-group>
                                </v-list-item>
                            </v-col>

                        </v-row>
                    </v-card-actions>
                    <v-card-subtitle v-if="!showFullDescription">{{ Primary_Informationresults?.relative_date?.text
                        }}・{{
                            Primary_Informationresults?.view_count?.short_view_count?.text ||
                            Primary_Informationresults?.view_count?.view_count?.text
                        }}</v-card-subtitle>
                    <v-card-subtitle v-else>{{ Primary_Informationresults?.published?.text }}・{{
                        Primary_Informationresults?.view_count?.view_count?.text
                        }}</v-card-subtitle>
                    <v-card-text>
                        <div :class="{ 'line-clamp': !showFullDescription }">
                            <template v-for="result in Secondary_Informationresults?.description?.runs">
                                <template v-if="result.endpoint">
                                    <span style="white-space: pre-wrap; word-break: break-all;">
                                        <NuxtLink :to="result.endpoint.metadata.url">{{ result.text }}</NuxtLink>
                                    </span>
                                </template>
                                <template v-else-if="result.emoji">
                                    <span style="white-space: pre-wrap; word-break: break-all;">{{ result.text }}</span>
                                </template>
                                <template v-else>
                                    <span style="white-space: pre-wrap; word-break: break-all;">{{ result.text }}</span>
                                </template>
                            </template>
                        </div>


                        <template v-if="showFullDescription"
                            v-for="result in Secondary_Informationresults?.metadata?.rows">
                            <template v-if="result.type === 'RichMetadataRow'">
                                <v-row>
                                    <template v-for="innerresult in result.contents">
                                        <v-col cols="6" v-if="innerresult.type === 'RichMetadata'">
                                            <v-card elevation="16" :to="innerresult?.endpoint?.metadata?.url" link>
                                                <v-row>
                                                    <v-col cols="12" md="4" class="d-flex align-center justify-center image">
                                                        <v-img :src="getProxifiedUrl(innerresult?.thumbnail[0]?.url)">
                                                            <template v-slot:placeholder>
                                                                <div
                                                                    class="d-flex align-center justify-center fill-height">
                                                                    <v-progress-circular color="grey-lighten-4"
                                                                        indeterminate></v-progress-circular>
                                                                </div>
                                                            </template>
                                                        </v-img>
                                                    </v-col>
                                                    <v-col cols="12" md="4" class="description">
                                                        <v-card-title class="small-text omit">{{
                                                            innerresult?.title?.text
                                                        }}</v-card-title>
                                                        <v-card-subtitle class="tiny-text">{{
                                                            innerresult?.subtitle?.text
                                                        }}</v-card-subtitle>
                                                        <v-card-subtitle class="tiny-text">{{
                                                            innerresult?.call_to_action?.text
                                                        }}</v-card-subtitle>
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-col>
                                    </template>
                                </v-row>
                            </template>

                        </template>

                        <v-btn @click="toggleDescription">
                            {{ showFullDescription ? Secondary_Informationresults?.show_less_text :
                                Secondary_Informationresults?.show_more_text }}
                        </v-btn>
                    </v-card-text>
                </v-card>

                <template v-if="isMobile">
                    <template v-if="Relatedresults">
                        <v-infinite-scroll :mode="mode" @load="LoadMore" v-if="Relatedresults.length">
                            <v-row style="width: 100%; margin-left: 0;">
                                <template v-for="result in Relatedresults" :key="result.id">
                                    <v-col v-if="result.type === 'CompactVideo'" cols="12">
                                        <CompactVideo :data="result" />
                                    </v-col>
                                    <v-col v-else-if="result.type === 'LockupView'" cols="12">
                                        <template v-if="result.content_type === 'PLAYLIST'">
                                            <CompactPlaylists :data="result" />
                                        </template>
                                        <template v-else-if="result.content_type === 'VIDEO'">
                                            <LockUpCompactVideo :data="result" />
                                        </template>
                                    </v-col>
                                </template>
                            </v-row>
                        </v-infinite-scroll>
                    </template>
                </template>
                <template v-else>
                    <template v-if="Commentresults">
                        <v-col>
                            <strong>{{ comsource?.header?.count.text }}</strong>
                            <v-menu transition="scale-transition">
                                <template v-slot:activator="{ isActive, props, targetRef }">
                                    <v-btn color="primary" dark v-bind="props" v-on="props">
                                        <v-icon left>mdi-sort</v-icon>
                                        {{ comsource?.header?.sort_menu?.title }}
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="selectedSort = 'TOP_COMMENTS'; ApplyComSort()">
                                        <v-list-item-title v-if="comsource?.header?.sort_menu?.sub_menu_items">{{
                                            comsource.header.sort_menu.sub_menu_items[0].title
                                            }}</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="selectedSort = 'NEWEST_FIRST'; ApplyComSort()">
                                        <v-list-item-title v-if="comsource?.header?.sort_menu?.sub_menu_items">{{
                                            comsource.header.sort_menu.sub_menu_items[1].title
                                            }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-col>

                        <v-infinite-scroll mode="intersect" @load="ComLoadMore" v-if="Commentresults.length">
                            <v-row style="width: 100%; margin-left: 0;">
                                <template v-for="result in Commentresults" :key="result.id">
                                    <v-col v-if="result.type === 'CommentThread'" cols="12">
                                        <Comments :data="result" />
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
                            <template v-for="result in Chatresults" :key="result.id">
                                <v-col v-if="result.type === 'LiveChatTextMessage'" cols="12">
                                    <Chat :data="result" />
                                </v-col>
                            </template>
                        </v-row>
                    </div>
                </v-expand-transition>

                <v-btn v-if="PLBtn" @click="togglePLComponent">Toggle Playlist</v-btn>


                <v-expand-transition>
                    <div v-if="PLComponent" class="scrollable-component">
                        <v-row>
                            <template v-for="result in PLResults" :key="result.id">
                                <template v-if="result.type === 'PlaylistVideo'">
                                    <v-col cols="12">
                                        <CompactPlaylistVideo :data="result" />
                                    </v-col>
                                </template>
                            </template>
                        </v-row>
                    </div>
                </v-expand-transition>


                <template v-if="isMobile">
                    <template v-if="Commentresults">
                        <v-col>
                            <strong>{{ comsource?.header?.count.text }}</strong>
                            <v-menu transition="scale-transition">
                                <template v-slot:activator="{ isActive, props, targetRef }">
                                    <v-btn color="primary" dark v-bind="props" v-on="props">
                                        <v-icon left>mdi-sort</v-icon>
                                        {{ comsource?.header?.sort_menu?.title }}
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="selectedSort = 'TOP_COMMENTS'; ApplyComSort()">
                                        <v-list-item-title v-if="comsource?.header?.sort_menu?.sub_menu_items">{{
                                            comsource.header.sort_menu.sub_menu_items[0].title
                                            }}</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="selectedSort = 'NEWEST_FIRST'; ApplyComSort()">
                                        <v-list-item-title v-if="comsource?.header?.sort_menu?.sub_menu_items">{{
                                            comsource.header.sort_menu.sub_menu_items[1].title
                                            }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-col>

                        <v-infinite-scroll :mode="mode" @load="ComLoadMore" v-if="Commentresults.length">
                            <v-row style="width: 100%; margin-left: 0;">
                                <template v-for="result in Commentresults" :key="result.id">
                                    <v-col v-if="result.type === 'CommentThread'" cols="12">
                                        <Comments :data="result" />
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
                                <template v-for="result in Relatedresults" :key="result.id">
                                    <v-col v-if="result.type === 'CompactVideo'" cols="12">
                                        <CompactVideo :data="result" />
                                    </v-col>
                                    <v-col v-else-if="result.type === 'LockupView'" cols="12">
                                        <template v-if="result.content_type === 'PLAYLIST'">
                                            <CompactPlaylists :data="result" />
                                        </template>
                                        <template v-else-if="result.content_type === 'VIDEO'">
                                            <LockUpCompactVideo :data="result" />
                                        </template>
                                    </v-col>
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
    methods: {
        share() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                }).then(() => {
                    console.log('Thanks for sharing!');
                }).catch(console.error);
            } else {
                console.log('Share not supported on this browser, do it the old way.');
            }
        }
    },
    watch: {
        isMobile(val) {
            this.mode = val ? 'manual' : 'intersect'
        }
    }
}
</script>

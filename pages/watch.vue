<script setup lang="ts">
import { ref } from 'vue';
import { Innertube, UniversalCache, YT } from 'youtubei.js';


const route = useRoute();
const langStore = useLangStore();
const locationStore = useLocationStore();
const Relatedresults = ref();
const Primary_Informationresults = ref();

watch(Primary_Informationresults, (newVal) => {
    if (newVal) {
        useHead({
            title: `${newVal.title.text} - JPTube` || "Watch"
        });
    }
});

const Secondary_Informationresults = ref();
const Basic_Informationresults = ref();
const Commentresults = ref();
const Chatresults = ref();
let livechat: YT.LiveChat;
const selectedSort = ref<'TOP_COMMENTS' | 'NEWEST_FIRST'>('TOP_COMMENTS');
let sourceresults: YT.VideoInfo;
let comsource: YT.Comments;
let yt: Innertube;
const alert = ref(false);
const errorMessage = ref('');
const showFullDescription = ref(false);

const toggleDescription = () => {
    showFullDescription.value = !showFullDescription.value;
};



try {
    const lang = langStore.lang || 'ja';
    const location = locationStore.location || 'JP';
    yt = await Innertube.create({
        fetch: fetchFn,
        cache: new UniversalCache(false),
        lang: lang,
        location: location
    })
    const searchResults = await yt.getInfo(route.query.v as string);

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
        livechat.on('chat-update', (message) => console.log(message));
        livechat.start();
    }

} catch (error) {
    alert.value = true;
    if (error instanceof Error) {
        errorMessage.value = error.message;
    } else {
        errorMessage.value = 'An unknown error occurred';
    }
}

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

        <v-row wrap>
            <v-col cols="12" md="8">
                <div class="video-container">
                    <iframe :src="videoUrl" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>


                <v-card v-if="Primary_Informationresults && Secondary_Informationresults">
                    <v-card-title class="titletext">{{ Primary_Informationresults.title.text }}</v-card-title>
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
                                    <v-row :dense=true :no-gutters=true>
                                        <v-btn variant="tonal" class="rounded-pill mx-2" readonly>
                                            <v-icon>mdi-thumb-up</v-icon>
                                            {{ Basic_Informationresults.like_count }}
                                        </v-btn>
                                        <v-btn @click.stop="share" variant="tonal" class="rounded-pill mx-2">
                                            <v-icon>mdi-share</v-icon>
                                            Share
                                        </v-btn>
                                    </v-row>
                                </v-list-item>
                            </v-col>

                        </v-row>
                    </v-card-actions>
                    <v-card-subtitle v-if="!showFullDescription">{{ Primary_Informationresults.relative_date.text }}・{{
                        Primary_Informationresults.short_view_count.text || Primary_Informationresults.view_count.text
                        }}</v-card-subtitle>
                    <v-card-subtitle v-else>{{ Primary_Informationresults.published.text }}・{{
                        Primary_Informationresults.view_count.text
                        }}</v-card-subtitle>
                    <v-card-text>
                        <div :class="{ 'line-clamp': !showFullDescription }">
                            {{ Secondary_Informationresults.description.text }}
                        </div>
                        <v-btn @click="toggleDescription">
                            {{ showFullDescription ? Secondary_Informationresults.show_less_text.simpleText :
                                Secondary_Informationresults.show_more_text.simpleText }}
                        </v-btn>
                    </v-card-text>
                </v-card>

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
                </template>

                <v-infinite-scroll :mode="mode" @load="ComLoadMore" v-if="Commentresults && Commentresults.length">
                    <v-row style="width: 100%; margin-left: 0;">
                        <template v-for="result in Commentresults" :key="result.id">
                            <v-col v-if="result.type === 'CommentThread'" cols="12">
                                <Comments :data="result" />
                            </v-col>
                        </template>
                    </v-row>
                </v-infinite-scroll>




            </v-col>
            <v-col cols="12" md="4">
                <v-infinite-scroll mode="intersect" @load="LoadMore" v-if="Relatedresults && Relatedresults.length">
                    <v-row style="width: 100%; margin-left: 0;">
                        <template v-for="result in Relatedresults" :key="result.id">
                            <v-col v-if="result.type === 'CompactVideo'" cols="12">
                                <CompactVideo :data="result" />
                            </v-col>
                            <v-col v-else-if="result.type === 'LockupView'" cols="12">
                                <CompactPlaylists :data="result" />
                            </v-col>
                        </template>
                    </v-row>
                </v-infinite-scroll>

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
        videoUrl() {
            const videoId = this.$route.query.v as string || '';
            const playlistId = this.$route.query.list as string || '';
            let url = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1`;
            if (playlistId) {
                url += `&list=${playlistId}`;
            }
            return url;
        },
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

<template>
    <template v-if="data">
        <!-- Unity Components -->
        <template v-if="data.type === 'Video'">
            <template v-if="attribute === 'slide'">
                <Video :data="(data as YTNodes.Video)" />
            </template>
            <template v-else>
                <v-col v-if="page === 'Search'" cols="12">
                    <Video-Search :data="(data as YTNodes.Video)" />
                </v-col>
                <v-col v-else cols="12" md="3" lg="2" sm="6">
                    <Video :data="(data as YTNodes.Video)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'Channel'">
            <template v-if="attribute === 'slide'">
                <Channel :data="(data as YTNodes.Channel)" />
            </template>
            <template v-else>
                <v-col v-if="page === 'Search'" cols="12">
                    <Channel :data="(data as YTNodes.Channel)" />
                </v-col>
                <v-col v-else cols="12" md="3" lg="2" sm="6">
                    <Channel :data="(data as YTNodes.Channel)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'ShortsLockupView'">
            <template v-if="attribute === 'slide'">
                <ShortsLockupView :data="(data as YTNodes.ShortsLockupView)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <ShortsLockupView :data="(data as YTNodes.ShortsLockupView)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'GridPlaylist'">
            <template v-if="attribute === 'slide'">
                <GridPlaylist :data="(data as YTNodes.GridPlaylist)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <GridPlaylist :data="(data as YTNodes.GridPlaylist)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'GridVideo'">
            <template v-if="attribute === 'slide'">
                <GridVideo :data="(data as YTNodes.GridVideo)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <GridVideo :data="(data as YTNodes.GridVideo)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'PlaylistVideo'">
            <template v-if="attribute === 'slide'">
                <PlaylistVideo :data="(data as YTNodes.PlaylistVideo)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <PlaylistVideo :data="(data as YTNodes.PlaylistVideo)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'CompactVideo'">
            <template v-if="attribute === 'slide'">
                <CompactVideo :data="(data as YTNodes.CompactVideo)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <CompactVideo :data="(data as YTNodes.CompactVideo)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'LockupView'">
            <template v-if="attribute === 'slide'">
                <template v-if="(data as YTNodes.LockupView).content_type === 'PLAYLIST' || 'PODCAST'">
                    <LockupView-Playlist :data="(data as YTNodes.LockupView)" />
                </template>
                <template v-else-if="(data as YTNodes.LockupView).content_type === 'VIDEO'">
                    <LockupView-Video :data="(data as YTNodes.LockupView)" />
                </template>

            </template>
            <template v-else>
                <template v-if="(data as YTNodes.LockupView).content_type === 'PLAYLIST' || 'PODCAST'">
                    <v-col v-if="page === 'Search'" cols="12">
                        <LockupView-Playlist-Search :data="(data as YTNodes.LockupView)" />
                    </v-col>
                    <v-col v-else-if="page === 'Watch'" cols="12">
                        <LockupView-Playlist-Watch :data="(data as YTNodes.LockupView)" />
                    </v-col>
                    <v-col v-else cols="12" md="3" lg="2" sm="6">
                        <LockupView-Playlist :data="(data as YTNodes.LockupView)" />
                    </v-col>
                </template>
                <template v-else-if="(data as YTNodes.LockupView).content_type === 'VIDEO'">
                    <v-col cols="12">
                        <LockupView-Video :data="(data as YTNodes.LockupView)" />
                    </v-col>
                </template>
            </template>
        </template>

        <template v-else-if="data.type === 'GridChannel'">
            <template v-if="attribute === 'slide'">
                <GridChannel :data="(data as YTNodes.GridChannel)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <GridChannel :data="(data as YTNodes.GridChannel)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'ChannelOwnerEmptyState'">
            <template v-if="attribute === 'slide'">
                <ChannelOwnerEmptyState :data="(data as YTNodes.ChannelOwnerEmptyState)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <ChannelOwnerEmptyState :data="(data as YTNodes.ChannelOwnerEmptyState)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'BackstagePost'">
            <template v-if="attribute === 'slide'">
                <BackstagePost :data="(data as YTNodes.BackstagePost)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <BackstagePost :data="(data as YTNodes.BackstagePost)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'Post'">
            <template v-if="attribute === 'slide'">
                <Post :data="(data as YTNodes.Post)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <Post :data="(data as YTNodes.Post)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'SharedPost'">
            <template v-if="attribute === 'slide'">
                <SharedPost :data="(data as YTNodes.SharedPost)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <SharedPost :data="(data as YTNodes.SharedPost)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'BackstageImage'">
            <template v-if="attribute === 'slide'">
                <BackstageImage :data="(data as YTNodes.BackstageImage)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <BackstageImage :data="(data as YTNodes.BackstageImage)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'PostMultiImage'">
            <template v-if="attribute === 'slide'">
                <PostMultiImage :data="(data as YTNodes.PostMultiImage)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <PostMultiImage :data="(data as YTNodes.PostMultiImage)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'GameDetails'">
            <template v-if="attribute === 'slide'">
                <GameDetails :data="(data as YTNodes.GameDetails)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <GameDetails :data="(data as YTNodes.GameDetails)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'VideoCard'">
            <template v-if="attribute === 'slide'">
                <VideoCard :data="(data as YTNodes.VideoCard)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <VideoCard :data="(data as YTNodes.VideoCard)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'RichListHeader'">
            <template v-if="attribute === 'slide'">
                <RichListHeader :data="(data as YTNodes.RichListHeader)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <RichListHeader :data="(data as YTNodes.RichListHeader)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'IncludingResultsFor'">
            <template v-if="attribute === 'slide'">
                <IncludingResultsFor :data="(data as YTNodes.IncludingResultsFor)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <IncludingResultsFor :data="(data as YTNodes.IncludingResultsFor)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'ShowingResultsFor'">
            <template v-if="attribute === 'slide'">
                <ShowingResultsFor :data="(data as YTNodes.ShowingResultsFor)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <ShowingResultsFor :data="(data as YTNodes.ShowingResultsFor)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'HashtagTile'">
            <template v-if="attribute === 'slide'">
                <HashtagTile :data="(data as YTNodes.HashtagTile)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <HashtagTile :data="(data as YTNodes.HashtagTile)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'LiveChatTextMessage'">
            <template v-if="attribute === 'slide'">
                <LiveChatTextMessage :data="(data as YTNodes.LiveChatTextMessage)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <LiveChatTextMessage :data="(data as YTNodes.LiveChatTextMessage)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'RichMetadata'">
            <template v-if="attribute === 'slide'">
                <RichMetadata :data="(data as YTNodes.RichMetadata)" />
            </template>
            <template v-else>
                <v-col cols="6">
                    <RichMetadata :data="(data as YTNodes.RichMetadata)" />
                </v-col>
            </template>
        </template>


        <!-- Recursion Components -->

        <template v-else-if="data.type === 'RichItem'">
            <template v-if="((data as YTNodes.RichItem).content instanceof Helpers.YTNode)">
                <YTNode :data="(data as YTNodes.RichItem).content" :attribute="attribute" :page="page" />
            </template>
        </template>

        <template v-else-if="data.type === 'RichSection'">
            <template v-if="attribute === 'slide'">
                <template v-if="((data as YTNodes.RichSection).content instanceof Helpers.YTNode)">
                    <YTNode :data="(data as YTNodes.RichSection).content" :attribute="attribute" :page="page" />
                </template>
            </template>

            <template v-else>
                <v-col cols="12">
                    <template v-if="((data as YTNodes.RichSection).content instanceof Helpers.YTNode)">
                        <YTNode :data="(data as YTNodes.RichSection).content" :attribute="attribute" :page="page" />
                    </template>
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'Shelf'">
            <strong>{{ (data as YTNodes.Shelf).title.text }}</strong>
            <template v-if="((data as YTNodes.Shelf).content instanceof Helpers.YTNode)">
                <template
                    v-if="(data as YTNodes.Shelf).content !== null && (data as YTNodes.Shelf).content !== undefined">
                    <YTNode :data="(data as YTNodes.Shelf).content!" :attribute="attribute" :page="page" />
                </template>
            </template>
        </template>

        <template v-else-if="data.type === 'BackstagePostThread'">
            <v-col cols="12">
                <template v-if="((data as YTNodes.BackstagePostThread).post instanceof Helpers.YTNode)">
                    <YTNode :data="(data as YTNodes.BackstagePostThread).post" :attribute="attribute" :page="page" />
                </template>
            </v-col>
        </template>

        <template v-else-if="data.type === 'GameCard'">
            <template v-if="((data as YTNodes.GameCard).game instanceof Helpers.YTNode)">
                <YTNode :data="(data as YTNodes.GameCard).game" :attribute="attribute" :page="page" />
            </template>
        </template>

        <!-- Loop Components -->

        <template v-else-if="data.type === 'ItemSection'">
            <v-col cols="12">
                <template v-for="content in (data as YTNodes.ItemSection).contents">
                    <template v-if="(content instanceof Helpers.YTNode)">
                        <YTNode :data="content" :attribute="attribute" :page="page" />
                    </template>
                </template>
            </v-col>
        </template>

        <template v-else-if="data.type === 'HorizontalList'">
            <v-col cols="12">
                <v-slide-group>
                    <v-slide-item v-for="content in (data as YTNodes.HorizontalList).contents" class="ma-2"
                        :style="{ width: content.type === 'Post' ? '500px' : '200px' }">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </v-slide-item>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'HorizontalCardList'">
            <v-col cols="12">
                <YTNode :data="(data as YTNodes.HorizontalCardList).header" :attribute="attribute" />
                <v-slide-group>
                    <v-slide-item v-for="card in (data as YTNodes.HorizontalCardList).cards" class="ma-2"
                        style="width: 200px;">
                        <template v-if="(card instanceof Helpers.YTNode)">
                            <YTNode :data="card" :attribute="'slide'" :page="page" />
                        </template>
                    </v-slide-item>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'VerticalList'">
            <v-col cols="12">
                <v-slide-group>
                    <v-slide-item v-for="content in (data as YTNodes.VerticalList).contents" class="ma-2"
                        style="width: 200px;">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </v-slide-item>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'ReelShelf'">
            <v-col cols="12">
                <strong>{{ (data as YTNodes.ReelShelf).title.text }}</strong>
                <v-slide-group>
                    <v-slide-item v-for="item in (data as YTNodes.ReelShelf).items" class="ma-2" style="width: 200px;">
                        <template v-if="(item instanceof Helpers.YTNode)">
                            <YTNode :data="item" :attribute="'slide'" :page="page" />
                        </template>
                    </v-slide-item>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'RichShelf'">
            <v-col cols="12">
                <strong>{{ (data as YTNodes.RichShelf).title.text }}</strong>
                <v-slide-group>
                    <v-slide-item v-for="content in (data as YTNodes.RichShelf).contents" class="ma-2"
                        style="width: 200px;">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </v-slide-item>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'ChannelFeaturedContent'">
            <strong>{{ (data as YTNodes.ChannelFeaturedContent).title.text }}</strong>
            <v-row>
                <template v-for="item in (data as YTNodes.ChannelFeaturedContent).items" class="ma-2"
                    style="width: 200px;">
                    <template v-if="(item instanceof Helpers.YTNode)">
                        <YTNode :data="item" :attribute="attribute" :page="page" />
                    </template>
                </template>
            </v-row>
        </template>

        <template v-else-if="data.type === 'Grid'">
            <v-row>
                <template v-for="item in (data as YTNodes.Grid).items">
                    <template v-if="(item instanceof Helpers.YTNode)">
                        <YTNode :data="item" :attribute="attribute" :page="page" />
                    </template>
                </template>
            </v-row>
        </template>

        <template v-else-if="data.type === 'RichMetadataRow'">
            <v-row style="margin-top: 0; margin-bottom: 0;">
                <template v-for="content in (data as YTNodes.RichMetadataRow).contents">
                    <templace v-if="(content instanceof Helpers.YTNode)">
                        <YTNode :data="content" :attribute="attribute" :page="page" />
                    </templace>
                </template>
            </v-row>
        </template>

    </template>
</template>

<script setup lang="ts">
import { Helpers, YTNodes } from 'youtubei.js';

const props = defineProps({
    data: Helpers.YTNode,
    attribute: String,
    page: String

});
</script>
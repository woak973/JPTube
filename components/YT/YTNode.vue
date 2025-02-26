<template>
    <template v-if="data">
        <!-- Unity Components -->
        <template v-if="data.type === 'Video'">
            <template v-if="attribute === 'slide'">
                <YTNodeVideo :data="(data as YTNodes.Video)" />
            </template>
            <template v-else>
                <v-col v-if="page === 'Search'" cols="12">
                    <YTNodeVideoSearch :data="(data as YTNodes.Video)" />
                </v-col>
                <v-col v-else cols="12" md="3" lg="2" sm="6">
                    <YTNodeVideo :data="(data as YTNodes.Video)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'Channel'">
            <template v-if="attribute === 'slide'">
                <YTNodeChannel :data="(data as YTNodes.Channel)" />
            </template>
            <template v-else>
                <v-col v-if="page === 'Search'" cols="12">
                    <YTNodeChannel :data="(data as YTNodes.Channel)" />
                </v-col>
                <v-col v-else cols="12" md="3" lg="2" sm="6">
                    <YTNodeChannel :data="(data as YTNodes.Channel)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'ShortsLockupView'">
            <template v-if="attribute === 'slide'">
                <YTNodeShortsLockupView :data="(data as YTNodes.ShortsLockupView)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <YTNodeShortsLockupView :data="(data as YTNodes.ShortsLockupView)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'GridPlaylist'">
            <template v-if="attribute === 'slide'">
                <YTNodeGridPlaylist :data="(data as YTNodes.GridPlaylist)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <YTNodeGridPlaylist :data="(data as YTNodes.GridPlaylist)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'GridVideo'">
            <template v-if="attribute === 'slide'">
                <YTNodeGridVideo :data="(data as YTNodes.GridVideo)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <YTNodeGridVideo :data="(data as YTNodes.GridVideo)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'PlaylistVideo'">
            <template v-if="attribute === 'slide'">
                <YTNodePlaylistVideo :data="(data as YTNodes.PlaylistVideo)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodePlaylistVideo :data="(data as YTNodes.PlaylistVideo)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'CompactVideo'">
            <template v-if="attribute === 'slide'">
                <YTNodeCompactVideo :data="(data as YTNodes.CompactVideo)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeCompactVideo :data="(data as YTNodes.CompactVideo)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'LockupView'">
            <template v-if="attribute === 'slide'">
                <YTNodeLockupView :data="(data as YTNodes.LockupView)" />
            </template>
            <template v-else>
                <v-col v-if="page === 'Search'" cols="12">
                    <YTNodeLockupViewSearch :data="(data as YTNodes.LockupView)" />
                </v-col>
                <v-col v-else-if="page === 'Watch'" cols="12">
                    <YTNodeLockupViewWatch :data="(data as YTNodes.LockupView)" />
                </v-col>
                <v-col v-else cols="12" md="3" lg="2" sm="6">
                    <YTNodeLockupView :data="(data as YTNodes.LockupView)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'GridChannel'">
            <template v-if="attribute === 'slide'">
                <YTNodeGridChannel :data="(data as YTNodes.GridChannel)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <YTNodeGridChannel :data="(data as YTNodes.GridChannel)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'DefaultPromoPanel'">
            <template v-if="attribute === 'slide'">
                <YTNodeDefaultPromoPanel :data="(data as YTNodes.DefaultPromoPanel)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <YTNodeDefaultPromoPanel :data="(data as YTNodes.DefaultPromoPanel)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'ChannelOwnerEmptyState'">
            <template v-if="attribute === 'slide'">
                <YTNodeChannelOwnerEmptyState :data="(data as YTNodes.ChannelOwnerEmptyState)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeChannelOwnerEmptyState :data="(data as YTNodes.ChannelOwnerEmptyState)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'BackstagePost'">
            <template v-if="attribute === 'slide'">
                <YTNodeBackstagePost :data="(data as YTNodes.BackstagePost)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeBackstagePost :data="(data as YTNodes.BackstagePost)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'Post'">
            <template v-if="attribute === 'slide'">
                <YTNodePost :data="(data as YTNodes.Post)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodePost :data="(data as YTNodes.Post)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'SharedPost'">
            <template v-if="attribute === 'slide'">
                <YTNodeSharedPost :data="(data as YTNodes.SharedPost)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeSharedPost :data="(data as YTNodes.SharedPost)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'BackstageImage'">
            <template v-if="attribute === 'slide'">
                <YTNodeBackstageImage :data="(data as YTNodes.BackstageImage)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeBackstageImage :data="(data as YTNodes.BackstageImage)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'PostMultiImage'">
            <template v-if="attribute === 'slide'">
                <YTNodePostMultiImage :data="(data as YTNodes.PostMultiImage)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodePostMultiImage :data="(data as YTNodes.PostMultiImage)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'GameDetails'">
            <template v-if="attribute === 'slide'">
                <YTNodeGameDetails :data="(data as YTNodes.GameDetails)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeGameDetails :data="(data as YTNodes.GameDetails)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'VideoCard'">
            <template v-if="attribute === 'slide'">
                <YTNodeVideoCard :data="(data as YTNodes.VideoCard)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeVideoCard :data="(data as YTNodes.VideoCard)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'RichListHeader'">
            <template v-if="attribute === 'slide'">
                <YTNodeRichListHeader :data="(data as YTNodes.RichListHeader)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeRichListHeader :data="(data as YTNodes.RichListHeader)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'IncludingResultsFor'">
            <template v-if="attribute === 'slide'">
                <YTNodeIncludingResultsFor :data="(data as YTNodes.IncludingResultsFor)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeIncludingResultsFor :data="(data as YTNodes.IncludingResultsFor)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'ShowingResultsFor'">
            <template v-if="attribute === 'slide'">
                <YTNodeShowingResultsFor :data="(data as YTNodes.ShowingResultsFor)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeShowingResultsFor :data="(data as YTNodes.ShowingResultsFor)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'HashtagTile'">
            <template v-if="attribute === 'slide'">
                <YTNodeHashtagTile :data="(data as YTNodes.HashtagTile)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeHashtagTile :data="(data as YTNodes.HashtagTile)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'LiveChatTextMessage'">
            <template v-if="attribute === 'slide'">
                <YTNodeLiveChatTextMessage :data="(data as YTNodes.LiveChatTextMessage)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeLiveChatTextMessage :data="(data as YTNodes.LiveChatTextMessage)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'RichMetadata'">
            <template v-if="attribute === 'slide'">
                <YTNodeRichMetadata :data="(data as YTNodes.RichMetadata)" />
            </template>
            <template v-else>
                <v-col cols="6">
                    <YTNodeRichMetadata :data="(data as YTNodes.RichMetadata)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'SearchRefinementCard'">
            <template v-if="attribute === 'slide'">
                <YTNodeSearchRefinementCard :data="(data as YTNodes.SearchRefinementCard)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeSearchRefinementCard :data="(data as YTNodes.SearchRefinementCard)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'TopicChannelDetails'">
            <template v-if="attribute === 'slide'">
                <YTNodeTopicChannelDetails :data="(data as YTNodes.TopicChannelDetails)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeTopicChannelDetails :data="(data as YTNodes.TopicChannelDetails)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'RecognitionShelf'">
            <template v-if="attribute === 'slide'">
                <YTNodeRecognitionShelf :data="(data as YTNodes.RecognitionShelf)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTNodeRecognitionShelf :data="(data as YTNodes.RecognitionShelf)" />
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
                    <div v-for="content in (data as YTNodes.HorizontalList).contents" class="ma-2"
                        :style="{ width: content.type === 'Post' ? '500px' : '200px' }">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'HorizontalCardList'">
            <v-col cols="12">
                <YTNode :data="(data as YTNodes.HorizontalCardList).header" :attribute="attribute" />
                <v-slide-group>
                    <div v-for="card in (data as YTNodes.HorizontalCardList).cards" class="ma-2" style="width: 200px;">
                        <template v-if="(card instanceof Helpers.YTNode)">
                            <YTNode :data="card" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'VerticalList'">
            <v-col cols="12">
                <v-slide-group>
                    <div v-for="content in (data as YTNodes.VerticalList).contents" class="ma-2" style="width: 200px;">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'CarouselItem'">
            <v-col cols="12">
                <v-slide-group>
                    <div v-for="content in (data as YTNodes.CarouselItem).contents" class="ma-2" style="width: 200px;">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'ReelShelf'">
            <v-col cols="12">
                <strong>{{ (data as YTNodes.ReelShelf).title.text }}</strong>
                <v-slide-group>
                    <div v-for="item in (data as YTNodes.ReelShelf).items" class="ma-2"
                        :style="{ width: page === 'Watch' ? '150px' : '200px' }">
                        <template v-if="(item instanceof Helpers.YTNode)">
                            <YTNode :data="item" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'RichShelf'">
            <v-col cols="12">
                <strong>{{ (data as YTNodes.RichShelf).title.text }}</strong>
                <v-slide-group>
                    <div v-for="content in (data as YTNodes.RichShelf).contents" class="ma-2" style="width: 200px;">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
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

        <template v-else-if="data.type === 'RichGrid'">
            <v-row>
                <template v-for="content in (data as YTNodes.RichGrid).contents">
                    <template v-if="(content instanceof Helpers.YTNode)">
                        <YTNode :data="content" :attribute="attribute" :page="page" />
                    </template>
                </template>
            </v-row>
        </template>

        <template v-else-if="data.type === 'SectionList'">
            <v-row>
                <template v-for="content in (data as YTNodes.SectionList).contents">
                    <template v-if="(content instanceof Helpers.YTNode)">
                        <YTNode :data="content" :attribute="attribute" :page="page" />
                    </template>
                </template>
            </v-row>
        </template>

        <template v-else-if="data.type === 'ExpandedShelfContents'">
            <v-row>
                <template v-for="content in (data as YTNodes.ExpandedShelfContents).contents">
                    <template v-if="(content instanceof Helpers.YTNode)">
                        <YTNode :data="content" :attribute="attribute" :page="page" />
                    </template>
                </template>
            </v-row>
        </template>

        <template v-else-if="data.type === 'RichMetadataRow'">
            <v-row style="margin-top: 0; margin-bottom: 0;">
                <template v-for="content in (data as YTNodes.RichMetadataRow).contents">
                    <template v-if="(content instanceof Helpers.YTNode)">
                        <YTNode :data="content" :attribute="attribute" :page="page" />
                    </template>
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
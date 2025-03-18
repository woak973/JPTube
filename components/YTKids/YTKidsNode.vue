<template>
    <template v-if="data">
        <!-- Unity Components -->
        <template v-if="data.type === 'CompactVideo'">
            <template v-if="attribute === 'slide'">
                <YTKidsNodeCompactVideo :data="(data as YTNodes.CompactVideo)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTKidsNodeCompactVideo :data="(data as YTNodes.CompactVideo)" />
                </v-col>
            </template>
        </template>

        <template v-if="data.type === 'CompactChannel'">
            <template v-if="attribute === 'slide'">
                <YTKidsNodeCompactChannel :data="(data as YTNodes.CompactChannel)" />
            </template>
            <template v-else>
                <v-col cols="12">
                    <YTKidsNodeCompactChannel :data="(data as YTNodes.CompactChannel)" />
                </v-col>
            </template>
        </template>

        <!-- Recursion Components -->

        <!-- Loop Components -->

        <template v-else-if="data.type === 'ItemSection'">
            <v-col cols="12">
                <v-row>
                    <template v-for="content in (data as YTNodes.ItemSection).contents">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTKidsNode :data="content" :attribute="attribute" :page="page" />
                        </template>
                    </template>
                </v-row>
            </v-col>
        </template>

        <template v-else-if="data.type === 'itemSectionContinuation'">
            <v-col cols="12">
                <v-row>
                    <template v-for="item in (data as ItemSectionContinuation).contents">
                        <template v-if="(item instanceof Helpers.YTNode)">
                            <YTKidsNode :data="item" :attribute="attribute" :page="page" />
                        </template>
                    </template>
                </v-row>
            </v-col>
        </template>

        <template v-else-if="data.type === 'HorizontalList'">
            <v-col cols="12">
                <v-slide-group>
                    <div v-for="content in (data as YTNodes.HorizontalList).contents" class="ma-2"
                        :style="{ width: (content.type === 'Post' || (content instanceof YTNodes.RichItem && content.content.type === 'Post')) ? '500px' : '200px' }">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTKidsNode :data="content" :attribute="'slide'" :page="page" />
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
                            <YTKidsNode :data="card" :attribute="'slide'" :page="page" />
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
                            <YTKidsNode :data="content" :attribute="'slide'" :page="page" />
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
                            <YTKidsNode :data="content" :attribute="'slide'" :page="page" />
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
                            <YTKidsNode :data="item" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'RichShelf'">
            <v-col cols="12">
                <strong>{{ (data as YTNodes.RichShelf).title.text }}</strong>
                <v-slide-group>
                    <div v-for="content in (data as YTNodes.RichShelf).contents" class="ma-2"
                        :style="{ width: (content.type === 'Post' || (content instanceof YTNodes.RichItem && content.content.type === 'Post')) ? '500px' : '200px' }">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTKidsNode :data="content" :attribute="'slide'" :page="page" />
                        </template>
                    </div>
                </v-slide-group>
            </v-col>
        </template>

        <template v-else-if="data.type === 'ChannelFeaturedContent'">
            <v-col cols="12">
                <strong>{{ (data as YTNodes.ChannelFeaturedContent).title.text }}</strong>
                <v-row>
                    <template v-for="item in (data as YTNodes.ChannelFeaturedContent).items" class="ma-2"
                        style="width: 200px;">
                        <template v-if="(item instanceof Helpers.YTNode)">
                            <YTKidsNode :data="item" :attribute="attribute" :page="page" />
                        </template>
                    </template>
                </v-row>
            </v-col>
        </template>

        <template v-else-if="data.type === 'Grid'">
            <v-col cols="12">
                <v-row>
                    <template v-for="item in (data as YTNodes.Grid).items">
                        <template v-if="(item instanceof Helpers.YTNode)">
                            <YTKidsNode :data="item" :attribute="attribute" :page="page" />
                        </template>
                    </template>
                </v-row>
            </v-col>
        </template>

        <template v-else-if="data.type === 'RichGrid'">
            <v-col cols="12">
                <v-row>
                    <template v-for="content in (data as YTNodes.RichGrid).contents">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTKidsNode :data="content" :attribute="attribute" :page="page" />
                        </template>
                    </template>
                </v-row>
            </v-col>
        </template>

        <template v-else-if="data.type === 'SectionList'">
            <v-col cols="12">
                <v-row>
                    <template v-for="content in (data as YTNodes.SectionList).contents">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTKidsNode :data="content" :attribute="attribute" :page="page" />
                        </template>
                    </template>
                </v-row>
            </v-col>
        </template>

        <template v-else-if="data.type === 'ExpandedShelfContents'">
            <v-col cols="12">
                <v-row>
                    <template v-for="content in (data as YTNodes.ExpandedShelfContents).contents">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTKidsNode :data="content" :attribute="attribute" :page="page" />
                        </template>
                    </template>
                </v-row>
            </v-col>
        </template>

        <template v-else-if="data.type === 'RichMetadataRow'">
            <v-col cols="12">
                <v-row>
                    <template v-for="content in (data as YTNodes.RichMetadataRow).contents">
                        <template v-if="(content instanceof Helpers.YTNode)">
                            <YTKidsNode :data="content" :attribute="attribute" :page="page" />
                        </template>
                    </template>
                </v-row>
            </v-col>
        </template>

    </template>
</template>

<script setup lang="ts">
import { Helpers, ItemSectionContinuation, YTNodes } from 'youtubei.js';

const props = defineProps({
    data: Helpers.YTNode,
    attribute: String,
    page: String

});
</script>
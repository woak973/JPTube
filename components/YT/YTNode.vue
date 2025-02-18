<template>
    <template v-if="data">
        <!-- Unity Components -->
        <template v-if="data.type === 'Video'">
            <template v-if="attribute === 'slide'">
                <HomeFeed :data="(data as YTNodes.Video)" />
            </template>
            <template v-else>
                <v-col cols="12" md="3" lg="2" sm="6">
                    <HomeFeed :data="(data as YTNodes.Video)" />
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

        <template v-else-if="data.type === 'LockupView'">
            <template v-if="attribute === 'slide'">
                <LockupView :data="(data as YTNodes.LockupView)" />
            </template>
            <template v-if="attribute === 'slide'">
                <v-col cols="12" md="3" lg="2" sm="6">
                    <LockupView :data="(data as YTNodes.LockupView)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'GridChannel'">
            <template v-if="attribute === 'slide'">
                <GridChannel :data="(data as YTNodes.GridChannel)" />
            </template>
            <template v-if="attribute === 'slide'">
                <v-col cols="12" md="3" lg="2" sm="6">
                    <GridChannel :data="(data as YTNodes.GridChannel)" />
                </v-col>
            </template>
        </template>

        <template v-else-if="data.type === 'BackstagePostThread'">
            <template v-if="attribute === 'slide'">
                <BackstagePostThread :data="(data as YTNodes.BackstagePostThread)" />
            </template>
            <template v-if="attribute === 'slide'">
                <v-col cols="12">
                    <BackstagePostThread :data="(data as YTNodes.BackstagePostThread)" />
                </v-col>
            </template>
        </template>

        <template v-if="data.type === 'ChannelOwnerEmptyState'">
            <template v-if="attribute === 'slide'">
                <ChannelOwnerEmptyState :data="(data as YTNodes.ChannelOwnerEmptyState)" />
            </template>
            <template v-if="attribute === 'slide'">
                <v-col>
                    <ChannelOwnerEmptyState :data="(data as YTNodes.ChannelOwnerEmptyState)" />
                </v-col>
            </template>
        </template>

        <!-- Recursion Components -->

        <template v-else-if="data.type === 'RichItem'">
            <template v-if="((data as YTNodes.RichItem).content instanceof Helpers.YTNode)">
                <YTNode :data="(data as YTNodes.RichItem).content" />
            </template>
        </template>


        <template v-else-if="data.type === 'RichSection'">
            <v-col cols="12">
                <template v-if="((data as YTNodes.RichSection).content instanceof Helpers.YTNode)">
                    <YTNode :data="(data as YTNodes.RichSection).content" />
                </template>
            </v-col>
        </template>

        <template v-else-if="data.type === 'Shelf'">
            <strong>{{ (data as YTNodes.Shelf).title.text }}</strong>
            <template v-if="((data as YTNodes.Shelf).content instanceof Helpers.YTNode)">
                <template
                    v-if="(data as YTNodes.Shelf).content !== null && (data as YTNodes.Shelf).content !== undefined">
                    <YTNode :data="(data as YTNodes.Shelf).content!" />
                </template>
            </template>
        </template>

        <!-- Loop Components -->

        <template v-else-if="data.type === 'ItemSection'">
            <v-col cols="12">
                <template v-for="result in (data as YTNodes.ItemSection).contents">
                    <template v-if="(result instanceof Helpers.YTNode)">
                        <YTNode :data="result" />
                    </template>
                </template>
            </v-col>
        </template>

        <template v-else-if="data.type === 'HorizontalList'">
            <v-slide-group>
                <v-slide-item v-for="result in (data as YTNodes.HorizontalList).contents" class="ma-2"
                    style="width: 200px;">
                    <template v-if="(result instanceof Helpers.YTNode)">
                        <YTNode :data="result" :attribute="'slide'" />
                    </template>
                </v-slide-item>
            </v-slide-group>
        </template>

        <template v-else-if="data.type === 'ReelShelf'">
            <strong>{{ (data as YTNodes.ReelShelf).title.text }}</strong>
            <v-slide-group>
                <v-slide-item v-for="result in (data as YTNodes.ReelShelf).items" class="ma-2" style="width: 200px;">
                    <template v-if="(result instanceof Helpers.YTNode)">
                        <YTNode :data="result" :attribute="'slide'" />
                    </template>
                </v-slide-item>
            </v-slide-group>
        </template>

        <template v-else-if="data.type === 'RichShelf'">
            <strong>{{ (data as YTNodes.RichShelf).title.text }}</strong>
            <v-slide-group>
                <v-slide-item v-for="result in (data as YTNodes.RichShelf).contents" class="ma-2" style="width: 200px;">
                    <template v-if="(result instanceof Helpers.YTNode)">
                        <YTNode :data="result" :attribute="'slide'" />
                    </template>
                </v-slide-item>
            </v-slide-group>
        </template>

        <template v-else-if="data.type === 'Grid'">
            <v-row>
                <template v-for="result in (data as YTNodes.Grid).items">
                    <template v-if="(result instanceof Helpers.YTNode)">
                        <YTNode :data="result" />
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
    attribute: String
});
</script>
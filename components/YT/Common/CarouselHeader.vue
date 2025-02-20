<template>
    <v-card v-if="data" elevation="16">
        <template v-for="content in data.contents">
            <v-row>
                <template v-if="(content instanceof Helpers.YTNode)">
                    <YTNode :data="content" />
                </template>
            </v-row>
        </template>
    </v-card>
    <div v-else>
        データがありません
    </div>

</template>

<script setup lang="ts">

import { YTNodes, Helpers } from 'youtubei.js';


const props = defineProps({
    data: YTNodes.CarouselHeader
});

</script>
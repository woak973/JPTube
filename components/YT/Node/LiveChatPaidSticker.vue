<template>
    <template v-if="data">
        <v-card v-if="data" elevation="16">
            <v-list-item>
                <v-row dense>
                    <v-col cols="auto">
                        <v-list-item :to="data.author.endpoint?.metadata?.url" style="padding: 0;">
                            <v-avatar :image="getProxifiedUrl(data.author.thumbnails[0]?.url)" class="mr-2"></v-avatar>
                        </v-list-item>
                    </v-col>
                    <v-col>
                        <v-card-title style="white-space: pre-wrap; word-break: break-all;">
                            {{ data.author.name }}
                            <template v-if="data.author.badges">
                                <template v-for="badge in data.author.badges">
                                    <YTNode :data="badge" :attribute="'slide'" />
                                </template>
                            </template>
                            - {{ data.purchase_amount }}
                        </v-card-title>
                        <v-row>
                            <v-col cols="4">
                                <v-img :src="getProxifiedUrl(data.sticker[0]?.url)"
                                    :alt="data.sticker_accessibility_label">
                                    <template v-slot:placeholder>
                                        <div class="d-flex align-center justify-center fill-height">
                                            <v-progress-circular color="grey-lighten-4"
                                                indeterminate></v-progress-circular>
                                        </div>
                                    </template>
                                </v-img>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-list-item>
        </v-card>
    </template>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">

import { YTNodes, Misc } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.LiveChatPaidSticker
});
</script>
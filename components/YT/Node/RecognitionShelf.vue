<template>
    <v-card v-if="data" elevation="16">
        <v-row>
            <v-col cols="12" sm="6">
                <v-card-title>{{ data.title?.text }}</v-card-title>
                <v-card-subtitle>{{ data.subtitle?.text }}</v-card-subtitle>
            </v-col>
            <v-col cols="12" sm="6">
                <v-slide-group>
                    <div v-for="avatar in data.avatars">
                        <v-img :src="getProxifiedUrl(avatar.url)" aspect-ratio="16/9" rounded>
                            <template v-slot:placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                </div>
                            </template>
                        </v-img>
                    </div>
                </v-slide-group>
            </v-col>
        </v-row>
    </v-card>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">
import { YTNodes } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.RecognitionShelf
});
</script>

<style scoped>
.duration-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
}
</style>
<template>
    <v-card v-if="data" elevation="16" :to="`/watch?v=${data.on_tap_endpoint.payload.videoId}`" link>
        <v-img :src="getProxifiedUrl(data.thumbnail[0].url)" aspect-ratio="16/9" rounded>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
        </v-img>
        <v-card-text class="omit">{{ data.accessibility_text }}</v-card-text>
        <v-card-subtitle>{{ data.overlay_metadata.secondary_text.text }}</v-card-subtitle>
    </v-card>
    <div v-else>
        データがありません
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    data: Object
});
</script>

<style scoped>

.omit {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    padding-bottom: 0;
    word-break: break-word;
}
</style>
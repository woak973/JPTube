<template>
    <v-card v-if="data" elevation="16" :to="`/watch?list=${data.id}`" link>
        <v-img :src="getProxifiedUrl(data.thumbnails[0].url)" aspect-ratio="16/9" rounded>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
            <div class="duration-overlay">{{ data.video_count.text }}</div>
        </v-img>
        <v-card-text class="omit">{{ data.title.text }}</v-card-text>
        <v-list-item style="min-height: 0px;" :to="data.view_playlist.endpoint.metadata.url">
            <v-list-item-subtitle>{{ data.view_playlist.text }}</v-list-item-subtitle>
        </v-list-item>
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
<template>
    <v-card v-if="data" elevation="16" :href="`/watch?list=${data.content_id}`" link>
        <v-img :src="data.content_image.primary_thumbnail.image[0].url" aspect-ratio="16/9" rounded>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
            <div class="duration-overlay">{{ data.content_image.primary_thumbnail.overlays[0].badges[0].text }}</div>
        </v-img>
        <v-card-text class="omit">{{ data.metadata.title.text }}</v-card-text>
        <v-card-subtitle>{{ data.metadata.metadata.metadata_rows[0].metadata_parts[0].text }}</v-card-subtitle>
    </v-card>
    <div v-else>
        データがありません
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

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
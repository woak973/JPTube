<template>
    <v-card v-if="data" elevation="16" :to="`/watch?list=${data.content_id}`" link>
        <v-img :src="getProxifiedUrl(data.content_image.primary_thumbnail.image[0].url)" aspect-ratio="16/9" rounded>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
            <div class="duration-overlay">{{ data.content_image.primary_thumbnail.overlays[0].badges[0].text }}</div>
        </v-img>
        <v-card-text class="omit">{{ data.metadata.title.text }}</v-card-text>
        <template v-for="row in data.metadata.metadata.metadata_rows">
            <v-list-item style="min-height: 0px;" v-for="part in row.metadata_parts"
                :to="part.text?.endpoint?.metadata?.url">
                <v-list-item-subtitle>{{ part.text }}</v-list-item-subtitle>
            </v-list-item>
        </template>
    </v-card>
    <div v-else>
        データがありません
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    data: Object
});
console.dir(props.data, { depth: null });
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
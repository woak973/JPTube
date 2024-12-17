<template>
    <v-card v-if="data" elevation="16" :href="`/watch?v=${data.id}`" link>
        <v-img :src="getProxifiedUrl(data.thumbnails[0].url)" aspect-ratio="16/9" rounded>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
            <div class="duration-overlay">{{ data.duration.text }}</div>
        </v-img>
        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <v-list-item :to="`/channel/${data.author.id}/featured`" style="padding: 0;">
                        <v-avatar :image="getProxifiedUrl(data.author.thumbnails[0].url)" class="mr-2" size="24"></v-avatar>
                    </v-list-item>
                </v-col>
                <v-col>
                    <div class="omit">{{ data.title }}</div>
                    <v-card-subtitle class="subomit">{{ data.author.name }}</v-card-subtitle>
                    <v-card-subtitle class="subomit">{{ data.short_view_count.text }}・{{ data.published.text }}</v-card-subtitle>
                </v-col>
            </v-row>
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

.subomit {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    padding: 0%;
    word-break: break-word;
}
</style>
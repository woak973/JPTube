<template>
    <v-card v-if="data" elevation="16">

        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <v-list-item :to="`/channel/${data.comment.author.id}/featured`" style="padding: 0;">
                        <v-avatar :image="getProxifiedUrl(data.comment.author.thumbnails[0].url)" class="mr-2"></v-avatar>
                    </v-list-item>
                </v-col>
                <v-col>
                    <v-card-subtitle>{{ data.comment.author.name }}・{{ data.comment.published_time }}</v-card-subtitle>
                    <v-card-text>
                        <template v-for="result in data?.comment?.content?.runs">
                            <template v-if="result.endpoint">
                                <span style="white-space: pre-wrap;"><NuxtLink :to="result.endpoint.metadata.url">{{ result.text }}</NuxtLink></span>
                            </template>
                            <template v-else>
                                <span style="white-space: pre-wrap;">{{ result.text }}</span>
                            </template>
                        </template>
                    </v-card-text>
                    <v-card-actions style="padding: 0">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon class="me-1" icon="mdi-thumb-up"></v-icon>
                                <v-list-item-subtitle>{{ data.comment.like_count }}</v-list-item-subtitle>
                            </template>
                        </v-list-item>
                    </v-card-actions>
                    <div v-if="data.has_replies && data.replies">
                        <details>
                            <summary class="hover-blue">{{ data.comment_replies_data.view_replies.text }}</summary>
                            <v-row>
                                <v-col cols="12">
                                    <template v-for="reply in data.replies">
                                        <Replies :data="reply" />
                                    </template>
                                </v-col>
                            </v-row>
                        </details>
                    </div>
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
.hover-blue:hover {
    color: #065fd4;
}
</style>
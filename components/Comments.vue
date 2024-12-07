<template>
    <v-card v-if="data" elevation="16">

        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <a :href="`/channel/${data.comment.author.id}/featured`">
                        <v-avatar :image="data.comment.author.thumbnails[0].url" class="mr-2"></v-avatar>
                    </a>
                </v-col>
                <v-col>
                    <v-card-subtitle>{{ data.comment.author.name }}・{{ data.comment.published_time }}</v-card-subtitle>
                    <v-card-text>{{ data.comment.content.text }}</v-card-text>
                    <v-card-actions>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon class="me-1" icon="mdi-thumb-up"></v-icon>
                                <v-list-item-subtitle>{{ data.comment.like_count }}</v-list-item-subtitle>
                            </template>
                        </v-list-item>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-list-item>
        <div v-if="data.has_replies && data.replies">
            <details>
                <summary>{{ data.comment_replies_data.view_replies.text }}</summary>
                <v-row>
                    <v-col cols="12">
                        <template v-for="reply in data.replies">
                            <Replies :data="reply" />
                        </template>
                    </v-col>
                </v-row>
            </details>
        </div>
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
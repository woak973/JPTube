<template>
    <v-card v-if="data" elevation="16">

        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <v-list-item :to="`/channel/${data.author.id}/featured`" style="padding: 0;">
                        <v-avatar :image="data.author.thumbnails[0].url" class="mr-2"></v-avatar>
                    </v-list-item>
                </v-col>
                <v-col>
                    <v-card-subtitle>{{ data.author.name }}・{{ data.published.text }}</v-card-subtitle>
                    <span style="white-space: pre-wrap;"><v-card-text>{{ data.content.text }}</v-card-text></span>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon class="me-1" icon="mdi-thumb-up"></v-icon>
                            <v-list-item-subtitle>{{ data.vote_count.text }}</v-list-item-subtitle>
                        </template>
                    </v-list-item>
                </v-col>
            </v-row>
        </v-list-item>
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
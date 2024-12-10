<template>
    <v-card v-if="data" elevation="0">

        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <v-list-item :to="`/channel/${data.author.id}/featured`" style="padding: 0;">
                        <v-avatar :image="data.author.thumbnails[0].url" class="mr-2"></v-avatar>
                    </v-list-item>
                </v-col>
                <v-col>
                    <v-card-subtitle>{{ data.author.name }}・{{ data.published_time }}</v-card-subtitle>
                    <v-card-text>
                        <template v-for="result in data?.content?.runs">
                            <template v-if="result.endpoint">
                                <NuxtLink :to="result.endpoint.metadata.url">{{ result.text }}</NuxtLink>
                            </template>
                            <template v-else-if="result.emoji">
                                {{ result.text }}
                            </template>
                            <template v-else>
                                {{ result.text }}<br>
                            </template>
                        </template>
                    </v-card-text>
                    <v-card-actions style="padding: 0">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon class="me-1" icon="mdi-thumb-up"></v-icon>
                                <v-list-item-subtitle>{{ data.like_count }}</v-list-item-subtitle>
                            </template>
                        </v-list-item>
                    </v-card-actions>
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
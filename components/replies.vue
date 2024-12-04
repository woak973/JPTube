<template>
    <v-card v-if="data" elevation="0">

        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <a :href="`/channel/${data.author.id}/featured`">
                        <v-avatar :image="data.author.thumbnails[0].url" class="mr-2"></v-avatar>
                    </a>
                </v-col>
                <v-col>
                    <v-card-subtitle>{{ data.author.name }}・{{ data.published_time }}</v-card-subtitle>
                    <v-card-text>{{ data.content.text }}</v-card-text>
                    <v-card-actions>
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
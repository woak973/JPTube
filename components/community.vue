<template>
    <v-card v-if="data" elevation="16">

        <v-list-item>
            <v-row dense>
                <v-col cols="auto">
                    <a :href="`/channel/${data.author.id}/featured`">
                        <v-avatar :image="data.author.thumbnails[0].url" class="mr-2"></v-avatar>
                    </a>
                </v-col>
                <v-col>
                    <v-card-subtitle>{{ data.author.name }}・{{ data.published.text }}</v-card-subtitle>
                    <v-card-text>{{ data.content.text }}</v-card-text>
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
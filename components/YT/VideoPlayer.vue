<template>
    <v-card v-if="data" elevation="16">
        <v-row>
            <v-col cols="12" sm="4" class="d-flex align-center justify-center">
                <Player :videoId="data.id" :key="data.id" />
            </v-col>
            <v-col cols="12" sm="8">
                <v-card-title>{{ data.title.text }}</v-card-title>
                <v-card-subtitle>{{ data.view_count.text }}・{{ data.published_time.text }}</v-card-subtitle>
            </v-col>
        </v-row>
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
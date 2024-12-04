<template>
    <v-card v-if="data">
        <v-img :src="data.illustration[0].url" width="160" height="160" class="mx-auto"/>
        <v-card-text class="text-center">{{ data.description.text }}</v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    data: Object
});
</script>
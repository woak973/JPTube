<template>
    <v-card v-if="data" elevation="16">
        <template v-for="content in data.header.contents">
            <template v-if="content.type === 'TopicChannelDetails'">
                <v-row>
                    <v-col cols="4" class="d-flex align-center justify-center">
                        <v-img v-if="content.avatar && content.avatar[0]?.url"
                            :src="getProxifiedUrl(content.avatar[0]?.url)" max-width="50%" style="border-radius: 50%;">
                            <template v-slot:placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                </div>
                            </template>
                        </v-img>
                    </v-col>
                    <v-col cols="8">
                        <v-card-title>{{ content.title.text }}</v-card-title>
                        <v-card-subtitle>{{ content.subtitle.text }}</v-card-subtitle>
                    </v-col>
                </v-row>
            </template>
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

</script>
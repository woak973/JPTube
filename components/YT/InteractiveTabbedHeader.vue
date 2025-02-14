<template>
    <v-card v-if="data" elevation="16" :image="data?.header?.banner[0]?.url">
        <v-row>
            <v-col cols="4" class="d-flex align-center justify-center">
                <v-img v-if="data.header.box_art && data.header.box_art[0]?.url" :src="getProxifiedUrl(data.header.box_art[0]?.url)"
                    max-width="50%">
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                    </template>
                </v-img>
            </v-col>
            <v-col cols="8">
                <v-card-title class="semi-transparent-background">{{ data?.header?.title?.text }}</v-card-title>
                <v-card-text class="omit semi-transparent-background">{{ data?.header?.description?.text }}</v-card-text>
                <v-card-subtitle class="bg-white">{{ data?.header?.metadata?.text }}</v-card-subtitle>
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

<style scoped>
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

.semi-transparent-background {
  background-color: rgba(255, 255, 255, 0.6); /* 白色の半透明背景 */
}

</style>
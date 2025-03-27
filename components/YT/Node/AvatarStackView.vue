<template>
    <v-row v-if="data">
        <v-col cols="auto">
            <v-list-item :to="data.renderer_context.command_context?.on_tap?.metadata.url">
                <template v-slot:prepend>
                    <v-avatar color="grey-darken-3" size="36"
                        :image="getProxifiedUrl(data.avatars[0]?.image[0]?.url || '')"></v-avatar>

                </template>

                <v-list-item-title>
                    {{ data.text?.text }}
                </v-list-item-title>

            </v-list-item>
        </v-col>
    </v-row>
    <div v-else>
        No data was provided
    </div>
</template>

<script setup lang="ts">

import { YTNodes, Misc } from 'youtubei.js';

const props = defineProps({
    data: YTNodes.AvatarStackView
});
</script>
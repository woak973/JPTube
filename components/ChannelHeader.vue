<template>
  <v-img v-if="data" :src="getProxifiedUrl(data?.header?.content?.banner?.image[0]?.url)" cover></v-img>
  <v-card v-if="data" elevation="16" @click="dialog = true">
    <v-row>
      <v-col cols="4" class="d-flex align-center justify-center">
        <v-img v-if="data?.metadata?.avatar && data.metadata.avatar[0]?.url" :src="getProxifiedUrl(data?.metadata?.avatar[0]?.url)"
          max-width="50%" style="border-radius: 50%;">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>
      <v-col cols="8">
        <v-card-title>{{ data?.header?.page_title }}</v-card-title>
        <v-card-subtitle>
          <template v-for="(row, index) in data?.header?.content?.metadata?.metadata_rows" :key="index">
            <span v-for="(part, partIndex) in row?.metadata_parts" :key="partIndex">
              {{ part?.text?.text }}<span v-if="partIndex < row?.metadata_parts?.length - 1">・</span>
            </span>
            <span v-if="index < data?.header?.content?.metadata?.metadata_rows?.length - 1">・</span>
          </template>
        </v-card-subtitle>
        <v-card-text>{{ data?.header?.content?.description?.description?.text }}</v-card-text>
        <v-card-text>{{ data?.header?.content?.description?.truncation_text?.text }}</v-card-text>
      </v-col>
    </v-row>
  </v-card>
  <div v-else>
    データがありません
  </div>

  <v-dialog v-model="dialog" max-width="600px" v-if="about">
    <v-card>
      <v-card-title>{{ about?.metadata?.description_label?.text }}</v-card-title>
      <v-card-text><span style="white-space: pre-wrap; word-break: break-all;">{{ about?.metadata?.description }}</span></v-card-text>
      <v-card-title>{{ about?.metadata?.custom_links_label?.text }}</v-card-title>
      <template v-for="link in about?.metadata?.links">
        <v-row>
          <v-col cols="12">
            <v-card v-if="link?.type === 'ChannelExternalLinkView'" elevation="0">
              <v-list-item>
                <template v-slot:prepend>
                  <img v-if="link?.favicon?.[0]?.url" :src="getProxifiedUrl(link.favicon[0].url)" alt="avatar" width="24">
                </template>

                <v-card-title>{{ link?.title?.text }}</v-card-title>

                <v-card-text>{{ link?.link?.text }}</v-card-text>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <v-card-title>{{ about?.metadata?.additional_info_label?.text }}</v-card-title>
      <v-card-text><v-icon>mdi-web</v-icon><span style="word-break: break-all;">{{ about?.metadata?.canonical_channel_url }}</span></v-card-text>
      <v-card-text><v-icon>mdi-account-outline</v-icon>{{ about?.metadata?.subscriber_count }}</v-card-text>
      <v-card-text><v-icon>mdi-play-box</v-icon>{{ about?.metadata?.video_count }}</v-card-text>
      <v-card-text><v-icon>mdi-trending-up</v-icon>{{ about?.metadata?.view_count }}</v-card-text>
      <v-card-text><v-icon>mdi-information-outline</v-icon>{{ about?.metadata?.joined_date?.text }}</v-card-text>
      <v-card-text><v-icon>mdi-earth</v-icon>{{ about?.metadata?.country }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">

const props = defineProps({
  data: Object,
  about: Object
});

const dialog = ref();
</script>
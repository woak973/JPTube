<template>
  <v-list-item v-if="data">
    <v-row dense>
      <v-col cols="auto">
        <v-list-item :to="data.author?.endpoint?.metadata?.url" style="padding: 0;" @click="handleClick">
          <v-avatar :image="getProxifiedUrl(data.author?.thumbnails[0].url || '')" class="mr-2" />
        </v-list-item>
      </v-col>
      <v-col>
        <v-card-subtitle style="white-space: pre-wrap; word-break: break-all;">{{ data.author?.name
        }}<template v-if="data.author?.badges">
          <template v-for="badge in data.author.badges">
            <YTNode :data="badge" :attribute="'slide'" />
          </template>
        </template><template v-if="data.member_badge">
          <v-avatar :image="getProxifiedUrl(data.member_badge.url)" class="ml-1" rounded="0" size="14" />
        </template>・{{ data.published_time }}</v-card-subtitle>
        <v-card-text>
          <template v-if="(data.content instanceof Misc.Text)">
            <YTMiscText :data="data.content" />
          </template>
        </v-card-text>
        <v-card-actions style="padding: 0">
          <v-list-item>
            <template #prepend>
              <v-icon class="me-1" icon="mdi-thumb-up" />
              <v-list-item-subtitle>{{ data.like_count }}</v-list-item-subtitle>
            </template>
          </v-list-item>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-list-item>
  <div v-else>
    No data was provided
  </div>
  <div>
    <v-dialog v-model="detail" max-width="500">
      <v-card elevation="16">
        <template v-if="popupdata">
          <v-card-title>{{ popupdata.profile_identity_info?.channel_display_name }}</v-card-title>
          <v-card-subtitle>{{ popupdata.profile_identity_info?.channel_handle }}</v-card-subtitle>
          <v-card-subtitle>{{ popupdata.profile_identity_info?.left_of_bullet_info }}・{{ popupdata.profile_identity_info?.right_of_bullet_info }}</v-card-subtitle>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :to="popupdata?.profile_identity_info?.channel_access?.on_tap?.metadata.url">{{ popupdata.profile_identity_info?.channel_access?.title }}</v-btn>
          </v-card-actions>
          <v-card-title>{{ popupdata.profile_info?.profile_badge_info_channel_wide.profile_section_title }}</v-card-title>
          <v-card-subtitle>{{ popupdata.profile_info?.profile_badge_info_channel_wide.comment_badge.comment_desc }}</v-card-subtitle>
          <template v-if="Array.isArray(popupdata.profile_info?.profile_badge_info_channel_wide.badges)">
            <v-card v-for="badge in popupdata.profile_info?.profile_badge_info_channel_wide.badges" flat>
              <v-card-text>{{ badge.badge_desc }}</v-card-text>
              <v-card-subtitle>{{ badge.badge_subtitle }}</v-card-subtitle>
            </v-card>
          </template>
          <v-card-title>{{ popupdata.profile_info?.comments_interaction_title }}</v-card-title>
          <template v-if="Array.isArray(popupdata.profile_info?.comments)">
            <v-card v-for="comment in popupdata.profile_info?.comments" flat>
              <v-card-text>{{ comment.header_prefix }}{{ comment.video_title }}</v-card-text>
              <v-card-subtitle>{{ comment.comment_content }}</v-card-subtitle>
            </v-card>
          </template>
        </template>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="detail = false">{{ $t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">

import { YTNodes, Misc, Innertube } from 'youtubei.js';

const props = defineProps({
  data: YTNodes.CommentView,
  yt: Innertube,
});

const detail = ref<boolean>(false);
const popupdata = ref<YTNodes.ProfileCardView>();

const openPopup = async () => {
  const NE = new YTNodes.NavigationEndpoint({});
  NE.payload = props.data?.author?.endpoint?.payload;
  NE.name = props.data?.author?.endpoint?.name;
  NE.metadata.api_url = '/account/get_profile_card';
  const caller = props.yt ? props.yt : await useInnertube('common');
  const parsed = await NE.call(caller.actions, { parse: true });
  detail.value = true;
  popupdata.value = parsed.profile_card;
};

const handleClick = async () => {
  if (!props?.data?.author?.endpoint?.metadata?.url && props?.data?.author?.endpoint?.name === 'profileCardCommand') {
    await openPopup();
  }
};

</script>

<style scoped>
.hover-blue:hover {
    color: #065fd4;
}
</style>

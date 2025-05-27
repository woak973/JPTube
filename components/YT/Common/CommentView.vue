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
        <v-card-title>{{ popupdata?.profileIdentityInfo?.profileIdentityInfoViewModel?.channelDisplayName }}</v-card-title>
        <v-card-subtitle>{{ popupdata?.profileIdentityInfo?.profileIdentityInfoViewModel?.channelHandle }}</v-card-subtitle>
        <v-card-subtitle>{{ popupdata?.profileIdentityInfo?.profileIdentityInfoViewModel?.leftOfBulletInfo }}・{{ popupdata?.profileIdentityInfo?.profileIdentityInfoViewModel?.rightOfBulletInfo }}</v-card-subtitle>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :to="popupdata?.profileIdentityInfo?.profileIdentityInfoViewModel?.channelAccess?.buttonViewModel?.onTap?.innertubeCommand?.commandMetadata?.webCommandMetadata?.url">{{ popupdata?.profileIdentityInfo?.profileIdentityInfoViewModel?.channelAccess?.buttonViewModel?.title }}</v-btn>
        </v-card-actions>
        <v-card-title>{{ popupdata?.profileInfo?.profileInfoViewModel?.profileBadgeInfoChannelWide?.profileSectionTitle }}</v-card-title>
        <v-card-subtitle>{{ popupdata?.profileInfo?.profileInfoViewModel?.profileBadgeInfoChannelWide?.commentBadge?.commentDesc }}</v-card-subtitle>
        <template v-if="Array.isArray(popupdata?.profileInfo?.profileInfoViewModel?.profileBadgeInfoChannelWide?.badges)">
          <v-card v-for="badge in popupdata?.profileInfo?.profileInfoViewModel?.profileBadgeInfoChannelWide?.badges" flat>
            <v-card-text>{{ badge?.badgeDesc }}</v-card-text>
            <v-card-subtitle>{{ badge?.badgeSubtitle }}</v-card-subtitle>
          </v-card>
        </template>
        <v-card-title>{{ popupdata?.profileInfo?.profileInfoViewModel?.commentsInteractionTitle }}</v-card-title>
        <template v-if="Array.isArray(popupdata?.profileInfo?.profileInfoViewModel?.comments)">
          <v-card v-for="comment in popupdata?.profileInfo?.profileInfoViewModel?.comments" flat>
            <v-card-text>{{ comment?.commentInteractionViewModel?.headerPrefix }}{{ comment?.commentInteractionViewModel?.videoTitle }}</v-card-text>
            <v-card-subtitle>{{ comment?.commentInteractionViewModel?.commentContent }}</v-card-subtitle>
          </v-card>
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const popupdata = ref<any>();

const openPopup = async () => {
  const NE = new YTNodes.NavigationEndpoint({});
  NE.payload = props.data?.author?.endpoint?.payload;
  NE.name = props.data?.author?.endpoint?.name;
  NE.metadata.api_url = '/account/get_profile_card';
  const caller = props.yt ? props.yt : await useInnertube('common');
  const raw = await NE.call(caller.actions);
  detail.value = true;
  popupdata.value = raw.data?.profileCard?.profileCardViewModel;
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

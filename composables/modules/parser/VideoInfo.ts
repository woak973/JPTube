/* eslint-disable @typescript-eslint/no-explicit-any */
import CastedVideoInfo from './CastedVideoInfo';
export type VideoThumbnail = {
  quality: string;
  url: string;
  width: number;
  height: number;
};

export type Storyboard = {
  url: string;
  templateUrl: string;
  width: number;
  height: number;
  count: number;
  interval: number;
  storyboardWidth: number;
  storyboardHeight: number;
  storyboardCount: number;
};

export type AuthorThumbnail = {
  url: string;
  width: number;
  height: number;
};

export type AdaptiveFormat = {
  index: string;
  bitrate: string;
  init: string;
  url: string;
  itag: string;
  type: string;
  clen: string;
  lmt: string;
  projectionType: string;
  container: string;
  encoding: string;
  qualityLabel?: string;
  resolution?: string;
  fps: number;
  size?: string;
  targetDurationsec?: number;
  maxDvrDurationSec?: number;
  audioQuality?: string;
  audioSampleRate?: string;
  audioChannels?: string;
  colorInfo?: string;
  captionTrack?: string;
};

export type FormatStream = {
  url: string;
  itag: string;
  type: string;
  quality: string;
  bitrate?: string;
  container: string;
  encoding: string;
  qualityLabel: string;
  resolution: string;
  size: string;
};

export type Caption = {
  label: string;
  language_code: string;
  url: string;
};

export type MusicTrack = {
  song: string;
  artist: string;
  album: string;
  license: string;
};

export type RecommendedVideo = {
  videoId: string;
  title: string;
  videoThumbnails: VideoThumbnail[];
  author: string;
  authorUrl: string;
  authorId?: string;
  authorVerified: boolean;
  authorThumbnails: AuthorThumbnail[];
  lengthSeconds: number;
  viewCount?: any;
  viewCountText: string;
  publishedText: string;
  published: string;
};

export type VideoInfoProps = {
  type?: string;
  title?: string;
  videoId?: string;
  videoThumbnails?: VideoThumbnail[];
  storyboards?: Storyboard[];
  description?: string;
  descriptionHtml?: string;
  published?: number;
  publishedText?: string;
  keywords?: string[];
  viewCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  paid?: boolean;
  premium?: boolean;
  isFamilyFriendly?: boolean;
  allowedRegions?: string[];
  genre?: string;
  genreUrl?: string;
  author?: string;
  authorId?: string;
  authorUrl?: string;
  authorThumbnails?: AuthorThumbnail[];
  subCountText?: string;
  lengthSeconds?: number;
  allowRatings?: boolean;
  rating?: number;
  isListed?: boolean;
  liveNow?: boolean;
  isPostLiveDvr?: boolean;
  isUpcoming?: boolean;
  dashUrl?: string;
  premiereTimestamp?: number;
  hlsUrl?: string;
  adaptiveFormats?: AdaptiveFormat[];
  formatStreams?: FormatStream[];
  captions?: Caption[];
  musicTracks?: MusicTrack[];
  recommendedVideos?: RecommendedVideo[];
};

export default class VideoInfo {
  type?: string;
  title?: string;
  videoId?: string;
  videoThumbnails?: VideoThumbnail[];
  storyboards?: Storyboard[];
  description?: string;
  descriptionHtml?: string;
  published?: number;
  publishedText?: string;
  keywords?: string[];
  viewCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  paid?: boolean;
  premium?: boolean;
  isFamilyFriendly?: boolean;
  allowedRegions?: string[];
  genre?: string;
  genreUrl?: string;
  author?: string;
  authorId?: string;
  authorUrl?: string;
  authorThumbnails?: AuthorThumbnail[];
  subCountText?: string;
  lengthSeconds?: number;
  allowRatings?: boolean;
  rating?: number;
  isListed?: boolean;
  liveNow?: boolean;
  isPostLiveDvr?: boolean;
  isUpcoming?: boolean;
  dashUrl?: string;
  premiereTimestamp?: number;
  hlsUrl?: string;
  adaptiveFormats?: AdaptiveFormat[];
  formatStreams?: FormatStream[];
  captions?: Caption[];
  musicTracks?: MusicTrack[];
  recommendedVideos?: RecommendedVideo[];

  constructor(rawdata: any) {
    for (const key of Object.keys(rawdata)) {
      if (key in this) {
        (this as any)[key] = rawdata[key];
      }
    }
  }

  async cast(): Promise<CastedVideoInfo> {
    const videoInfo = new CastedVideoInfo(this);
    return videoInfo;
  }
}

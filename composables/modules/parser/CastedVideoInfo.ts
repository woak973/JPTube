/* eslint-disable @typescript-eslint/no-explicit-any */
import VideoInfo from './VideoInfo';
import type { AdaptiveFormat, FormatStream, RecommendedVideo } from './VideoInfo';
import { YTNodes, Helpers, APIResponseTypes, Misc } from 'youtubei.js';
import CastedCompactVideo from './CastedCompactVideo';
export default class CastedVideoInfo extends Helpers.YTNode {
  static override type = 'castedvideoInfo';

  public primary_info?: YTNodes.VideoPrimaryInfo | null;
  public secondary_info?: YTNodes.VideoSecondaryInfo | null;
  public playlist?: YTNodes.TwoColumnWatchNextResults['playlist'];
  public game_info?: any;
  public merchandise?: YTNodes.MerchandiseShelf | null;
  public related_chip_cloud?: YTNodes.ChipCloud | null;
  public watch_next_feed?: Helpers.ObservedArray<Helpers.YTNode> | null;
  public player_overlays?: YTNodes.PlayerOverlay | null;
  public comments_entry_point_header?: YTNodes.CommentsEntryPointHeader | null;
  public livechat?: YTNodes.LiveChat | null;
  public autoplay?: YTNodes.TwoColumnWatchNextResults['autoplay'];
  public basic_info;
  public annotations?: Helpers.ObservedArray<YTNodes.PlayerAnnotationsExpanded>;
  public storyboards?: YTNodes.PlayerStoryboardSpec | YTNodes.PlayerLiveStoryboardSpec;
  public endscreen?: YTNodes.Endscreen;
  public captions?: YTNodes.PlayerCaptionsTracklist;
  public cards?: YTNodes.CardCollection;
  public streaming_data?: APIResponseTypes.IStreamingData;
  public playability_status?: APIResponseTypes.IPlayabilityStatus;
  public player_config?: APIResponseTypes.IPlayerConfig;

  constructor(rawdata: VideoInfo) {
    super();
    this.basic_info = {
      allowratings: rawdata.allowRatings,
      author: rawdata.author,
      channel_id: rawdata.authorId,
      duration: rawdata.lengthSeconds,
      keywords: rawdata.keywords,
      title: rawdata.title,
      view_count: rawdata.viewCount,
      thumbnail: rawdata.videoThumbnails as Misc.Thumbnail[],
      like_count: rawdata.likeCount,
      short_description: rawdata.description,
      id: rawdata.videoId,
      is_post_live_dvr: rawdata.isPostLiveDvr,
      is_family_safe: rawdata.isFamilyFriendly,
      is_unlisted: !rawdata.isListed,
      is_upcoming: rawdata.isUpcoming,
      is_live: rawdata.liveNow,
    };
    this.streaming_data = {
      dash_manifest_url: rawdata.dashUrl,
      hls_manifest_url: rawdata.hlsUrl,
      adaptive_formats: (rawdata.adaptiveFormats ?? []).map(mapAdaptiveFormatToMiscFormat),
      formats: (rawdata.formatStreams ?? []).map(mapFormatStreamToMiscFormat),
      expires: new Date(),
    };
    this.watch_next_feed = (rawdata.recommendedVideos ?? []).map((v: RecommendedVideo) => new CastedCompactVideo(v)) as unknown as Helpers.ObservedArray<Helpers.YTNode>;
  }
}

function mapAdaptiveFormatToMiscFormat(format: AdaptiveFormat): Misc.Format {
  // @ts-expect-error aaaaaaaaaaa
  return {
    itag: Number(format.itag),
    url: format.url,
    width: format.resolution ? Number(format.resolution.split('x')[0]) : undefined,
    height: format.resolution ? Number(format.resolution.split('x')[1]) : undefined,
    last_modified: new Date(format.lmt),
    last_modified_ms: format.lmt,
    content_length: format.clen ? Number(format.clen) : undefined,
    quality: format.qualityLabel,
    xtags: undefined,
    drm_families: undefined,
    fps: format.fps,
    quality_label: format.qualityLabel,
    projection_type: format.projectionType as ProjectionType,
    average_bitrate: format.bitrate ? Number(format.bitrate) : undefined,
    bitrate: format.bitrate ? Number(format.bitrate) : 0,
    spatial_audio_type: undefined,
    target_duration_dec: format.targetDurationsec,
    fair_play_key_uri: undefined,
    stereo_layout: undefined,
    max_dvr_duration_sec: format.maxDvrDurationSec,
    high_replication: undefined,
    audio_quality: format.audioQuality,
    approx_duration_ms: 0,
    audio_sample_rate: format.audioSampleRate ? Number(format.audioSampleRate) : undefined,
    audio_channels: format.audioChannels ? Number(format.audioChannels) : undefined,
    loudness_db: undefined,
    signature_cipher: undefined,
    is_drc: undefined,
    drm_track_type: undefined,
    distinct_params: undefined,
    track_absolute_loudness_lkfs: undefined,
    mime_type: format.type,
    is_type_otf: false,
    init_range: parseRange(format.init),
    index_range: parseRange(format.index),
    cipher: undefined,
    audio_track: undefined,
    has_audio: !!format.audioQuality,
    has_video: !!format.resolution,
    has_text: false,
    language: undefined,
    is_dubbed: undefined,
    is_auto_dubbed: undefined,
    is_descriptive: undefined,
    is_secondary: undefined,
    is_original: undefined,
    color_info: parseColorInfo(format.colorInfo),
    caption_track: undefined,
    decipher: () => { return 'Sorry, I cannot deciphy.'; },
  };
}

function mapFormatStreamToMiscFormat(format: FormatStream): Misc.Format {
  // @ts-expect-error aaaaaaaaaaa
  return {
    itag: Number(format.itag),
    url: format.url,
    width: format.resolution ? Number(format.resolution.split('x')[0]) : undefined,
    height: format.resolution ? Number(format.resolution.split('x')[1]) : undefined,
    last_modified: new Date(0),
    last_modified_ms: '0',
    content_length: format.size ? Number(format.size) : undefined,
    quality: format.quality,
    xtags: undefined,
    drm_families: undefined,
    fps: undefined,
    quality_label: format.qualityLabel,
    projection_type: undefined,
    average_bitrate: format.bitrate ? Number(format.bitrate) : undefined,
    bitrate: format.bitrate ? Number(format.bitrate) : 0,
    spatial_audio_type: undefined,
    target_duration_dec: undefined,
    fair_play_key_uri: undefined,
    stereo_layout: undefined,
    max_dvr_duration_sec: undefined,
    high_replication: undefined,
    audio_quality: undefined,
    approx_duration_ms: 0,
    audio_sample_rate: undefined,
    audio_channels: undefined,
    loudness_db: undefined,
    signature_cipher: undefined,
    is_drc: undefined,
    drm_track_type: undefined,
    distinct_params: undefined,
    track_absolute_loudness_lkfs: undefined,
    mime_type: format.type,
    is_type_otf: false,
    init_range: undefined,
    index_range: undefined,
    cipher: undefined,
    audio_track: undefined,
    has_audio: false,
    has_video: !!format.resolution,
    has_text: false,
    language: undefined,
    is_dubbed: undefined,
    is_auto_dubbed: undefined,
    is_descriptive: undefined,
    is_secondary: undefined,
    is_original: undefined,
    color_info: undefined,
    caption_track: undefined,
    decipher: () => { return 'Sorry, I cannot deciphy.'; },
  };
}

function parseRange(rangeStr?: string): Range | undefined {
  if (!rangeStr) return undefined;
  const [start, end] = rangeStr.split('-').map(Number);
  if (isNaN(start) || isNaN(end)) return undefined;
  return { start, end };
}

function parseColorInfo(colorInfo?: string): ColorInfo | undefined {
  if (!colorInfo) return undefined;
  return {
    primaries: Reflect.has(colorInfo as unknown as object, 'primaries')
      ? (colorInfo as unknown as { primaries: string }).primaries
      : undefined,
    transfer_characteristics: Reflect.has(colorInfo as unknown as object, 'transferCharacteristics')
      ? (colorInfo as unknown as { transferCharacteristics: string }).transferCharacteristics
      : undefined,
    matrix_coefficients: Reflect.has(colorInfo as unknown as object, 'matrixCoefficients')
      ? (colorInfo as unknown as { matrixCoefficients: string }).matrixCoefficients
      : undefined,
  };
}

export type ProjectionType = 'RECTANGULAR' | 'EQUIRECTANGULAR' | 'EQUIRECTANGULAR_THREED_TOP_BOTTOM' | 'MESH';
export type SpatialAudioType = 'AMBISONICS_5_1' | 'AMBISONICS_QUAD' | 'FOA_WITH_NON_DIEGETIC';
export type StereoLayout = 'LEFT_RIGHT' | 'TOP_BOTTOM';

export type Range = {
  start: number;
  end: number;
};

export type ColorInfo = {
  primaries?: string;
  transfer_characteristics?: string;
  matrix_coefficients?: string;
};

export type AudioTrack = {
  audio_is_default: boolean;
  display_name: string;
  id: string;
};

export type CaptionTrack = {
  display_name: string;
  vss_id: string;
  language_code: string;
  kind?: 'asr' | 'frc';
  id: string;
};

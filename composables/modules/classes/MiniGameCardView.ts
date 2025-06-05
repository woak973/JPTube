import { YTNodes, Helpers, Parser, APIResponseTypes } from 'youtubei.js';

export default class MiniGameCardView extends Helpers.YTNode {
  static override type = 'MiniGameCardView';

  image: {
    sources: {
      url: string;
      width: number;
      height: number;
    }[];
  };

  title: string;
  genre: string;
  on_tap: {
    innertube_command: YTNodes.NavigationEndpoint;
  };

  accessibility_text: string;
  overflow_button: YTNodes.ButtonView | null;
  layout: string;
  color_palette: {
    text_primary_color: number;
    section_two_color: number;
    section_four_color: number;
  };

  inline_playback_experiments: {
    enable_simplified_android_ui: boolean;
    disable_cinematic_container: boolean;
    enable_squared_thumbnails: boolean;
    enable_logging_directives_for_android_inline_playback: boolean;
  };

  index_in_shelf: number;
  entity_redesign_experiments: {
    change_playables_layout_with_cta: boolean;
    change_playables_layout_with_content_type_badge: boolean;
    enable11_thumbnail_on_home_shelves: boolean;
    enable169_thumbnail_on_home_shelves: boolean;
    change_playables_layout_with_cta_below_metadata: boolean;
    enable_responsive_width: boolean;
    enable_game_console_with_cinematic_container: boolean;
    enable_game_console_with_subtle_color: boolean;
  };

  responsive_num_visible_items: number;
  logging_directives: {
    tracking_params: string;
    visibility: {
      types: string;
    };
    gestures: {
      types: string;
    };
  };

  overlay_badge_text?: string;

  constructor(data: APIResponseTypes.RawNode) {
    super();
    this.image = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sources: data.image.sources.map((item: any) => ({
        url: item.url,
        width: item.width,
        height: item.height,
      })),
    };
    this.title = data.title;
    this.genre = data.genre;
    this.on_tap = {
      innertube_command: new YTNodes.NavigationEndpoint(data.onTap.innertubeCommand),
    };
    this.accessibility_text = data.accessibilityText;
    this.overflow_button = Parser.parseItem(data.overflowButton, YTNodes.ButtonView);
    this.layout = data.layout;
    this.color_palette = {
      text_primary_color: data.colorPalette.textPrimaryColor,
      section_two_color: data.colorPalette.sectionTwoColor,
      section_four_color: data.colorPalette.sectionFourColor,
    };
    this.inline_playback_experiments = {
      enable_simplified_android_ui: data.inlinePlaybackExperiments.enableSimplifiedAndroidUi,
      disable_cinematic_container: data.inlinePlaybackExperiments.disableCinematicContainer,
      enable_squared_thumbnails: data.inlinePlaybackExperiments.enableSquaredThumbnails,
      enable_logging_directives_for_android_inline_playback: data.inlinePlaybackExperiments.enableLoggingDirectivesForAndroidInlinePlayback,
    };
    this.index_in_shelf = data.indexInShelf;
    this.entity_redesign_experiments = {
      change_playables_layout_with_cta: data.entityRedesignExperiments.changePlayablesLayoutWithCta,
      change_playables_layout_with_content_type_badge: data.entityRedesignExperiments.changePlayablesLayoutWithContentTypeBadge,
      enable11_thumbnail_on_home_shelves: data.entityRedesignExperiments.enable11ThumbnailOnHomeShelves,
      enable169_thumbnail_on_home_shelves: data.entityRedesignExperiments.enable169ThumbnailOnHomeShelves,
      change_playables_layout_with_cta_below_metadata: data.entityRedesignExperiments.changePlayablesLayoutWithCtaBelowMetadata,
      enable_responsive_width: data.entityRedesignExperiments.enableResponsiveWidth,
      enable_game_console_with_cinematic_container: data.entityRedesignExperiments.enableGameConsoleWithCinematicContainer,
      enable_game_console_with_subtle_color: data.entityRedesignExperiments.enableGameConsoleWithSubtleColor,
    };
    this.responsive_num_visible_items = data.responsiveNumVisibleItems;
    this.logging_directives = {
      tracking_params: data.loggingDirectives.trackingParams,
      visibility: {
        types: data.loggingDirectives.visibility.types,
      },
      gestures: {
        types: data.loggingDirectives.gestures.types,
      },
    };
    this.overlay_badge_text = Reflect.has(data, 'overlayBadgeText') ? data.overlayBadgeText : undefined;
  }
}

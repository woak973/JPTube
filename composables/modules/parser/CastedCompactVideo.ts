import { Misc, Helpers, YTNodes } from 'youtubei.js';
import type { RecommendedVideo } from './VideoInfo';

export default class CastedCompactVideo extends Helpers.YTNode {
  static override type = 'CastedCompactVideo';

  id: string;
  thumbnails: Misc.Thumbnail[];
  rich_thumbnail?: Helpers.YTNode;
  title: Misc.Text;
  author: Misc.Author;
  view_count: Misc.Text;
  short_view_count: Misc.Text;
  published: Misc.Text;
  badges: YTNodes.MetadataBadge[];

  duration: {
    text: string;
    seconds: number;
  };

  thumbnail_overlays?: Helpers.ObservedArray<Helpers.YTNode>;
  endpoint?: YTNodes.NavigationEndpoint;
  menu?: YTNodes.Menu | null;

  constructor(data: RecommendedVideo) {
    super();
    this.id = data.videoId ? data.videoId : '';
    this.thumbnails = data.videoThumbnails as Misc.Thumbnail[];
    this.title = new Misc.Text({ simpleText: data.title });
    this.author = new Misc.Author({ simpleText: data.author });
    this.view_count = new Misc.Text({ simpleText: data.viewCount });
    this.short_view_count = new Misc.Text({ simpleText: data.viewCountText });
    this.published = new Misc.Text({ simpleText: data.publishedText });
    this.badges = [];

    this.duration = {
      text: new Misc.Text({ simpleText: data.lengthSeconds }).toString(),
      seconds: data.lengthSeconds,
    };
    this.endpoint = new YTNodes.NavigationEndpoint({ commandMetadata: { webCommandMetadata: { url: `/watch?v=${this.id}` } }, watchEndpoint: { videoId: this.id } });
  }

  get best_thumbnail() {
    return this.thumbnails[0];
  }
}

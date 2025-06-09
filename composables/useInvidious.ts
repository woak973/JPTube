import { INV } from './modules';
export class Invidious {
  static type = 'invidious';

  private targetUrl: string;
  constructor(targetUrl: string) {
    this.targetUrl = targetUrl;
  }

  async getInfo(_videoId: string): Promise<INV.VideoInfo> {
    const info = await fetch(`/api/proxy/api/v1/videos/${_videoId}?__host=${this.targetUrl}&__isSelf=true`).then(res => res.json());
    const VideoInfo = new INV.VideoInfo(info);
    return VideoInfo;
  }
}

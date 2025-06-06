async function getProxifiedUrl(input, init, targetHost, isYouTube = false) {
  if (!input) {
    return ''; // デフォルトのURLまたは空文字列を返す
  }

  let url;

  try {
    url = typeof input === 'string'
      ? new URL(input, self.location.href)
      : input instanceof URL
        ? input
        : new URL(input.url);
  } catch (e) {
    console.error(e);
    return ''; // 無効なURLの場合は空文字列を返す
  }

  url.searchParams.set('__host', targetHost ? targetHost : url.host);
  url.searchParams.set('__isSelf', 'true');
  url.host = self.location.host;
  url.protocol = self.location.protocol;
  if (!url.pathname.includes('/v/assets/') && !isYouTube) {
    url.pathname = '/v/assets' + url.pathname;
  }

  if (url.pathname.includes('/v/assets/') && isYouTube){
    url.pathname = url.pathname.replace('/v/assets', '');
  }
  url.pathname = `/api/playables${url.pathname}`;

  const headers = init?.headers
    ? new Headers(init.headers)
    : input instanceof Request
      ? input.headers
      : new Headers();

  // Base64エンコード
  const encodedHeaders = btoa(JSON.stringify([...headers]));
  url.searchParams.set('__headers', encodedHeaders);

  return url.toString();
}

self.getProxifiedUrl = getProxifiedUrl;

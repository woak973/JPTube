async function getProxifiedUrl(input, init, targetHost, isYouTube = false) {
  if (!input) {
    return '';
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
    return '';
  }

  url.host = self.location.host;
  url.protocol = self.location.protocol;
  if (!url.pathname.includes('/v/assets/') && !isYouTube) {
    url.pathname = '/v/assets' + url.pathname;
  }

  if (url.pathname.includes('/v/assets/') && isYouTube){
    url.pathname = url.pathname.replace('/v/assets', '');
  }
  url.pathname = '/' + targetHost + url.pathname;
  url.pathname = `/api/playables${url.pathname}`;

  const headers = init?.headers
    ? new Headers(init.headers)
    : input instanceof Request
      ? input.headers
      : new Headers();

  const encodedHeaders = btoa(JSON.stringify([...headers]));
  url.searchParams.set('__headers', encodedHeaders);

  return url.toString();
}

self.getProxifiedUrl = getProxifiedUrl;

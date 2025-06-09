async function getProxifiedUrl(input, init) {
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

  url.pathname = `/api/playables/${url.host}${url.pathname}`;
  url.host = self.location.host;
  url.protocol = self.location.protocol;

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

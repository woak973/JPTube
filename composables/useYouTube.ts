function createRequest(input: RequestInfo | URL, init?: RequestInit) {
  const url = typeof input === 'string'
    ? new URL(input)
    : input instanceof URL
      ? input
      : new URL(input.url);

  url.searchParams.set('__host', url.host);
  url.host = window.location.host;
  url.protocol = 'http';
  url.pathname = `/api/proxy${url.pathname}`;

  const headers = init?.headers
    ? new Headers(init.headers)
    : input instanceof Request
      ? input.headers
      : new Headers();

  // Base64エンコード
  const encodedHeaders = btoa(JSON.stringify([...headers]));
  url.searchParams.set('__headers', encodedHeaders);

  const request = new Request(
    url,
    input instanceof Request ? input : undefined,
  );

  headers.delete('user-agent');

  return { request, headers };
}

export function fetchFn(input: RequestInfo | URL, init?: RequestInit) {
  const { request, headers } = createRequest(input, init);
  return fetch(request, init ? { ...init, headers } : { headers });
}

export function PlayerfetchFn(input: RequestInfo | URL, init?: RequestInit) {
  const { request, headers } = createRequest(input, init);
  return fetch(request, init ? { ...init, headers } : { headers });
}

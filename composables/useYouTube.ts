function createRequest(proxyhost: string, input: RequestInfo | URL, init?: RequestInit) {
  const url = typeof input === 'string'
    ? new URL(input)
    : input instanceof URL
      ? input
      : new URL(input.url);

  const protocolStore = useProtocolStore().protocol;

  url.searchParams.set('__host', url.host);
  url.searchParams.set('__proxyhost', proxyhost);
  url.searchParams.set('__proxyschema', protocolStore);
  url.host = window.location.host;
  url.protocol = window.location.protocol;
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
  const backendStore = useBackendStore().backend;
  const proxyhost = typeof backendStore === 'string' ? backendStore : 'jptube-server.onrender.com';
  const { request, headers } = createRequest(proxyhost, input, init);
  return fetch(request, init ? { ...init, headers } : { headers });
}

export function PlayerfetchFn(input: RequestInfo | URL, init?: RequestInit) {
  const playerbackendStore = usePlayerBackendStore().playerbackend;
  const proxyhost = typeof playerbackendStore === 'string' ? playerbackendStore : 'jptube-player-server.onrender.com';
  const { request, headers } = createRequest(proxyhost, input, init);
  return fetch(request, init ? { ...init, headers } : { headers });
}

export function getProxifiedUrl(input: RequestInfo | URL, init?: RequestInit): string {
  if (!input) {
    return ''; // デフォルトのURLまたは空文字列を返す
  }
  const backendStore = useBackendStore();
  const proxyhost = typeof backendStore === 'string' ? backendStore : 'jptube-server.onrender.com';
  const protocolStore = useProtocolStore().protocol;
  let url: URL;

  try {
    url = typeof input === 'string'
      ? new URL(input, window.location.href)
      : input instanceof URL
        ? input
        : new URL(input.url);
  } catch (e) {
    console.error(e);
    return ''; // 無効なURLの場合は空文字列を返す
  }

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

  return url.toString();
}

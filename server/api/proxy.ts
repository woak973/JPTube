export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { input, init, host } = body;
  const response = await createRequest(input as RequestInfo | URL, init as RequestInit | undefined, host as string);

  // ヘッダーを複製して新しいレスポンスを作成
  const headers = new Headers(response.headers);
  headers.set('Content-Encoding', 'identify');

  const modifiedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });

  return modifiedResponse;
});

async function createRequest(input: RequestInfo | URL, init: RequestInit | undefined, host: string): Promise<Response> {
  const url = typeof input === 'string'
    ? new URL(input)
    : input instanceof URL
      ? input
      : new URL(input.url);

  url.searchParams.set('__host', url.host);
  url.host = host;
  url.protocol = 'https';

  const headers = init?.headers
    ? new Headers(init.headers)
    : input instanceof Request
      ? input.headers
      : new Headers();

  // Base64エンコード
  const encodedHeaders = btoa(JSON.stringify([...headers]));
  url.searchParams.set('__headers', encodedHeaders);
  url.searchParams.set('__target', host);

  const request = new Request(
    url,
    input instanceof Request ? input : undefined,
  );

  headers.delete('user-agent');

  // fetchでリクエストを送信し、レスポンスを返す
  return fetch(request, init
    ? {
        ...init,
        headers,
      }
    : {
        headers,
      });
}

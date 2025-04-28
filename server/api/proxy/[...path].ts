import type { H3Event } from 'h3';
export default defineEventHandler(async (event) => {
  try {
    return await handler(event);
  } catch (e) {
    console.error('Error in proxy handler:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
});

const handler = async (event: H3Event): Promise<Response> => {
  const url = getRequestURL(event);
  const isSelf = url.searchParams.get('__isSelf') || 'false';
  if (isSelf === 'true') {
    function copyHeader(headerName: string, to: Headers, from: Headers) {
      const hdrVal = from.get(headerName);
      if (hdrVal) {
        to.set(headerName, hdrVal);
      }
    }

    if (event.method === 'OPTIONS') {
      const response = new Response('', {
        status: 200,
        headers: new Headers({
          'Access-Control-Allow-Origin': event.headers.get('origin') || '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers':
            'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-goog-visitor-id, x-goog-api-key, x-origin, x-youtube-client-version, x-youtube-client-name, x-goog-api-format-version, x-user-agent, Accept-Language, Range, Referer',
          'Access-Control-Max-Age': '86400',
          'Access-Control-Allow-Credentials': 'true',
        }),
      });
      return response;
    }

    if (!url.searchParams.has('__host')) {
      return new Response(
        'Request is formatted incorrectly. Please include __host in the query string.',
        { status: 400 },
      );
    }

    url.host = url.searchParams.get('__host')!;
    url.protocol = 'https';
    url.port = '443';
    url.pathname = url.pathname.replace(/^\/api\/proxy\//, '/');
    url.searchParams.delete('__host');

    const headersBase64 = url.searchParams.get('__headers');
    let parsedHeaders = {};
    if (headersBase64) {
      try {
        parsedHeaders = JSON.parse(atob(headersBase64));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        try {
          parsedHeaders = JSON.parse(headersBase64);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          return new Response(
            'Request is formatted incorrectly. The __headers query must be formatted as JSON or Base64.',
            { status: 400 },
          );
        }
      }
    }
    const request_headers = new Headers(parsedHeaders);

    copyHeader('range', request_headers, event.headers);

    if (!request_headers.has('user-agent'))
      copyHeader('user-agent', request_headers, event.headers);

    url.searchParams.delete('__headers');
    const body
    = event.method !== 'GET' && event.method !== 'HEAD'
      ? await readRawBody(event)
      : undefined;

    const fetchRes = await fetch(url, {
      method: event.method,
      headers: request_headers,
      body: body,
    });

    const headers = new Headers();
    copyHeader('content-length', headers, fetchRes.headers);
    copyHeader('content-type', headers, fetchRes.headers);
    copyHeader('content-disposition', headers, fetchRes.headers);
    copyHeader('accept-ranges', headers, fetchRes.headers);
    copyHeader('content-range', headers, fetchRes.headers);

    headers.set(
      'Access-Control-Allow-Origin',
      event.headers.get('origin') || '*',
    );
    headers.set('Access-Control-Allow-Headers', '*');
    headers.set('Access-Control-Allow-Methods', '*');
    headers.set('Access-Control-Allow-Credentials', 'true');

    return new Response(fetchRes.body, {
      status: fetchRes.status,
      headers: headers,
    });
  } else {
    const strippedPathname = url.pathname.replace(/^\/api\/proxy\//, '/');
    const proxyBaseUrlHost = url.searchParams.get('__proxyhost');
    const proxySchema = url.searchParams.get('__proxyProtocol') || 'https';
    const proxyBaseUrl = `${proxySchema}://${proxyBaseUrlHost}`;
    const proxyUrl = new URL(strippedPathname + url.search, proxyBaseUrl);
    const headers = event.headers;
    const body
    = event.method !== 'GET' && event.method !== 'HEAD'
      ? await readRawBody(event)
      : undefined;

    const proxyReq = new Request(proxyUrl.toString(), {
      method: event.method,
      headers: headers,
      body: body,
    });

    const proxyRes = await fetch(proxyReq);
    const responseHeaders = new Headers(proxyRes.headers);

    const origin = headers.get('Origin') || '*';
    responseHeaders.set('Access-Control-Allow-Origin', origin);
    responseHeaders.set('Access-Control-Allow-Methods', '*');
    responseHeaders.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-goog-visitor-id, x-goog-api-key, x-origin, x-youtube-client-version, x-youtube-client-name, x-goog-api-format-version, x-user-agent, Accept-Language, Range, Referer');
    responseHeaders.set('Access-Control-Max-Age', '86400');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    responseHeaders.set('Content-Encoding', 'identify');

    return new Response(proxyRes.body, {
      status: proxyRes.status,
      statusText: proxyRes.statusText,
      headers: responseHeaders,
    });
  }
};

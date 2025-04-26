export default defineEventHandler(async (event) => {
  const req = await event.web?.request;
  if (req) {
    console.log('req exsists on event!!');
    const response = await handler(req);
    return response;
  } else {
    console.log('req does not exsist on event!!');
    const url = new URL(event.node.req.url || '', `https://${event.node.req.headers.host}`);
    const strippedPathname = url.pathname.replace(/^\/api\/proxy\//, '/');
    const proxyUrl = new URL(strippedPathname + url.search, 'https://innertube.sitejp.synology.me');
    const proxyRes = await fetch(proxyUrl);
    const responseHeaders = new Headers(proxyRes.headers);

    responseHeaders.set('Access-Control-Allow-Origin', 'localhost:3000');
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
});

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const strippedPathname = url.pathname.replace(/^\/api\/proxy\//, '/');
  const proxyUrl = new URL(strippedPathname + url.search, 'https://innertube.sitejp.synology.me');

  const proxyReq = new Request(proxyUrl.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  const proxyRes = await fetch(proxyReq);
  const responseHeaders = new Headers(proxyRes.headers);

  const origin = req.headers.get('Origin') || '*';
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
};

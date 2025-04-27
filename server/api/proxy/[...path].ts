import type { IncomingMessage, IncomingHttpHeaders } from 'node:http';
import type { H3Event } from 'h3';
export default defineEventHandler(async (event) => {
  try {
    const req = await event.web?.request;
    if (req) {
      const response = await handler(req);
      return response;
    } else {
      const nodereq = event.node.req;
      const response = await nodehandler(nodereq, event);
      return response;
    }
  } catch (e) {
    console.error('Error in proxy handler:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
});

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const strippedPathname = url.pathname.replace(/^\/api\/proxy\//, '/');
  const proxyBaseUrlHost = url.searchParams.get('__proxyhost') || 'jptube-player-server.onrender.com';
  const proxySchema = url.searchParams.get('__proxyProtocol') || 'https';
  const proxyBaseUrl = `${proxySchema}://${proxyBaseUrlHost}`;
  const proxyUrl = new URL(strippedPathname + url.search, proxyBaseUrl);

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

const nodehandler = async (req: IncomingMessage, event: H3Event): Promise<Response> => {
  const url = new URL(req.url || '', `https://${event.node.req.headers.host}`);
  const strippedPathname = url.pathname.replace(/^\/api\/proxy\//, '/');
  const proxyBaseUrlHost = url.searchParams.get('__proxyhost') || 'jptube-player-server.onrender.com';
  const proxySchema = url.searchParams.get('__proxyProtocol') || 'https';
  const proxyBaseUrl = `${proxySchema}://${proxyBaseUrlHost}`;
  const proxyUrl = new URL(strippedPathname + url.search, proxyBaseUrl);
  const headers = headersFromIncomingHttpHeaders(req.headers);
  const body
    = event.method !== 'GET' && event.method !== 'HEAD'
      ? await readRawBody(event)
      : undefined;

  const proxyReq = new Request(proxyUrl.toString(), {
    method: req.method,
    headers: headers,
    body: body,
  });

  const proxyRes = await fetch(proxyReq);
  const responseHeaders = new Headers(proxyRes.headers);

  const origin = headers['origin'] || '*';
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

function headersFromIncomingHttpHeaders(headers: IncomingHttpHeaders): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string') {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value.join(',');
    }
  }
  return result;
}

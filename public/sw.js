importScripts('/proxify.js');
let globalHost = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.id) {
    globalHost = event.data.id;
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  let targetHost = null;
  let isSimpleProxy = false;
  let isYouTube = false;
  if (!url.pathname.startsWith('/_nuxt') && !url.pathname.startsWith('/npm') && url.pathname !== '/favicon.ico' && !url.pathname.endsWith('index.html')) {
    if (
      url.host === location.host
    ) {
      isSimpleProxy = true;
      targetHost = globalHost;
    } else if (
      url.host === 'www.youtube.com'
    ) {
      isYouTube = true;
      targetHost = 'www.youtube.com';
    } else if (
      url.host.includes('playables.usercontent.goog')
    ) {
      targetHost = globalHost;
    } else {
      console.log('Unknown host:', url.host);
    }

    if (!isSimpleProxy && targetHost) {
      event.respondWith(
        (async () => {
          const proxifiedUrl = await getProxifiedUrl(event.request, undefined, targetHost, isYouTube);
          return fetch(proxifiedUrl, {
            method: event.request.method,
            body: ['POST', 'PUT', 'PATCH'].includes(event.request.method) ? event.request.body : undefined,
            duplex: 'half',
          });
        })(),
      );
    } else if (isSimpleProxy && targetHost) {
      event.respondWith(
        (async () => {
          const reqUrl = new URL(event.request.url);
          reqUrl.searchParams.set('__isSelf', 'true');
          reqUrl.searchParams.set('__host', targetHost);
          if (!url.pathname.includes('/v/assets/')) {
            reqUrl.pathname = '/v/assets' + reqUrl.pathname;
          }
          if (!url.pathname.includes('/api/playables/')) {
            reqUrl.pathname = '/api/playables' + reqUrl.pathname;
          }
          return fetch(reqUrl.toString(), {
            method: event.request.method,
            body: ['POST', 'PUT', 'PATCH'].includes(event.request.method) ? event.request.body : undefined,
            duplex: 'half',
          });
        })(),
      );
    }
  }
});

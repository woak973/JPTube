importScripts('/proxify.js');
const globalHost = new URL(self.location).searchParams.get('globalhost');

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  let targetHost = null;
  let isYouTube = false;
  if (!url.pathname.startsWith('/_nuxt') && !url.pathname.startsWith('/npm') && url.pathname !== '/favicon.ico' && !url.pathname.endsWith('index.html')) {
    if (
      url.host === 'www.youtube.com'
    ) {
      isYouTube = true;
      targetHost = 'www.youtube.com';
    } else if (
      url.host.includes('playables.usercontent.goog')
    ) {
      targetHost = globalHost;
    }
    if (targetHost) {
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
    }
  }
});

importScripts('/proxify.js');

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  let isproxy = false;
  if (!url.pathname.startsWith('/_nuxt') && !url.pathname.startsWith('/npm') && url.pathname !== '/favicon.ico' && !url.pathname.endsWith('index.html')) {
    if (
      url.host === 'www.youtube.com' || url.host !== self.location.host
    ) {
      isproxy = true;
    }
    if (isproxy) {
      event.respondWith(
        (async () => {
          const proxifiedUrl = await getProxifiedUrl(event.request, undefined);
          return fetch(proxifiedUrl, {
            method: event.request.method,
            body: ['POST', 'PUT', 'PATCH'].includes(event.request.method) ? await event.request.clone().blob() : undefined,
            duplex: 'half',
          });
        })(),
      );
    }
  }
});

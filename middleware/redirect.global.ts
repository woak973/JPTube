// middleware/redirect.ts
export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/@')) {
    return navigateTo(`/channel${to.path}`);
  } else if (to.path === '/gaming') {
    return navigateTo('/channel/UCOpNcN46UbXVtpKMrmU4Abg');
  } else if (to.path === '/results' && to.query.search_query) {
    return navigateTo(`/search/${to.query.search_query}`);
  } else if (to.path.startsWith('/feed/news_destination/')) {
    const q = to.path.replace('/feed/news_destination/', '');
    return navigateTo(`/channel/UCYfdidRxbB8Qhf0Nx7ioOYw/${q}`);
  } else if (to.path === '/feed/news_destination') {
    return navigateTo('/channel/UCYfdidRxbB8Qhf0Nx7ioOYw');
  } else if (to.path.startsWith('/feed/storefront')) {
    const bp = to.query.bp;
    if (bp) {
      return navigateTo(`/channel/UClgRkhTL3_hImCAmdLfDE4g?bp=${bp}`);
    }
    return navigateTo('/channel/UClgRkhTL3_hImCAmdLfDE4g');
  } else if (to.query.pp) {
    const { pp, ...query } = to.query;
    return navigateTo({ path: to.path, query });
  }
});

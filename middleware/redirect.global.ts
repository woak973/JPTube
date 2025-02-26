// middleware/redirect.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/@')) {
    return navigateTo(`/channel${to.path}`); // スライスしない
  }
  if (to.path === '/gaming') {
    return navigateTo('/channel/UCOpNcN46UbXVtpKMrmU4Abg'); // gaming.vue のリダイレクト
  }
  if (to.path === '/results' && to.query.search_query) {
    return navigateTo(`/search/${to.query.search_query}`); // results.vue のリダイレクト
  }
});
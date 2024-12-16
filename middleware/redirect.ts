// middleware/redirect.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/@')) {
    return navigateTo(`/channel${to.path}`); // スライスしない
  }
});
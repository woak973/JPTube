// middleware/auth.ts


export default defineNuxtRouteMiddleware((to, from) => {
    const validToken = 'your-secure-token'; // ここに実際のトークンを設定
    const cookies = useCookie('authToken')
    const enteredToken = cookies.value;
  
    if (enteredToken !== validToken && !to.path.startsWith('/login')) {
      return navigateTo('/login');
    }
});
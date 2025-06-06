export const useCookieStore = defineStore('cookie', {
  state: () => ({
    cookie: '',
  }),
  actions: {
    setCookie(this: { cookie: string }, newCookie: string) {
      this.cookie = newCookie;
    },
    resetCookie(this: { cookie: string }) {
      this.cookie = '';
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 400 * 24 * 60 * 60,
    }),
  },
});

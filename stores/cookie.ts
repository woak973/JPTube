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
  persist: true,
});

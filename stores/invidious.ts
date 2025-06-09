export const useInvidiousStore = defineStore('invidious', {
  state: () => ({
    invidious: false,
    invURL: '',
  }),
  actions: {
    setInvidious(this: { invidious: boolean }, newInvidious: boolean) {
      this.invidious = newInvidious;
    },
    resetInvidious(this: { invidious: boolean }) {
      this.invidious = false;
    },
    setInvURL(this: { invURL: string }, newInvURL: string) {
      this.invURL = newInvURL;
    },
    resetInvURL(this: { invURL: string }) {
      this.invURL = '';
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 400 * 24 * 60 * 60,
    }),
  },
});

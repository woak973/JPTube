export const useAutoPlayStore = defineStore('autoplay', {
  state: () => ({
    autoplay: false,
  }),
  actions: {
    setAutoPlay(this: { autoplay: boolean }, newAutoPlay: boolean) {
      this.autoplay = newAutoPlay;
    },
    resetAutoPlay(this: { autoplay: boolean }) {
      this.autoplay = false;
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 400 * 24 * 60 * 60,
    }),
  },
});

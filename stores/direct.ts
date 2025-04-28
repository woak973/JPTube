export const useDirectStore = defineStore('direct', {
  state: () => ({
    direct: true,
    self: false,
    puppeteer: false,
  }),
  actions: {
    setDirect(this: { direct: boolean }, newDirect: boolean) {
      this.direct = newDirect;
    },
    resetDirect(this: { direct: boolean }) {
      this.direct = false;
    },
    setSelf(this: { self: boolean }, newSelf: boolean) {
      this.self = newSelf;
    },
    resetSelf(this: { self: boolean }) {
      this.self = false;
    },
    setPuppeteer(this: { puppeteer: boolean }, newPuppeteer: boolean) {
      this.puppeteer = newPuppeteer;
    },
    resetPuppeteer(this: { puppeteer: boolean }) {
      this.puppeteer = false;
    },
  },
  persist: true,
});

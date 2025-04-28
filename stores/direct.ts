export const useDirectStore = defineStore('direct', {
  state: () => ({
    direct: true,
    self: false,
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
  },
  persist: true,
});

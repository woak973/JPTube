export const useDirectStore = defineStore('direct', {
  state: () => ({
    direct: true,
  }),
  actions: {
    setDirect(this: { direct: boolean }, newDirect: boolean) {
      this.direct = newDirect;
    },
    resetDirect(this: { direct: boolean }) {
      this.direct = false;
    },
  },
  persist: true,
});

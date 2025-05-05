export const useDirectStore = defineStore('direct', {
  state: () => {
    const config = useRuntimeConfig();
    return {
      direct: typeof config.public.direct === 'boolean' ? config.public.direct : false,
      self: typeof config.public.self === 'boolean' ? config.public.self : true,
    };
  },
  actions: {
    setDirect(this: { direct: boolean }, newDirect: boolean) {
      this.direct = newDirect;
    },
    resetDirect(this: { direct: boolean }) {
      const config = useRuntimeConfig();
      this.direct = typeof config.public.direct === 'boolean' ? config.public.direct : false;
    },
    setSelf(this: { self: boolean }, newSelf: boolean) {
      this.self = newSelf;
    },
    resetSelf(this: { self: boolean }) {
      const config = useRuntimeConfig();
      this.self = typeof config.public.self === 'boolean' ? config.public.self : true;
    },
  },
  persist: true,
});

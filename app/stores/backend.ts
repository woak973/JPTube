export const useBackendStore = defineStore('backend', {
  state: () => {
    const config = useRuntimeConfig();
    return {
      backend: config.public.backendHost,
    };
  },
  actions: {
    setBackend(this: { backend: string }, newBackend: string) {
      this.backend = newBackend;
    },
    resetBackend(this: { backend: string }) {
      const config = useRuntimeConfig();
      this.backend = config.public.backendHost as string;
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 400 * 24 * 60 * 60,
    }),
  },
});

export const usePlayerBackendStore = defineStore('playerbackend', {
  state: () => {
    const config = useRuntimeConfig();
    return {
      playerbackend: config.public.playerbackendHost,
    };
  },
  actions: {
    setPlayerBackend(this: { playerbackend: string }, newPlayerBackend: string) {
      this.playerbackend = newPlayerBackend;
    },
    resetPlayerBackend(this: { playerbackend: string }) {
      const config = useRuntimeConfig();
      this.playerbackend = config.public.playerbackendHost as string;
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 400 * 24 * 60 * 60,
    }),
  },
});

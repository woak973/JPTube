export const useProtocolStore = defineStore('protocol', {
  state: (): { protocol: 'https' | 'http' } => ({
    protocol: 'https',
  }),
  actions: {
    setProtocol(this: { protocol: 'https' | 'http' }, newProtocol: 'https' | 'http') {
      this.protocol = newProtocol;
    },
    resetProtocol(this: { protocol: 'https' | 'http' }) {
      this.protocol = 'https';
    },
  },
  persist: true,
});

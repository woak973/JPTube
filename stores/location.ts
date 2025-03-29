export const useLocationStore = defineStore('location', {
  state: () => ({
    location: 'US',
  }),
  actions: {
    setLocation(this: { location: string }, newLocation: string) {
      this.location = newLocation;
    },
    resetLocation(this: { location: string }) {
      this.location = 'US';
    },
  },
  persist: true,
});
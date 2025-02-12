export const useLocationStore = defineStore('location', {
  state: () => ({
    location: 'JP',
  }),
  actions: {
    setLocation(this: { location: string }, newLocation: string) {
      this.location = newLocation;
    },
    resetLocation(this: { location: string }) {
      this.location = 'JP';
    },
  },
  persist: true,
});
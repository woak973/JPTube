export const useLocationStore = defineStore('location', {
    state: () => ({
      location: 'JP',
    }),
    actions: {
      setLocation(this: { location: string }, newLocation: string) {
        this.location = newLocation;
      },
    },
    persist: true,
  });
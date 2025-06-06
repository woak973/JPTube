export type SupportedLocations =
  | 'AU' | 'BR' | 'CA' | 'FR' | 'DE' | 'IN' | 'ID' | 'IT'
  | 'NL' | 'PT' | 'RU' | 'KR' | 'ES' | 'JP' | 'GB' | 'US';

export const useLocationStore = defineStore('location', {
  state: () => ({
    location: 'US' as SupportedLocations,
  }),
  actions: {
    setLocation(this: { location: SupportedLocations }, newLocation: SupportedLocations) {
      this.location = newLocation;
    },
    resetLocation(this: { location: SupportedLocations }) {
      this.location = 'US' as SupportedLocations;
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 400 * 24 * 60 * 60,
    }),
  },
});

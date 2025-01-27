export const usePlayerStore = defineStore('player', {
    state: () => ({
      player: 'embed',
    }),
    actions: {
      setPlayer(this: { player: string }, newPlayer: string) {
        this.player = newPlayer;
      },
    },
    persist: true,
  });
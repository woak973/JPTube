export const usePlayerStore = defineStore('player', {
    state: () => ({
      player: 'shaka-player',
    }),
    actions: {
      setPlayer(this: { player: string }, newPlayer: string) {
        this.player = newPlayer;
      },
    },
    persist: true,
  });
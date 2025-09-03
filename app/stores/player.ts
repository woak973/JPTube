interface PlayerState {
  player: 'shaka-player' | 'embed' | 'VideoJS';
}

export const usePlayerStore = defineStore('player', {
  state: (): PlayerState => ({
    player: 'shaka-player',
  }),
  actions: {
    setPlayer(this: PlayerState, newPlayer: PlayerState['player']) {
      this.player = newPlayer;
    },
    resetPlayer(this: PlayerState) {
      this.player = 'shaka-player';
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 400 * 24 * 60 * 60,
    }),
  },
});

export const useBackendHistoryStore = defineStore('backendHistory', {
    state: (): { history: Array<string> } => ({
        history: [],
    }),
    actions: {
        addBackend(backend: string) {
            if (!this.history.includes(backend)) {
                this.history.push(backend);
            }
        },
        clearHistory() {
            this.history = [];
        },
        removeBackend(backend: string) {
            const index = this.history.indexOf(backend);
            if (index > -1) {
                this.history.splice(index, 1);
            }
        },
    },
});
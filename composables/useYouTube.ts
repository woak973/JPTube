export async function fetchFn(input: RequestInfo | URL, init?: RequestInit) {
  const backendStore = useBackendStore();
  const opt = {
    method: 'POST' as const,
    body: {
      input: input,
      init: init,
      host: backendStore.backend,
    },
  };
  return $fetch.raw<Response>('/api/proxy', opt);
}

export async function PlayerfetchFn(input: RequestInfo | URL, init?: RequestInit) {
  const playerbackendStore = usePlayerBackendStore();
  const opt = {
    method: 'POST' as const,
    body: {
      input: input,
      init: init,
      host: playerbackendStore.playerbackend,
    },
  };
  return $fetch.raw<Response>('/api/proxy', opt);
}

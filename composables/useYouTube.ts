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
  const respond = $fetch<Response>('/api/proxy', opt);
  console.log((await respond).bytes);
  return respond;
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
  const respond = $fetch<Response>('/api/proxy', opt);
  console.log((await respond).ok);
  return respond;
}

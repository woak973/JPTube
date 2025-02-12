function createRequest(input: RequestInfo | URL, init: RequestInit | undefined, host: string) {
    const url = typeof input === 'string' ?
        new URL(input) :
        input instanceof URL ?
            input :
            new URL(input.url);

    url.searchParams.set('__host', url.host);
    url.host = host;
    url.protocol = 'https';

    const headers = init?.headers ?
        new Headers(init.headers) :
        input instanceof Request ?
            input.headers :
            new Headers();

    // Base64エンコード
    const encodedHeaders = btoa(JSON.stringify([...headers]));
    url.searchParams.set('__headers', encodedHeaders);

    if (input instanceof Request) {
        try {
            input.duplex = 'half';
        } catch (e) {
            // Handle error
        }
    }

    const request = new Request(
        url,
        input instanceof Request ? input : undefined
    );

    headers.delete('user-agent');

    return { request, headers };
}

export function fetchFn(input: RequestInfo | URL, init?: RequestInit) {
    const backendStore = useBackendStore();
    const { request, headers } = createRequest(input, init, typeof backendStore.backend === 'string' ? backendStore.backend : 'jptube-server.onrender.com');
    return fetch(request, init ? { ...init, headers } : { headers });
}

export function PlayerfetchFn(input: RequestInfo | URL, init?: RequestInit) {
    const playerbackendStore = usePlayerBackendStore();
    const { request, headers } = createRequest(input, init, typeof playerbackendStore.playerbackend === 'string' ? playerbackendStore.playerbackend : 'official-jptube-proxy.onrender.com');
    return fetch(request, init ? { ...init, headers } : { headers });
}
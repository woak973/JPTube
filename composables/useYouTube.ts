export function fetchFn(input: RequestInfo | URL, init?: RequestInit) {
    const config = useRuntimeConfig();
    const url = typeof input === 'string' ?
        new URL(input) :
        input instanceof URL ?
            input :
            new URL(input.url);

    url.searchParams.set('__host', url.host);
    url.host = config.public.backendHost as string || 'jptube-server.onrender.com';
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

    return fetch(request, init ? {
        ...init,
        headers
    } : {
        headers
    });
}
export function getProxifiedUrl(input: RequestInfo | URL, init?: RequestInit): string {
    if (!input) {
        return ''; // デフォルトのURLまたは空文字列を返す
    }
    const backendStore = useBackendStore();
    let url: URL;

    try {
        url = typeof input === 'string' ?
            new URL(input, window.location.href) :
            input instanceof URL ?
                input :
                new URL(input.url);
    } catch (e) {
        console.error(e);
        return ''; // 無効なURLの場合は空文字列を返す
    }

    url.searchParams.set('__host', url.host);
    url.host = (backendStore.backend as string) || 'jptube-server.onrender.com';
    url.protocol = 'https';

    const headers = init?.headers ?
        new Headers(init.headers) :
        input instanceof Request ?
            input.headers :
            new Headers();

    // Base64エンコード
    const encodedHeaders = btoa(JSON.stringify([...headers]));
    url.searchParams.set('__headers', encodedHeaders);

    return url.toString();
}
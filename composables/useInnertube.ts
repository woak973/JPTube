import type { ClientType } from 'youtubei.js';
import { Innertube, UniversalCache } from 'youtubei.js';

export async function useInnertube(args: 'common' | 'player', client_type?: ClientType, unique_data?: { po_token: string | undefined; visitor_data: string }, isgenerate?: boolean) {
  const lang = useLangStore().lang || 'en';
  const location = useLocationStore().location || 'US';
  const cookie = useCookieStore().cookie || (useRuntimeConfig().public.cookie as string) || '';

  const fetchFunction = args === 'player' ? PlayerfetchFn : fetchFn;

  const yt = await Innertube.create({
    fetch: fetchFunction,
    cache: new UniversalCache(false),
    lang: lang,
    location: location,
    client_type: client_type,
    po_token: unique_data?.po_token,
    visitor_data: unique_data?.visitor_data,
    generate_session_locally: isgenerate,
    cookie: cookie,
  });

  return yt;
}

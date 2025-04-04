import type { RouterConfig } from '@nuxt/schema';

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  stringifyQuery: (query) => {
    const keys = Object.keys(query);
    return keys.map(key => `${key}=${encodeURIComponent(query[key] as string)}`).join('&');
  },
};

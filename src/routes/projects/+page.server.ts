import type { PageServerLoad } from './$types';
import { getPostsByMainCategory } from '$lib/server/content';

export const load: PageServerLoad = async () => {
  return {
    posts: await getPostsByMainCategory('projects')
  };
};

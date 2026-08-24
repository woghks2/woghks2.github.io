import type { PageServerLoad } from './$types';
import { getAllPosts, getPostCountByMainCategory } from '$lib/server/content';

const HOME_POST_LIMIT = 10;

export const load: PageServerLoad = async () => {
  const [posts, postCountByMainCategory] = await Promise.all([
    getAllPosts(),
    getPostCountByMainCategory()
  ]);

  return {
    posts,
    homePostLimit: HOME_POST_LIMIT,
    totalPostCount: posts.length,
    postCountByMainCategory
  };
};

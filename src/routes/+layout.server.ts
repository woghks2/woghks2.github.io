import type { LayoutServerLoad } from './$types';
import { getPostCountByMainCategory, getSidebarCategories } from '$lib/server/content';

export const prerender = true;
export const trailingSlash = 'always';

export const load: LayoutServerLoad = async () => {
  const [sidebarCategories, postCountByMainCategory] = await Promise.all([
    getSidebarCategories(),
    getPostCountByMainCategory()
  ]);

  return {
    sidebarCategories,
    postCountByMainCategory
  };
};

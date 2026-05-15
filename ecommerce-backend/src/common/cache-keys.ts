/** Redis keys — đồng bộ giữa ProductsService và CategoriesService */
export const PRODUCT_LIST_CACHE_KEY = 'products:list';
export const CATEGORY_LIST_CACHE_KEY = 'products:categories';

export const PRODUCT_LIST_TTL_SEC = 60;
export const CATEGORY_LIST_TTL_SEC = 300;

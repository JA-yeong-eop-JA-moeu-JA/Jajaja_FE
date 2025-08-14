import type { IGetCategoryProductsResponse, TCategorySort, TGetMainCategoryResponse, TGetSubCategoryResponse } from '@/types/category';

import axiosInstance from '@/apis/axiosInstance';

export const categoryApi = {
  getMainCategories: async (group: 'DEFAULT' | 'BUSINESS'): Promise<TGetMainCategoryResponse> => {
    const res = await axiosInstance.get('/api/categories', { params: { group } });
    return res.data;
  },
  getSubCategories: async (mainId: number): Promise<TGetSubCategoryResponse> => {
    const res = await axiosInstance.get(`/api/categories/${mainId}/subcategories`);
    return res.data;
  },
  getProductsBySubcategory: async (subcategoryId: number, sort: TCategorySort = 'NEW', page = 0, size = 20): Promise<IGetCategoryProductsResponse> => {
    try {
      const res = await axiosInstance.get(`/api/products/categories/${subcategoryId}/products`, {
        params: { sort, page, size },
      });
      return res.data;
    } catch (err: any) {
      console.error(
        '📌 [getProductsBySubcategory] API Error:',
        err.response?.status,
        err.response?.data,
        'url:',
        err.config?.url,
        'params:',
        err.config?.params,
      );
      throw err;
    }
  },
};

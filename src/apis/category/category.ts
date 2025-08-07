import type { TGetMainCategoryResponse, TGetSubCategoryResponse } from '@/types/category';

import axiosInstance from '../axiosInstance';

export const categoryApi = {
  getMainCategories: async (group: 'DEFAULT' | 'BUSINESS'): Promise<TGetMainCategoryResponse> => {
    const res = await axiosInstance.get('/api/categories', {
      params: { group },
    });
    return res.data;
  },

  getSubCategories: async (mainId: number): Promise<TGetSubCategoryResponse> => {
    const res = await axiosInstance.get(`/api/categories/${mainId}/subcategories`);
    return res.data;
  },
};

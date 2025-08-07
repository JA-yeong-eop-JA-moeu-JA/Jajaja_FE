import { useEffect, useState } from 'react';

import { categoryApi } from '@/apis/category/category';

export function useCategory(selectedGroup: 'DEFAULT' | 'BUSINESS', selectedMainId: number | null) {
  const [mainCategories, setMainCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const loadMain = async () => {
      try {
        const data = await categoryApi.getMainCategories(selectedGroup);
        if (data.isSuccess) {
          setMainCategories(data.result);
        }
      } catch (e) {
        console.error('상위 카테고리 로딩 실패:', e);
      }
    };
    loadMain();
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedMainId == null) return;
    const loadSub = async () => {
      try {
        const data = await categoryApi.getSubCategories(selectedMainId);
        if (data.isSuccess) {
          setSubCategories(data.result);
        }
      } catch (e) {
        console.error('하위 카테고리 로딩 실패:', e);
      }
    };
    loadSub();
  }, [selectedMainId]);

  return { mainCategories, subCategories };
}

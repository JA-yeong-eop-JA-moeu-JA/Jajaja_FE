import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import Storage from '@/utils/storage';
import { getHomeProduct } from '@/apis/home/product';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useHomeProduct() {
  const hasAccessToken = document.cookie.includes('accessToken');
  const category = Number(Storage.getCategory());
  const categoryId = hasAccessToken ? undefined : category;
  const { data } = useCoreQuery(QUERY_KEYS.GET_HOME_PRODUCT, () => getHomeProduct({ categoryId: categoryId }));
  return { data };
}

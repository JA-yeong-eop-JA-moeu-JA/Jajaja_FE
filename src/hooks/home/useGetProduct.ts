import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import Storage from '@/utils/storage';
import { getHomeProduct } from '@/apis/home/product';

import { useCoreQuery } from '@/hooks/customQuery';

import { useAuth } from '@/context/AuthContext';

export default function useHomeProduct() {
  const { isLoggedIn } = useAuth();
  const category = isLoggedIn ? undefined : Number(Storage.getCategory());
  const { data } = useCoreQuery(QUERY_KEYS.GET_HOME_PRODUCT, () => getHomeProduct({ categoryId: category }));
  return { data };
}

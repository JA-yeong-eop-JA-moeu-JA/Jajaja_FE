import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getRecent } from '@/apis/search/recent';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useGetRecent() {
  const { data } = useCoreQuery(QUERY_KEYS.GET_RECENT_SEARCH, () => getRecent());
  return { data };
}

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getSearchKeyword } from '@/apis/search/search';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useGetKeyword() {
  const { data } = useCoreQuery(QUERY_KEYS.GET_SEARCH_KEYWORD, () => getSearchKeyword());
  return { data };
}

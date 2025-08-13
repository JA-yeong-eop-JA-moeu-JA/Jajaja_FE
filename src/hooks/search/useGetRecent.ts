import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getRecent } from '@/apis/search/recent';

import { useCoreQuery } from '@/hooks/customQuery';

import { useAuth } from '@/context/AuthContext';

export default function useGetRecent() {
  const { isError } = useAuth();
  const { data, refetch } = useCoreQuery(QUERY_KEYS.GET_RECENT_SEARCH, () => getRecent(), { enabled: !isError, retry: false });
  return { data, refetch };
}

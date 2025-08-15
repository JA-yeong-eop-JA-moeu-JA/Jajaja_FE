import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getTeamProducts } from '@/apis/board/team';

import { useCoreQuery } from '@/hooks/customQuery';

export const useTeamProducts = (page: number) => {
  const DEFAULT_SIZE = 6;

  const queryResult = useCoreQuery([...QUERY_KEYS.GET_TEAM_PRODUCTS, page], () => getTeamProducts(page, DEFAULT_SIZE), {
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    data: queryResult.data?.result?.teams ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    isFetched: queryResult.isFetched,
    error: queryResult.error,
  };
};

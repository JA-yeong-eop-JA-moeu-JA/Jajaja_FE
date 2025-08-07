import { useCoreQuery } from '@/hooks/customQuery';
import { getTeamProducts } from '@/apis/board/team';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';
export const useTeamProducts = (page: number, size: number = 5) => {
  const queryResult = useCoreQuery(
    [...QUERY_KEYS.GET_TEAM_PRODUCTS, page],
    () => getTeamProducts(page, size),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: queryResult.data?.result?.teams ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    isFetched: queryResult.isFetched,
    error: queryResult.error,
  };

};


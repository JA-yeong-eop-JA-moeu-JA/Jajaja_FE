// src/libs/queryClient.ts
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

function isAuthRequired(err: unknown): err is { authRequired?: boolean } {
  return !!(err as any)?.authRequired;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (isAuthRequired(err)) return;
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if (isAuthRequired(err)) return;
    },
  }),

  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

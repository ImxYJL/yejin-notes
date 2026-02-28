import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        throwOnError: true,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // for SSR
      },
      mutations: {
        retry: 1,
        throwOnError: true,
      },
      dehydrate: {
        // dehydrate 시 성공한 쿼리만 포함
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

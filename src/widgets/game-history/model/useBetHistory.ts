"use client";

import { useQuery } from "@tanstack/react-query";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";

export function useBetHistory(limit = 20) {
  return useQuery({
    queryKey: PLINKO_QUERY_KEYS.betHistory({ limit }),
    queryFn: () => plinkoApi.listBets({ limit }),
  });
}

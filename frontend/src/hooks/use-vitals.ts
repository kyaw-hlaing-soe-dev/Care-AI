import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { loadDashboard, loadHistory, loadReading } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export function useVitals(limit?: number) {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["dashboard", user?.uid],
    queryFn: loadDashboard,
    enabled: Boolean(user),
    retry: 1,
  });
  const records = (query.data?.records ?? []).slice(0, limit);
  return {
    records,
    loading: query.isLoading,
    error: query.error,
    latest: records[0],
    refetch: query.refetch,
  };
}

export function useHistory(period: "all" | "7d" | "30d") {
  const { user } = useAuth();
  const query = useInfiniteQuery({
    queryKey: ["history", user?.uid, period],
    queryFn: ({ pageParam }) => loadHistory(period, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: Boolean(user),
    retry: 1,
  });
  return { ...query, records: query.data?.pages.flatMap((page) => page.records) ?? [] };
}

export function useVital(id: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["history", user?.uid, id],
    queryFn: () => loadReading(id),
    enabled: Boolean(user && id),
    retry: false,
  });
}

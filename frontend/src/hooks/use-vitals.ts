import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { loadDashboard, loadHistory, loadReading } from "@/lib/firestore-service";
import { useAuth } from "@/lib/auth-context";
import {
  createOpenRouterAnalysis,
  isOpenRouterAnalysisEnabled,
  mergeAiAnalysis,
} from "@/lib/openrouter-analysis";
import type { VitalRecord } from "@/lib/vitals";

function useAiEnhancedRecord(record: VitalRecord | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["openrouter-analysis", user?.uid, record?.id],
    queryFn: async ({ signal }) =>
      mergeAiAnalysis(record!, await createOpenRouterAnalysis(record!, signal)),
    enabled: Boolean(user && record && isOpenRouterAnalysisEnabled()),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
}

export function useVitals(limit?: number) {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["dashboard", user?.uid],
    queryFn: loadDashboard,
    enabled: Boolean(user),
    retry: 1,
  });
  const records = (query.data?.records ?? []).slice(0, limit);
  const aiLatest = useAiEnhancedRecord(records[0]);
  const latest = aiLatest.data ?? records[0];
  return {
    records,
    loading: query.isLoading,
    error: query.error,
    latest,
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
  const query = useQuery({
    queryKey: ["history", user?.uid, id],
    queryFn: () => loadReading(id),
    enabled: Boolean(user && id),
    retry: false,
  });
  const aiRecord = useAiEnhancedRecord(query.data);
  return { ...query, data: aiRecord.data ?? query.data };
}

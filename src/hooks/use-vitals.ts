import { useCallback, useEffect, useState } from "react";
import { listVitals, subscribeVitals } from "@/lib/vitals-store";
import type { VitalRecord } from "@/lib/vitals";

/** Reads records from the local store and stays in sync with writes. */
export function useVitals(limit?: number) {
  const [records, setRecords] = useState<VitalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(() => {
    try {
      setRecords(listVitals(limit));
      setError(null);
    } catch {
      setError("We couldn't load your health overview.");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    sync();
    return subscribeVitals(sync);
  }, [sync]);

  return { records, loading, latest: records[0], error, refresh: sync };
}

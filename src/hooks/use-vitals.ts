import { useEffect, useState } from "react";
import { listVitals, subscribeVitals } from "@/lib/vitals-store";
import type { VitalRecord } from "@/lib/vitals";

/** Reads records from the local store and stays in sync with writes. */
export function useVitals(limit?: number) {
  const [records, setRecords] = useState<VitalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = () => setRecords(listVitals(limit));
    sync();
    setLoading(false);
    return subscribeVitals(sync);
  }, [limit]);

  return { records, loading, latest: records[0] };
}

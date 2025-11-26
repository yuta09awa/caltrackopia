import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SyncEvent {
  id: string;
  timestamp: string;
  action: string;
  status: "success" | "failed" | "pending";
  details?: string;
}

export function useSyncStatus() {
  return useQuery<SyncEvent[]>({
    queryKey: ["sync-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, created_at, action_type, new_values")
        .in("action_type", ["SYNC_SUCCESS", "SYNC_FAILED", "SYNC_PENDING"])
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map((log) => ({
        id: log.id,
        timestamp: log.created_at || new Date().toISOString(),
        action: log.action_type,
        status: log.action_type.includes("SUCCESS")
          ? "success"
          : log.action_type.includes("FAILED")
          ? "failed"
          : "pending",
        details: log.new_values ? JSON.stringify(log.new_values).slice(0, 100) : undefined,
      }));
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

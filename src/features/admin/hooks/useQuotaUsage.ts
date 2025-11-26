import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuotaData {
  service_name: string;
  quota_used: number;
  quota_limit: number;
  quota_reset_at: string;
}

export function useQuotaUsage() {
  return useQuery<QuotaData[]>({
    queryKey: ["quota-usage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_quota_tracking")
        .select("service_name, quota_used, quota_limit, quota_reset_at")
        .order("service_name");

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000, // Refresh every minute
  });
}

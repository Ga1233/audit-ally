import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Finding = Database["public"]["Tables"]["findings"]["Row"];
type FindingInsert = Database["public"]["Tables"]["findings"]["Insert"];
type FindingUpdate = Database["public"]["Tables"]["findings"]["Update"];

export function useFindings(auditId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const findingsQuery = useQuery({
    queryKey: ["findings", auditId],
    queryFn: async () => {
      if (!auditId) return [];
      const { data, error } = await supabase
        .from("findings")
        .select("*")
        .eq("audit_id", auditId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Finding[];
    },
    enabled: !!user && !!auditId,
  });

  const createFinding = useMutation({
    mutationFn: async (finding: Omit<FindingInsert, "user_id">) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("findings")
        .insert({ ...finding, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["findings", auditId] });
      toast.success("Finding added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add finding: ${error.message}`);
    },
  });

  const updateFinding = useMutation({
    mutationFn: async ({ id, ...updates }: FindingUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("findings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["findings", auditId] });
      toast.success("Finding updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update finding: ${error.message}`);
    },
  });

  const deleteFinding = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("findings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["findings", auditId] });
      toast.success("Finding deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete finding: ${error.message}`);
    },
  });

  return {
    findings: findingsQuery.data ?? [],
    isLoading: findingsQuery.isLoading,
    error: findingsQuery.error,
    createFinding,
    updateFinding,
    deleteFinding,
  };
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ChecklistItem = Database["public"]["Tables"]["checklist_items"]["Row"];
type ChecklistItemUpdate = Database["public"]["Tables"]["checklist_items"]["Update"];

export function useChecklist(auditId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const checklistQuery = useQuery({
    queryKey: ["checklist", auditId],
    queryFn: async () => {
      if (!auditId) return [];
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("audit_id", auditId)
        .order("owasp_code", { ascending: true });

      if (error) throw error;
      return data as ChecklistItem[];
    },
    enabled: !!user && !!auditId,
  });

  const updateChecklistItem = useMutation({
    mutationFn: async ({ id, ...updates }: ChecklistItemUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("checklist_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist", auditId] });
    },
    onError: (error) => {
      toast.error(`Failed to update checklist: ${error.message}`);
    },
  });

  return {
    checklistItems: checklistQuery.data ?? [],
    isLoading: checklistQuery.isLoading,
    error: checklistQuery.error,
    updateChecklistItem,
  };
}

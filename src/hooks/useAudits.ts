import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { createChecklistItemsForAudit } from "@/lib/owasp-checklist";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Audit = Database["public"]["Tables"]["audits"]["Row"];
type AuditInsert = Database["public"]["Tables"]["audits"]["Insert"];
type AuditUpdate = Database["public"]["Tables"]["audits"]["Update"];

export function useAudits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const auditsQuery = useQuery({
    queryKey: ["audits", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Audit[];
    },
    enabled: !!user,
  });

  const createAudit = useMutation({
    mutationFn: async (audit: Omit<AuditInsert, "user_id">) => {
      if (!user) throw new Error("Not authenticated");

      // Create the audit
      const { data: newAudit, error: auditError } = await supabase
        .from("audits")
        .insert({ ...audit, user_id: user.id })
        .select()
        .single();

      if (auditError) throw auditError;

      // Create OWASP checklist items for the audit
      const checklistItems = createChecklistItemsForAudit(newAudit.id);
      const { error: checklistError } = await supabase
        .from("checklist_items")
        .insert(checklistItems);

      if (checklistError) throw checklistError;

      return newAudit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      toast.success("Audit created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create audit: ${error.message}`);
    },
  });

  const updateAudit = useMutation({
    mutationFn: async ({ id, ...updates }: AuditUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("audits")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      toast.success("Audit updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update audit: ${error.message}`);
    },
  });

  const deleteAudit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("audits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      toast.success("Audit deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete audit: ${error.message}`);
    },
  });

  return {
    audits: auditsQuery.data ?? [],
    isLoading: auditsQuery.isLoading,
    error: auditsQuery.error,
    createAudit,
    updateAudit,
    deleteAudit,
  };
}

export function useAudit(id: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["audit", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Audit;
    },
    enabled: !!user && !!id,
  });
}

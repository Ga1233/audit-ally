import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

type Finding = Database["public"]["Tables"]["findings"]["Row"];
type FindingSeverity = Database["public"]["Enums"]["finding_severity"];
type FindingStatus = Database["public"]["Enums"]["finding_status"];

interface FindingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditId: string;
  finding: Finding | null;
  onSave: (data: Partial<Finding>) => void;
}

const findingSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().max(2000).optional(),
  severity: z.enum(["critical", "high", "medium", "low", "info"]),
  status: z.enum(["open", "fixed", "accepted_risk", "false_positive"]),
  proof_of_concept: z.string().max(5000).optional(),
  remediation: z.string().max(2000).optional(),
  affected_url: z.string().max(500).optional(),
  cvss_score: z.number().min(0).max(10).optional(),
});

export function FindingDialog({
  open,
  onOpenChange,
  auditId,
  finding,
  onSave,
}: FindingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium" as FindingSeverity,
    status: "open" as FindingStatus,
    proof_of_concept: "",
    remediation: "",
    affected_url: "",
    cvss_score: "",
  });

  useEffect(() => {
    if (finding) {
      setFormData({
        title: finding.title,
        description: finding.description || "",
        severity: finding.severity,
        status: finding.status,
        proof_of_concept: finding.proof_of_concept || "",
        remediation: finding.remediation || "",
        affected_url: finding.affected_url || "",
        cvss_score: finding.cvss_score?.toString() || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        severity: "medium",
        status: "open",
        proof_of_concept: "",
        remediation: "",
        affected_url: "",
        cvss_score: "",
      });
    }
    setErrors({});
  }, [finding, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = findingSchema.parse({
        ...formData,
        cvss_score: formData.cvss_score ? parseFloat(formData.cvss_score) : undefined,
      });

      onSave({
        title: validated.title,
        description: validated.description || null,
        severity: validated.severity,
        status: validated.status,
        proof_of_concept: validated.proof_of_concept || null,
        remediation: validated.remediation || null,
        affected_url: validated.affected_url || null,
        cvss_score: validated.cvss_score ?? null,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{finding ? "Edit Finding" : "Add New Finding"}</DialogTitle>
          <DialogDescription>
            Document a security vulnerability or issue discovered during the audit
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="SQL Injection in Login Form"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-muted/50 border-border/50"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value: FindingSeverity) =>
                  setFormData({ ...formData, severity: value })
                }
              >
                <SelectTrigger className="bg-muted/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: FindingStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-muted/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="accepted_risk">Accepted Risk</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvss_score">CVSS Score</Label>
              <Input
                id="cvss_score"
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="7.5"
                value={formData.cvss_score}
                onChange={(e) => setFormData({ ...formData, cvss_score: e.target.value })}
                className="bg-muted/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affected_url">Affected URL/Endpoint</Label>
            <Input
              id="affected_url"
              placeholder="https://example.com/api/login"
              value={formData.affected_url}
              onChange={(e) => setFormData({ ...formData, affected_url: e.target.value })}
              className="bg-muted/50 border-border/50 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the vulnerability..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-muted/50 border-border/50 min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof_of_concept">Proof of Concept</Label>
            <Textarea
              id="proof_of_concept"
              placeholder="Steps to reproduce, exploit code, or request/response examples..."
              value={formData.proof_of_concept}
              onChange={(e) => setFormData({ ...formData, proof_of_concept: e.target.value })}
              className="bg-muted/50 border-border/50 min-h-24 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remediation">Remediation</Label>
            <Textarea
              id="remediation"
              placeholder="Recommended fix or mitigation steps..."
              value={formData.remediation}
              onChange={(e) => setFormData({ ...formData, remediation: e.target.value })}
              className="bg-muted/50 border-border/50 min-h-20"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : finding ? (
                "Update Finding"
              ) : (
                "Add Finding"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

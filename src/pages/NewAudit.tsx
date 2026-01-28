import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudits } from "@/hooks/useAudits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AuditStatus = Database["public"]["Enums"]["audit_status"];

const auditSchema = z.object({
  name: z.string().min(2, "Audit name must be at least 2 characters").max(100),
  client_name: z.string().min(2, "Client name must be at least 2 characters").max(100),
  target: z.string().max(255).optional(),
  description: z.string().max(1000).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["planning", "in_progress", "completed", "on_hold"]),
});

export default function NewAudit() {
  const navigate = useNavigate();
  const { createAudit } = useAudits();
  const [formData, setFormData] = useState({
    name: "",
    client_name: "",
    target: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "planning" as AuditStatus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = auditSchema.parse(formData);
      await createAudit.mutateAsync({
        name: validated.name,
        client_name: validated.client_name,
        target: validated.target || null,
        description: validated.description || null,
        start_date: validated.start_date || null,
        end_date: validated.end_date || null,
        status: validated.status,
      });
      navigate("/audits");
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
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/audits")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Audits
      </Button>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/30">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Create New Audit</CardTitle>
              <CardDescription>
                Start a new security assessment project
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Audit Name *</Label>
                <Input
                  id="name"
                  placeholder="Q1 2024 Web Application Pentest"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-muted/50 border-border/50"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  placeholder="Acme Corporation"
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData({ ...formData, client_name: e.target.value })
                  }
                  className="bg-muted/50 border-border/50"
                />
                {errors.client_name && (
                  <p className="text-sm text-destructive">{errors.client_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target (URL/IP/Scope)</Label>
              <Input
                id="target"
                placeholder="https://app.example.com"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                className="bg-muted/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the audit scope and objectives..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-muted/50 border-border/50 min-h-24"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: AuditStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-muted/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="bg-muted/50 border-border/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/audits")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={createAudit.isPending}
              >
                {createAudit.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Audit"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

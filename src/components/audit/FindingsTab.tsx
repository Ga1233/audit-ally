import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/badges/SeverityBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, AlertTriangle, Edit2, Trash2, ExternalLink } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Finding = Database["public"]["Tables"]["findings"]["Row"];

interface FindingsTabProps {
  findings: Finding[];
  isLoading: boolean;
  onAddFinding: () => void;
  onEditFinding: (finding: Finding) => void;
  onDeleteFinding: (id: string) => void;
}

export function FindingsTab({
  findings,
  isLoading,
  onAddFinding,
  onEditFinding,
  onDeleteFinding,
}: FindingsTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  // Sort findings by severity
  const severityOrder = ["critical", "high", "medium", "low", "info"];
  const sortedFindings = [...findings].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-severity-high" />
              Security Findings
            </CardTitle>
            <CardDescription>
              Discovered vulnerabilities and security issues
            </CardDescription>
          </div>
          <Button onClick={onAddFinding}>
            <Plus className="w-4 h-4 mr-2" />
            Add Finding
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedFindings.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No findings yet</h3>
            <p className="text-muted-foreground mb-4">
              Start documenting security vulnerabilities as you discover them
            </p>
            <Button onClick={onAddFinding}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Finding
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedFindings.map((finding) => (
              <div
                key={finding.id}
                className="p-4 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold">{finding.title}</h4>
                      <SeverityBadge severity={finding.severity} />
                      <StatusBadge status={finding.status} />
                      {finding.cvss_score && (
                        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                          CVSS: {finding.cvss_score}
                        </span>
                      )}
                    </div>
                    {finding.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {finding.description}
                      </p>
                    )}
                    {finding.affected_url && (
                      <p className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {finding.affected_url}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditFinding(finding)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Finding</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{finding.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteFinding(finding.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

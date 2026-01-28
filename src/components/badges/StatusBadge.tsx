import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FindingStatus = "open" | "fixed" | "accepted_risk" | "false_positive";

interface StatusBadgeProps {
  status: FindingStatus;
  className?: string;
}

const statusConfig: Record<FindingStatus, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "bg-status-open/20 text-status-open border-status-open/50",
  },
  fixed: {
    label: "Fixed",
    className: "bg-status-fixed/20 text-status-fixed border-status-fixed/50",
  },
  accepted_risk: {
    label: "Accepted Risk",
    className: "bg-status-accepted/20 text-status-accepted border-status-accepted/50",
  },
  false_positive: {
    label: "False Positive",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

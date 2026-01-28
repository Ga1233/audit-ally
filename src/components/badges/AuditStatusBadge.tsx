import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AuditStatus = "planning" | "in_progress" | "completed" | "on_hold";

interface AuditStatusBadgeProps {
  status: AuditStatus;
  className?: string;
}

const statusConfig: Record<AuditStatus, { label: string; className: string }> = {
  planning: {
    label: "Planning",
    className: "bg-audit-planning/20 text-audit-planning border-audit-planning/50",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-audit-in-progress/20 text-audit-in-progress border-audit-in-progress/50",
  },
  completed: {
    label: "Completed",
    className: "bg-audit-completed/20 text-audit-completed border-audit-completed/50",
  },
  on_hold: {
    label: "On Hold",
    className: "bg-audit-on-hold/20 text-audit-on-hold border-audit-on-hold/50",
  },
};

export function AuditStatusBadge({ status, className }: AuditStatusBadgeProps) {
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

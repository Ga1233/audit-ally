import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Severity = "critical" | "high" | "medium" | "low" | "info";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className: "bg-severity-critical text-white border-severity-critical",
  },
  high: {
    label: "High",
    className: "bg-severity-high text-black border-severity-high",
  },
  medium: {
    label: "Medium",
    className: "bg-severity-medium text-black border-severity-medium",
  },
  low: {
    label: "Low",
    className: "bg-severity-low text-black border-severity-low",
  },
  info: {
    label: "Info",
    className: "bg-severity-info text-white border-severity-info",
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <Badge
      variant="outline"
      className={cn("font-semibold text-xs", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

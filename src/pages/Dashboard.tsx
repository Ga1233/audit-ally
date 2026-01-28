import { Link } from "react-router-dom";
import { useAudits } from "@/hooks/useAudits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import { 
  Shield, 
  FolderOpen, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus,
  Activity,
  Target
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { audits, isLoading } = useAudits();

  const stats = {
    total: audits.length,
    inProgress: audits.filter((a) => a.status === "in_progress").length,
    completed: audits.filter((a) => a.status === "completed").length,
    planning: audits.filter((a) => a.status === "planning").length,
  };

  const recentAudits = audits.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your security audits and findings
          </p>
        </div>
        <Link to="/audits/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Audit
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Audits
            </CardTitle>
            <FolderOpen className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time audits
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
            <Activity className="w-5 h-5 text-audit-in-progress" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-audit-in-progress">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active engagements
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-audit-completed" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-audit-completed">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Finished audits
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Planning
            </CardTitle>
            <Clock className="w-5 h-5 text-audit-planning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-audit-planning">{stats.planning}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Upcoming audits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audits */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Recent Audits
              </CardTitle>
              <CardDescription>Your latest security assessments</CardDescription>
            </div>
            <Link to="/audits">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentAudits.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No audits yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first security audit
              </p>
              <Link to="/audits/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Audit
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAudits.map((audit) => (
                <Link
                  key={audit.id}
                  to={`/audits/${audit.id}`}
                  className="block p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{audit.name}</h4>
                        <AuditStatusBadge status={audit.status} />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {audit.client_name}
                        {audit.target && ` • ${audit.target}`}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {new Date(audit.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* OWASP Quick Reference */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-severity-high" />
            OWASP Top 10 Quick Reference
          </CardTitle>
          <CardDescription>
            Each audit includes a comprehensive OWASP Top 10 2021 checklist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { code: "A01", name: "Broken Access Control" },
              { code: "A02", name: "Cryptographic Failures" },
              { code: "A03", name: "Injection" },
              { code: "A04", name: "Insecure Design" },
              { code: "A05", name: "Security Misconfiguration" },
              { code: "A06", name: "Vulnerable Components" },
              { code: "A07", name: "Auth Failures" },
              { code: "A08", name: "Data Integrity" },
              { code: "A09", name: "Logging Failures" },
              { code: "A10", name: "SSRF" },
            ].map((item) => (
              <div
                key={item.code}
                className="px-3 py-2 bg-muted/30 rounded-lg border border-border/50"
              >
                <span className="text-primary font-mono text-xs">{item.code}</span>
                <p className="text-xs text-muted-foreground truncate">{item.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

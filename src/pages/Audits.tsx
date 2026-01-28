import { useState } from "react";
import { Link } from "react-router-dom";
import { useAudits } from "@/hooks/useAudits";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
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
import { 
  Plus, 
  Search, 
  FolderOpen, 
  Calendar, 
  Trash2,
  Target,
  Building2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Audits() {
  const { audits, isLoading, deleteAudit } = useAudits();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.name.toLowerCase().includes(search.toLowerCase()) ||
      audit.client_name.toLowerCase().includes(search.toLowerCase()) ||
      audit.target?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audits</h1>
          <p className="text-muted-foreground">
            Manage your security audit projects
          </p>
        </div>
        <Link to="/audits/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Audit
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search audits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-muted/50 border-border/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Audits List */}
      {filteredAudits.length === 0 ? (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No audits found</h3>
            <p className="text-muted-foreground mb-4">
              {search || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first security audit to get started"}
            </p>
            {!search && statusFilter === "all" && (
              <Link to="/audits/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Audit
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAudits.map((audit) => (
            <Card
              key={audit.id}
              className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <Link to={`/audits/${audit.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold truncate hover:text-primary transition-colors">
                        {audit.name}
                      </h3>
                      <AuditStatusBadge status={audit.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {audit.client_name}
                      </span>
                      {audit.target && (
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {audit.target}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono text-xs">
                        <Calendar className="w-4 h-4" />
                        {new Date(audit.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link to={`/audits/${audit.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Audit</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{audit.name}"? This will permanently remove all findings and attachments. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteAudit.mutate(audit.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckSquare, Save, Info } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ChecklistItem = Database["public"]["Tables"]["checklist_items"]["Row"];

interface ChecklistTabProps {
  items: ChecklistItem[];
  isLoading: boolean;
  onUpdateItem: (data: { id: string; checked?: boolean; notes?: string | null }) => void;
}

export function ChecklistTab({ items, isLoading, onUpdateItem }: ChecklistTabProps) {
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const handleSaveNotes = (itemId: string) => {
    onUpdateItem({ id: itemId, notes: notesValue || null });
    setEditingNotes(null);
    setNotesValue("");
  };

  const checkedCount = items.filter((item) => item.checked).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              OWASP Top 10 (2021) Checklist
            </CardTitle>
            <CardDescription>
              Comprehensive security assessment checklist based on OWASP Top 10
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {checkedCount}/{items.length}
            </p>
            <p className="text-xs text-muted-foreground">completed</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border border-border/50 rounded-lg overflow-hidden bg-muted/20"
            >
              <div className="flex items-center px-4 py-3">
                <Checkbox
                  id={`check-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={(checked) =>
                    onUpdateItem({ id: item.id, checked: checked as boolean })
                  }
                  className="mr-4"
                />
                <AccordionTrigger className="flex-1 hover:no-underline py-0">
                  <div className="flex items-center gap-3 text-left">
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {item.owasp_code}
                    </span>
                    <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>
              </div>
              <AccordionContent className="px-4 pb-4">
                <div className="ml-8 space-y-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{item.description}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    {editingNotes === item.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          placeholder="Add notes about your testing..."
                          className="bg-muted/50 border-border/50 min-h-20"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveNotes(item.id)}
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingNotes(null);
                              setNotesValue("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingNotes(item.id);
                          setNotesValue(item.notes || "");
                        }}
                        className="p-3 rounded-lg bg-muted/30 border border-border/50 cursor-pointer hover:border-primary/30 transition-colors min-h-12"
                      >
                        {item.notes ? (
                          <p className="text-sm whitespace-pre-wrap">{item.notes}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Click to add notes...</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

import { Brain, FileText, Mail, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatWhen, kindLabel, type NexaItem } from "@/lib/store";

const ICONS = { email: Mail, meeting: FileText, research: Brain };

export function ItemCard({
  item,
  onDelete,
  onCopy,
}: {
  item: NexaItem;
  onDelete: () => void;
  onCopy?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[item.kind];

  return (
    <article className="glass-card glow-hover rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {kindLabel[item.kind]}
            {item.demo && <span className="ml-2 text-muted-foreground">Sample</span>}
          </p>
          <h3 className="mt-1 font-display text-base font-semibold text-foreground">{item.title}</h3>
          <p className="text-xs text-muted-foreground">{formatWhen(item.createdAt)}</p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.preview}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
              Open
            </Button>
            {onCopy && (
              <Button size="sm" variant="outline" onClick={onCopy}>
                Copy
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onDelete} aria-label={`Delete ${item.title}`}>
              <Trash2 className="size-4" aria-hidden="true" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{item.title}</DialogTitle>
            <DialogDescription>
              {kindLabel[item.kind]} · {formatWhen(item.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-muted-foreground">
            {item.content}
          </pre>
        </DialogContent>
      </Dialog>
    </article>
  );
}

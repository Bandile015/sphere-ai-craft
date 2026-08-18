import { ShieldCheck } from "lucide-react";

export function ResponsibleAi({ variant = "default" }: { variant?: "default" | "research" }) {
  return (
    <aside className="glass-card rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div className="space-y-1.5">
          <h2 className="font-display text-sm font-semibold text-foreground">Responsible AI</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            NEXA AI provides AI-generated assistance for productivity purposes. AI-generated content
            may contain errors or inaccuracies. Users should review and verify important information
            before relying on it or sharing it professionally.
          </p>
          {variant === "research" && (
            <p className="text-sm leading-relaxed text-accent">
              AI-generated research should be verified against reliable sources before being used for
              important decisions.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

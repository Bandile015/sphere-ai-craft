import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Copy, Eraser, Mail, Pencil, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiHead } from "@/components/nexa/AiHead";
import { AiLoading } from "@/components/nexa/AiLoading";
import { PageHeader } from "@/components/nexa/PageHeader";
import { ResponsibleAi } from "@/components/nexa/ResponsibleAi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator · NEXA AI" },
      {
        name: "description",
        content: "Create professional workplace emails with AI-controlled tone, purpose and length.",
      },
      { property: "og:title", content: "Smart Email Generator · NEXA AI" },
      {
        property: "og:description",
        content: "Generate professional workplace emails in seconds with NEXA AI.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive", "Professional", "Concise"];
const PURPOSES = ["Request", "Follow-up", "Apology", "Announcement", "Meeting", "Thank you", "Other"];
const LENGTHS = ["Short", "Medium", "Detailed"];

type EmailResult = { subject: string; greeting: string; body: string; closing: string };

function EmailPage() {
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("Professional");
  const [purpose, setPurpose] = useState("Request");
  const [length, setLength] = useState("Medium");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const generate = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: (input: { context: string; tone: string; purpose: string; length: string }) =>
      generate({ data: input }),
    onSuccess: (data) => {
      setResult(data);
      setEditing(false);
      store.addHistory({
        kind: "email",
        title: data.subject || "Generated email",
        preview: `${data.greeting} ${data.body}`.slice(0, 140),
        content: asText(data),
      });
      toast.success("Email generated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function asText(data: EmailResult) {
    return `Subject: ${data.subject}\n\n${data.greeting}\n\n${data.body}\n\n${data.closing}`;
  }

  function submit() {
    if (!context.trim()) {
      toast.error("Please provide some information before asking the AI to generate a response.");
      return;
    }
    mutation.mutate({ context, tone, purpose, length });
  }

  const text = result ? (editing ? draft : asText(result)) : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Email Generator"
        subtitle="Create professional workplace emails with AI."
        icon={<Mail className="size-6" aria-hidden="true" />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-card space-y-6 rounded-2xl p-6">
          <div className="space-y-2">
            <Label htmlFor="email-context">Recipient / Context — what is this email about?</Label>
            <Textarea
              id="email-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={7}
              placeholder="Example: I need to request a meeting with my manager to discuss my project progress."
              className="resize-y bg-background/60"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">Tone</legend>
            <div className="flex flex-wrap gap-2">
              {TONES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTone(option)}
                  aria-pressed={tone === option}
                  className={cn(
                    "min-h-9 rounded-full border px-4 text-sm transition-colors",
                    tone === option
                      ? "border-primary/50 bg-primary/20 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email-purpose">Email purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger id="email-purpose" className="bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-length">Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger id="email-length" className="bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={submit}
            disabled={mutation.isPending}
            size="lg"
            className="w-full bg-gradient-ai text-primary-foreground"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {mutation.isPending ? "Generating..." : "Generate Email"}
          </Button>
        </section>

        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-foreground">AI Generated Email</h2>
            <AiHead size={52} animated={mutation.isPending} />
          </div>

          {mutation.isPending ? (
            <AiLoading label="Drafting your email" />
          ) : result ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border bg-background/70 p-5">
                {editing ? (
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={16}
                    aria-label="Edit generated email"
                    className="bg-transparent"
                  />
                ) : (
                  <article className="space-y-4 text-sm leading-relaxed text-foreground">
                    <p className="border-b border-border pb-3 font-display text-base font-semibold">
                      {result.subject}
                    </p>
                    <p>{result.greeting}</p>
                    {result.body.split(/\n{2,}/).map((para, i) => (
                      <p key={i} className="whitespace-pre-line text-muted-foreground">
                        {para}
                      </p>
                    ))}
                    <p className="whitespace-pre-line">{result.closing}</p>
                  </article>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    void navigator.clipboard.writeText(text);
                    toast.success("Email copied");
                  }}
                >
                  <Copy className="size-4" aria-hidden="true" /> Copy
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => mutation.mutate({ context, tone, purpose, length })}
                >
                  <RefreshCw className="size-4" aria-hidden="true" /> Regenerate
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDraft(text);
                    setEditing((e) => !e);
                  }}
                >
                  <Pencil className="size-4" aria-hidden="true" /> {editing ? "Done" : "Edit"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setResult(null);
                    setEditing(false);
                  }}
                >
                  <Eraser className="size-4" aria-hidden="true" /> Clear
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    store.save({
                      kind: "email",
                      title: result.subject || "Generated email",
                      preview: text.slice(0, 140),
                      content: text,
                    });
                    toast.success("Saved to Saved Results");
                  }}
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Generated by NEXA AI</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AiHead size={110} animated />
              <p className="font-display text-base text-foreground">Your AI assistant is ready</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Describe your email context on the left and NEXA AI will draft it for you.
              </p>
            </div>
          )}
        </section>
      </div>

      <ResponsibleAi />
    </div>
  );
}

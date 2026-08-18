import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { BookOpen, Brain, Copy, Lightbulb, ListChecks, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiHead } from "@/components/nexa/AiHead";
import { AiLoading } from "@/components/nexa/AiLoading";
import { PageHeader } from "@/components/nexa/PageHeader";
import { ResponsibleAi } from "@/components/nexa/ResponsibleAi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runResearch } from "@/lib/ai.functions";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant · NEXA AI" },
      {
        name: "description",
        content:
          "Research topics, generate key findings, insights and recommendations with the NEXA AI research assistant.",
      },
      { property: "og:title", content: "AI Research Assistant · NEXA AI" },
      {
        property: "og:description",
        content: "Explore topics and generate actionable workplace insights with AI.",
      },
    ],
  }),
  component: ResearchPage,
});

const MODES = ["Quick Summary", "Detailed Research", "Key Insights", "Recommendations", "Pros & Cons"];

type ResearchResult = {
  overview: string;
  findings: Array<{ title: string; detail: string }>;
  insights: string[];
  recommendations: string[];
  takeaways: string[];
  sources: Array<{ name: string; note: string }>;
};

function asText(r: ResearchResult) {
  return [
    "OVERVIEW",
    r.overview,
    "",
    "KEY FINDINGS",
    ...r.findings.map((f) => `- ${f.title}: ${f.detail}`),
    "",
    "INSIGHTS",
    ...r.insights.map((i) => `- ${i}`),
    "",
    "RECOMMENDATIONS",
    ...r.recommendations.map((i) => `- ${i}`),
    "",
    "KEY TAKEAWAYS",
    ...r.takeaways.map((i) => `- ${i}`),
  ].join("\n");
}

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("Quick Summary");
  const [result, setResult] = useState<ResearchResult | null>(null);

  const research = useServerFn(runResearch);
  const mutation = useMutation({
    mutationFn: () => research({ data: { topic, mode } }),
    onSuccess: (data) => {
      setResult(data);
      store.addHistory({
        kind: "research",
        title: topic.slice(0, 60) || "Research task",
        preview: data.overview.slice(0, 140),
        content: asText(data),
      });
      toast.success("Research ready");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function submit() {
    if (!topic.trim()) {
      toast.error("Please provide some information before asking the AI to generate a response.");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Research Assistant"
        subtitle="Explore topics, understand information and generate actionable insights."
        icon={<Brain className="size-6" aria-hidden="true" />}
      />

      <section className="glass-card space-y-5 rounded-2xl p-6">
        <div className="space-y-2">
          <Label htmlFor="research-topic">What would you like to research?</Label>
          <Textarea
            id="research-topic"
            rows={5}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Explain how artificial intelligence is changing workplace productivity."
            className="bg-background/60"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">Research mode</legend>
          <div className="flex flex-wrap gap-2">
            {MODES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                aria-pressed={mode === option}
                className={cn(
                  "min-h-9 rounded-full border px-4 text-sm transition-colors",
                  mode === option
                    ? "border-primary/50 bg-primary/20 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <Button
          onClick={submit}
          disabled={mutation.isPending}
          size="lg"
          className="bg-gradient-ai text-primary-foreground"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {mutation.isPending ? "Researching..." : "Research with AI"}
        </Button>
      </section>

      {mutation.isPending && (
        <section className="glass-card rounded-2xl p-6">
          <AiLoading label="Researching your topic" />
        </section>
      )}

      {!mutation.isPending && !result && (
        <section className="glass-card flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <AiHead size={120} animated />
          <p className="font-display text-base text-foreground">Your AI assistant is ready</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Ask a research question and NEXA AI will build a structured report for you.
          </p>
        </section>
      )}

      {!mutation.isPending && result && (
        <div className="space-y-5">
          <section className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Overview</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {result.overview}
                </p>
              </div>
              <AiHead size={56} />
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <ListChecks className="size-5 text-primary" aria-hidden="true" /> Key Findings
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {result.findings.map((f, i) => (
                <article key={i} className="rounded-2xl border border-border bg-background/60 p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <section className="glass-card rounded-2xl p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <Lightbulb className="size-5 text-accent" aria-hidden="true" /> Insights
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {result.insights.map((i, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">AI-generated interpretation.</p>
            </section>

            <section className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Recommendations</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {result.recommendations.map((i, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    {i}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Key Takeaways</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.takeaways.map((t, i) => (
                <p
                  key={i}
                  className="rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm text-foreground"
                >
                  {t}
                </p>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <BookOpen className="size-5 text-primary" aria-hidden="true" /> Sources / References
            </h2>
            {result.sources.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {result.sources.map((s, i) => (
                  <li key={i}>
                    <span className="text-foreground">{s.name}</span> — {s.note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No verified external sources were provided for this report.
              </p>
            )}
            <p className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3 text-xs text-foreground">
              Sections above are AI-generated and are not verified external sources. AI-generated
              research should be verified against reliable sources before being used for important
              decisions.
            </p>
          </section>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                void navigator.clipboard.writeText(asText(result));
                toast.success("Report copied");
              }}
            >
              <Copy className="size-4" aria-hidden="true" /> Copy
            </Button>
            <Button variant="secondary" onClick={() => mutation.mutate()}>
              <RefreshCw className="size-4" aria-hidden="true" /> Regenerate
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                store.save({
                  kind: "research",
                  title: topic.slice(0, 60) || "Research task",
                  preview: result.overview.slice(0, 140),
                  content: asText(result),
                });
                toast.success("Saved to Saved Results");
              }}
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Generated by NEXA AI</p>
        </div>
      )}

      <ResponsibleAi variant="research" />
    </div>
  );
}

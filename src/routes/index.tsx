import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Clock, FileText, Mail, Search, Sparkles, TrendingUp } from "lucide-react";

import { AiHead } from "@/components/nexa/AiHead";
import { ResponsibleAi } from "@/components/nexa/ResponsibleAi";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXA AI Dashboard · AI Productivity Command Centre" },
      {
        name: "description",
        content:
          "Automate repetitive workplace tasks with NEXA AI: smart email writing, meeting summaries and AI research from one dashboard.",
      },
      { property: "og:title", content: "NEXA AI Dashboard" },
      {
        property: "og:description",
        content: "One AI workspace for email writing, meeting summaries and research.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Emails Generated", value: "24", icon: Mail, trend: "+6 this week" },
  { label: "Meetings Summarized", value: "12", icon: FileText, trend: "+3 this week" },
  { label: "Research Tasks", value: "18", icon: Search, trend: "+5 this week" },
  { label: "Time Saved", value: "8.4 hrs", icon: Clock, trend: "vs. manual work" },
];

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description:
      "Create professional emails in seconds with AI-powered tone and context control.",
    cta: "Generate Email",
  },
  {
    to: "/meetings",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    description:
      "Turn lengthy meeting notes into concise summaries, decisions, action items and deadlines.",
    cta: "Summarize Notes",
  },
  {
    to: "/research",
    icon: Brain,
    title: "AI Research Assistant",
    description:
      "Research topics, summarize information and generate useful insights and recommendations.",
    cta: "Start Research",
  },
] as const;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <span className="ai-orb -right-20 -top-24 size-80 bg-primary" />
        <div className="relative flex flex-col-reverse items-start gap-8 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-foreground">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              {greeting()} 👋 Your AI productivity assistant is ready.
            </p>
            <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
              Work Smarter.
              <br />
              <span className="text-gradient-ai">Let AI Handle the Busywork.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              NEXA AI brings intelligent writing, meeting analysis and research assistance into one
              powerful productivity workspace. Automate repetitive workplace tasks, turn information
              into insights, and get more done with AI.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-ai text-primary-foreground">
                <Link to="/email">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Start Creating
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/research">Explore AI Tools</Link>
              </Button>
            </div>
          </div>
          <AiHead size={200} animated priority className="mx-auto lg:mx-0" />
        </div>
      </section>

      <section aria-labelledby="overview-heading">
        <h2
          id="overview-heading"
          className="mb-4 font-display text-lg font-semibold text-foreground"
        >
          Productivity overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => (
            <article key={stat.label} className="glass-card glow-hover rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <stat.icon className="size-5" aria-hidden="true" />
                </span>
                <TrendingUp className="size-4 text-accent" aria-hidden="true" />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-xs text-primary">{stat.trend}</p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Sample data shown for demonstration purposes.
        </p>
      </section>

      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="mb-4 font-display text-lg font-semibold text-foreground">
          AI tools
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <article key={tool.to} className="glass-card glow-hover flex flex-col rounded-2xl p-6">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-ai text-primary-foreground shadow-[var(--shadow-glow)]">
                <tool.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {tool.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
              <Button asChild className="mt-6 bg-gradient-ai text-primary-foreground">
                <Link to={tool.to}>{tool.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <ResponsibleAi />
    </div>
  );
}

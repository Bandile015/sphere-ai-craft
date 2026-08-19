import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";

import { AiHead } from "@/components/nexa/AiHead";
import { PageHeader } from "@/components/nexa/PageHeader";
import { ResponsibleAi } from "@/components/nexa/ResponsibleAi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Guidance · NEXA AI" },
      {
        name: "description",
        content: "Learn how to use the NEXA AI email generator, meeting summarizer and research assistant.",
      },
      { property: "og:title", content: "Help & Guidance · NEXA AI" },
      { property: "og:description", content: "Guidance for getting the most out of NEXA AI." },
    ],
  }),
  component: HelpPage,
});

const FAQS = [
  {
    q: "How do I write a good email prompt?",
    a: "Describe who the email is for and what outcome you want. NEXA AI never invents names, dates or commitments, so include any detail that must appear in the message.",
  },
  {
    q: "What does the meeting summarizer extract?",
    a: "An executive summary, key decisions, an action item table with owners and deadlines, and any dates detected. Anything not stated in your notes is marked as 'Not specified'.",
  },
  {
    q: "Can I trust the research output?",
    a: "Treat it as a starting point. The assistant separates facts from interpretation and does not fabricate citations, but AI-generated research should always be verified against reliable sources.",
  },
  {
    q: "Where are my results stored?",
    a: "Generated outputs appear in History, and anything you press Save on appears in Saved Results, stored locally in this browser for the demonstration.",
  },
  {
    q: "What if something goes wrong?",
    a: "If the AI service is temporarily unavailable or a request fails, you will see a message in the corner of the screen. Wait a moment and try again.",
  },
];

function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help"
        subtitle="Everything you need to get more out of your AI assistant."
        icon={<HelpCircle className="size-6" aria-hidden="true" />}
      />

      <section className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 text-center sm:flex-row sm:text-left">
        <AiHead size={110} animated />
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Three tools, one workspace
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Start with the{" "}
            <Link to="/email" className="text-primary underline-offset-4 hover:underline">
              Smart Email Generator
            </Link>
            , condense discussions in the{" "}
            <Link to="/meetings" className="text-primary underline-offset-4 hover:underline">
              Meeting Notes Summarizer
            </Link>
            , and build understanding with the{" "}
            <Link to="/research" className="text-primary underline-offset-4 hover:underline">
              AI Research Assistant
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-3">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <ResponsibleAi />
    </div>
  );
}

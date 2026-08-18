import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import {
  CalendarClock,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiHead } from "@/components/nexa/AiHead";
import { AiLoading } from "@/components/nexa/AiLoading";
import { PageHeader } from "@/components/nexa/PageHeader";
import { ResponsibleAi } from "@/components/nexa/ResponsibleAi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";
import { store } from "@/lib/store";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer · NEXA AI" },
      {
        name: "description",
        content:
          "Turn lengthy meeting notes into executive summaries, decisions, action items and deadlines with AI.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer · NEXA AI" },
      {
        property: "og:description",
        content: "Extract decisions, owners and deadlines from meeting notes automatically.",
      },
    ],
  }),
  component: MeetingsPage,
});

type MeetingResult = {
  summary: string;
  decisions: string[];
  actionItems: Array<{ task: string; owner: string; deadline: string; status: string }>;
  dates: Array<{ label: string; date: string }>;
};

function asText(r: MeetingResult) {
  return [
    "EXECUTIVE SUMMARY",
    r.summary,
    "",
    "KEY DECISIONS",
    ...r.decisions.map((d) => `- ${d}`),
    "",
    "ACTION ITEMS",
    ...r.actionItems.map((a) => `- ${a.task} | ${a.owner} | ${a.deadline} | ${a.status}`),
    "",
    "IMPORTANT DATES",
    ...r.dates.map((d) => `- ${d.label}: ${d.date}`),
  ].join("\n");
}

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [result, setResult] = useState<MeetingResult | null>(null);

  const summarize = useServerFn(summarizeMeeting);
  const mutation = useMutation({
    mutationFn: () =>
      summarize({
        data: {
          notes,
          ...(title ? { title } : {}),
          ...(date ? { date } : {}),
          ...(participants ? { participants } : {}),
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      store.addHistory({
        kind: "meeting",
        title: title || "Meeting summary",
        preview: data.summary.slice(0, 140),
        content: asText(data),
      });
      toast.success("Meeting summarized");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function submit() {
    if (!notes.trim()) {
      toast.error("Please provide some information before asking the AI to generate a response.");
      return;
    }
    mutation.mutate();
  }

  function exportTxt() {
    if (!result) return;
    const blob = new Blob([asText(result)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "meeting-summary"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meeting Notes Summarizer"
        subtitle="Turn lengthy meeting notes into clear, actionable information."
        icon={<FileText className="size-6" aria-hidden="true" />}
      />

      <section className="glass-card space-y-5 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Meeting title (optional)</Label>
            <Input
              id="meeting-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project planning meeting"
              className="bg-background/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-date">Meeting date (optional)</Label>
            <Input
              id="meeting-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-participants">Participants (optional)</Label>
            <Input
              id="meeting-participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Lerato, Thabo, Sipho"
              className="bg-background/60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meeting-notes">Meeting notes</Label>
          <Textarea
            id="meeting-notes"
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes here..."
            className="bg-background/60"
          />
        </div>

        <Button
          onClick={submit}
          disabled={mutation.isPending}
          size="lg"
          className="bg-gradient-ai text-primary-foreground"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {mutation.isPending ? "Summarizing..." : "Summarize Meeting"}
        </Button>
      </section>

      {mutation.isPending && (
        <section className="glass-card rounded-2xl p-6">
          <AiLoading label="Analysing your meeting notes" />
        </section>
      )}

      {!mutation.isPending && !result && (
        <section className="glass-card flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <AiHead size={120} animated />
          <p className="font-display text-base text-foreground">Your AI assistant is ready</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Paste notes above and NEXA AI will extract the summary, decisions, action items and
            deadlines.
          </p>
        </section>
      )}

      {!mutation.isPending && result && (
        <div className="space-y-5">
          <section className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Executive Summary</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {result.summary}
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Key Decisions</h2>
            <ul className="mt-3 space-y-2">
              {result.decisions.map((d, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
              {result.decisions.length === 0 && (
                <li className="text-sm text-muted-foreground">No decisions stated in the notes.</li>
              )}
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Action Items</h2>
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.actionItems.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-foreground">{item.task}</TableCell>
                      <TableCell>{item.owner}</TableCell>
                      <TableCell>{item.deadline}</TableCell>
                      <TableCell>
                        <span className="rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-xs text-foreground">
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {result.actionItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>No action items stated in the notes.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Important Dates / Deadlines
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.dates.map((d, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm"
                >
                  <CalendarClock className="size-4 text-accent" aria-hidden="true" />
                  <p className="mt-2 font-medium text-foreground">{d.label}</p>
                  <p className="text-muted-foreground">{d.date}</p>
                </article>
              ))}
              {result.dates.length === 0 && (
                <p className="text-sm text-muted-foreground">No dates detected in the notes.</p>
              )}
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                void navigator.clipboard.writeText(asText(result));
                toast.success("Summary copied");
              }}
            >
              <Copy className="size-4" aria-hidden="true" /> Copy Summary
            </Button>
            <Button variant="secondary" onClick={() => mutation.mutate()}>
              <RefreshCw className="size-4" aria-hidden="true" /> Regenerate
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                store.save({
                  kind: "meeting",
                  title: title || "Meeting summary",
                  preview: result.summary.slice(0, 140),
                  content: asText(result),
                });
                toast.success("Saved to Saved Results");
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={exportTxt}>
              <Download className="size-4" aria-hidden="true" /> Export
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Generated by NEXA AI</p>
        </div>
      )}

      <ResponsibleAi />
    </div>
  );
}

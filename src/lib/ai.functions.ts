import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.6-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const EmailInput = z.object({
  context: z.string().min(1),
  tone: z.string(),
  purpose: z.string(),
  length: z.string(),
});

const MeetingInput = z.object({
  notes: z.string().min(1),
  title: z.string().optional(),
  date: z.string().optional(),
  participants: z.string().optional(),
});

const ResearchInput = z.object({
  topic: z.string().min(1),
  mode: z.string(),
});

type GatewayMessage = { role: "system" | "user"; content: string };

async function callGateway(messages: GatewayMessage[], json: boolean) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI service temporarily unavailable. Please try again shortly.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`AI gateway failed [${res.status}]: ${body}`);
    if (res.status === 429)
      throw new Error("Too many AI requests right now. Please try again in a moment.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted for this workspace. Please add credits to continue.");
    throw new Error("Something went wrong while generating your response. Please try again.");
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return JSON.parse(start >= 0 ? cleaned.slice(start, end + 1) : cleaned) as T;
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway(
      [
        {
          role: "system",
          content: [
            "You are NEXA AI, a professional workplace writing assistant.",
            "Generate a professional email based ONLY on the provided context.",
            "Do not invent facts, names, dates, numbers, commitments or information the user did not provide.",
            "Use placeholders like [Manager's Name] when a detail is genuinely missing.",
            "Maintain the requested tone and length exactly.",
            'Return strict JSON: {"subject": string, "greeting": string, "body": string, "closing": string}.',
            "The body may contain multiple paragraphs separated by blank lines.",
          ].join(" "),
        },
        {
          role: "user",
          content: [
            `Email purpose: ${data.purpose}`,
            `Tone: ${data.tone}`,
            `Desired length: ${data.length}`,
            `Recipient / context provided by the user: ${data.context}`,
          ].join("\n"),
        },
      ],
      true,
    );

    return parseJson<{ subject: string; greeting: string; body: string; closing: string }>(raw);
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway(
      [
        {
          role: "system",
          content: [
            "You are NEXA AI, a meeting analysis assistant.",
            "Summarize ONLY information contained in the supplied notes.",
            "Never invent decisions, owners, deadlines or participants that are not stated.",
            "If an owner or deadline is not stated, use the string 'Not specified'.",
            "Return strict JSON with this shape:",
            '{"summary": string, "decisions": string[], "actionItems": [{"task": string, "owner": string, "deadline": string, "status": string}], "dates": [{"label": string, "date": string}]}',
            "status must be one of: Not started, In progress, Blocked, Done — inferred only from the notes, otherwise 'Not started'.",
          ].join(" "),
        },
        {
          role: "user",
          content: [
            data.title ? `Meeting title: ${data.title}` : "",
            data.date ? `Meeting date: ${data.date}` : "",
            data.participants ? `Participants: ${data.participants}` : "",
            "Meeting notes:",
            data.notes,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
      true,
    );

    return parseJson<{
      summary: string;
      decisions: string[];
      actionItems: Array<{ task: string; owner: string; deadline: string; status: string }>;
      dates: Array<{ label: string; date: string }>;
    }>(raw);
  });

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway(
      [
        {
          role: "system",
          content: [
            "You are NEXA AI, a research assistant for workplace professionals.",
            "Explain the topic clearly and separate established facts from your own interpretation.",
            "Never fabricate sources, citations, URLs, statistics or study names.",
            "In 'sources', only list well-known, real organisations or publication types the user can verify themselves, described generically (e.g. 'McKinsey research on workplace automation'), or return an empty array.",
            "State explicitly in 'overview' when information cannot be verified.",
            "Return strict JSON:",
            '{"overview": string, "findings": [{"title": string, "detail": string}], "insights": string[], "recommendations": string[], "takeaways": string[], "sources": [{"name": string, "note": string}]}',
          ].join(" "),
        },
        {
          role: "user",
          content: `Research mode: ${data.mode}\nTopic: ${data.topic}`,
        },
      ],
      true,
    );

    return parseJson<{
      overview: string;
      findings: Array<{ title: string; detail: string }>;
      insights: string[];
      recommendations: string[];
      takeaways: string[];
      sources: Array<{ name: string; note: string }>;
    }>(raw);
  });

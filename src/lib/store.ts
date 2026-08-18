export type ItemKind = "email" | "meeting" | "research";

export type NexaItem = {
  id: string;
  kind: ItemKind;
  title: string;
  preview: string;
  content: string;
  createdAt: string;
  demo?: boolean;
};

const HISTORY_KEY = "nexa.history";
const SAVED_KEY = "nexa.saved";
const PREFS_KEY = "nexa.prefs";

export const kindLabel: Record<ItemKind, string> = {
  email: "Smart Email",
  meeting: "Meeting Summary",
  research: "Research",
};

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

export const demoHistory: NexaItem[] = [
  {
    id: "demo-1",
    kind: "email",
    title: "Meeting request email",
    preview:
      "Subject: Request for a project progress review — I would like to schedule 30 minutes this week to walk through the current milestones…",
    content:
      "Subject: Request for a project progress review\n\nDear Manager,\n\nI would like to schedule 30 minutes this week to walk through the current milestones on the platform rollout and agree on next steps.\n\nKind regards,\nBandile",
    createdAt: hoursAgo(2),
    demo: true,
  },
  {
    id: "demo-2",
    kind: "meeting",
    title: "Project planning meeting",
    preview:
      "Team agreed to move the beta launch to the 29th, assign QA ownership to Thabo and freeze scope on Friday…",
    content:
      "Executive summary: The team reviewed delivery risk on the beta launch and agreed a revised date.\n\nDecisions: Beta launch moved to the 29th. Scope freeze on Friday.\n\nAction items: Thabo — QA plan (Friday). Lerato — update stakeholders (Wednesday).",
    createdAt: hoursAgo(5),
    demo: true,
  },
  {
    id: "demo-3",
    kind: "research",
    title: "AI in workplace productivity",
    preview:
      "Overview of how AI assistants reduce administrative overhead, with insights on adoption and governance…",
    content:
      "Overview: AI assistants are increasingly used to reduce repetitive administrative work such as drafting, summarising and information retrieval.\n\nInsights: Gains concentrate in writing-heavy roles. Governance and review remain essential.",
    createdAt: hoursAgo(20),
    demo: true,
  },
  {
    id: "demo-4",
    kind: "email",
    title: "Client follow-up after demo",
    preview:
      "Subject: Thank you for your time yesterday — following up with the summary and next steps we discussed…",
    content:
      "Subject: Thank you for your time yesterday\n\nHi Team,\n\nThank you for your time yesterday. As promised, here is a short summary of what we discussed and the next steps.\n\nBest regards,\nBandile",
    createdAt: hoursAgo(28),
    demo: true,
  },
];

export const demoSaved: NexaItem[] = [demoHistory[1], demoHistory[2]].map((item, i) => ({
  ...item,
  id: `saved-demo-${i + 1}`,
}));

function read(key: string, fallback: NexaItem[]): NexaItem[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as NexaItem[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, items: NexaItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("nexa:store"));
}

export const store = {
  history: () => read(HISTORY_KEY, demoHistory),
  saved: () => read(SAVED_KEY, demoSaved),
  addHistory(item: Omit<NexaItem, "id" | "createdAt">) {
    const entry: NexaItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    write(HISTORY_KEY, [entry, ...store.history()]);
    return entry;
  },
  save(item: Omit<NexaItem, "id" | "createdAt">) {
    const entry: NexaItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    write(SAVED_KEY, [entry, ...store.saved()]);
    return entry;
  },
  removeHistory(id: string) {
    write(
      HISTORY_KEY,
      store.history().filter((i) => i.id !== id),
    );
  },
  removeSaved(id: string) {
    write(
      SAVED_KEY,
      store.saved().filter((i) => i.id !== id),
    );
  },
};

export type Prefs = {
  name: string;
  email: string;
  role: string;
  tone: string;
  researchLength: string;
  style: string;
};

export const defaultPrefs: Prefs = {
  name: "Bandile Nkosi",
  email: "bandile@nexa.ai",
  role: "Product Manager",
  tone: "Professional",
  researchLength: "Medium",
  style: "Balanced",
};

export function readPrefs(): Prefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    return raw ? { ...defaultPrefs, ...(JSON.parse(raw) as Partial<Prefs>) } : defaultPrefs;
  } catch {
    return defaultPrefs;
  }
}

export function writePrefs(prefs: Prefs) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function formatWhen(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const sameDay = date.toDateString() === now.toDateString();
  const yesterday = new Date(now.getTime() - 86_400_000).toDateString() === date.toDateString();
  if (sameDay) return `Today, ${time}`;
  if (yesterday) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString([], { day: "2-digit", month: "short" })}, ${time}`;
}

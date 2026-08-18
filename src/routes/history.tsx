import { createFileRoute } from "@tanstack/react-router";
import { History, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ItemCard } from "@/components/nexa/ItemCard";
import { PageHeader } from "@/components/nexa/PageHeader";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { store, type ItemKind, type NexaItem } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History · NEXA AI" },
      {
        name: "description",
        content: "Browse, search and filter your previous NEXA AI emails, meeting summaries and research.",
      },
      { property: "og:title", content: "History · NEXA AI" },
      { property: "og:description", content: "Your previous AI productivity activity in one place." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<NexaItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ItemKind>("all");

  useEffect(() => {
    const sync = () => setItems(store.history());
    sync();
    window.addEventListener("nexa:store", sync);
    return () => window.removeEventListener("nexa:store", sync);
  }, []);

  const visible = items.filter(
    (item) =>
      (filter === "all" || item.kind === filter) &&
      `${item.title} ${item.preview}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="History"
        subtitle="Every AI activity you have run in NEXA AI."
        icon={<History className="size-6" aria-hidden="true" />}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search history"
            aria-label="Search history"
            className="bg-background/60 pl-9"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="email">Emails</TabsTrigger>
            <TabsTrigger value="meeting">Meetings</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onCopy={() => {
              void navigator.clipboard.writeText(item.content);
              toast.success("Copied");
            }}
            onDelete={() => {
              store.removeHistory(item.id);
              setItems(store.history().filter((i) => i.id !== item.id));
              toast.success("Removed from history");
            }}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="glass-card rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No activity matches your search yet.
        </p>
      )}
    </div>
  );
}

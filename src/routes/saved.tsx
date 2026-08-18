import { createFileRoute } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ItemCard } from "@/components/nexa/ItemCard";
import { PageHeader } from "@/components/nexa/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { store, type ItemKind, type NexaItem } from "@/lib/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Results · NEXA AI" },
      {
        name: "description",
        content: "Open, copy and manage the AI outputs you saved in NEXA AI.",
      },
      { property: "og:title", content: "Saved Results · NEXA AI" },
      { property: "og:description", content: "Your saved AI emails, meeting summaries and research." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const [items, setItems] = useState<NexaItem[]>([]);
  const [filter, setFilter] = useState<"all" | ItemKind>("all");

  useEffect(() => {
    const sync = () => setItems(store.saved());
    sync();
    window.addEventListener("nexa:store", sync);
    return () => window.removeEventListener("nexa:store", sync);
  }, []);

  const visible = items.filter((item) => filter === "all" || item.kind === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Results"
        subtitle="Keep your most useful AI outputs close at hand."
        icon={<BookMarked className="size-6" aria-hidden="true" />}
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
          <TabsTrigger value="meeting">Meetings</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>
      </Tabs>

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
              store.removeSaved(item.id);
              setItems(store.saved().filter((i) => i.id !== item.id));
              toast.success("Removed from saved results");
            }}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="glass-card rounded-2xl p-10 text-center text-sm text-muted-foreground">
          Nothing saved yet. Generate something and press Save.
        </p>
      )}
    </div>
  );
}

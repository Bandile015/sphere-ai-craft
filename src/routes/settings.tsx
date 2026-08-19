import { createFileRoute } from "@tanstack/react-router";
import { Lock, Palette, Settings as SettingsIcon, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/nexa/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { defaultPrefs, readPrefs, writePrefs, type Prefs } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · NEXA AI" },
      {
        name: "description",
        content: "Manage your NEXA AI profile, AI preferences, appearance and privacy guidance.",
      },
      { property: "og:title", content: "Settings · NEXA AI" },
      { property: "og:description", content: "Configure your AI productivity workspace." },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card rounded-2xl p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);

  useEffect(() => setPrefs(readPrefs()), []);

  function update<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Personalise NEXA AI and how your assistant responds."
        icon={<SettingsIcon className="size-6" aria-hidden="true" />}
      />

      <Section title="Profile" icon={<User className="size-5" aria-hidden="true" />}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={prefs.name}
              onChange={(e) => update("name", e.target.value)}
              className="bg-background/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={prefs.email}
              onChange={(e) => update("email", e.target.value)}
              className="bg-background/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-role">Role</Label>
            <Input
              id="profile-role"
              value={prefs.role}
              onChange={(e) => update("role", e.target.value)}
              className="bg-background/60"
            />
          </div>
        </div>
      </Section>

      <Section title="AI Preferences" icon={<Sparkles className="size-5" aria-hidden="true" />}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="pref-tone">Default email tone</Label>
            <Select value={prefs.tone} onValueChange={(v) => update("tone", v)}>
              <SelectTrigger id="pref-tone" className="bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Formal", "Friendly", "Persuasive", "Professional", "Concise"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pref-length">Research response length</Label>
            <Select value={prefs.researchLength} onValueChange={(v) => update("researchLength", v)}>
              <SelectTrigger id="pref-length" className="bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Short", "Medium", "Detailed"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pref-style">AI response style</Label>
            <Select value={prefs.style} onValueChange={(v) => update("style", v)}>
              <SelectTrigger id="pref-style" className="bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Balanced", "Direct", "Explanatory", "Executive"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Appearance" icon={<Palette className="size-5" aria-hidden="true" />}>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/60 p-4">
          <div>
            <Label htmlFor="dark-mode">Dark mode</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              NEXA AI uses its futuristic dark theme by default for reduced eye strain.
            </p>
          </div>
          <Switch id="dark-mode" checked disabled aria-label="Dark mode enabled by default" />
        </div>
      </Section>

      <Section title="Privacy" icon={<Lock className="size-5" aria-hidden="true" />}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your AI-generated content should be treated as potentially sensitive workplace information.
          Avoid entering confidential information unless your organization's policies permit it.
        </p>
      </Section>

      <Button
        className="bg-gradient-ai text-primary-foreground"
        size="lg"
        onClick={() => {
          writePrefs(prefs);
          toast.success("Settings saved");
        }}
      >
        Save changes
      </Button>
    </div>
  );
}

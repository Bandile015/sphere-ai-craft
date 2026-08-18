import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  Brain,
  ChevronLeft,
  FileText,
  HelpCircle,
  History,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof Mail };

const NAV_GROUPS: Array<{ heading: string; items: NavItem[] }> = [
  {
    heading: "Main",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/email", label: "Smart Email", icon: Mail },
      { to: "/meetings", label: "Meeting Notes", icon: FileText },
      { to: "/research", label: "Research Assistant", icon: Brain },
    ],
  },
  {
    heading: "Productivity",
    items: [
      { to: "/history", label: "History", icon: History },
      { to: "/saved", label: "Saved Results", icon: BookMarked },
    ],
  },
  {
    heading: "System",
    items: [
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/help", label: "Help", icon: HelpCircle },
    ],
  },
];

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-1.5" aria-label="NEXA AI home">
      <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-ai text-primary-foreground shadow-[var(--shadow-glow)]">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block font-display text-base font-semibold tracking-tight text-foreground">
            NEXA AI
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            AI Productivity Platform
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Main navigation">
      {NAV_GROUPS.map((group) => (
        <div key={group.heading}>
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {group.heading}
            </p>
          )}
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "border border-primary/40 bg-primary/15 text-foreground shadow-[var(--shadow-glow)]"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <item.icon
                      className={cn("size-[18px] shrink-0", active && "text-primary")}
                      aria-hidden="true"
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function AiStatus({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-sidebar-border p-3">
      <div
        className={cn(
          "rounded-xl border border-border bg-secondary/40 px-3 py-3",
          collapsed && "flex justify-center px-2",
        )}
      >
        {collapsed ? (
          <span className="size-2.5 animate-nexa-pulse rounded-full bg-accent" aria-hidden="true" />
        ) : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              AI Status
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-foreground">
              <span
                className="size-2.5 animate-nexa-pulse rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]"
                aria-hidden="true"
              />
              AI Assistant Online
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="ai-orb left-[-8rem] top-[-6rem] size-[26rem] bg-primary" />
        <span className="ai-orb right-[-10rem] top-[18rem] size-[24rem] bg-accent" />
      </div>

      <div className="relative flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-all duration-300 lg:flex",
            collapsed ? "w-[86px]" : "w-[272px]",
          )}
        >
          <div className="flex items-center justify-between gap-2 px-3 py-4">
            <Brand collapsed={collapsed} />
            <Button
              variant="ghost"
              size="icon"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((c) => !c)}
              className="min-h-9 min-w-9 text-muted-foreground"
            >
              <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          </div>
          <NavList collapsed={collapsed} pathname={pathname} />
          <AiStatus collapsed={collapsed} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="min-h-11 min-w-11 lg:hidden"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
                <SheetTitle className="sr-only">NEXA AI navigation</SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="px-3 py-4">
                    <Brand />
                  </div>
                  <NavList
                    collapsed={false}
                    pathname={pathname}
                    onNavigate={() => setMobileOpen(false)}
                  />
                  <AiStatus collapsed={false} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="lg:hidden">
              <Brand />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-foreground sm:flex">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                Powered by NEXA AI
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-gradient-ai text-xs font-semibold text-primary-foreground">
                BN
              </span>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>

          <footer className="border-t border-border px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
            NEXA AI · AI-generated content may contain errors. Review important information before
            sharing it professionally.
          </footer>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}) {
  return (
    <header className="mb-8 flex items-start gap-4">
      {icon && (
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-ai text-primary-foreground shadow-[var(--shadow-glow)]">
          {icon}
        </span>
      )}
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      </div>
    </header>
  );
}

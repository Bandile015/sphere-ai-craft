import { useEffect, useState } from "react";
import { AiHead } from "./AiHead";

const STAGES = ["Thinking...", "Analysing your request...", "Preparing your results..."];

export function AiLoading({ label = "NEXA AI is working" }: { label?: string }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-14 text-center"
      role="status"
      aria-live="polite"
    >
      <AiHead size={120} animated />
      <p className="font-display text-lg text-foreground">{STAGES[stage]}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-nexa-pulse rounded-full bg-gradient-ai" />
      </div>
    </div>
  );
}

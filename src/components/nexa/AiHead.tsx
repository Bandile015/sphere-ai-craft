import nexaHead from "@/assets/nexa-head.png";
import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  className?: string;
  animated?: boolean;
  priority?: boolean;
};

export function AiHead({ size = 96, className, animated = false, priority = false }: Props) {
  return (
    <div
      className={cn("relative shrink-0", animated && "animate-nexa-float", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className={cn(
          "absolute inset-[12%] rounded-full bg-gradient-ai blur-2xl opacity-50",
          animated && "animate-nexa-pulse",
        )}
      />
      <img
        src={nexaHead}
        alt=""
        width={1024}
        height={1024}
        {...(priority ? {} : { loading: "lazy" as const })}
        className="relative size-full object-contain object-top drop-shadow-[0_0_30px_oklch(0.56_0.24_296/0.55)]"
      />
    </div>
  );
}

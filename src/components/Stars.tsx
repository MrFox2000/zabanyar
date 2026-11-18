import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ earned, size = 14, className }: { earned: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${earned} ستاره`}>
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={2.4}
          className={n <= earned ? "fill-gold text-gold" : "fill-transparent text-plum/25"}
        />
      ))}
    </span>
  );
}

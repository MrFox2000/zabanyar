import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "soft" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-fox text-white hover:bg-fox-deep",
  soft: "bg-white text-plum border border-fox/20 hover:bg-sand",
  ghost: "bg-transparent text-plum-soft hover:bg-fox/10",
  danger: "bg-lose text-white hover:bg-red-600",
  success: "bg-mint text-[#043d2b] hover:bg-emerald-400",
};

const SIZES: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm rounded-xl",
  md: "px-5 py-3 text-base rounded-2xl",
  lg: "px-7 py-4 text-lg rounded-2xl",
};

const base =
  "btn-pop inline-flex items-center justify-center gap-2 font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none select-none";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </Link>
  );
}

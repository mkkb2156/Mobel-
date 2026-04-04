import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-linen text-walnut",
  success: "bg-green-50 text-success",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-error",
  info: "bg-blue-50 text-blue-700",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

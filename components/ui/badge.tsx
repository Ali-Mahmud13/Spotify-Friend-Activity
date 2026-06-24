import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-colors",
  {
    variants: {
      variant: {
        default: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
        violet: "border-violet-300/20 bg-violet-300/10 text-violet-100",
        blue: "border-blue-300/20 bg-blue-300/10 text-blue-100",
        muted: "border-white/10 bg-white/5 text-slate-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

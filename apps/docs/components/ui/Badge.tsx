import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-fd-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80",
        secondary:
          "border-transparent bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-secondary/80",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-600/80",
        outline: "text-fd-foreground",
        success: "border-[#BBF7D0] dark:border-[#166534] text-[#16A34A] bg-[#ECFDF5] dark:bg-[#064e3b]/20",
        warning: "border-[#FEF08A] dark:border-[#CA8A04] text-[#854D0E] dark:text-[#FEF08A] bg-[#FEF9C3] dark:bg-[#854D0E]/20",
        purple: "border-[#E9D5FF] dark:border-[#7E22CE] text-[#7E22CE] dark:text-[#E9D5FF] bg-[#F3E8FF] dark:bg-[#7E22CE]/20",
        error: "border-[#FECACA] dark:border-[#991B1B] text-[#B91C1C] dark:text-[#FECACA] bg-[#FEF2F2] dark:bg-[#991B1B]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

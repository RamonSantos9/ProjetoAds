"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/cn"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 w-full flex justify-center", className)}
      // @ts-ignore - Ignoring V9 classes for V8 compatibility
      classNames={{
        // -------------------------
        // V8 Compatibility Classes
        // -------------------------
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 mx-auto",
        head_row: "flex w-full justify-between",
        head_cell:
          "text-fd-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
        row: "flex w-full mt-2 justify-between",
        cell: "h-9 w-9 text-center text-sm p-0 flex items-center justify-center relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center mx-auto"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary hover:text-fd-primary-foreground focus:bg-fd-primary focus:text-fd-primary-foreground",
        day_today: "bg-fd-muted/50 text-accent-foreground font-bold",
        day_outside:
          "day-outside text-fd-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-fd-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-fd-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        
        // -------------------------
        // V9 Compatibility Classes
        // -------------------------
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        month_grid: "w-full border-collapse space-y-1 mx-auto",
        weekdays: "flex w-full justify-between mt-2",
        weekday: "text-fd-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2 justify-between",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center mx-auto"
        ),
        selected:
          "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary hover:text-fd-primary-foreground focus:bg-fd-primary focus:text-fd-primary-foreground",
        today: "bg-fd-muted/50 text-foreground font-bold",
        outside:
          "day-outside text-fd-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-fd-muted-foreground aria-selected:opacity-30",
        disabled: "text-fd-muted-foreground opacity-50",
        hidden: "invisible",
        button_previous: "absolute left-1 z-10",
        button_next: "absolute right-1 z-10",
        ...classNames,
      } as any}
      // @ts-ignore - Ignoring V9 components for V8 compatibility
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Chevron: ({ ...props }) => {
          // React Day Picker v9 uses Chevron component with orientation
          const orientation = (props as any).orientation;
          const Comp = orientation === "left" || (props as any).className?.includes("left") ? ChevronLeft : ChevronRight;
          return <Comp className="h-4 w-4" {...props} />;
        },
      } as any}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

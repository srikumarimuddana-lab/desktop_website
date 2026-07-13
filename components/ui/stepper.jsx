"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Simple numbered-steps header for multi-step flows.
 *
 * @param {{steps: string[], current: number, className?: string}} props
 *   current is a 0-based index; steps before it render as completed.
 */
export function Stepper({ steps, current, className }) {
  return (
    <ol className={cn("flex items-center w-full", className)}>
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-1 min-w-0">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  done && "border-primary bg-primary text-white",
                  active && "border-primary text-primary",
                  !done && !active && "border-gray-300 text-gray-400"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-xs text-center whitespace-nowrap",
                  active ? "text-primary font-medium" : "text-gray-500"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                aria-hidden
                className={cn("mx-2 mb-5 h-0.5 flex-1", done ? "bg-primary" : "bg-gray-200")}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

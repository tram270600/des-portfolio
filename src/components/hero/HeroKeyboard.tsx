import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

const rows = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "search"],
  ["z", "x", "c", "v", "b", "n", "m", ".", "enter"],
  ["!#1", "space"],
] as const

const highlighted = new Set(["a", "s", "d", "f", "j", "k", "l"])

export function HeroKeyboard() {
  return (
    <div className="relative mx-auto mt-6 hidden w-full min-w-0 max-w-[540px] md:block">
      <div
        className="pointer-events-none absolute inset-x-8 top-6 h-28 rounded-[50%] bg-[radial-gradient(circle,rgba(253,229,93,0.55)_0%,transparent_70%)] opacity-80 motion-safe:animate-pulse"
        aria-hidden
      />
      <div className="relative rounded-[22px] border border-black/5 bg-card/90 p-2 shadow-[0_20px_50px_rgba(26,26,26,0.08)] md:rounded-[28px] md:p-4">
        <div className="flex flex-col gap-1 md:gap-1.5">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-full gap-0.5 md:gap-1.5">
              {row.map((key) => {
                const flex =
                  key === "space" ? "flex-[4]" : key === "enter" || key === "!#1" ? "flex-[1.6]" : "flex-1"
                const isHighlight = highlighted.has(key)
                return (
                  <span
                    key={key}
                    className={cn(
                      "grid h-7 min-w-0 place-items-center overflow-hidden rounded-full bg-background text-[8px] font-medium text-foreground/80 sm:text-[9px] md:h-9 md:text-xs",
                      flex,
                      isHighlight && "bg-yellow text-foreground shadow-sm",
                    )}
                  >
                    {key === "search" ? (
                      <Search className="size-3 text-foreground/70 md:size-3.5" aria-hidden />
                    ) : key === "enter" ? (
                      "⏎"
                    ) : key === "space" ? (
                      "Space"
                    ) : (
                      key
                    )}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

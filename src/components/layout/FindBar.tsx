import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"

import { useDebouncedEffect } from "@/hooks/useDebouncedEffect"
import { SEARCH_IGNORE_ATTR, clearMatches, findTextRanges, paintMatches, revealRange } from "@/lib/pageSearch"
import { useSearchStore } from "@/store/search"

export function FindBar() {
  const findOpen = useSearchStore((state) => state.findOpen)
  return findOpen ? <FindBarPanel /> : null
}

function FindBarPanel() {
  const query = useSearchStore((state) => state.query)
  const setQuery = useSearchStore((state) => state.setQuery)
  const closeFind = useSearchStore((state) => state.closeFind)

  const inputRef = useRef<HTMLInputElement>(null)
  const [ranges, setRanges] = useState<Range[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
    return clearMatches
  }, [])

  useDebouncedEffect(query, 150, (value) => {
    setRanges(findTextRanges(value))
    setCurrent(0)
  })

  useEffect(() => {
    paintMatches(ranges, current)
    const active = ranges[current]
    if (active) revealRange(active)
  }, [ranges, current])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFind()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [closeFind])

  const step = (delta: number) => {
    if (ranges.length === 0) return
    setCurrent((index) => (index + delta + ranges.length) % ranges.length)
  }

  const hasMatches = ranges.length > 0

  return (
    <div
      {...{ [SEARCH_IGNORE_ATTR]: "" }}
      role="search"
      aria-label="Find in page"
      className="fixed top-20 right-4 left-4 z-50 flex items-center gap-2 rounded-2xl border border-black/5 bg-card py-2 pr-2 pl-5 shadow-[0_12px_40px_rgba(26,26,26,0.14)] sm:left-auto sm:w-[400px] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2"
    >
      <label htmlFor="find-in-page" className="sr-only">
        Find in page
      </label>
      <input
        ref={inputRef}
        id="find-in-page"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            step(event.shiftKey ? -1 : 1)
          }
        }}
        className="min-w-0 flex-1 bg-transparent py-1.5 text-base font-medium text-foreground focus-visible:outline-none"
      />
      <span className="shrink-0 text-sm tabular-nums text-muted-foreground" aria-live="polite">
        {hasMatches ? `${current + 1}/${ranges.length}` : "0/0"}
      </span>
      <span aria-hidden className="mx-1 h-7 w-px shrink-0 bg-border" />
      <FindButton label="Previous match" disabled={!hasMatches} onClick={() => step(-1)}>
        <ChevronUp className="size-5" />
      </FindButton>
      <FindButton label="Next match" disabled={!hasMatches} onClick={() => step(1)}>
        <ChevronDown className="size-5" />
      </FindButton>
      <FindButton label="Close find" onClick={closeFind}>
        <X className="size-5" />
      </FindButton>
    </div>
  )
}

function FindButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}

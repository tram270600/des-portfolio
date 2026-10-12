import { useEffect, useId, useRef, useState } from "react"

import { cn } from "@/lib/utils"

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
      fill="none"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
        checked ? "border-foreground bg-foreground text-background" : "border-mono-300 bg-white",
      )}
    >
      {checked ? (
        <svg viewBox="0 0 24 24" className="size-3" fill="none">
          <path d="M5 12.5l4.2 4.2L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  )
}

function selectionLabel(count: number, total: number) {
  if (count === total) return "All"
  return `${count} selected`
}

function NamedFilter<T extends string>({
  name,
  value,
  options,
  open,
  onOpenChange,
  onApply,
}: {
  name: string
  value: T[]
  options: { id: T; label: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (ids: T[]) => void
}) {
  const menuId = useId()
  const [draft, setDraft] = useState(value)
  const allChecked = draft.length === options.length
  const filtered = value.length !== options.length

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const toggle = (id: T) => {
    setDraft((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "inline-flex items-center gap-3 rounded-xl border border-border px-3.5 py-2 text-sm text-foreground shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-colors",
          filtered ? "bg-[#e8e8e8] hover:bg-[#dedede]" : "bg-white hover:bg-[#f7f7f7]",
        )}
      >
        <span className="font-medium">{name}</span>
        <span aria-hidden className="h-4 w-px bg-border" />
        <span className="inline-flex items-center gap-2">
          {selectionLabel(value.length, options.length)}
          <ChevronIcon open={open} />
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          className="absolute top-full left-0 z-20 mt-2 w-64 rounded-xl border border-border bg-white p-2 shadow-[0_8px_24px_rgba(26,26,26,0.08)]"
        >
          <button
            type="button"
            role="checkbox"
            aria-checked={allChecked}
            onClick={() => setDraft(allChecked ? [] : options.map((item) => item.id))}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
          >
            <CheckMark checked={allChecked} />
            Select All
          </button>
          <div className="my-1 h-px bg-border" />
          <div className="flex flex-col">
            {options.map((item) => {
              const checked = draft.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground hover:bg-muted"
                >
                  <CheckMark checked={checked} />
                  {item.label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              onApply(draft)
              onOpenChange(false)
            }}
            className="mt-2 w-full rounded-lg bg-foreground py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Apply
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function ProjectFilters<T extends string, D extends string>({
  types,
  domains,
  typeOptions,
  domainOptions,
  onTypesApply,
  onDomainsApply,
}: {
  types: T[]
  domains: D[]
  typeOptions: { id: T; label: string }[]
  domainOptions: { id: D; label: string }[]
  onTypesApply: (ids: T[]) => void
  onDomainsApply: (ids: D[]) => void
}) {
  const [open, setOpen] = useState<"type" | "domain" | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="flex flex-wrap items-center gap-3">
      <NamedFilter
        name="Type"
        value={types}
        options={typeOptions}
        open={open === "type"}
        onOpenChange={(next) => setOpen(next ? "type" : null)}
        onApply={onTypesApply}
      />
      <NamedFilter
        name="Domain"
        value={domains}
        options={domainOptions}
        open={open === "domain"}
        onOpenChange={(next) => setOpen(next ? "domain" : null)}
        onApply={onDomainsApply}
      />
    </div>
  )
}

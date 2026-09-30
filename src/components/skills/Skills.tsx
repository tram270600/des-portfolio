import { useEffect, useRef, useState } from "react"

import { Section } from "@/components/layout/Section"
import { SectionTitle } from "@/components/layout/SectionTitle"
import {
  allSkillRows,
  sheetLineCount,
  skillSheets,
  totalSkillRows,
  type SkillRow,
  type SkillSheet,
} from "@/data/skills"
import { cn } from "@/lib/utils"

type SkillMode = "table" | "insight"

const TAB_COLORS = ["#0069D7", "#00B77F", "#FDE55D", "#FC664B"] as const
const TAB_WIDTH = "15.8029%"

const allTabs: Array<{ id: string; label: string; comingSoon?: boolean; sheet?: SkillSheet }> = [
  { id: "all", label: "All" },
  ...skillSheets.map((sheet) => ({
    id: sheet.id,
    label: sheet.label,
    comingSoon: sheet.comingSoon,
    sheet,
  })),
]

function rowLabel(shown: number) {
  return `${shown}/${totalSkillRows} Rows`
}

function tabInk(color: string, selected: boolean) {
  if (selected) return color === "#FDE55D" ? "#1a1a1a" : color
  return color === "#FDE55D" ? "#1a1a1a" : "#ffffff"
}

function tabLeft(index: number) {
  return index === 0 ? "0%" : `${(index * 27.5862) / 2}%`
}

function spannedRows(rows: SkillRow[]) {
  return rows.map((row, index) => {
    const previous = rows[index - 1]
    const showGroup = !previous || previous.group !== row.group
    const showFocus = showGroup || previous.focus !== row.focus
    return { ...row, showGroup, showFocus }
  })
}

const groupedRows = spannedRows(allSkillRows)

function ModeSwitch({ mode, onChange }: { mode: SkillMode; onChange: (mode: SkillMode) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Skill view"
      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm shadow-[0_1px_2px_rgba(40,30,10,0.06)]"
    >
      {(
        [
          ["table", "Table"],
          ["insight", "Insight"],
        ] as const
      ).map(([value, label], index) => (
        <span key={value} className="inline-flex items-center gap-1.5">
          {index > 0 ? (
            <span className="text-[#c8c4bc]" aria-hidden>
              /
            </span>
          ) : null}
          <button
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => onChange(value)}
            className={cn(
              "rounded-full px-1.5 py-0.5 transition-colors",
              mode === value ? "font-medium text-foreground" : "text-[#a39e96] hover:text-foreground",
            )}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  )
}

function FolderTabs({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  function updateEdges() {
    const el = scrollerRef.current
    if (!el) return
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    })
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    el.addEventListener("scroll", updateEdges, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", updateEdges)
    }
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    const tab = document.getElementById(`skill-tab-${activeId}`)
    if (!scroller || !tab) return
    const tabLeft = tab.offsetLeft
    const tabRight = tabLeft + tab.offsetWidth
    const viewLeft = scroller.scrollLeft
    const viewRight = viewLeft + scroller.clientWidth
    if (tabLeft < viewLeft + 28) scroller.scrollTo({ left: Math.max(0, tabLeft - 28) })
    else if (tabRight > viewRight - 28) scroller.scrollTo({ left: tabRight - scroller.clientWidth + 28 })
  }, [activeId])

  function scrollBy(direction: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: direction * 220 })
  }

  return (
    <div className="relative z-10">
      <div
        ref={scrollerRef}
        className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div role="tablist" aria-label="Skill groups" className="relative h-16 w-full">
          {allTabs.map((tab, index) => {
            const selected = tab.id === activeId
            const color = TAB_COLORS[index % TAB_COLORS.length]
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`skill-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="skill-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => onSelect(tab.id)}
                onKeyDown={(event) => {
                  const nextKey = event.key === "ArrowRight" || event.key === "ArrowDown"
                  const prevKey = event.key === "ArrowLeft" || event.key === "ArrowUp"
                  if (!nextKey && !prevKey && event.key !== "Home" && event.key !== "End") return
                  event.preventDefault()
                  const nextIndex =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? allTabs.length - 1
                        : (index + (nextKey ? 1 : -1) + allTabs.length) % allTabs.length
                  const next = allTabs[nextIndex]
                  onSelect(next.id)
                  document.getElementById(`skill-tab-${next.id}`)?.focus()
                }}
                style={{
                  left: tabLeft(index),
                  width: TAB_WIDTH,
                  backgroundColor: selected ? "#ffffff" : color,
                  color: tabInk(color, selected),
                  zIndex: selected ? 30 : index + 1,
                  boxShadow: selected ? `inset 0 3px 0 ${color}` : undefined,
                }}
                className="absolute bottom-0 flex h-[3.25rem] items-center justify-center overflow-hidden rounded-t-2xl pr-4 pl-2 text-center text-[11px] leading-tight font-medium sm:text-xs"
              >
                <span>
                  {tab.label}
                  {tab.comingSoon ? <span className="mt-0.5 block text-[10px] font-normal opacity-80">Soon</span> : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      {edges.left ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
          <button
            type="button"
            aria-label="Show previous skill groups"
            onClick={() => scrollBy(-1)}
            className="absolute top-1/2 left-1 z-30 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg leading-none text-foreground shadow-sm"
          >
            ‹
          </button>
        </>
      ) : null}
      {edges.right ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
          <button
            type="button"
            aria-label="Show more skill groups"
            onClick={() => scrollBy(1)}
            className="absolute top-1/2 right-1 z-30 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg leading-none text-foreground shadow-sm"
          >
            ›
          </button>
        </>
      ) : null}
    </div>
  )
}

function AllTable() {
  return (
    <table className="w-full min-w-[640px] border-collapse text-left text-sm sm:text-base">
      <thead>
        <tr>
          {["Skill group", "Focus", "Skill"].map((heading) => (
            <th key={heading} scope="col" className="border-b border-black/10 bg-transparent px-4 py-3.5 font-semibold sm:px-5">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {groupedRows.map((row, index) => (
          <tr key={`${row.group}-${row.focus}-${row.skill}`}>
            <td
              className={cn(
                "border-b border-black/10 bg-transparent px-4 py-3.5 align-top font-medium sm:px-5",
                row.showGroup && index > 0 && "border-t border-black/10",
              )}
            >
              {row.showGroup ? row.group : ""}
            </td>
            <td
              className={cn(
                "border-b border-black/10 bg-transparent px-4 py-3.5 align-top text-[#313131] sm:px-5",
                row.showGroup && index > 0 && "border-t border-black/10",
              )}
            >
              {row.showFocus ? row.focus : ""}
            </td>
            <td
              className={cn(
                "border-b border-black/10 bg-transparent px-4 py-3.5 text-[#313131] sm:px-5",
                row.showGroup && index > 0 && "border-t border-black/10",
              )}
            >
              {row.skill}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SheetTable({ sheet }: { sheet: SkillSheet }) {
  const rows = sheet.columns.flatMap((column) =>
    column.items.map((skill, index) => ({
      group: column.title,
      skill,
      showGroup: index === 0,
    })),
  )

  return (
    <table className="w-full min-w-[520px] border-collapse bg-transparent text-left text-sm sm:text-base">
      <thead>
        <tr>
          {["Group", "Skill"].map((heading) => (
            <th key={heading} scope="col" className="border-b border-black/10 bg-transparent px-4 py-3.5 font-semibold sm:px-6">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${sheet.id}-${row.group}-${row.skill}`}>
            <th
              scope="row"
              className={cn(
                "border-b border-black/10 bg-transparent px-4 py-3.5 text-left align-top font-medium sm:px-6",
                row.showGroup && index > 0 && "border-t-2 border-t-black/10",
              )}
            >
              {row.showGroup ? row.group : ""}
            </th>
            <td
              className={cn(
                "border-b border-black/10 bg-transparent px-4 py-3.5 text-[#313131] sm:px-6",
                row.showGroup && index > 0 && "border-t-2 border-t-black/10",
              )}
            >
              {row.skill}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Skills() {
  const [activeId, setActiveId] = useState("all")
  const [mode, setMode] = useState<SkillMode>("table")
  const active = allTabs.find((tab) => tab.id === activeId) ?? allTabs[0]
  const shown = active.id === "all" ? totalSkillRows : active.sheet ? sheetLineCount(active.sheet.columns) : 0

  return (
    <Section id="skills">
      <SectionTitle index="04">Skills</SectionTitle>
      <div className="mt-8 md:mt-10">
        <FolderTabs activeId={activeId} onSelect={setActiveId} />
        <div
          className="relative -mt-2 rounded-[22px] bg-white shadow-[0_18px_40px_rgba(40,30,10,0.06)]"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage:
              "linear-gradient(to right, rgba(0, 105, 215, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 105, 215, 0.45) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-5 pb-2 sm:px-6">
            <p className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-[#8a8680] shadow-[0_1px_2px_rgba(40,30,10,0.05)] sm:text-sm">
              {rowLabel(shown)}
            </p>
            <ModeSwitch mode={mode} onChange={setMode} />
          </div>

          <div
            role="tabpanel"
            id="skill-panel"
            aria-labelledby={`skill-tab-${active.id}`}
            className="overflow-x-auto px-2 pb-4 sm:px-3"
          >
            {mode === "insight" || active.comingSoon ? (
              <p className="px-4 py-20 text-center text-sm text-[#8a8680] sm:text-base">Coming soon</p>
            ) : active.id === "all" ? (
              <AllTable />
            ) : active.sheet ? (
              <SheetTable sheet={active.sheet} />
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  )
}

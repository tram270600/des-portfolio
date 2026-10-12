import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { ProjectCard } from "@/components/projects/ProjectCard"
import type { ProjectType } from "@/data/projects"
import { cn } from "@/lib/utils"

const GAP_SM = 24
const GAP_MD = 32
const PEEK = 18
const PEEK_BASIS = 84
const STACK_DEPTH = 2
const HOVER_SHIFT = 50
const REVEAL_AMOUNT = 0.28

const revealSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.8,
}

function projectRows(items: ProjectType[]) {
  const rows: ProjectType[][] = []
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]
    const next = items[index + 1]
    if (item.layout === "vertical" && next?.layout === "vertical") {
      rows.push([item, next])
      index += 1
    } else {
      rows.push([item])
    }
  }
  return rows
}

function collapsedPose(index: number, peek: number) {
  const depth = Math.min(index, STACK_DEPTH)

  return {
    x: 0,
    y: depth * peek,
    scale: 1 - depth * 0.035,
    opacity: index > STACK_DEPTH ? 0 : 1 - depth * 0.08,
    filter: "grayscale(0)",
  }
}

function sameHeights(current: number[], next: number[]) {
  return current.length === next.length && current.every((height, index) => height === next[index])
}

function listGap() {
  return window.matchMedia("(min-width: 768px)").matches ? GAP_MD : GAP_SM
}

export function ProjectList({ items }: { items: ProjectType[] }) {
  const rows = projectRows(items)
  const stackRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const [heights, setHeights] = useState<number[]>([])
  const [gap, setGap] = useState(GAP_SM)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const [seen, setSeen] = useState(false)
  const revealed = Boolean(reduceMotion) || seen
  const hasOpened = useRef(false)
  const staggerOpen = revealed && !hasOpened.current
  const layoutKey = rows.map((row) => row.map((item) => item.title).join("+")).join("|")

  useEffect(() => {
    if (revealed) hasOpened.current = true
  }, [revealed])

  useLayoutEffect(() => {
    const measure = () => {
      const next = Array.from({ length: rows.length }, (_, index) => rowRefs.current[index]?.offsetHeight ?? 0)
      const nextGap = listGap()
      setHeights((current) => (sameHeights(current, next) ? current : next))
      setGap((current) => (current === nextGap ? current : nextGap))
    }

    measure()
    const observer = new ResizeObserver(measure)
    rowRefs.current.slice(0, rows.length).forEach((node) => {
      if (node) observer.observe(node)
    })
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [layoutKey, rows.length])

  const measured = heights.length === rows.length && rows.length > 0 && heights.every((height) => height > 0)
  let cursor = 0
  const slots = rows.map((_, index) => {
    const y = cursor
    cursor += (heights[index] ?? 0) + gap
    return y
  })
  const stackHeight = measured ? Math.max(0, cursor - gap) : 0
  const peek = measured ? Math.max(PEEK, Math.round(((heights[0] ?? 0) * PEEK) / PEEK_BASIS)) : PEEK
  const collapsedHeight = measured ? (heights[0] ?? 0) + peek * Math.min(STACK_DEPTH, rows.length - 1) : 0
  const open = revealed && measured

  useEffect(() => {
    const stack = stackRef.current
    if (!stack || reduceMotion || seen || collapsedHeight <= 0) return

    const visibleEnough = () => {
      const rect = stack.getBoundingClientRect()
      const height = collapsedHeight
      if (height <= 0) return false
      const bottom = rect.top + height
      const visible = Math.min(bottom, window.innerHeight) - Math.max(rect.top, 0)
      return visible / height >= REVEAL_AMOUNT
    }

    if (visibleEnough()) {
      setSeen(true)
      return
    }

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!visibleEnough()) return
        setSeen(true)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [reduceMotion, seen, collapsedHeight])

  if (rows.length === 0) {
    return <p className="mt-10 text-center text-base text-muted-foreground">No projects match these filters.</p>
  }

  return (
    <div
      ref={stackRef}
      className="relative mt-8 pr-[50px] md:mt-10"
      style={{ height: open ? stackHeight : collapsedHeight }}
      onMouseLeave={() => setHoveredId(null)}
    >
      {rows.map((row, index) => {
        const id = row.map((item) => item.title).join("-")
        const hovered = open && hoveredId === id
        const dimmed = open && hoveredId !== null && !hovered
        const resting = collapsedPose(index, peek)
        const pose = open
          ? {
              x: hovered ? HOVER_SHIFT : 0,
              y: slots[index],
              scale: 1,
              opacity: dimmed ? 0.4 : 1,
              filter: dimmed ? "grayscale(1)" : "grayscale(0)",
            }
          : resting

        return (
          <motion.div
            key={id}
            ref={(node) => {
              rowRefs.current[index] = node
            }}
            className={cn("absolute top-0 left-0 w-full", !open && index > 0 && "pointer-events-none")}
            style={{ zIndex: hovered ? 10 : rows.length - index, transformOrigin: "top center" }}
            initial={hasOpened.current ? false : resting}
            animate={pose}
            inert={!open && index > 0 ? true : undefined}
            transition={
              !measured || reduceMotion
                ? { duration: 0 }
                : {
                    y: { ...revealSpring, delay: staggerOpen ? index * 0.04 : 0 },
                    scale: { ...revealSpring, delay: staggerOpen ? index * 0.04 : 0 },
                    opacity: { duration: 0.28, delay: staggerOpen ? index * 0.04 : 0 },
                    x: { type: "spring", stiffness: 520, damping: 38 },
                    filter: { duration: 0.25 },
                  }
            }
            onMouseEnter={() => open && setHoveredId(id)}
            onFocus={() => open && setHoveredId(id)}
            onBlur={(event) => {
              const next = event.relatedTarget
              if (next instanceof Node && event.currentTarget.contains(next)) return
              setHoveredId(null)
            }}
          >
            {row.length === 1 ? (
              <ProjectCard {...row[0]} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {row.map((project) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

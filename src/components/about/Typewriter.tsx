import { useInView, useReducedMotion } from "motion/react"
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const SEGMENT_PAUSE = 420

function wordLengthAt(text: string, index: number) {
  let end = index
  while (end < text.length && text[end] !== " ") end++
  return end - index
}

function naturalDelay(text: string, index: number) {
  const char = text[index]
  const prev = text[index - 1]
  let delay = 28 + Math.random() * 42

  if (index === 0 || prev === " ") delay += Math.min(wordLengthAt(text, index), 10) * 7
  if (char === " ") delay += 20 + Math.random() * 40
  if (/[A-Z(]/.test(char)) delay += 45
  if (prev === ",") delay += 170
  if (prev === "." || prev === "!" || prev === "?") delay += 300
  if (prev && /[^a-z\s]/i.test(prev) && /[^a-z\s]/i.test(char)) delay += 60

  return delay
}

type TypewriterState = { typed: number; offsets: number[]; done: boolean }

const TypewriterContext = createContext<TypewriterState | null>(null)

type TypewriterGroupProps = {
  segments: readonly string[]
  className?: string
  children: ReactNode
  active?: boolean
  amount?: number
}

export function TypewriterGroup({
  segments,
  className,
  children,
  active = true,
  amount = 0.35,
}: TypewriterGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount })
  const reduceMotion = useReducedMotion()
  const canType = inView && active

  const offsets = useMemo(
    () => segments.map((_, index) => segments.slice(0, index).reduce((sum, segment) => sum + segment.length, 0)),
    [segments],
  )
  const total = segments.reduce((sum, segment) => sum + segment.length, 0)

  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!canType || reduceMotion) return
    let timer: ReturnType<typeof setTimeout>
    let position = 0

    const tick = () => {
      if (position >= total) return
      const segmentIndex = offsets.findLastIndex((offset) => offset <= position)
      const local = position - offsets[segmentIndex]
      const pause = local === 0 && segmentIndex > 0 ? SEGMENT_PAUSE : 0
      timer = setTimeout(() => {
        position++
        setTyped(position)
        tick()
      }, pause + naturalDelay(segments[segmentIndex], local))
    }

    tick()
    return () => clearTimeout(timer)
  }, [canType, reduceMotion, offsets, segments, total])

  const state = useMemo(
    () => ({ typed: reduceMotion ? total : typed, offsets, done: reduceMotion || typed >= total }),
    [typed, offsets, total, reduceMotion],
  )

  return (
    <TypewriterContext.Provider value={state}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </TypewriterContext.Provider>
  )
}

type TypewriterTextProps = {
  index: number
  children: string
  className?: string
}

export function TypewriterText({ index, children, className }: TypewriterTextProps) {
  const state = useContext(TypewriterContext)
  if (!state) throw new Error("TypewriterText must be rendered inside TypewriterGroup")

  const start = state.offsets[index]
  const visible = Math.max(0, Math.min(children.length, state.typed - start))
  const isLast = index === state.offsets.length - 1
  const typing = visible > 0 && (visible < children.length || (isLast && state.done))
  const showCaret = typing || (visible === 0 && state.typed === start && start > 0)

  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {children.slice(0, visible)}
        {showCaret ? (
          <span
            className={cn(
              "-mr-[2px] inline-block h-[1.15em] w-[2px] bg-primary align-[-0.2em]",
              state.done && "motion-safe:animate-[typewriter-caret_1s_steps(1)_infinite]",
            )}
          />
        ) : null}
        <span className="invisible">{children.slice(visible)}</span>
      </span>
    </span>
  )
}

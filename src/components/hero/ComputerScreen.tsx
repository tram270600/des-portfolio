import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const LINES = [
  "Portfolio Guideline",
  "----------------------",
  "> Find keyword in port",
  "Ctrl + P / ⌘P",
  "> Go to Works section",
  "Ctrl + E / ⌘E",
] as const

const CHAR_MS = 16
const LINE_PAUSE_MS = 70
const START_DELAY_MS = 280

const script = LINES.join("\n")

export function ComputerScreen() {
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(0)
  const done = count >= script.length

  useEffect(() => {
    if (reduceMotion !== false) return

    let position = 0
    let timer = 0

    const tick = () => {
      position += 1
      setCount(position)
      if (position >= script.length) return
      const pause = script[position - 1] === "\n" ? LINE_PAUSE_MS : 0
      timer = window.setTimeout(tick, CHAR_MS + pause)
    }

    timer = window.setTimeout(tick, START_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  const shown = reduceMotion ? script.length : count
  let cursor = 0

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute text-[#FDE55D]"
      style={{
        top: "21%",
        left: "36%",
        width: "max-content",
        transform: "rotate(-3.7deg)",
        transformOrigin: "0 0",
      }}
    >
      <p className="font-sans text-[10px] leading-[1.2] font-bold tracking-[-0.02em]">
          {LINES.map((line) => {
            const start = cursor
            cursor += line.length + 1
            const visible = Math.max(0, Math.min(line.length, shown - start))
            const typingHere = shown > start && visible < line.length
            const caretOnLine = typingHere || (done && line === LINES[LINES.length - 1])

            return (
              <span key={line} className="block whitespace-nowrap">
                {line.slice(0, visible)}
                {caretOnLine ? (
                  <span
                    className={cn(
                      "ml-px inline-block h-[0.9em] w-[0.45em] translate-y-[0.08em] bg-[#FDE55D] align-[-0.05em]",
                      done && "motion-safe:animate-[typewriter-caret_1s_steps(1)_infinite]",
                    )}
                  />
                ) : null}
                <span className="invisible">{line.slice(visible)}</span>
              </span>
            )
          })}
      </p>
    </div>
  )
}

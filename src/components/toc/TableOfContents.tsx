import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { contents } from "@/data/contents"
import { cn } from "@/lib/utils"

const GAP = 8
const PEEK = 18
const STACK_DEPTH = 2
const HOVER_SHIFT = 50
const REVEAL_AMOUNT = 0.28

const revealSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.8,
}

function collapsedPose(index: number) {
  const depth = Math.min(index, STACK_DEPTH)

  return {
    x: 0,
    y: depth * PEEK,
    scale: 1 - depth * 0.035,
    opacity: index > STACK_DEPTH ? 0 : 1 - depth * 0.08,
    filter: "grayscale(0)",
  }
}

export function TableOfContents() {
  const sectionRef = useRef<HTMLElement>(null)
  const stackRef = useRef<HTMLUListElement>(null)
  const [stackWidth, setStackWidth] = useState(0)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const [seen, setSeen] = useState(false)
  const revealed = Boolean(reduceMotion) || seen
  const hasOpened = useRef(false)
  const staggerOpen = revealed && !hasOpened.current

  useEffect(() => {
    if (revealed) hasOpened.current = true
  }, [revealed])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || reduceMotion) return

    const visibleEnough = () => {
      const rect = section.getBoundingClientRect()
      if (rect.height <= 0) return false
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      return visible / rect.height >= REVEAL_AMOUNT
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
        window.removeEventListener("scroll", onScroll)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [reduceMotion])

  useLayoutEffect(() => {
    const stack = stackRef.current
    if (!stack) return

    const measure = () => setStackWidth(stack.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stack)
    return () => observer.disconnect()
  }, [])

  let cursor = 0
  const slots = contents.map((item) => {
    const height = stackWidth > 0 ? (stackWidth * item.height) / item.width : 0
    const y = cursor
    cursor += height + GAP
    return { y, height }
  })
  const stackHeight = Math.max(0, cursor - GAP)

  return (
    <section
      ref={sectionRef}
      id="contents"
      aria-labelledby="contents-heading"
      className="relative scroll-mt-24 px-5 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.1fr)] md:gap-8 lg:gap-16">
        <h2
          id="contents-heading"
          className="font-sans text-5xl font-medium leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          <span className="block">
            Table{" "}
            <span className="font-pinyon relative top-[0.12em] text-[1.15em] font-normal leading-none">
              of
            </span>
          </span>
          <span className="mt-1 block pl-[0.95em] md:mt-2">Content</span>
        </h2>

        <nav aria-label="Table of contents" onMouseLeave={() => setHoveredId(null)} className="pr-[50px]">
          <ul ref={stackRef} className="relative" style={{ height: stackHeight }}>
            {contents.map((item, index) => {
              const hovered = revealed && hoveredId === item.id
              const dimmed = revealed && hoveredId !== null && !hovered
              const resting = collapsedPose(index)
              const pose = revealed
                ? {
                    x: (parseFloat(item.offset) / 100) * stackWidth + (hovered ? HOVER_SHIFT : 0),
                    y: slots[index].y,
                    scale: 1,
                    opacity: dimmed ? 0.4 : 1,
                    filter: dimmed ? "grayscale(1)" : "grayscale(0)",
                  }
                : resting

              return (
                <motion.li
                  key={item.id}
                  className={cn(
                    "absolute top-0 left-0 w-full",
                    !revealed && index > 0 && "pointer-events-none",
                  )}
                  style={{
                    zIndex: hovered ? 10 : contents.length - index,
                    transformOrigin: "top center",
                  }}
                  initial={resting}
                  animate={pose}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          y: { ...revealSpring, delay: staggerOpen ? index * 0.04 : 0 },
                          scale: { ...revealSpring, delay: staggerOpen ? index * 0.04 : 0 },
                          opacity: { duration: 0.28, delay: staggerOpen ? index * 0.04 : 0 },
                          x: { type: "spring", stiffness: 520, damping: 38 },
                          filter: { duration: 0.25 },
                        }
                  }
                >
                  <a
                    href={item.href}
                    tabIndex={!revealed && index > STACK_DEPTH ? -1 : undefined}
                    onMouseEnter={() => revealed && setHoveredId(item.id)}
                    onFocus={() => revealed && setHoveredId(item.id)}
                    onBlur={() => setHoveredId(null)}
                    className="block"
                  >
                    <img
                      src={item.image}
                      alt={`${item.index}. ${item.label}`}
                      width={item.width}
                      height={item.height}
                      className="h-auto w-full select-none"
                      draggable={false}
                    />
                  </a>
                </motion.li>
              )
            })}
          </ul>
        </nav>
      </div>
    </section>
  )
}

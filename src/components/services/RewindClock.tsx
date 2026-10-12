import { useRef, type ReactNode } from "react"

import { useRewindDial } from "@/components/services/useRewindDial"
import { PLAYERS, revealAt } from "@/lib/rewindPlayers"

const TICKS = Array.from({ length: 12 }, (_, index) => {
  const major = index % 3 === 0
  const angle = (index * Math.PI) / 6
  const inner = major ? 37 : 41
  const outer = 46
  return {
    x1: 50 + Math.sin(angle) * inner,
    y1: 50 - Math.cos(angle) * inner,
    x2: 50 + Math.sin(angle) * outer,
    y2: 50 - Math.cos(angle) * outer,
    width: major ? 1.7 : 1,
  }
})

export function RewindClock({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const faceRef = useRef<SVGSVGElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const hourRef = useRef<SVGGElement>(null)
  const minuteRef = useRef<SVGGElement>(null)
  const secondRef = useRef<SVGGElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const yearRef = useRef<HTMLSpanElement>(null)
  const liveRef = useRef<HTMLParagraphElement>(null)
  const playersRef = useRef<Array<HTMLDivElement | null>>([])
  const announced = useRef(0)

  useRewindDial({
    rootRef,
    faceRef,
    sliderRef,
    hourRef,
    minuteRef,
    secondRef,
    hintRef,
    onProgress: (progress, reduce) => {
      const row = rowRef.current
      if (!row) return
      const span = PLAYERS.length - 1
      const position = progress * span
      const available = row.clientWidth || 776
      const compact = available < 640
      const minHeight = compact ? 44 : 68
      const maxHeight = compact ? 84 : 124
      const gap = compact ? 8 : 14

      const metrics = PLAYERS.map((player, era) => {
        const reveal = revealAt(era, progress)
        const emphasis = Math.max(0, 1 - Math.abs(position - era))
        const height = minHeight + (maxHeight - minHeight) * emphasis
        return { reveal, emphasis, height, width: height * player.aspect * reveal }
      })

      const visible = metrics.filter((item) => item.width > 1)
      const naturalSpan =
        metrics.reduce((sum, item) => sum + item.width, 0) + Math.max(0, visible.length - 1) * gap
      const fit = naturalSpan > available && naturalSpan > 0 ? available / naturalSpan : 1
      const widths = metrics.map((item) => item.width * fit)
      const gapPx = gap * fit

      const centers = new Array<number>(PLAYERS.length).fill(0)
      let leftEdge = -widths[0] / 2
      centers[0] = 0
      for (let era = 1; era < PLAYERS.length; era += 1) {
        const width = widths[era]
        if (width < 1) {
          centers[era] = leftEdge
          continue
        }
        centers[era] = leftEdge - gapPx - width / 2
        leftEdge = centers[era] - width / 2
      }

      const rightEdge = widths[0] / 2
      let shift = 0
      const half = available / 2
      if (leftEdge < -half) shift = -half - leftEdge
      if (rightEdge + shift > half) shift -= rightEdge + shift - half

      row.style.height = `${maxHeight + 10}px`

      let current = 0
      let bestEmphasis = -1
      metrics.forEach((item, era) => {
        if (item.reveal >= 0.35 && item.emphasis >= bestEmphasis) {
          bestEmphasis = item.emphasis
          current = era
        }
        const node = playersRef.current[era]
        if (!node) return
        const width = widths[era]
        const slide = reduce ? 0 : (1 - item.reveal) * 28
        node.style.width = `${width}px`
        node.style.height = `${item.height * fit}px`
        node.style.opacity = String(era === 0 ? 1 : Math.min(1, item.reveal * 1.4))
        node.style.left = `calc(50% + ${centers[era] + shift}px)`
        node.style.transform = `translateX(calc(-50% + ${slide}px))`
        node.style.zIndex = String(10 + Math.round(item.emphasis * 5))
        const shadow = node.querySelector("[data-floor]")
        if (shadow instanceof HTMLElement) shadow.style.opacity = String(item.emphasis * item.reveal)
        const hidden = item.reveal < 0.18
        node.setAttribute("aria-hidden", hidden ? "true" : "false")
        if (!hidden) node.setAttribute("aria-label", `${PLAYERS[era].name}, ${PLAYERS[era].year}`)
      })

      if (current !== announced.current) {
        announced.current = current
        const player = PLAYERS[current]
        if (nameRef.current) nameRef.current.textContent = player.name
        if (yearRef.current) yearRef.current.textContent = ` · ${player.year}`
        if (liveRef.current) liveRef.current.textContent = `${player.name}, ${player.year}`
      }
    },
  })

  return (
    <div ref={rootRef} className="relative" data-rewind="0">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 z-10 h-28 w-[min(100%,440px)] -translate-x-1/2 -translate-y-full cursor-grab touch-none md:h-40"
      />
      <div
        ref={sliderRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-valuetext="Apple iPod"
        aria-label="Rewind clock. Move around it counter-clockwise to reveal earlier music players. Left arrow rewinds, right arrow returns."
        className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-[82%] cursor-grab rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <svg
          ref={faceRef}
          aria-hidden
          viewBox="0 0 100 100"
          className="h-[92px] w-[92px] drop-shadow-[0_10px_14px_rgba(26,26,26,0.16)] md:h-[112px] md:w-[112px]"
        >
          <circle cx="50" cy="50" r="48" fill="#fffcf7" stroke="#1a1a1a" strokeWidth="1.4" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#0069d7" strokeWidth="1.1" />
          {TICKS.map((tick) => (
            <line
              key={`${tick.x1}-${tick.y1}`}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="#0069d7"
              strokeWidth={tick.width}
              strokeLinecap="round"
            />
          ))}
          <g ref={hourRef}>
            <line x1="50" y1="50" x2="50" y2="32" stroke="#1a1a1a" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <g ref={minuteRef}>
            <line x1="50" y1="50" x2="50" y2="20" stroke="#1a1a1a" strokeWidth="1.7" strokeLinecap="round" />
          </g>
          <g ref={secondRef}>
            <line x1="50" y1="58" x2="50" y2="16" stroke="#fc664b" strokeWidth="1" strokeLinecap="round" />
          </g>
          <circle cx="50" cy="50" r="2.4" fill="#1a1a1a" />
          <circle cx="50" cy="50" r="1.1" fill="#fc664b" />
        </svg>
        <p
          ref={hintRef}
          className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 font-script text-base whitespace-nowrap text-primary transition-opacity duration-300"
        >
          ↺ turn back
        </p>
      </div>

      {children}

      <div
        ref={rowRef}
        role="group"
        aria-label="Music players, rewinding from the present toward earlier inventions on the left"
        className="relative mt-8 h-32 md:mt-10"
      >
        {[...PLAYERS].map((player, era) => ({ player, era })).reverse().map(({ player, era }) => (
          <div
            key={player.name}
            ref={(node) => {
              playersRef.current[era] = node
            }}
            data-era={era}
            aria-hidden={era === 0 ? undefined : true}
            className="absolute bottom-0 left-1/2 w-0"
          >
            <img alt="" draggable={false} className="absolute inset-0 h-full w-full object-contain object-bottom" />
            <span
              data-floor
              aria-hidden
              className="pointer-events-none absolute inset-x-[14%] -bottom-1 h-2 rounded-[100%] bg-[rgba(26,26,26,0.18)] blur-[3px]"
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center font-sans text-sm text-foreground">
        <span ref={nameRef}>Apple iPod</span>
        <span ref={yearRef} className="text-muted-foreground">
          {" · 2001"}
        </span>
      </p>
      <p ref={liveRef} className="sr-only" aria-live="polite">
        Apple iPod, 2001
      </p>
    </div>
  )
}

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Volume2, VolumeX } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Navbar } from "@/components/layout/Navbar"
import { SkipLink } from "@/components/layout/SkipLink"
import { useRewindDial } from "@/components/services/useRewindDial"
import { serviceDrawerAt, type ServiceDocument } from "@/data/services"
import { cn } from "@/lib/utils"
import { PLAYERS } from "@/lib/rewindPlayers"
import { Section } from "@/components/layout/Section"
import { SectionTitle } from "@/components/layout/SectionTitle"

const INK = [0x00, 0x69, 0xd7] as const
const PAPER = [0xf7, 0xf7, 0xf7] as const

function paintWindow(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = Math.max(1, Math.round(rect.width * dpr))
  const height = Math.max(1, Math.round(rect.height * dpr))
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) return
  context.drawImage(video, 0, 0, width, height)
  const frame = context.getImageData(0, 0, width, height)
  const data = frame.data
  for (let index = 0; index < data.length; index += 4) {
    const minChannel = Math.min(data[index], data[index + 1], data[index + 2])
    let ink = (255 - minChannel) / 130
    if (ink < 0) ink = 0
    else if (ink > 1) ink = 1
    ink = ink * ink * (3 - 2 * ink)
    data[index] = PAPER[0] + (INK[0] - PAPER[0]) * ink
    data[index + 1] = PAPER[1] + (INK[1] - PAPER[1]) * ink
    data[index + 2] = PAPER[2] + (INK[2] - PAPER[2]) * ink
  }
  context.putImageData(frame, 0, 0)
}

function versionTitle(index: number) {
  const label = PLAYERS[index]?.label ?? PLAYERS[0].label
  const title = label.split(" – ")[1]
  return title || PLAYERS[index]?.name || PLAYERS[0].name
}

function speakerAria(index: number, muted: boolean) {
  return `${versionTitle(index)}. ${muted ? "Unmute" : "Mute"} the window sound.`
}

const SPEAKER_WIDTH = 20
const SPEAKER_HEIGHT = 34
const SPEAKER_BOX_ASPECT = (SPEAKER_WIDTH / SPEAKER_HEIGHT) * (2752 / 1536)
const SPEAKER_SCALES = [0.5, 0.64, 0.76, 0.86, 0.94, 1]

function speakerReach(aspect: number, scale: number) {
  const fill = aspect >= SPEAKER_BOX_ASPECT ? SPEAKER_BOX_ASPECT / aspect : 1
  return fill * scale
}

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

const FAN_ROTATE = [-8, -3.2, 2.6, 0.4]
const FAN_NUDGE = [-8, 5, -3, 1]
const CHAIR_PAPERS = serviceDrawerAt(1)?.documents ?? []
const FOCUSED_LIST_INSET = 24
const FOCUSED_LIST_WIDTH = `min(460px, calc(100vw - ${FOCUSED_LIST_INSET * 2}px))`
const flyEase = [0.22, 1, 0.36, 1] as const

function ChairPaperCard({
  paper,
  stackIndex,
  revealed,
  fromFront,
  aligned,
  active,
  reduceMotion,
  onEngage,
  onHover,
}: {
  paper: ServiceDocument
  stackIndex: number
  revealed: boolean
  fromFront: number
  aligned: boolean
  active: boolean
  reduceMotion: boolean
  onEngage: () => void
  onHover: (index: number) => void
}) {
  return (
    <motion.article
      data-paper={stackIndex}
      initial={false}
      animate={
        aligned
          ? { x: 0, y: 0, rotate: 0, opacity: 1 }
          : {
              x: revealed ? (FAN_NUDGE[stackIndex] ?? 0) : 0,
              y: revealed ? 8 - fromFront * 54 : 190,
              rotate: revealed ? (FAN_ROTATE[stackIndex] ?? 0) : 0,
              opacity: revealed ? 1 : 0,
            }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : aligned
            ? { duration: 0.5, ease: flyEase }
            : revealed
              ? { type: "spring", stiffness: 46, damping: 14, mass: 0.95 }
              : { duration: 0.35, ease: flyEase }
      }
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return
        onEngage()
        if (aligned) onHover(stackIndex)
      }}
      onClick={(event) => {
        event.stopPropagation()
        onEngage()
        onHover(stackIndex)
      }}
      style={{
        position: aligned ? "relative" : "absolute",
        left: 0,
        bottom: aligned ? undefined : 0,
        width: "100%",
        zIndex: stackIndex + 1,
        transformOrigin: "50% 100%",
      }}
      className={cn(
        "pointer-events-auto cursor-pointer bg-white text-left text-[#1a1a1a]",
        aligned
          ? "border-x border-b border-[#1a1a1a] first:border-t"
          : "border border-[#1a1a1a] shadow-[0_14px_30px_rgba(26,26,26,0.1)]",
      )}
    >
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          aligned && active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: "708 / 428" }}>
            {paper.image && (
              <img
                src={paper.image}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain object-center"
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>
      </div>
      <p className={cn("leading-none", aligned ? "px-5 pt-5 text-[15px]" : "px-4 pt-4 text-[13px]")}>
        {paper.index}
      </p>
      <div className={cn(aligned ? "px-5 pt-5 pb-5" : "px-4 pt-3 pb-4")}>
        <h3 className={cn("leading-snug font-semibold", aligned ? "text-[15px]" : "text-[14px]")}>
          {paper.title}
        </h3>
        <p className={cn("mt-1.5 leading-relaxed", aligned ? "text-[13px]" : "text-[12px]")}>
          {paper.description}
        </p>
      </div>
    </motion.article>
  )
}

function ChairPapers({
  open,
  onReadingChange,
  onKeepOpen,
  onRequestClose,
}: {
  open: boolean
  onReadingChange: (reading: boolean) => void
  onKeepOpen: () => void
  onRequestClose: () => void
}) {
  const reduceMotion = useReducedMotion() ?? false
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [risen, setRisen] = useState(0)
  const [aligned, setAligned] = useState(false)
  const [hoveredPaper, setHoveredPaper] = useState<number | null>(null)
  const [scrolledPaper, setScrolledPaper] = useState<number | null>(null)
  const activePaper = hoveredPaper ?? scrolledPaper

  useEffect(() => {
    if (!open) {
      setRisen(0)
      setAligned(false)
      setHoveredPaper(null)
      setScrolledPaper(null)
      return
    }
    if (reduceMotion) {
      setRisen(CHAIR_PAPERS.length)
      return
    }
    const timers = CHAIR_PAPERS.map((_, index) =>
      window.setTimeout(() => setRisen((value) => Math.max(value, index + 1)), 80 + index * 150),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [open, reduceMotion])

  useEffect(() => {
    onReadingChange(aligned)
  }, [aligned, onReadingChange])

  useEffect(() => {
    if (!aligned) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setAligned(false)
      onRequestClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [aligned, onRequestClose])

  useEffect(() => {
    const container = scrollerRef.current
    if (!container || !aligned) return

    const onScroll = () => {
      if (container.scrollTop <= 18) {
        setScrolledPaper((current) => (current === null ? current : null))
        return
      }

      const bounds = container.getBoundingClientRect()
      const focus = bounds.top + 6
      let best: number | null = null
      let bestDist = Infinity
      container.querySelectorAll<HTMLElement>("[data-paper]").forEach((card) => {
        const rect = card.getBoundingClientRect()
        if (rect.bottom < bounds.top || rect.top > bounds.bottom) return
        const dist = Math.abs(rect.top - focus)
        if (dist < bestDist) {
          bestDist = dist
          best = Number(card.dataset.paper)
        }
      })
      setScrolledPaper((current) => (current === best ? current : best))
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [aligned])

  const engage = () => {
    onKeepOpen()
    if (risen > 0 || reduceMotion) setAligned(true)
  }

  const papers = CHAIR_PAPERS.map((paper, index) => (
    <ChairPaperCard
      key={paper.index}
      paper={paper}
      stackIndex={index}
      revealed={risen > index}
      fromFront={CHAIR_PAPERS.length - 1 - index}
      aligned={aligned}
      active={aligned && activePaper === index}
      reduceMotion={reduceMotion}
      onEngage={engage}
      onHover={setHoveredPaper}
    />
  ))

  if (!open && !aligned) return null

  // The tram scene uses transforms, so the reading list is portaled to the
  // document so `fixed` can center on the viewport.
  if (aligned) {
    return createPortal(
      <div
        className="pointer-events-none fixed inset-x-0 z-[60]"
        style={{
          top: FOCUSED_LIST_INSET,
          bottom: FOCUSED_LIST_INSET,
        }}
        onPointerEnter={onKeepOpen}
      >
        <div
          ref={scrollerRef}
          tabIndex={0}
          aria-label="Design services"
          className="pointer-events-auto relative mx-auto h-full overflow-y-auto overscroll-contain py-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ width: FOCUSED_LIST_WIDTH }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex min-h-full flex-col justify-center">{papers}</div>
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <div
      className="pointer-events-none absolute bottom-[16%] left-[7%] z-[6] w-[min(15rem,34%)]"
      onPointerEnter={onKeepOpen}
      onPointerLeave={onRequestClose}
    >
      <div
        className="relative h-0 w-full"
        onClick={(event) => {
          event.stopPropagation()
          engage()
        }}
      >
        {papers}
      </div>
    </div>
  )
}

export function Playground({ embedded = false }: { embedded?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const faceRef = useRef<SVGSVGElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const hourRef = useRef<SVGGElement>(null)
  const minuteRef = useRef<SVGGElement>(null)
  const secondRef = useRef<SVGGElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const yearRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const soundRef = useRef<HTMLSpanElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)
  const speakerRef = useRef<HTMLButtonElement>(null)
  const liveRef = useRef<HTMLParagraphElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const announced = useRef(0)
  const [muted, setMuted] = useState(false)
  const [chairOpen, setChairOpen] = useState(false)
  const [readingPapers, setReadingPapers] = useState(false)
  const chairTimer = useRef<number | null>(null)
  const readingRef = useRef(false)
  readingRef.current = readingPapers

  const openChair = () => {
    if (chairTimer.current !== null) window.clearTimeout(chairTimer.current)
    setChairOpen(true)
  }

  const closeChair = () => {
    if (readingRef.current) return
    if (chairTimer.current !== null) window.clearTimeout(chairTimer.current)
    chairTimer.current = window.setTimeout(() => setChairOpen(false), 140)
  }

  useEffect(() => {
    if (embedded) return
    const previous = document.title
    document.title = "Playground — Tram Nguyen"
    return () => {
      document.title = previous
    }
  }, [embedded])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    let stopped = false

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas || video.readyState < 2 || document.hidden) return
      paintWindow(video, canvas)
    }

    const tick = () => {
      if (stopped) return
      if (video.currentTime >= 5 && !video.seeking) video.currentTime = 0
      draw()
      frame = window.requestAnimationFrame(tick)
    }

    const unlockSound = (event: Event) => {
      if (event.target instanceof Node && speakerRef.current?.contains(event.target)) return
      video.muted = false
      setMuted(false)
      void video.play().catch(() => {})
    }

    const play = () => {
      window.cancelAnimationFrame(frame)
      if (motion.matches) {
        video.pause()
        video.currentTime = 0
        return
      }
      if (embedded) {
        video.muted = true
        video.volume = 1
        setMuted(true)
        void video.play().then(draw).catch(() => {})
        frame = window.requestAnimationFrame(tick)
        return
      }
      video.muted = false
      video.volume = 1
      void video.play().then(draw).catch(() => {
        video.muted = true
        setMuted(true)
        void video.play().then(draw).catch(() => {})
        window.addEventListener("pointerdown", unlockSound, { once: true })
        window.addEventListener("keydown", unlockSound, { once: true })
      })
      frame = window.requestAnimationFrame(tick)
    }

    if (video.readyState >= 2) play()
    else video.addEventListener("loadeddata", play)
    motion.addEventListener("change", play)

    return () => {
      stopped = true
      window.cancelAnimationFrame(frame)
      video.removeEventListener("loadeddata", play)
      motion.removeEventListener("change", play)
      window.removeEventListener("pointerdown", unlockSound)
      window.removeEventListener("keydown", unlockSound)
    }
  }, [embedded])

  useRewindDial({
    rootRef,
    faceRef,
    sliderRef,
    hourRef,
    minuteRef,
    secondRef,
    hintRef,
    fullRing: true,
    hold: true,
    turns: PLAYERS.length - 1,
    onProgress: (progress) => {
      const span = PLAYERS.length - 1
      const current = Math.min(span, Math.floor(progress * span + 1e-4))
      rootRef.current?.querySelectorAll<HTMLElement>("[data-era]").forEach((node) => {
        const era = Number(node.getAttribute("data-era"))
        const image = node.querySelector("img")
        if (image) image.style.opacity = era === current ? "1" : "0"
        if (era === current) node.removeAttribute("aria-hidden")
        else node.setAttribute("aria-hidden", "true")
      })
      const label = PLAYERS[current].label
      if (yearRef.current) yearRef.current.textContent = PLAYERS[current].year
      if (titleRef.current) titleRef.current.textContent = versionTitle(current)
      if (soundRef.current) {
        soundRef.current.style.bottom = `calc(${speakerReach(PLAYERS[current].aspect, SPEAKER_SCALES[current]) * 100}% + 4px)`
      }
      if (shadowRef.current) shadowRef.current.style.width = `${SPEAKER_SCALES[current] * 70}%`
      if (speakerRef.current) {
        speakerRef.current.setAttribute("aria-label", speakerAria(current, videoRef.current?.muted ?? false))
      }
      if (current !== announced.current && liveRef.current) {
        announced.current = current
        liveRef.current.textContent = label
      }
    },
  })

  const scene = (
        <div
          ref={rootRef}
          data-rewind="0"
          className="relative"
        >
          <img
            src="/images/playground/playground_full.png"
            alt="Line drawing of a tram interior. The window shows the city passing by, with a clock on the wall and a music player on the seat."
            draggable={false}
            className="pointer-events-none block h-full w-full select-none"
          />
          <div
            className="pointer-events-none absolute z-[1] overflow-hidden"
            style={{ left: "39.15%", top: "26.35%", width: "21.75%", height: "30.5%", borderRadius: "12%" }}
          >
            <video
              ref={videoRef}
              src="/images/playground/playground_background.mp4"
              autoPlay
              playsInline
              preload="auto"
              aria-label="City sounds outside the tram window"
              className="absolute inset-0 h-full w-full object-cover opacity-0"
            />
            <canvas ref={canvasRef} aria-hidden className="h-full w-full" />
          </div>
          <div
            ref={sliderRef}
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            aria-valuetext="Apple iPod"
            aria-label="Rewind clock. Press and hold, then turn one full circle counter-clockwise for each earlier music player. Left arrow rewinds one version, right arrow returns."
            className="absolute z-[2] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full outline-none before:absolute before:-inset-full before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:cursor-grabbing"
            style={{ left: "65.2%", top: "33.9%", width: "4.8%" }}
          >
            <svg ref={faceRef} aria-hidden viewBox="0 0 100 100" className="block h-auto w-full">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#0069d7" strokeWidth="1.2" />
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
              className="pointer-events-none absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 font-script text-sm whitespace-nowrap text-primary transition-opacity duration-300 md:text-base"
            >
              ↺ hold & turn
            </p>
            <p
              ref={yearRef}
              className="pointer-events-none absolute top-[calc(100%+2px)] left-1/2 -translate-x-1/2 font-script text-sm whitespace-nowrap text-primary md:text-base"
            >
              2001
            </p>
          </div>

          <button
            ref={speakerRef}
            type="button"
            aria-pressed={muted}
            aria-label={speakerAria(announced.current, muted)}
            onClick={() => {
              const video = videoRef.current
              if (!video) return
              const next = !video.muted
              video.muted = next
              setMuted(next)
              if (!next) void video.play().catch(() => {})
            }}
            onPointerEnter={openChair}
            onPointerLeave={closeChair}
            className="group absolute z-[3] cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            style={{ left: "12%", top: "88%", width: `${SPEAKER_WIDTH}%`, height: `${SPEAKER_HEIGHT}%`, transform: "translate(-50%, -100%)" }}
          >
            {PLAYERS.map((player, era) => (
              <div
                key={player.name}
                data-era={era}
                className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
                aria-hidden={era === announced.current ? undefined : true}
                style={{ width: `${SPEAKER_SCALES[era] * 100}%`, height: `${SPEAKER_SCALES[era] * 100}%` }}
              >
                <img
                  alt=""
                  draggable={false}
                  className="h-full w-full object-contain object-bottom"
                  style={{ opacity: era === announced.current ? 1 : 0 }}
                />
              </div>
            ))}
            <span
              ref={shadowRef}
              aria-hidden
              className="pointer-events-none absolute bottom-[4%] left-1/2 h-[2%] -translate-x-1/2 rounded-[100%] bg-[rgba(26,26,26,0.14)] blur-[2px]"
              style={{ width: `${SPEAKER_SCALES[0] * 70}%` }}
            />
            <span
              ref={soundRef}
              className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
              style={{ bottom: `calc(${speakerReach(PLAYERS[0].aspect, SPEAKER_SCALES[0]) * 100}% + 4px)` }}
            >
              <span
                ref={titleRef}
                className="mb-0.5 font-script text-sm whitespace-nowrap text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:text-base"
              >
                Apple iPod
              </span>
              <span aria-hidden className="text-primary">
                {muted ? <VolumeX className="size-4" strokeWidth={1.75} /> : <Volume2 className="size-4" strokeWidth={1.75} />}
              </span>
            </span>
          </button>
          <div
            className="absolute z-[2] cursor-pointer"
            style={{ left: "0%", top: "38%", width: "24%", height: "58%" }}
            onPointerEnter={openChair}
            onPointerLeave={closeChair}
            onClick={openChair}
          />
          {/* <ChairPapers
            open={chairOpen}
            onReadingChange={setReadingPapers}
            onKeepOpen={openChair}
            onRequestClose={closeChair}
          /> */}
          <p ref={liveRef} className="sr-only" aria-live="polite">
            2001 – Apple iPod
          </p>
        </div>
  )

  if (embedded) return scene

  return (
    <Section id="playground" contained={false} className="overflow-hidden bg-background">
       <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
       <SectionTitle index="05">Playground</SectionTitle>
      <SkipLink />
      <Navbar home={false} />
      <main id="main" className="fixed inset-0 overflow-hidden bg-[#f7f7f7]">
        <h1 className="sr-only">Playground</h1>
        {scene}
      </main>
       </div>
    </Section>
  )
}

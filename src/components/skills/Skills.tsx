import { useLayoutEffect, useRef, useState } from "react"

import { Section } from "@/components/layout/Section"
import { SectionTitle } from "@/components/layout/SectionTitle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { certificates, restingCertificateId, type Certificate } from "@/data/skills"
import { cn } from "@/lib/utils"

const FRAME_WINDOW = {
  left: "6.39%",
  top: "9.01%",
  width: "87.22%",
  height: "81.98%",
} as const

type Spot = {
  angle: number
  length: number
  width: number
}

const restingSpot: Spot = { angle: 0, length: 420, width: 280 }

function preferredCertificateId() {
  if (window.matchMedia("(max-width: 639px)").matches) return certificates[0].id
  return restingCertificateId
}

function GalleryLight({ spot }: { spot: Spot }) {
  const beam = Math.max(160, spot.length - 28)

  return (
    <div className="pointer-events-none relative z-0 mx-auto h-16">
      <div className="absolute top-0 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[#3d3833] shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.35)]" />
      <div className="absolute top-1.5 left-1/2 h-3 w-px -translate-x-1/2 bg-[#2a2622]" />
      <div className="absolute top-4 left-1/2" style={{ transform: "translateX(-50%)" }}>
        <div
          className="flex origin-top flex-col items-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ width: spot.width, transform: `rotate(${spot.angle}deg)` }}
        >
          <div
            aria-hidden
            className="relative h-7 w-14"
          >
            <div
              className="absolute inset-0 bg-[#2a2622]"
              style={{ clipPath: "polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)" }}
            />
            <div className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#fff8d6] shadow-[0_0_22px_8px_rgba(255,244,180,0.9)]" />
          </div>
          <div
            aria-hidden
            className="relative -mt-1 w-full transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ height: beam }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255, 248, 190, 0.92) 0%, rgba(255, 252, 220, 0.62) 32%, rgba(255, 253, 235, 0.28) 68%, rgba(255, 254, 245, 0) 100%)",
                clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
                filter: "blur(10px)",
                maskImage: "linear-gradient(to bottom, transparent 0%, #000 8%, #000 88%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 8%, #000 88%, transparent 100%)",
              }}
            />
            <div
              className="absolute inset-x-[22%] inset-y-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255, 246, 170, 0.9) 0%, rgba(255, 250, 205, 0.48) 48%, rgba(255, 253, 230, 0) 100%)",
                clipPath: "polygon(36% 0%, 64% 0%, 86% 100%, 14% 100%)",
                filter: "blur(4px)",
                maskImage: "linear-gradient(to bottom, transparent 0%, #000 6%, #000 82%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 6%, #000 82%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function HangingFrame({
  certificate,
  lit,
  onLight,
  onRest,
  artRef,
}: {
  certificate: Certificate
  lit: boolean
  onLight: () => void
  onRest: () => void
  artRef: (node: HTMLDivElement | null) => void
}) {
  return (
    <li className="flex w-full max-w-[340px] flex-col">
      <div className="relative pt-7">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-x-8 top-4 -bottom-3 -z-10 transition-opacity duration-700 motion-reduce:transition-none",
            lit ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "radial-gradient(ellipse at 50% 48%, rgba(255, 248, 190, 0.9) 0%, rgba(255, 252, 215, 0.5) 46%, rgba(255, 254, 240, 0) 74%)",
          }}
        />
        <span
          aria-hidden
          className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-[#4a433c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_1px_rgba(0,0,0,0.35)]"
        />
        <svg
          aria-hidden
          viewBox="0 0 100 28"
          className="pointer-events-none absolute top-1 left-[12%] h-7 w-[76%] text-[#3a342e]"
        >
          <path d="M50 1 L8 27" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <path d="M50 1 L92 27" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </svg>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={certificate.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`View ${certificate.title} certificate`}
              onMouseEnter={onLight}
              onMouseLeave={onRest}
              onFocus={onLight}
              onBlur={onRest}
              className={cn(
                "relative block transition-[filter] duration-700 ease-out motion-reduce:transition-none",
                lit ? "brightness-110 saturate-100" : "brightness-[0.78] saturate-90",
              )}
            >
              <div
                ref={artRef}
                className="relative transition-[filter] duration-700 ease-out motion-reduce:transition-none"
                style={{
                  filter: lit
                    ? "drop-shadow(0 22px 18px rgba(48, 32, 12, 0.2))"
                    : "drop-shadow(0 12px 10px rgba(28, 22, 14, 0.28))",
                }}
              >
                <div className="absolute overflow-hidden bg-white" style={FRAME_WINDOW}>
                  <img
                    src={certificate.artwork}
                    alt=""
                    draggable={false}
                    className="size-full scale-[1.015] object-cover"
                  />
                </div>
                <img
                  src={certificate.frame}
                  alt=""
                  width={939}
                  height={666}
                  draggable={false}
                  className="relative z-10 h-auto w-full select-none"
                />
              </div>
            </a>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={10}
            className="pointer-events-none rounded-full bg-foreground px-3.5 py-2 text-sm font-medium text-background"
          >
            View Certificate
          </TooltipContent>
        </Tooltip>
      </div>
      <h3 className="mt-5 text-base leading-snug font-semibold md:text-lg" style={{ color: certificate.accent }}>
        {certificate.title}
      </h3>
      <p className="mt-2 text-sm leading-snug text-foreground md:text-[15px]">{certificate.description}</p>
    </li>
  )
}

export function Skills() {
  const stageRef = useRef<HTMLDivElement>(null)
  const pivotRef = useRef<HTMLDivElement>(null)
  const artRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const restTimer = useRef(0)
  const [litId, setLitId] = useState(preferredCertificateId)
  const [spot, setSpot] = useState<Spot>(restingSpot)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const measure = () => {
      const pivot = pivotRef.current
      const art = artRefs.current[litId]
      if (!pivot || !art) return
      const origin = pivot.getBoundingClientRect()
      const box = art.getBoundingClientRect()
      if (box.width < 2 || box.height < 2) return
      const ox = origin.left + origin.width / 2
      const oy = origin.top + origin.height / 2
      const cx = box.left + box.width / 2
      const cy = box.top + box.height * 0.42
      const dx = cx - ox
      const dy = Math.max(1, cy - oy)
      // Positive CSS rotation swings a downward beam to the left.
      const angle = -Math.atan2(dx, dy) * (180 / Math.PI)
      setSpot({
        angle: Math.max(-62, Math.min(62, angle)),
        length: Math.hypot(dx, dy) + box.height * 0.5,
        width: Math.max(180, box.width * 1.2),
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => {
      observer.disconnect()
      window.clearTimeout(restTimer.current)
    }
  }, [litId])

  function light(id: string) {
    window.clearTimeout(restTimer.current)
    setLitId(id)
  }

  function rest() {
    window.clearTimeout(restTimer.current)
    restTimer.current = window.setTimeout(() => setLitId(preferredCertificateId()), 160)
  }

  return (
    <Section id="skills" contained={false} className="overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <SectionTitle index="04">Skills</SectionTitle>
        <div ref={stageRef} className="relative mt-8 md:mt-10">
          <div ref={pivotRef} className="absolute top-4 left-1/2 z-30 size-px -translate-x-1/2" />
          <GalleryLight spot={spot} />
          <ul className="relative z-10 mt-6 grid grid-cols-1 justify-items-center gap-y-16 sm:mt-8 sm:grid-cols-3 sm:items-start sm:gap-x-6 md:gap-x-10 lg:gap-x-14">
            {certificates.map((certificate) => (
              <HangingFrame
                key={certificate.id}
                certificate={certificate}
                lit={certificate.id === litId}
                onLight={() => light(certificate.id)}
                onRest={rest}
                artRef={(node) => {
                  artRefs.current[certificate.id] = node
                }}
              />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

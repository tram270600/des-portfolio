import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react"
import { getCalApi } from "@calcom/embed-react"
import { Check, Copy, FileText, Mail } from "lucide-react"

import { ContactObjects } from "@/components/contact/ContactObjects"
import { HangingPhone } from "@/components/contact/HangingPhone"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { behanceProfile } from "@/data/projects"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

const iconButton =
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#2a2a2a] text-white transition-colors duration-200 hover:bg-[#3a3a3a] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white md:size-12"

type CopySource = "icon" | "name"

const calNamespace = "intro-call"

function useCalPopup() {
  useEffect(() => {
    let cancelled = false
    getCalApi({ namespace: calNamespace }).then((cal) => {
      if (cancelled) return
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" })
    })
    return () => {
      cancelled = true
    }
  }, [])
}

function revealWhenUncovered(shell: HTMLElement, items: [HTMLElement, number][]) {
  const mark = (marker: HTMLElement) => {
    marker.dataset.revealed = "true"
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(([marker]) => mark(marker))
    return () => {}
  }

  let pending = [...items]
  const check = () => {
    const shellRect = shell.getBoundingClientRect()
    const top = Math.max(shellRect.top, 0)
    const bottom = Math.min(shellRect.bottom, window.innerHeight)
    pending = pending.filter(([marker, amount]) => {
      const rect = marker.getBoundingClientRect()
      const visible = Math.min(rect.bottom, bottom) - Math.max(rect.top, top)
      if (visible / (rect.height || 1) < amount) return true
      mark(marker)
      return false
    })
    if (!pending.length) stop()
  }
  const observer = new IntersectionObserver(check, {
    threshold: Array.from({ length: 21 }, (_, step) => step / 20),
  })
  const frame = requestAnimationFrame(check)
  const stop = () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener("scroll", check)
    window.removeEventListener("resize", check)
  }

  observer.observe(shell)
  window.addEventListener("scroll", check, { passive: true })
  window.addEventListener("resize", check)
  return stop
}

function usePinnedHeight(section: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = section.current
    if (!node) return
    const measure = () => {
      const next = node.offsetHeight
      setHeight(next <= window.innerHeight ? next : null)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [section])

  return height
}

function Reveal({
  delay,
  duration = 850,
  travel = "115%",
  className,
  children,
}: {
  delay: number
  duration?: number
  travel?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="contact-rise"
        style={{ ["--rise" as string]: travel, ["--rise-duration" as string]: `${duration}ms`, ["--rise-delay" as string]: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  )
}

function CopyTooltip({
  copied,
  side,
  children,
}: {
  copied: boolean
  side: "top" | "bottom"
  children: ReactElement
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Tooltip open={hovered || copied} onOpenChange={setHovered}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={12}
        collisionPadding={16}
        className={cn(
          "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
          copied ? "bg-emerald-500 text-white" : "bg-accent text-accent-foreground",
        )}
      >
        {copied ? "Copied!" : "Click to copy email"}
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      </TooltipContent>
    </Tooltip>
  )
}

function BehanceIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
      <path d="M22 7h-7V5h7v2zm1.73 10c-.44 1.3-2.03 3-5.1 3-3.08 0-5.57-1.73-5.57-5.68 0-3.91 2.33-5.92 5.47-5.92 3.08 0 4.96 1.78 5.37 4.43.08.5.11 1.18.1 2.14H15.97c.13 3.21 3.48 3.31 4.59 2.03h3.17zM16.04 13h4.97c-.11-1.55-1.14-2.22-2.48-2.22-1.46 0-2.27.77-2.49 2.22zM6.47 19.99H0V5h6.95c5.48.08 5.58 5.44 2.72 6.48 3.46.63 3.86 5.28-3.2 8.51zM3 11h3.58c2.51 0 2.91-3-.31-3H3v3zm3.39 3H3v3.02h3.34c3.06 0 2.87-3.02.05-3.02z" />
    </svg>
  )
}

export function Contact() {
  const shellRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const [copiedFrom, setCopiedFrom] = useState<CopySource | null>(null)
  const copyTimer = useRef<number | null>(null)
  const pinnedHeight = usePinnedHeight(sectionRef)
  useCalPopup()

  useEffect(() => {
    const shell = shellRef.current
    const intro = introRef.current
    const name = nameRef.current
    if (!shell || !intro || !name) return
    const stop = revealWhenUncovered(shell, [
      [name, 0.35],
      [intro, 0.6],
    ])
    return () => {
      stop()
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    }
  }, [])

  async function copyEmail(source: CopySource) {
    try {
      await navigator.clipboard.writeText(site.email)
    } catch {
      return
    }
    setCopiedFrom(source)
    if (copyTimer.current) window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopiedFrom(null), 1600)
  }

  const pinned = pinnedHeight !== null

  return (
    <div
      id="contact"
      ref={shellRef}
      className="relative [clip-path:inset(0)]"
      style={pinned ? { height: pinnedHeight } : undefined}
    >
      <section
        ref={sectionRef}
        aria-labelledby="contact-heading"
        className={cn(
          "isolate flex min-h-[100svh] flex-col overflow-hidden bg-black text-white",
          pinned ? "fixed inset-x-0 bottom-0" : "relative",
        )}
      >
        <ContactObjects sectionRef={sectionRef} />
        <div className="absolute top-20 right-20 z-20">
          <HangingPhone />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          <div
            ref={introRef}
            className="contact-reveal flex flex-col gap-8 pt-20 pr-28 pl-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:pr-32 md:pt-28 md:pr-40 md:pl-10 lg:pr-44 lg:pl-14"
          >
            <div className="max-w-md">
              <Reveal delay={0}>
                <h2 id="contact-heading" className="text-base font-normal tracking-tight text-white/85 md:text-lg">
                  Let's connect
                </h2>
              </Reveal>
              <Reveal delay={80} className="mt-2">
                <p className="text-base text-white/70 md:text-lg">Drop me a line to talk about your project</p>
              </Reveal>
            </div>

            <Reveal delay={160} className="shrink-0 py-1">
              <div className="flex items-center gap-3">
                <CopyTooltip copied={copiedFrom === "icon"} side="bottom">
                  <button
                    type="button"
                    className={iconButton}
                    aria-label={copiedFrom ? "Email address copied" : `Copy email address ${site.email}`}
                    onClick={() => copyEmail("icon")}
                  >
                    <Mail className="size-5" aria-hidden />
                  </button>
                </CopyTooltip>

                 <Tooltip>
                  <TooltipTrigger asChild>
                     <a
                  href={behanceProfile}
                  target="_blank"
                  rel="noreferrer"
                  className={iconButton}
                  aria-label="Behance profile"
                >
                  <BehanceIcon />
                </a>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={12}
                    collisionPadding={16}
                    className="rounded-full bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground"
                  >
                    View Behance profile
                  </TooltipContent>
                </Tooltip>
                  <Tooltip>
                  <TooltipTrigger asChild>
                     <a
                  href={site.cv}
                  target="_blank"
                  rel="noreferrer"
                  className={iconButton}
                  aria-label="Resume"
                >
                  <FileText className="size-5" aria-hidden />
                </a>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={12}
                    collisionPadding={16}
                    className="rounded-full bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground"
                  >
                    Download Resume
                  </TooltipContent>
                </Tooltip>
                <span className="sr-only" aria-live="polite">
                  {copiedFrom ? "Copied email address" : ""}
                </span>
              </div>
            </Reveal>
          </div>

          <div ref={nameRef} className="contact-reveal mt-auto pt-16 md:pt-24">
            <Reveal delay={40} duration={1150} travel="120%" className="text-center">
              <CopyTooltip copied={copiedFrom === "name"} side="top">
                <button
                  type="button"
                  onClick={() => copyEmail("name")}
                  aria-label={`${site.name}, copy email address ${site.email}`}
                  className="inline-block cursor-pointer rounded-lg px-3 pb-[0.26em] font-display text-[clamp(2.55rem,17.8vw,18rem)] leading-[0.82] font-semibold tracking-[-0.045em] whitespace-nowrap text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                >
                  {site.name}
                </button>
              </CopyTooltip>
            </Reveal>

            <Reveal delay={220} className="-mt-2 md:-mt-4">
              <footer className="flex items-center justify-between gap-4 px-5 pb-6 text-sm text-white/55 md:px-10 md:pb-8 lg:px-14">
                <p>
                  © {site.year} {site.name}
                </p>
                <a href="#home" className="rounded-sm transition-colors hover:text-white">
                  Back to top
                </a>
              </footer>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

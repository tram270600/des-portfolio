import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { motion, useReducedMotion } from "motion/react"

import { SERVICE_COMPARTMENT_COUNT, serviceDrawerAt, serviceDrawers, type ServiceDocument } from "@/data/services"
import { FolderCover, FolderFile } from "@/components/services/FolderPaper"
import { folderStackY } from "@/components/services/folderLayout"
import { cn } from "@/lib/utils"

const DRAWER_FRONT = "/images/services/drawerFront.png"
const DRAWER_OPEN = "/images/services/drawerOpen.png"
const DRAWER_CLOSE = "/images/services/drawClose.png"
const DRAWER_OUTER = "/images/services/drawerOuter.png"

// Transparent opening inside drawerOuter.png (776×413): 5px stroke, bottom rail at y=340.
const OUTER_OPENING = {
  left: `${(5 / 776) * 100}%`,
  top: `${(5 / 413) * 100}%`,
  width: `${(766 / 776) * 100}%`,
  height: `${(335 / 413) * 100}%`,
}

// Desktop sizes. The frame is 776px wide, so each closed drawer is 246×148
// with a 14px gap. Opening grows to 320×183, centered on x and 14px lower
// (612,321 → 575,335). The front panel sits on the bottom of that open art.
const CLOSE_W = 246
const CLOSE_H = 148
const OPEN_W = 320
const OPEN_H = 183
const FRONT_H = 121
const OPEN_DX = (CLOSE_W - OPEN_W) / 2
const OPEN_DY = 14
const FRONT_DY = OPEN_DY + (OPEN_H - FRONT_H)

const ofCloseW = (px: number) => `${(px / CLOSE_W) * 100}%`
const ofCloseH = (px: number) => `${(px / CLOSE_H) * 100}%`

const openArtStyle = {
  left: ofCloseW(OPEN_DX),
  top: ofCloseH(OPEN_DY),
  width: ofCloseW(OPEN_W),
  height: ofCloseH(OPEN_H),
}

const frontArtStyle = {
  left: ofCloseW(OPEN_DX),
  top: ofCloseH(FRONT_DY),
  width: ofCloseW(OPEN_W),
  height: ofCloseH(FRONT_H),
}

const FRONT_TOP = ofCloseH(FRONT_DY)

// Focused reading list: centered on the viewport, 24px from the top and bottom.
const FOCUSED_LIST_INSET = 24
const FOCUSED_LIST_WIDTH = `min(460px, calc(100vw - ${FOCUSED_LIST_INSET * 2}px))`

// Bottom edge of the front panel, measured from the top of the cell. Papers
// are clipped here so they never show below the front.
const FRONT_BOTTOM = FRONT_DY + FRONT_H
const PAPER_CLIP = `inset(-2000px -2000px ${(((CLOSE_H - FRONT_BOTTOM) / CLOSE_H) * 100).toFixed(2)}% -2000px)`

// The open box is a trapezoid: back wall 17%-83% wide, flaring to full width
// where the front starts (y=139 of 376 in drawerOpen.png).
const CAVITY_H = 139 / 376

// Closed pose of each open layer. Opening morphs them into place.
const closedArtStyle = {
  left: "0%",
  top: "0%",
  width: "100%",
  height: ofCloseH((CLOSE_W * OPEN_H) / OPEN_W),
}
const closedFrontStyle = {
  left: "0%",
  top: "0%",
  width: "100%",
  height: "100%",
}
const cavityOpenStyle = {
  ...openArtStyle,
  height: `${CAVITY_H * (OPEN_H / CLOSE_H) * 100}%`,
}
const cavityClosedStyle = {
  ...closedArtStyle,
  height: `${CAVITY_H * parseFloat(closedArtStyle.height)}%`,
}
const shadowOpenStyle = { ...frontArtStyle }

const MORPH =
  "transition-[left,top,width,height,opacity] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"

const PEEK_DELAY_MS = 700
const RISE_DELAY_MS = 1000
const RISE_STAGGER_MS = 500

const FAN_ROTATE = [-8, -3.2, 2.6, 0.4]
const FAN_NUDGE = [-8, 5, -3, 1]
const flyEase = [0.22, 1, 0.36, 1] as const

type Pose = { x: number; y: number; rotate: number }

function ClosedFace({ muted, open }: { muted: boolean; open: boolean }) {
  return (
    <img
      src={DRAWER_CLOSE}
      alt=""
      draggable={false}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full max-w-none bg-white transition-[filter,opacity] duration-[450ms] ease-out motion-reduce:transition-none",
        open && "opacity-0",
      )}
      style={muted ? { filter: "grayscale(1) brightness(1.5)" } : undefined}
    />
  )
}

function peekPose(index: number, cardHeight: number): Pose {
  return {
    x: (FAN_NUDGE[index] ?? 0) * 0.35,
    y: cardHeight - (18 + index * 7),
    rotate: [-1.8, -0.5, 0.8, 1.6][index] ?? 0,
  }
}

function fanPose(index: number, count: number): Pose {
  const step = 58
  const fromFront = count - 1 - index
  return {
    x: FAN_NUDGE[index] ?? 0,
    y: 10 - fromFront * step,
    rotate: FAN_ROTATE[index] ?? 0,
  }
}

function folderRisenPose(index: number, count: number): Pose {
  return { x: 0, y: folderStackY(index, count), rotate: 0 }
}

function folderPeekPose(index: number): Pose {
  return { x: 0, y: 28 - index * 4, rotate: 0 }
}

function hiddenPose(cardHeight: number): Pose {
  // Fully behind the front panel: nothing shows until the papers are revealed.
  return { x: 0, y: cardHeight + 6, rotate: 0 }
}

function PaperCard({
  paper,
  stackIndex,
  pose,
  hidden,
  aligned,
  active,
  reduceMotion,
  onEngage,
  onHover,
  cardRef,
}: {
  paper: ServiceDocument
  stackIndex: number
  pose: Pose
  hidden: boolean
  aligned: boolean
  active: boolean
  reduceMotion: boolean
  onEngage: () => void
  onHover: (index: number) => void
  cardRef: (node: HTMLElement | null) => void
}) {
  return (
    <motion.article
      ref={cardRef}
      data-paper={stackIndex}
      initial={false}
      animate={{
        x: aligned ? 0 : pose.x,
        y: aligned ? 0 : pose.y,
        rotate: aligned ? 0 : pose.rotate,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : aligned
            ? { duration: 0.5, ease: flyEase }
            : hidden
              ? { duration: 0 }
              : { type: "spring", stiffness: 46, damping: 14, mass: 0.95 }
      }
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return
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
        opacity: hidden ? 0 : 1,
      }}
      className={cn(
        "bg-white text-left text-[#1a1a1a]",
        aligned
          ? "border-x border-b border-[#1a1a1a] first:border-t"
          : "border border-[#1a1a1a] shadow-[0_14px_30px_rgba(26,26,26,0.1)]",
      )}
    >
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
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
      <p className="px-5 pt-5 text-[15px] leading-none">{paper.index}</p>
      <div className="px-5 pt-5 pb-5">
        <h3 className="text-[15px] leading-snug font-semibold">{paper.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed">{paper.description}</p>
      </div>
    </motion.article>
  )
}

export function Cabinet() {
  const reduceMotion = useReducedMotion() ?? false
  const stageRef = useRef<HTMLDivElement>(null)
  const cellRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const openIndexRef = useRef<number | null>(null)
  const alignedRef = useRef(false)
  const lastPointer = useRef("mouse")
  const cardNodes = useRef<Array<HTMLElement | null>>([])
  const scrollerRef = useRef<HTMLDivElement>(null)
  const keepHover = useRef(false)

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [peeked, setPeeked] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [risen, setRisen] = useState(0)
  const [aligned, setAligned] = useState(false)
  const [hoveredPaper, setHoveredPaper] = useState<number | null>(null)
  const [scrolledPaper, setScrolledPaper] = useState<number | null>(null)
  const [cardHeight, setCardHeight] = useState(196)
  const [paperWidth, setPaperWidth] = useState(280)

  alignedRef.current = aligned
  const activePaper = hoveredPaper ?? scrolledPaper
  const openDrawer = openIndex === null ? undefined : serviceDrawerAt(openIndex)
  const folderMode = openDrawer?.variant === "folders"

  const cancelClose = () => {
    if (closeTimer.current === null) return
    window.clearTimeout(closeTimer.current)
    closeTimer.current = null
  }

  const close = () => {
    cancelClose()
    openIndexRef.current = null
    setOpenIndex(null)
    setAligned(false)
    setPeeked(false)
    setEpoch((value) => value + 1)
    setRisen(0)
    setHoveredPaper(null)
    setScrolledPaper(null)
  }

  const openCompartment = (index: number) => {
    cancelClose()
    if (openIndexRef.current !== index) {
      setPeeked(false)
      setEpoch((value) => value + 1)
      setRisen(0)
      setAligned(false)
      setHoveredPaper(null)
      setScrolledPaper(null)
    }
    openIndexRef.current = index
    setOpenIndex(index)
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(close, 120)
  }

  const engagePapers = () => {
    cancelClose()
    if (risen > 0 || reduceMotion) setAligned(true)
  }

  const showThumbnail = (index: number) => {
    keepHover.current = true
    window.setTimeout(() => {
      keepHover.current = false
    }, 220)
    setHoveredPaper(index)
  }

  useEffect(() => () => cancelClose(), [])

  useEffect(() => {
    if (!openDrawer) return
    const count = openDrawer.documents.length
    if (reduceMotion) {
      setPeeked(true)
      setRisen(count)
      return
    }

    // Empty drawer first, then papers appear inside it, then they rise.
    const timers = [
      window.setTimeout(() => setPeeked(true), PEEK_DELAY_MS),
      ...openDrawer.documents.map((_, index) =>
        window.setTimeout(
          () => {
            setRisen((value) => Math.max(value, index + 1))
          },
          RISE_DELAY_MS + index * RISE_STAGGER_MS,
        ),
      ),
    ]
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [openDrawer, epoch, reduceMotion])

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return
      if (!(event.target instanceof Node)) return
      if (!stageRef.current?.contains(event.target)) close()
    }
    window.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [openIndex])

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current
      const cell = cellRef.current
      if (!stage || !cell) return
      const cellBox = cell.getBoundingClientRect()
      const folders = serviceDrawerAt(openIndexRef.current ?? -1)?.variant === "folders"
      const nextWidth = Math.min(
        folders ? 360 : 300,
        Math.max(folders ? 292 : 236, cellBox.width * (folders ? 1.22 : 1.02)),
        window.innerWidth - 32,
      )
      setPaperWidth((current) => (current === nextWidth ? current : nextWidth))
      if (alignedRef.current) return
      const sample = cardNodes.current.find((node) => node)
      if (!sample) return
      const next = sample.offsetHeight
      setCardHeight((current) => (Math.abs(current - next) > 1 ? next : current))
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (stageRef.current) observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [openIndex, aligned, risen])

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

  const onStageLeave = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return
    scheduleClose()
  }

  return (
    <div
      ref={stageRef}
      data-cabinet
      className="relative w-full"
      onPointerEnter={cancelClose}
      onPointerLeave={onStageLeave}
    >
      {serviceDrawers.map((drawer) =>
        drawer.index === openIndex ? null : (
          <div key={drawer.index} className="sr-only">
            {drawer.documents.map((paper) => (
              <article key={paper.index}>
                <h3>{paper.title}</h3>
                <p>{paper.description}</p>
              </article>
            ))}
          </div>
        ),
      )}

      <div className="relative">
        <img
          src={DRAWER_OUTER}
          alt=""
          draggable={false}
          className="pointer-events-none block h-auto w-full select-none"
        />
        <div
          className="absolute flex items-center p-4"
          style={{ ...OUTER_OPENING, containerType: "inline-size" }}
        >
          <div
            className="grid w-full grid-cols-3"
            style={{
              columnGap: "calc(14 / 766 * 100cqi)",
              rowGap: "calc(14 / 766 * 100cqi)",
            }}
          >
            {Array.from({ length: SERVICE_COMPARTMENT_COUNT }, (_, index) => {
              const isOpen = openIndex === index
              const muted = openIndex !== null && !isOpen
              const compartment = serviceDrawerAt(index)
              const isContent = compartment !== undefined

              return (
                <div
                  key={index}
                  ref={isOpen && isContent ? cellRef : undefined}
                  className={cn(
                    "relative w-full",
                    isOpen && "z-20",
                    isOpen && aligned && isContent && "z-30",
                  )}
                  style={{ aspectRatio: `${CLOSE_W} / ${CLOSE_H}` }}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return
                    if (alignedRef.current && index !== openIndexRef.current) return
                    openCompartment(index)
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType !== "mouse") return
                    if (alignedRef.current) return
                    scheduleClose()
                  }}
                >
                  <ClosedFace muted={muted} open={isOpen} />

                  {/* Soft shade on the back wall and floor of the opened box */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute z-0",
                      MORPH,
                      isOpen ? "opacity-100" : "opacity-0",
                    )}
                    style={{
                      ...(isOpen ? cavityOpenStyle : cavityClosedStyle),
                      clipPath: "polygon(17.1% 0, 82.9% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(to bottom, rgba(26,26,26,0.16), rgba(26,26,26,0.03))",
                    }}
                  />
                  <img
                    src={DRAWER_OPEN}
                    alt=""
                    draggable={false}
                    className={cn(
                      "pointer-events-none absolute z-0 max-w-none",
                      MORPH,
                      isOpen ? "opacity-100" : "opacity-0",
                    )}
                    style={isOpen ? openArtStyle : closedArtStyle}
                  />
                  {/* Light shadow the pulled-out front casts on the cabinet */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute z-[1] bg-white",
                      MORPH,
                      isOpen ? "opacity-100" : "opacity-0",
                    )}
                    style={{
                      ...(isOpen ? shadowOpenStyle : closedFrontStyle),
                      boxShadow: isOpen
                        ? "0 16px 22px -8px rgba(26,26,26,0.22), 0 4px 8px -2px rgba(26,26,26,0.12)"
                        : "0 0 0 0 rgba(26,26,26,0)",
                      transitionProperty: "left, top, width, height, opacity, box-shadow",
                    }}
                  />

                  {isContent && isOpen && compartment && (
                    <div
                      className={cn("pointer-events-none absolute inset-0", aligned ? "z-20" : "z-[3]")}
                      style={aligned ? undefined : { clipPath: PAPER_CLIP }}
                    >
                      <div
                        className={cn(
                          "pointer-events-auto",
                          aligned ? "fixed left-1/2 z-[60] -translate-x-1/2" : "absolute left-1/2",
                        )}
                        style={
                          aligned
                            ? {
                                top: FOCUSED_LIST_INSET,
                                bottom: FOCUSED_LIST_INSET,
                                width: FOCUSED_LIST_WIDTH,
                              }
                            : {
                                width: paperWidth,
                                top: FRONT_TOP,
                                height: 0,
                                transform: "translate(-50%, 0)",
                              }
                        }
                        onPointerEnter={(event) => {
                          if (event.pointerType !== "mouse") return
                          cancelClose()
                        }}
                        onPointerLeave={(event) => {
                          if (event.pointerType !== "mouse") return
                          if (keepHover.current) return
                          const next = event.relatedTarget
                          if (next instanceof Node && event.currentTarget.contains(next)) return
                          setHoveredPaper(null)
                        }}
                        onClick={(event) => {
                          event.stopPropagation()
                          if (risen > 0 || reduceMotion) setAligned(true)
                        }}
                      >
                        {!aligned && (
                          <div
                            aria-hidden
                            className="absolute bottom-0 left-0 w-full"
                            style={{ height: Math.max(420, cardHeight * 2.5) }}
                          />
                        )}
                        <div
                          className={cn(
                            "relative",
                            aligned &&
                              "h-full py-20 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                          )}
                          ref={scrollerRef}
                          tabIndex={aligned ? 0 : undefined}
                          aria-label={aligned ? compartment.label : undefined}
                        >
                          <div className={cn(aligned && "flex min-h-full flex-col justify-center")}>
                            {compartment.documents.map((paper, paperIndex) => {
                              const revealed = risen > paperIndex
                              const pose = revealed
                                ? folderMode
                                  ? folderRisenPose(paperIndex, compartment.documents.length)
                                  : fanPose(paperIndex, compartment.documents.length)
                                : peeked
                                  ? folderMode
                                    ? folderPeekPose(paperIndex)
                                    : peekPose(paperIndex, cardHeight)
                                  : hiddenPose(cardHeight)
                              const shared = {
                                paper,
                                stackIndex: paperIndex,
                                pose,
                                hidden: !peeked,
                                aligned,
                                active: aligned && activePaper === paperIndex,
                                reduceMotion,
                                onEngage: engagePapers,
                                onHover: showThumbnail,
                                cardRef: (node: HTMLElement | null) => {
                                  cardNodes.current[paperIndex] = node
                                },
                              }
                              return folderMode ? (
                                <FolderFile
                                  key={paper.index}
                                  {...shared}
                                  tabAlign={paperIndex % 2 === 0 ? "left" : "right"}
                                />
                              ) : (
                                <PaperCard key={paper.index} {...shared} />
                              )
                            })}
                            {folderMode && !aligned && (
                              <FolderCover
                                label={compartment.cover}
                                count={compartment.documents.length}
                                peeked={peeked}
                                risen={risen > 0}
                                reduceMotion={reduceMotion}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={compartment?.label ?? `Compartment ${index + 1}`}
                    onPointerDown={(event) => {
                      lastPointer.current = event.pointerType
                    }}
                    onClick={(event) => {
                      if (event.detail === 0) {
                        openCompartment(index)
                        return
                      }
                      if (lastPointer.current === "mouse") return
                      if (openIndexRef.current === index) close()
                      else openCompartment(index)
                    }}
                    className={cn("absolute z-10 cursor-pointer bg-transparent p-0 text-left", MORPH)}
                    style={isOpen ? frontArtStyle : closedFrontStyle}
                  >
                    <img
                      src={DRAWER_FRONT}
                      alt=""
                      draggable={false}
                      className={cn(
                        "pointer-events-none block h-full w-full max-w-none transition-opacity duration-[450ms] ease-out motion-reduce:transition-none",
                        isOpen ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

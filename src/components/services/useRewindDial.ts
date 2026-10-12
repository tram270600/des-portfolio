import { useEffect, useRef, type RefObject } from "react"

import {
  ORBIT,
  PLAYERS,
  clamp,
  handAngles,
  loadCutout,
  playerSrc,
  wrapAngle,
} from "@/lib/rewindPlayers"

type DialRefs = {
  rootRef: RefObject<HTMLElement | null>
  faceRef: RefObject<SVGSVGElement | null>
  sliderRef: RefObject<HTMLElement | null>
  hourRef: RefObject<SVGGElement | null>
  minuteRef: RefObject<SVGGElement | null>
  secondRef: RefObject<SVGGElement | null>
  hintRef: RefObject<HTMLElement | null>
  onProgress: (progress: number, reduce: boolean) => void
  fullRing?: boolean
  hold?: boolean
  turns?: number
}

export function useRewindDial({
  rootRef,
  faceRef,
  sliderRef,
  hourRef,
  minuteRef,
  secondRef,
  hintRef,
  onProgress,
  fullRing = false,
  hold = false,
  turns = 1,
}: DialRefs) {
  const onProgressRef = useRef(onProgress)
  onProgressRef.current = onProgress

  useEffect(() => {
    const root = rootRef.current
    const face = faceRef.current
    const slider = sliderRef.current
    if (!root || !face || !slider) return

    const listenOn = root.closest("section") ?? root
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let reduce = motion.matches
    let frame = 0
    let running = false
    let rewind = 0
    let lastAngle: number | null = null
    let lastDistance = 0
    let lastX: number | null = null
    let pending = 0
    let engaged = false
    let holding = false
    let outsideAt = 0
    let lastPercent = -1
    let cancelled = false

    const maxRewind = ORBIT * turns

    const apply = (_now?: number) => {
      const circles = rewind / ORBIT
      const progress = circles / turns
      onProgressRef.current(progress, reduce)

      const angles = handAngles(turns > 1 ? 0 : progress, reduce)
      const wind = turns > 1 ? (rewind * 180) / Math.PI : 0
      hourRef.current?.setAttribute("transform", `rotate(${angles.hour - wind} 50 50)`)
      minuteRef.current?.setAttribute("transform", `rotate(${angles.minute - wind} 50 50)`)
      secondRef.current?.setAttribute("transform", `rotate(${angles.second - wind} 50 50)`)
      if (hintRef.current) hintRef.current.style.opacity = circles > 0.04 ? "0" : "1"

      const percent = Math.round(progress * 100)
      if (percent !== lastPercent) {
        lastPercent = percent
        const span = PLAYERS.length - 1
        const era = turns > 1 ? Math.min(span, Math.floor(circles + 1e-4)) : Math.round(progress * span)
        slider.setAttribute("aria-valuenow", String(percent))
        slider.setAttribute("aria-valuetext", turns > 1 ? PLAYERS[era].label : PLAYERS[era]?.name ?? PLAYERS[0].name)
      }
      if (root instanceof HTMLElement) root.dataset.rewind = progress.toFixed(3)
    }

    const stepRewind = (delta: number) => {
      rewind = clamp(rewind + delta, 0, maxRewind)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const step = turns > 1 ? ORBIT : ORBIT / 12
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault()
        stepRewind(step)
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault()
        stepRewind(-step)
      } else if (event.key === "Home") {
        event.preventDefault()
        rewind = 0
      } else if (event.key === "End") {
        event.preventDefault()
        rewind = maxRewind
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      holding = true
      engaged = true
      pending = 0
      lastAngle = null
      try {
        slider.setPointerCapture(event.pointerId)
      } catch {
        // The pointer can already be gone. Turning still tracks the move.
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const bounds = face.getBoundingClientRect()
      const centerX = bounds.left + bounds.width / 2
      const centerY = bounds.top + bounds.height / 2
      const dx = event.clientX - centerX
      const dy = event.clientY - centerY
      const distance = Math.hypot(dx, dy)

      if (hold) {
        if (!holding) return
        const angle = Math.atan2(dy, dx)
        const previous = lastAngle
        lastAngle = angle
        lastDistance = distance
        if (previous !== null) {
          const delta = wrapAngle(angle - previous)
          if (Math.abs(delta) <= 0.9) stepRewind(-delta)
        }
        return
      }

      const clip = fullRing ? null : root.querySelector("[data-cabinet]")
      const clipTop = clip?.getBoundingClientRect().top ?? centerY + bounds.height
      const belowClip = !fullRing && event.clientY > clipTop + 4
      const maxDistance = belowClip ? bounds.width * 0.42 : Math.max(168, bounds.width * 1.85)
      const inRing = distance >= 18 && distance <= maxDistance

      if (inRing) {
        outsideAt = 0
        const angle = Math.atan2(dy, dx)
        const previous = lastAngle
        const previousDistance = lastDistance
        lastAngle = angle
        lastDistance = distance
        if (previous !== null) {
          const delta = wrapAngle(angle - previous)
          const arc = Math.abs(delta) * ((distance + previousDistance) / 2)
          const radial = Math.abs(distance - previousDistance)
          if (Math.abs(delta) <= 0.9 && arc > radial * 1.15) {
            const turned = -delta
            if (engaged) {
              stepRewind(turned)
            } else {
              pending = Math.sign(turned) === Math.sign(pending) || pending === 0 ? pending + turned : turned
              if (Math.abs(pending) >= 0.42) {
                engaged = true
                stepRewind(pending)
                pending = 0
              }
            }
          }
        }
        lastX = event.clientX
        return
      }

      lastAngle = null
      if (outsideAt === 0) outsideAt = performance.now()
      else if (performance.now() - outsideAt > 420) {
        engaged = false
        pending = 0
      }

      if (event.pointerType === "mouse") {
        lastX = null
        return
      }
      if (lastX === null) {
        lastX = event.clientX
        return
      }
      const drag = event.clientX - lastX
      lastX = event.clientX
      if (Math.abs(drag) < 0.5) return
      if (!engaged) {
        pending += -drag * 0.012
        if (Math.abs(pending) < 0.28) return
        engaged = true
        stepRewind(pending)
        pending = 0
        return
      }
      stepRewind(-drag * 0.012)
    }

    const onPointerEnd = () => {
      holding = false
      lastAngle = null
      lastX = null
      engaged = false
      pending = 0
      outsideAt = 0
    }

    const onPointerLeave = () => {
      if (hold && holding) return
      onPointerEnd()
    }

    const loop = (now: number) => {
      apply(now)
      if (running) frame = window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (running) return
      running = true
      frame = window.requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      window.cancelAnimationFrame(frame)
    }

    root.querySelectorAll<HTMLImageElement>("[data-era] img").forEach((image) => {
      const era = Number(image.closest("[data-era]")?.getAttribute("data-era"))
      const player = PLAYERS[era]
      if (!player) return
      loadCutout(playerSrc(player.file)).then(
        (url) => {
          if (!cancelled) image.src = url
        },
        () => {
          if (!cancelled) image.src = playerSrc(player.file)
        },
      )
    })

    apply(performance.now())
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start()
      else stop()
    })
    observer.observe(root)
    if (hold) slider.addEventListener("pointerdown", onPointerDown)
    listenOn.addEventListener("pointermove", onPointerMove)
    listenOn.addEventListener("pointerleave", onPointerLeave)
    listenOn.addEventListener("pointercancel", onPointerEnd)
    listenOn.addEventListener("pointerup", onPointerEnd)
    slider.addEventListener("keydown", onKeyDown)
    const onMotion = () => {
      reduce = motion.matches
    }
    motion.addEventListener("change", onMotion)
    const resize = new ResizeObserver(() => apply(performance.now()))
    resize.observe(root)

    return () => {
      cancelled = true
      stop()
      observer.disconnect()
      resize.disconnect()
      if (hold) slider.removeEventListener("pointerdown", onPointerDown)
      listenOn.removeEventListener("pointermove", onPointerMove)
      listenOn.removeEventListener("pointerleave", onPointerLeave)
      listenOn.removeEventListener("pointercancel", onPointerEnd)
      listenOn.removeEventListener("pointerup", onPointerEnd)
      slider.removeEventListener("keydown", onKeyDown)
      motion.removeEventListener("change", onMotion)
    }
  }, [faceRef, fullRing, hintRef, hold, hourRef, minuteRef, rootRef, secondRef, sliderRef, turns])
}

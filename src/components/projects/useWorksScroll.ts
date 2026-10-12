import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { useMotionValue, useReducedMotion, type MotionValue } from "motion/react"

const HOLD = 0.1
const COMMIT = 0.26

function stepHeight() {
  const mobile = window.matchMedia("(max-width: 1023px)").matches
  return window.innerHeight * (mobile ? 0.36 : 0.46)
}

function trackHeight(count: number) {
  return Math.round(window.innerHeight + stepHeight() * count)
}

/** Scroll position in project units. The final unit holds the last project, then the section releases. */
function readPosition(track: HTMLElement, count: number) {
  const scrollable = track.offsetHeight - window.innerHeight
  if (scrollable <= 0) return 0
  const start = track.getBoundingClientRect().top + window.scrollY
  const scrolled = Math.min(Math.max(window.scrollY - start, 0), scrollable)
  return (scrolled / scrollable) * count
}

function mapToIndex(position: number, count: number, reduce: boolean) {
  const max = count - 1
  if (position >= max) return max
  if (reduce) return position
  const base = Math.floor(position)
  const frac = position - base
  if (frac <= HOLD) return base
  const t = (frac - HOLD) / (1 - HOLD)
  const eased = t * t * (3 - 2 * t)
  return base + eased
}

function snapIndex(position: number, count: number) {
  const max = count - 1
  if (position >= max) return null
  const base = Math.floor(position)
  const frac = position - base
  if (frac < HOLD) return null
  return frac > COMMIT ? Math.min(max, base + 1) : base
}

export function useWorksScroll(count: number) {
  const reduce = useReducedMotion() === true
  const reduceRef = useRef(reduce)
  reduceRef.current = reduce
  const programmaticRef = useRef(false)

  const trackRef = useRef<HTMLElement>(null)
  const [height, setHeight] = useState(() => trackHeight(count))
  const raw = useMotionValue(0)
  const visual = useMotionValue(0)
  const velocity = useMotionValue(0)
  const springVelocity = useRef(0)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const scrollable = track.offsetHeight - window.innerHeight
    const start = track.getBoundingClientRect().top + window.scrollY
    const top = start + (index / count) * scrollable
    programmaticRef.current = true
    window.scrollTo({ top, behavior: reduceRef.current ? "auto" : "smooth" })
  }, [count])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => setHeight(trackHeight(count))
    measure()

    let frame = 0
    let loop = 0
    let snapLock = false
    let timer = 0
    let last = performance.now()

    const settleSpring = (now: number) => {
      const position = readPosition(track, count)
      raw.set(position)
      const target = mapToIndex(position, count, reduceRef.current)
      const current = visual.get()
      const rect = track.getBoundingClientRect()
      const onScreen = rect.bottom > -80 && rect.top < window.innerHeight + 80

      if (reduceRef.current) {
        visual.set(target)
        springVelocity.current = 0
        velocity.set(0)
        if (onScreen) loop = requestAnimationFrame(settleSpring)
        return
      }

      const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000))
      last = now
      const stiffness = 280
      const damping = 27
      const mass = 0.8
      const accel = (-stiffness * (current - target) - damping * springVelocity.current) / mass
      const nextVelocity = springVelocity.current + accel * dt
      let next = current + nextVelocity * dt
      const settled = Math.abs(target - next) < 0.0008 && Math.abs(nextVelocity) < 0.01

      if (settled) {
        visual.set(target)
        springVelocity.current = 0
        velocity.set(0)
      } else {
        springVelocity.current = nextVelocity
        velocity.set(next - current)
        visual.set(next)
      }

      if (onScreen || !settled) loop = requestAnimationFrame(settleSpring)
    }

    const kick = () => {
      cancelAnimationFrame(loop)
      last = performance.now()
      loop = requestAnimationFrame(settleSpring)
    }

    const update = () => {
      raw.set(readPosition(track, count))
      kick()
    }

    const settle = () => {
      if (snapLock || programmaticRef.current || reduceRef.current) return
      const target = snapIndex(readPosition(track, count), count)
      if (target == null) return
      const scrollable = track.offsetHeight - window.innerHeight
      const start = track.getBoundingClientRect().top + window.scrollY
      const top = start + (target / count) * scrollable
      if (Math.abs(top - window.scrollY) < 2) return
      snapLock = true
      programmaticRef.current = true
      window.scrollTo({ top, behavior: "smooth" })
      window.setTimeout(() => {
        snapLock = false
      }, 650)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
      if (programmaticRef.current || reduceRef.current) return
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, 110)
    }

    const onScrollEnd = () => {
      window.clearTimeout(timer)
      if (programmaticRef.current) {
        programmaticRef.current = false
        snapLock = false
        update()
        return
      }
      settle()
    }

    const onTouchStart = () => {
      if (!programmaticRef.current && !snapLock) return
      programmaticRef.current = false
      snapLock = false
      window.scrollTo({ top: window.scrollY, behavior: "auto" })
    }

    const observer = new IntersectionObserver(() => kick(), { rootMargin: "120px" })
    observer.observe(track)

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("scrollend", onScrollEnd)
    window.addEventListener("resize", measure)
    window.addEventListener("touchstart", onTouchStart, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(loop)
      window.clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("scrollend", onScrollEnd)
      window.removeEventListener("resize", measure)
      window.removeEventListener("touchstart", onTouchStart)
    }
  }, [count, raw, velocity, visual])

  return { trackRef, height, raw, visual, velocity, reduce, scrollToIndex }
}

export type WorksMotion = {
  raw: MotionValue<number>
  visual: MotionValue<number>
  velocity: MotionValue<number>
}

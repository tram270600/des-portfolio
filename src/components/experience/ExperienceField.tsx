import { useEffect, useRef } from "react"

// Hover field in the portfolio palette: blue, green, yellow, coral.
const COLORS = ["#0069D7", "#00B77F", "#FDE55D", "#FC664B"] as const

type Mark = {
  x: number
  y: number
  length: number
  width: number
  color: string
  dot: boolean
}

type Point = { x: number; y: number }

function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function smooth(edge0: number, edge1: number, amount: number) {
  const span = edge1 - edge0
  const t = span === 0 ? 0 : Math.min(1, Math.max(0, (amount - edge0) / span))
  return t * t * (3 - 2 * t)
}

function logoColumnLeft(width: number) {
  const pad = width >= 768 ? 32 : 20
  const content = Math.min(width, 1152)
  const innerLeft = (width - content) / 2 + pad
  const innerWidth = content - pad * 2
  const listMax = width >= 1280 ? 1024 : 768
  const listWidth = Math.min(listMax, innerWidth)
  return innerLeft + Math.max(0, innerWidth - listWidth) / 2
}

function buildMarks(width: number, height: number) {
  const next = random(11)
  const marks: Mark[] = []
  const min = Math.min(width, height)

  const radius = Math.min(168, min * 0.2)
  const cx = width - radius * 0.72
  const cy = height * 0.5
  for (let x = cx - radius; x <= cx + radius; x += 3.4) {
    const dx = (x - cx) / radius
    const half = Math.sqrt(Math.max(0, 1 - dx * dx)) * radius
    if (half < 3 || next() < 0.08) continue
    const edge = Math.abs(dx)
    const color = edge < 0.22 ? COLORS[0] : edge < 0.48 ? COLORS[1] : edge < 0.74 ? COLORS[2] : COLORS[3]
    let y = cy - half
    const end = cy + half
    while (y < end) {
      const along = (y - (cy - half)) / (half * 2)
      const length = Math.min(4 + (1 - Math.abs(along - 0.5) * 2) * 18 * (0.45 + next() * 0.8), end - y)
      if (length > 2.4 && next() > 0.06) {
        marks.push({ x, y: y + length / 2, length, width: 1.7, color, dot: false })
      }
      y += length + 3.2 + next() * 5.5
    }
  }

  const left = 10
  const right = logoColumnLeft(width) - 28
  const span = Math.max(56, right - left)
  const originY = height * 0.42
  const count = Math.round(Math.min(180, 48 + span * 0.7))
  for (let index = 0; index < count; index += 1) {
    const spread = next() ** 0.62 * span
    const x = Math.min(right, left + spread * (0.12 + next() * 0.88))
    const y = originY + (left - x) * 0.42 + (next() - 0.5) * span * 0.5
    const dot = next() > 0.42
    marks.push({
      x,
      y,
      length: dot ? 2.4 : 5 + next() * 11,
      width: dot ? 2.4 : 1.5,
      color: COLORS[Math.floor(next() * COLORS.length)],
      dot,
    })
  }

  const cell = 32
  for (let y = cell * 0.5; y < height; y += cell) {
    for (let x = cell * 0.5; x < width; x += cell) {
      if (next() > 0.16) continue
      const dot = next() > 0.55
      const markX = x + (next() - 0.5) * 14
      const logoLeft = logoColumnLeft(width)
      if (markX > logoLeft - 12 && markX < logoLeft + 120) continue
      marks.push({
        x: markX,
        y: y + (next() - 0.5) * 14,
        length: dot ? 2.2 : 5 + next() * 10,
        width: dot ? 2.2 : 1.35,
        color: COLORS[Math.floor(next() * COLORS.length)],
        dot,
      })
    }
  }

  return marks
}

function warp(x: number, y: number, trail: Point[]) {
  let offsetX = 0
  let offsetY = 0
  let boost = 0
  for (let index = 0; index < trail.length; index += 1) {
    const point = trail[index]
    const dx = x - point.x
    const dy = y - point.y
    const distance = Math.hypot(dx, dy)
    const radius = 168 * (1 - index * 0.055)
    if (distance >= radius || distance < 0.5) continue
    const falloff = (1 - distance / radius) ** 2 * (1 - index / trail.length)
    offsetX += (dx / distance) * falloff * 16
    offsetY += (dy / distance) * falloff * 9
    boost = Math.max(boost, falloff)
  }
  return { x: x + offsetX, y: y + offsetY, boost }
}

export function ExperienceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.closest("section")
    const context = canvas?.getContext("2d")
    if (!canvas || !section || !context) return

    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let marks: Mark[] = []
    let width = 0
    let height = 0
    let opacity = 0
    let progress = 0
    let hovering = false
    let inView = false
    let running = false
    let frame = 0
    let last = performance.now()
    let cursor: Point | null = null
    const trail: Point[] = Array.from({ length: 10 }, () => ({ x: -4000, y: -4000 }))

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.max(1, Math.round(width * dpr))
      const nextHeight = Math.max(1, Math.round(height * dpr))
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      marks = width > 0 && height > 0 ? buildMarks(width, height) : []
    }

    const shown = () => (fineQuery.matches ? hovering : inView)

    const paint = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const reduce = reduceQuery.matches
      const active = shown()
      const target = active ? 1 : 0
      opacity += (target - opacity) * (1 - Math.exp(-dt * (active ? 5.5 : 7)))
      if (reduce) progress = active ? 1 : progress
      else if (active) progress = Math.min(1, progress + dt / 0.9)

      if (!active && opacity < 0.012) {
        opacity = 0
        progress = 0
        context.clearRect(0, 0, width, height)
        return
      }

      if (!reduce && cursor && active) {
        let previous = cursor
        for (const point of trail) {
          point.x += (previous.x - point.x) * 0.42
          point.y += (previous.y - point.y) * 0.42
          previous = point
        }
      }

      context.clearRect(0, 0, width, height)
      context.fillStyle = "rgba(26, 26, 26, 0.055)"
      const grid = 48
      for (let y = grid; y < height; y += grid) {
        for (let x = grid; x < width; x += grid) {
          context.globalAlpha = opacity * 0.55
          context.fillRect(x, y, 1.25, 1.25)
        }
      }

      const maxDist = Math.hypot(width, height) || 1
      const origin = cursor ?? { x: width * 0.5, y: height * 0.5 }
      for (const mark of marks) {
        const placed = reduce || !cursor ? { x: mark.x, y: mark.y, boost: 0 } : warp(mark.x, mark.y, trail)
        const order = Math.hypot(mark.x - origin.x, mark.y - origin.y) / maxDist
        const reveal = progress >= 1 ? 1 : smooth(order - 0.045, order + 0.045, progress)
        if (reveal <= 0.01) continue
        context.globalAlpha = reveal * opacity * (0.62 + placed.boost * 0.38)
        context.fillStyle = mark.color
        if (mark.dot) {
          context.beginPath()
          context.arc(placed.x, placed.y, mark.width / 2, 0, Math.PI * 2)
          context.fill()
          continue
        }
        const radius = mark.width / 2
        context.beginPath()
        context.roundRect(placed.x - radius, placed.y - mark.length / 2, mark.width, mark.length, radius)
        context.fill()
      }
      context.globalAlpha = 1
    }

    const loop = (now: number) => {
      paint(now)
      if (!shown() && opacity === 0) {
        running = false
        return
      }
      frame = window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      frame = window.requestAnimationFrame(loop)
    }

    const pointFrom = (event: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }

    const onEnter = (event: PointerEvent) => {
      if (!fineQuery.matches) return
      hovering = true
      cursor = pointFrom(event)
      for (const point of trail) {
        point.x = cursor.x
        point.y = cursor.y
      }
      start()
    }

    const onMove = (event: PointerEvent) => {
      if (!fineQuery.matches) return
      hovering = true
      cursor = pointFrom(event)
      start()
    }

    const onLeave = () => {
      if (!fineQuery.matches) return
      hovering = false
    }

    const onChange = () => start()

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.35)
        if (!fineQuery.matches && inView) start()
      },
      { threshold: [0, 0.35, 0.6] },
    )

    resize()
    observer.observe(canvas)
    section.addEventListener("pointerenter", onEnter)
    section.addEventListener("pointermove", onMove)
    section.addEventListener("pointerleave", onLeave)
    section.addEventListener("pointercancel", onLeave)
    fineQuery.addEventListener("change", onChange)
    reduceQuery.addEventListener("change", onChange)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      section.removeEventListener("pointerenter", onEnter)
      section.removeEventListener("pointermove", onMove)
      section.removeEventListener("pointerleave", onLeave)
      section.removeEventListener("pointercancel", onLeave)
      fineQuery.removeEventListener("change", onChange)
      reduceQuery.removeEventListener("change", onChange)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}

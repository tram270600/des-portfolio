import { useEffect, useRef } from "react"

const SHAPES = [
  {
    src: "/images/hero-walkman.png",
    rotate: -10,
    seal: 10,
    slot: "upper-left",
    colors: ["#FC664B", "#FDE55D", "#00B77F", "#FC664B"] as const,
  },
  {
    src: "/images/hero-computer.png",
    rotate: -8,
    seal: 5,
    slot: "lower-left",
    colors: ["#0069D7", "#00B77F", "#FDE55D", "#0069D7"] as const,
  },
  {
    src: "/images/hero-famicom.png",
    rotate: 4,
    seal: 8,
    keepWhite: false,
    slot: "right",
    colors: ["#FC664B", "#FC664B", "#FDE55D", "#00B77F"] as const,
  },
] as const

type Mark = {
  x: number
  y: number
  length: number
  width: number
  color: string
  dot: boolean
}

type Point = { x: number; y: number }

type Mask = { ink: Uint8Array; w: number; h: number }

type Frame = { x: number; y: number; w: number; h: number }

type Layout = {
  holes: Frame[]
  upperLeft: Frame
  lowerLeft: Frame
  right: Frame
}

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
  const t = span === 0 ? 0 : Math.min(1, Math.max(0, (amount - edge0) / (span || 1)))
  return t * t * (3 - 2 * t)
}

function sealGaps(source: Uint8Array, w: number, h: number, maxGap: number) {
  const sealed = source.slice()
  const fill = (buffer: Uint8Array, horizontal: boolean) => {
    const outer = horizontal ? h : w
    const inner = horizontal ? w : h
    for (let a = 0; a < outer; a += 1) {
      let seen = false
      let gap = -1
      for (let b = 0; b < inner; b += 1) {
        const index = horizontal ? a * w + b : b * w + a
        if (buffer[index]) {
          if (seen && gap >= 0 && b - gap <= maxGap) {
            for (let fillAt = gap; fillAt < b; fillAt += 1) {
              const target = horizontal ? a * w + fillAt : fillAt * w + a
              sealed[target] = 1
            }
          }
          seen = true
          gap = -1
        } else if (seen && gap < 0) {
          gap = b
        }
      }
    }
  }
  fill(source, true)
  fill(sealed, false)
  return sealed
}

function cropInk(ink: Uint8Array, w: number, h: number): Mask | null {
  let minX = w
  let minY = h
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (!ink[y * w + x]) continue
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
  if (maxX < minX || maxY < minY) return null
  const cw = maxX - minX + 1
  const ch = maxY - minY + 1
  const cropped = new Uint8Array(cw * ch)
  for (let y = 0; y < ch; y += 1) {
    cropped.set(ink.subarray((y + minY) * w + minX, (y + minY) * w + minX + cw), y * cw)
  }
  return { ink: cropped, w: cw, h: ch }
}

function maskFrom(image: HTMLImageElement, maxGap: number, keepWhite: boolean): Mask | null {
  const w = 200
  const h = Math.max(1, Math.round(w * (image.naturalHeight / image.naturalWidth)))
  const sample = document.createElement("canvas")
  sample.width = w
  sample.height = h
  const context = sample.getContext("2d", { willReadFrequently: true })
  if (!context) return null
  context.drawImage(image, 0, 0, w, h)
  const data = context.getImageData(0, 0, w, h).data
  const ink = new Uint8Array(w * h)
  for (let index = 0; index < w * h; index += 1) {
    const offset = index * 4
    const red = data[offset]
    const green = data[offset + 1]
    const blue = data[offset + 2]
    if (data[offset + 3] < 24) continue
    if (!keepWhite && red > 186 && green > 186 && blue > 186) continue
    if (red > 20 || green > 20 || blue > 20) ink[index] = 1
  }
  return cropInk(sealGaps(ink, w, h, maxGap), w, h)
}

function inside(mask: Mask, u: number, v: number) {
  if (u < 0 || v < 0 || u >= 1 || v >= 1) return false
  const x = Math.min(mask.w - 1, Math.floor(u * mask.w))
  const y = Math.min(mask.h - 1, Math.floor(v * mask.h))
  return mask.ink[y * mask.w + x] === 1
}

function blocked(x: number, y: number, holes: Frame[]) {
  for (const hole of holes) {
    if (x > hole.x && x < hole.x + hole.w && y > hole.y && y < hole.y + hole.h) return true
  }
  return false
}

function shapeMarks(
  mask: Mask,
  box: Frame,
  rotate: number,
  colors: readonly string[],
  holes: Frame[],
  next: () => number,
) {
  const marks: Mark[] = []
  const step = 2.35
  const pad = 6
  const radians = (rotate * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2

  for (let x = box.x - pad; x <= box.x + box.w + pad; x += step) {
    let y = box.y - pad
    const end = box.y + box.h + pad
    while (y <= end) {
      let runStart = -1
      let cursor = y
      while (cursor <= end) {
        const dx = x - cx
        const dy = cursor - cy
        const localX = dx * cos + dy * sin
        const localY = -dx * sin + dy * cos
        const on = inside(mask, localX / box.w + 0.5, localY / box.h + 0.5)
        if (on && runStart < 0) runStart = cursor
        if (!on && runStart >= 0) break
        cursor += 1.5
      }
      if (runStart < 0) break
      let dash = runStart
      while (dash < cursor) {
        const length = Math.min(5 + next() * 8, cursor - dash)
        const markY = dash + length / 2
        if (length > 2.4 && next() > 0.04 && !blocked(x, markY, holes)) {
          const edge = Math.min(1, Math.hypot((x - cx) / (box.w * 0.5), (markY - cy) / (box.h * 0.5)))
          const dot = next() > 0.9
          marks.push({
            x,
            y: markY,
            length: dot ? 2.3 : length,
            width: dot ? 2.3 : 1.7,
            color: colors[Math.min(colors.length - 1, Math.floor(edge * colors.length))],
            dot,
          })
        }
        dash += length + 1.7 + next() * 1.5
      }
      y = cursor + 1.5
    }
  }
  return marks
}

function fit(mask: Mask, region: Frame, anchor: "start" | "end" | "center"): Frame {
  const aspect = mask.w / Math.max(1, mask.h)
  let w = region.w
  let h = w / aspect
  if (h > region.h) {
    h = region.h
    w = h * aspect
  }
  const x = region.x + (region.w - w) / 2
  const y = anchor === "start" ? region.y : anchor === "end" ? region.y + region.h - h : region.y + (region.h - h) / 2
  return { x, y, w, h }
}

function inflate(frame: Frame, pad: number): Frame {
  return { x: frame.x - pad, y: frame.y - pad, w: frame.w + pad * 2, h: frame.h + pad * 2 }
}

function frameOf(element: Element, root: DOMRect): Frame {
  const rect = element.getBoundingClientRect()
  return { x: rect.left - root.left, y: rect.top - root.top, w: rect.width, h: rect.height }
}

function shownOpacity(element: Element) {
  const host = element.closest("[data-project-index]") ?? element
  const value = Number(getComputedStyle(host).opacity)
  return Number.isFinite(value) ? value : 1
}

function readLayout(section: HTMLElement, canvas: HTMLCanvasElement): Layout {
  const root = canvas.getBoundingClientRect()
  const width = root.width
  const height = root.height
  const contentWidth = Math.min(width, 1152)
  const contentLeft = (width - contentWidth) / 2
  const contentRight = contentLeft + contentWidth
  const walkman = Math.min(height * 0.56, 320)
  const computer = Math.min(height * 0.6, 344)
  const famicom = Math.min(height * 0.64, 368)
  const holes: Frame[] = []
  const add = (element: Element | null, pad: number) => {
    if (!element || shownOpacity(element) < 0.35) return
    const frame = frameOf(element, root)
    if (frame.w < 8 || frame.h < 8) return
    holes.push(inflate(frame, pad))
  }
  add(section.querySelector("h2"), 12)
  add(section.querySelector('a[href="/experience"]'), 8)
  for (const node of section.querySelectorAll("h3, p")) add(node, 8)
  let explore: Frame | null = null
  let exploreScore = 0
  for (const link of section.querySelectorAll("a")) {
    if (!link.textContent?.trim().startsWith("Explore")) continue
    if (shownOpacity(link) < 0.45) continue
    const frame = frameOf(link, root)
    holes.push(inflate(frame, 10))
    const score = shownOpacity(link) * frame.w * frame.h
    if (score > exploreScore) {
      exploreScore = score
      explore = frame
    }
  }
  for (const control of section.querySelectorAll("ul button, ul a")) add(control, 6)

  return {
    holes,
    upperLeft: { x: contentLeft - walkman * 0.42, y: height * 0.05, w: walkman, h: walkman },
    lowerLeft: {
      x: explore ? explore.x - computer * 0.08 : contentLeft - computer * 0.2,
      y: explore ? explore.y + explore.h + 18 : height * 0.58,
      w: computer,
      h: computer,
    },
    right: { x: contentRight - famicom * 0.42, y: (height - famicom) * 0.4, w: famicom, h: famicom },
  }
}

function buildMarks(masks: Map<string, Mask>, layout: Layout) {
  const next = random(19)
  const marks: Mark[] = []
  const regions = {
    "upper-left": layout.upperLeft,
    "lower-left": layout.lowerLeft,
    right: layout.right,
  } as const
  const anchors = { "upper-left": "start", "lower-left": "end", right: "center" } as const
  for (const shape of SHAPES) {
    const mask = masks.get(shape.src)
    if (!mask) continue
    const box = fit(mask, regions[shape.slot], anchors[shape.slot])
    if (box.w < 48 || box.h < 48) continue
    marks.push(...shapeMarks(mask, box, shape.rotate, shape.colors, layout.holes, next))
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

function loadMask(src: string, maxGap: number, keepWhite: boolean) {
  return new Promise<Mask | null>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(maskFrom(image, maxGap, keepWhite))
    image.onerror = () => resolve(null)
    image.src = src
  })
}

export function WorksField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.closest("section")
    const context = canvas?.getContext("2d")
    if (!canvas || !section || !context) return

    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const masks = new Map<string, Mask>()
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
    let alive = true
    const trail: Point[] = Array.from({ length: 10 }, () => ({ x: -4000, y: -4000 }))

    const rebuild = () => {
      if (width <= 0 || height <= 0) {
        marks = []
        return
      }
      marks = buildMarks(masks, readLayout(section, canvas))
    }

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
      rebuild()
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
        context.globalAlpha = reveal * opacity * (0.7 + placed.boost * 0.3)
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

    void Promise.all(SHAPES.map(async (shape) => [shape.src, await loadMask(shape.src, shape.seal, "keepWhite" in shape && shape.keepWhite)] as const)).then((loaded) => {
      if (!alive) return
      for (const [src, mask] of loaded) {
        if (mask) masks.set(src, mask)
      }
      rebuild()
      if (shown()) start()
    })

    return () => {
      alive = false
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

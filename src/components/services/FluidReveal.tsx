import { useEffect, useRef } from "react"

const REVEAL_SRC = "/images/service/background-reveal.png"

// Walnut dresser inside background-reveal.png (1671×941), lined up with the cabinet.
const DRESSER = { x: 0.318, y: 0.578, w: 0.364, h: 0.225 }

// Dog TV "Mouse trail" (fluid-trail, Reveal / layers below).
const TRAIL_RADIUS = 136
const TRAIL_HARDNESS = 0.61
const TRAIL_LIFE = 0.05 + 35 * 0.03

type Point = { x: number; y: number; t: number }

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function harden(amount: number) {
  const width = 1 - TRAIL_HARDNESS * 0.98
  const edge0 = 0.5 - width * 0.5
  const edge1 = 0.5 + width * 0.5
  return smoothstep((amount - edge0) / (edge1 - edge0))
}

export function FluidReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.closest("section")
    const context = canvas?.getContext("2d", { alpha: true })
    if (!canvas || !section || !context) return

    const mask = document.createElement("canvas")
    const maskContext = mask.getContext("2d", { alpha: true, willReadFrequently: true })
    if (!maskContext) return

    const image = new Image()
    let imageReady = false
    image.onload = () => {
      imageReady = true
    }
    image.src = REVEAL_SRC

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let running = false
    let inside = false
    let cursor: Point | null = null
    let dyeScale = 1
    const trail: Point[] = []

    const resize = (width: number, height: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const nextWidth = Math.max(1, Math.round(width * dpr))
      const nextHeight = Math.max(1, Math.round(height * dpr))
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      dyeScale = 1 / Math.max(1, Math.min(width, height) / 420)
      const maskWidth = Math.max(1, Math.round(width * dyeScale))
      const maskHeight = Math.max(1, Math.round(height * dyeScale))
      if (mask.width !== maskWidth || mask.height !== maskHeight) {
        mask.width = maskWidth
        mask.height = maskHeight
        maskContext.setTransform(1, 0, 0, 1, 0, 0)
      }
    }

    const placement = () => {
      if (!imageReady) return null
      const canvasRect = canvas.getBoundingClientRect()
      const cabinet = section.querySelector("[data-cabinet]")
      if (cabinet instanceof HTMLElement) {
        const box = cabinet.getBoundingClientRect()
        if (box.width >= 1 && box.height >= 1) {
          const scale = box.width / (image.naturalWidth * DRESSER.w)
          const dw = image.naturalWidth * scale
          const dh = image.naturalHeight * scale
          const dresserHeight = DRESSER.h * dh
          return {
            dx: box.left - canvasRect.left - DRESSER.x * dw,
            dy: box.top - canvasRect.top + (box.height - dresserHeight) / 2 - DRESSER.y * dh,
            dw,
            dh,
          }
        }
      }
      const scale = Math.max(canvasRect.width / image.naturalWidth, canvasRect.height / image.naturalHeight)
      const dw = image.naturalWidth * scale
      const dh = image.naturalHeight * scale
      return {
        dx: (canvasRect.width - dw) / 2,
        dy: (canvasRect.height - dh) / 2,
        dw,
        dh,
      }
    }

    const stamp = (x: number, y: number, radius: number, amount: number) => {
      const px = x * dyeScale
      const py = y * dyeScale
      const reach = radius * 2 * dyeScale
      const gradient = maskContext.createRadialGradient(px, py, 0, px, py, reach)
      for (const t of [0, 0.25, 0.5, 0.75, 1]) {
        const level = Math.round((1 - smoothstep(t)) * amount * 255)
        gradient.addColorStop(t, `rgb(${level},${level},${level})`)
      }
      maskContext.globalCompositeOperation = "lighten"
      maskContext.fillStyle = gradient
      maskContext.beginPath()
      maskContext.arc(px, py, reach, 0, Math.PI * 2)
      maskContext.fill()
    }

    const pushTrail = (point: Point) => {
      const previous = trail[trail.length - 1]
      if (!previous) {
        trail.push(point)
        return
      }
      const distance = Math.hypot(point.x - previous.x, point.y - previous.y)
      const step = 8
      const steps = Math.ceil(distance / step)
      for (let index = 1; index <= steps; index += 1) {
        const amount = index / steps
        trail.push({
          x: previous.x + (point.x - previous.x) * amount,
          y: previous.y + (point.y - previous.y) * amount,
          t: point.t,
        })
      }
    }

    const applyHardness = () => {
      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height)
      const data = pixels.data
      for (let index = 3; index < data.length; index += 4) {
        const alpha = harden(data[index - 3] / 255)
        data[index] = Math.round(alpha * 255)
        data[index - 1] = 255
        data[index - 2] = 255
        data[index - 3] = 255
      }
      maskContext.putImageData(pixels, 0, 0)
    }

    const paint = () => {
      const now = performance.now()
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) return
      resize(width, height)

      const radius = Math.max(TRAIL_RADIUS, 1) * 0.0012 * height
      const fresh = trail.findIndex((point) => now - point.t < 2800)
      if (fresh > 0) trail.splice(0, fresh)
      if (fresh === -1) trail.length = 0

      maskContext.globalCompositeOperation = "source-over"
      maskContext.fillStyle = "#000"
      maskContext.fillRect(0, 0, mask.width, mask.height)
      for (const point of trail) {
        const keep = Math.exp(-((now - point.t) / 1000) / TRAIL_LIFE)
        if (keep > 0.04) stamp(point.x, point.y, radius, keep)
      }
      if (inside && cursor) stamp(cursor.x, cursor.y, radius, 1)
      maskContext.globalCompositeOperation = "source-over"
      applyHardness()

      context.clearRect(0, 0, width, height)
      const imageBox = placement()
      if (!imageBox) return
      context.globalCompositeOperation = "source-over"
      context.globalAlpha = 1
      context.drawImage(image, imageBox.dx, imageBox.dy, imageBox.dw, imageBox.dh)
      context.globalCompositeOperation = "destination-in"
      context.drawImage(mask, 0, 0, width, height)
      context.globalCompositeOperation = "source-over"
    }

    const loop = () => {
      paint()
      if (running) frame = window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || reduce) return
      running = true
      frame = window.requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      window.cancelAnimationFrame(frame)
      inside = false
      cursor = null
      trail.length = 0
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    const localPoint = (event: PointerEvent, time: number) => {
      const rect = canvas.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top, t: time }
    }

    const onPointer = (event: PointerEvent) => {
      const point = localPoint(event, performance.now())
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (point.x < 0 || point.y < 0 || point.x > width || point.y > height) return
      if (!running) start()
      inside = true
      const previous = cursor
      cursor = point
      if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) <= 0.5) return
      if (trail.length === 0) trail.push(previous)
      pushTrail(point)
    }

    const onLeave = () => {
      inside = false
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start()
      else if (!inside) stop()
    })
    observer.observe(section)
    section.addEventListener("pointermove", onPointer)
    section.addEventListener("pointerdown", onPointer)
    section.addEventListener("pointerleave", onLeave)
    section.addEventListener("pointercancel", onLeave)

    return () => {
      stop()
      observer.disconnect()
      section.removeEventListener("pointermove", onPointer)
      section.removeEventListener("pointerdown", onPointer)
      section.removeEventListener("pointerleave", onLeave)
      section.removeEventListener("pointercancel", onLeave)
    }
  }, [])

  return (
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
  )
}

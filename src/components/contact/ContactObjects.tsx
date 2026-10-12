import { useEffect, useRef, useState, type RefObject } from "react"

type TrailImage = {
  src: string
  width: number
}

const trail: TrailImage[] = [
  { src: "/images/about/star.png", width: 84 },
  { src: "/images/about/polaroid.png", width: 176 },
  { src: "/images/contact/image 966.png", width: 168 },
  { src: "/images/about/miffy.png", width: 132 },
  { src: "/images/about/photo-strip.png", width: 148 },
  { src: "/images/contact/image 973.png", width: 156 },
  { src: "/images/contact/image-roll.png", width: 176 },
  { src: "/images/about/non-la.png", width: 168 },
  { src: "/images/contact/image 977.png", width: 188 },
  { src: "/images/contact/image-pallete.png", width: 236 },
  { src: "/images/about/flag.png", width: 92 },
  { src: "/images/contact/Group 2.png", width: 132 },
  { src: "/images/contact/image 970.png", width: 140 },
  { src: "/images/about/camera.png", width: 150 },
  { src: "/images/contact/image 980.png", width: 200 },
  { src: "/images/contact/image 984.png", width: 150 },
  { src: "/images/about/cassette.png", width: 176 },
  { src: "/images/contact/image 986.png", width: 140 },
]

const trailDistance = 80
const moveEase = "cubic-bezier(0.25, 0.1, 0.25, 1)"
const fadeEase = "cubic-bezier(0.215, 0.61, 0.355, 1)"

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function useTrailEnabled() {
  const [enabled, setEnabled] = useState(
    () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setEnabled(hover.matches && !reduce.matches)
    hover.addEventListener("change", update)
    reduce.addEventListener("change", update)
    return () => {
      hover.removeEventListener("change", update)
      reduce.removeEventListener("change", update)
    }
  }, [])

  return enabled
}

export function ContactObjects({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const enabled = useTrailEnabled()
  const nodes = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!enabled) return
    const section = sectionRef.current
    if (!section) return
    const pool = nodes.current

    const mouse = { x: 0, y: 0 }
    const last = { x: 0, y: 0 }
    const cache = { x: 0, y: 0 }
    let inside = false
    let frame = 0
    let index = 0
    let z = 1

    const showNext = () => {
      const node = nodes.current[index]
      index = (index + 1) % trail.length
      if (!node) return

      const width = node.offsetWidth
      const height = node.offsetHeight || width
      const fromX = cache.x - width / 2
      const fromY = cache.y - height / 2
      const toX = mouse.x - width / 2
      const toY = mouse.y - height / 2

      z += 1
      node.style.zIndex = String(z)
      node.getAnimations().forEach((animation) => animation.cancel())

      const move = node.animate(
        [
          { opacity: 1, transform: `translate3d(${fromX}px, ${fromY}px, 0) scale(1)` },
          { opacity: 1, transform: `translate3d(${toX}px, ${toY}px, 0) scale(1)` },
        ],
        { duration: 400, easing: moveEase, fill: "forwards" },
      )

      move.onfinish = () => {
        if (move.playState !== "finished") return
        node.animate(
          [
            { opacity: 1, transform: `translate3d(${toX}px, ${toY}px, 0) scale(1)` },
            { opacity: 0, transform: `translate3d(${toX}px, ${toY}px, 0) scale(0.2)` },
          ],
          { duration: 400, easing: fadeEase, fill: "forwards" },
        )
      }
    }

    const render = () => {
      cache.x = lerp(cache.x, mouse.x, 0.1)
      cache.y = lerp(cache.y, mouse.y, 0.1)
      if (distance(mouse, last) > trailDistance) {
        showNext()
        last.x = mouse.x
        last.y = mouse.y
      }
      frame = requestAnimationFrame(render)
    }

    const start = (x: number, y: number) => {
      mouse.x = x
      mouse.y = y
      if (inside) return
      inside = true
      last.x = x
      last.y = y
      cache.x = x
      cache.y = y
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(render)
    }

    const stop = () => {
      inside = false
      cancelAnimationFrame(frame)
      frame = 0
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const rect = section.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        stop()
        return
      }
      if (!inside) start(x, y)
      else {
        mouse.x = x
        mouse.y = y
      }
    }

    section.addEventListener("pointermove", onMove)
    section.addEventListener("pointerleave", stop)
    return () => {
      section.removeEventListener("pointermove", onMove)
      section.removeEventListener("pointerleave", stop)
      cancelAnimationFrame(frame)
      pool.forEach((node) => node?.getAnimations().forEach((animation) => animation.cancel()))
    }
  }, [enabled, sectionRef])

  if (!enabled) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {trail.map((image, imageIndex) => (
        <div
          key={image.src}
          ref={(node) => {
            nodes.current[imageIndex] = node
          }}
          className="absolute top-0 left-0 opacity-0 will-change-transform"
          style={{ width: image.width }}
        >
          <img src={encodeURI(image.src)} alt="" draggable={false} className="block h-auto w-full select-none" />
        </div>
      ))}
    </div>
  )
}

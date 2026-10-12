import { animate, stagger } from "motion"

type Box = { width: number; height: number }

type Playback = { finished: Promise<unknown> }

type BlindsOptions = {
  size?: number
  direction?: "row" | "column"
  directionMode?: "normal" | "reverse"
}

const DURATION = 0.28
const STAGGER = 0.02

export function blinds({ size = 64, direction = "row", directionMode = "normal" }: BlindsOptions = {}) {
  const slats: HTMLElement[] = []
  const horizontal = direction === "row"
  const startOrigin = horizontal ? "center top" : "left center"
  const endOrigin = horizontal ? "center bottom" : "right center"

  const scale = (from: number, to: number, origin: string, fromIndex: number | "last"): Playback => {
    for (const slat of slats) slat.style.transformOrigin = origin
    const key = horizontal ? "scaleY" : "scaleX"
    return animate(
      slats,
      { [key]: [from, to] },
      { duration: DURATION, ease: [0.42, 0, 0.58, 1], delay: stagger(STAGGER, { from: fromIndex }) },
    )
  }

  return {
    setup(container: HTMLElement, box: Box) {
      const span = horizontal ? box.height : box.width
      const count = Math.max(1, Math.ceil(span / Math.max(size, 1)))
      const share = 100 / count
      for (let index = 0; index < count; index += 1) {
        const slat = document.createElement("div")
        slat.className = "motion-curtain"
        slat.style.position = "absolute"
        slat.style.willChange = "transform"
        slat.style.transformOrigin = startOrigin
        slat.style.transform = horizontal ? "scaleY(0)" : "scaleX(0)"
        if (horizontal) {
          slat.style.left = "0"
          slat.style.width = "100%"
          slat.style.top = `${index * share}%`
          slat.style.height = `calc(${share}% + 1px)`
        } else {
          slat.style.top = "0"
          slat.style.height = "100%"
          slat.style.left = `${index * share}%`
          slat.style.width = `calc(${share}% + 1px)`
        }
        container.appendChild(slat)
        slats.push(slat)
      }
    },
    cover() {
      return scale(0, 1, startOrigin, 0)
    },
    reveal() {
      const reverse = directionMode === "reverse"
      return scale(1, 0, reverse ? startOrigin : endOrigin, reverse ? "last" : 0)
    },
  }
}

function restoreFocus(focused: Element | null) {
  if (!(focused instanceof HTMLElement)) return
  if (focused.isConnected) {
    focused.focus()
    return
  }
  const label = focused.getAttribute("aria-label")
  if (!label) return
  const match = document.querySelector(`[aria-label="${CSS.escape(label)}"]`)
  if (match instanceof HTMLElement) match.focus()
}

export async function curtains(update: () => void | Promise<void>, options?: { effect?: ReturnType<typeof blinds> }) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    await update()
    return
  }

  const effect = options?.effect ?? blinds()
  const container = document.createElement("div")
  container.className = "motion-curtains"
  container.setAttribute("aria-hidden", "true")
  container.popover = "manual"
  Object.assign(container.style, {
    position: "fixed",
    margin: "0",
    padding: "0",
    border: "0",
    inset: "0",
    width: "100vw",
    height: "100vh",
    maxWidth: "none",
    maxHeight: "none",
    background: "transparent",
    overflow: "hidden",
  })

  const root = document.getElementById("root")
  const focused = document.activeElement
  document.body.appendChild(container)
  root?.setAttribute("inert", "")

  try {
    if (typeof container.showPopover === "function") container.showPopover()
    else container.style.zIndex = "2147483646"

    const rect = container.getBoundingClientRect()
    effect.setup(container, {
      width: rect.width || window.innerWidth,
      height: rect.height || window.innerHeight,
    })
    await effect.cover().finished
    try {
      await update()
    } finally {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })
      await effect.reveal().finished
    }
  } finally {
    root?.removeAttribute("inert")
    if (container.isConnected) {
      if (typeof container.hidePopover === "function" && container.matches(":popover-open")) container.hidePopover()
      container.remove()
    }
    restoreFocus(focused)
  }
}

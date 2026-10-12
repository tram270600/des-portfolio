import { useEffect } from "react"

import { sectionIds, type SectionId } from "@/data/site"
import { afterAboutLayout } from "@/lib/aboutRunway"
import { useUIStore } from "@/store/ui"

function markerLine() {
  const nav = window.matchMedia("(min-width: 768px)").matches ? 72 : 64
  return Math.max(nav + 24, Math.min(window.innerHeight * 0.33, 360))
}

function sectionAtMarker(): SectionId {
  const marker = markerLine()
  let current: SectionId = "home"
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= marker) current = id
  }
  return current
}

export function useScrollSpy() {
  useEffect(() => {
    let frame = 0
    const update = () => {
      const next = sectionAtMarker()
      if (useUIStore.getState().activeSection !== next) {
        useUIStore.getState().setActiveSection(next)
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest("a[href^='#']")
      if (!link) return
      const id = link.getAttribute("href")?.slice(1)
      const target = id ? document.getElementById(id) : null
      if (!target) return
      event.preventDefault()
      const scroll = () => {
        target.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        })
        history.pushState(null, "", `#${id}`)
        update()
      }
      if (id === "home" || id === "main") scroll()
      else afterAboutLayout(scroll)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    document.addEventListener("click", onClick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      document.removeEventListener("click", onClick)
    }
  }, [])
}

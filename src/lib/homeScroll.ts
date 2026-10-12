import { useEffect } from "react"

import { afterAboutLayout } from "@/lib/aboutRunway"

const SCROLL_KEY = "home-scroll"
const RESTORE_KEY = "restore-home-scroll"

export function rememberHomeScroll(scrollY = window.scrollY) {
  sessionStorage.setItem(SCROLL_KEY, String(scrollY))
}

export function readHomeScroll() {
  const value = Number(sessionStorage.getItem(SCROLL_KEY))
  return Number.isFinite(value) ? value : null
}

export function requestHomeScrollRestore() {
  sessionStorage.setItem(RESTORE_KEY, "1")
}

export function useHomeScrollMemory() {
  useEffect(() => {
    const restoring = sessionStorage.getItem(RESTORE_KEY) === "1"
    if (restoring) sessionStorage.removeItem(RESTORE_KEY)
    const saved = restoring ? readHomeScroll() : null
    let ready = !restoring

    const save = () => {
      if (!ready) return
      rememberHomeScroll()
    }

    if (restoring) {
      afterAboutLayout(() => {
        const top = saved != null && saved > 0 ? saved : projectsOffset()
        window.scrollTo({ top, behavior: "instant" })
        ready = true
        rememberHomeScroll(window.scrollY)
      })
    }

    window.addEventListener("scroll", save, { passive: true })
    window.addEventListener("pagehide", save)
    return () => {
      window.removeEventListener("scroll", save)
      window.removeEventListener("pagehide", save)
    }
  }, [])
}

function projectsOffset() {
  const projects = document.getElementById("projects")
  if (!projects) return 0
  const margin = Number.parseFloat(getComputedStyle(projects).scrollMarginTop) || 0
  return Math.max(0, window.scrollY + projects.getBoundingClientRect().top - margin)
}

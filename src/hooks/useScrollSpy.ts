import { useEffect } from "react"

import { sectionIds, type SectionId } from "@/data/site"
import { useUIStore } from "@/store/ui"

export function useScrollSpy() {
  const setActiveSection = useUIStore((state) => state.setActiveSection)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        const id = visible?.target.id
        if (id && sectionIds.includes(id as SectionId)) {
          setActiveSection(id as SectionId)
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.2, 0.45, 0.7],
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [setActiveSection])
}

import { create } from "zustand"

import { type SectionId } from "@/data/site"

type UIState = {
  mobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  activeSection: SectionId
  setActiveSection: (id: SectionId) => void
  hoveredTape: string | null
  setHoveredTape: (id: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  activeSection: "home",
  setActiveSection: (id) => set({ activeSection: id }),
  hoveredTape: null,
  setHoveredTape: (id) => set({ hoveredTape: id }),
}))

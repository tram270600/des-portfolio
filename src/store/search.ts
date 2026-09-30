import { create } from "zustand"

import { site } from "@/data/site"

type SearchState = {
  query: string
  setQuery: (query: string) => void
  pressedKey: string | null
  setPressedKey: (key: string | null) => void
  findOpen: boolean
  openFind: () => void
  closeFind: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: site.name,
  setQuery: (query) => set({ query }),
  pressedKey: null,
  setPressedKey: (key) => set({ pressedKey: key }),
  findOpen: false,
  openFind: () => set({ findOpen: true }),
  closeFind: () => set({ findOpen: false }),
}))

export const keyboardRows = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "search"],
  ["z", "x", "c", "v", "b", "n", "m", ".", "enter"],
  ["!#1", "space"],
] as const

export type KeyLabel = (typeof keyboardRows)[number][number]

const keyLabels = new Set<string>(keyboardRows.flat())

export function keyLabelFor(eventKey: string): KeyLabel | null {
  if (eventKey === " ") return "space"
  if (eventKey === "Enter") return "enter"
  if (eventKey === "Backspace") return "⌫"
  const key = eventKey.toLowerCase()
  return keyLabels.has(key) ? (key as KeyLabel) : null
}

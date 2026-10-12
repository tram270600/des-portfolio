import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const SCRAMBLE_MS = 2400

function scrambleToward(target: string, progress: number) {
  return Array.from(target, (char, index) => {
    if (char === " ") return " "
    const revealAt = (index + 1) / (target.length + 1)
    if (progress >= revealAt) return char
    return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
  }).join("")
}

export function useScrambleText(text: string) {
  const reduceMotion = useReducedMotion()
  const active = useRef(true)
  const [frame, setFrame] = useState<string | null>(null)

  const stop = useCallback(() => {
    if (!active.current) return
    active.current = false
    setFrame(null)
  }, [])

  useEffect(() => {
    if (reduceMotion !== false) return
    active.current = true
    const started = performance.now()
    setFrame(scrambleToward(text, 0))
    const timer = window.setInterval(() => {
      if (!active.current) return
      const progress = Math.min(1, (performance.now() - started) / SCRAMBLE_MS)
      if (progress >= 1) {
        active.current = false
        setFrame(null)
        window.clearInterval(timer)
        return
      }
      setFrame(scrambleToward(text, progress))
    }, 56)
    return () => {
      active.current = false
      window.clearInterval(timer)
    }
  }, [reduceMotion, text])

  return { frame, stop }
}

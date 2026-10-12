import { useEffect, useRef, useState } from "react"
import { motion, useAnimationControls, useReducedMotion } from "motion/react"

const PALETTE = ["#FC664B", "#FDE55D", "#00B77F", "#0069D7"] as const
const MONO = "#0a0a0a"

function accentColors(text: string) {
  const colors = Array.from(text, () => MONO)
  const letters: number[] = []
  for (let index = 0; index < text.length; index++) {
    if (text[index] !== " ") letters.push(index)
  }
  let cursor = letters.length > 2 ? Math.floor(Math.random() * 2) : 0
  while (cursor < letters.length) {
    colors[letters[cursor]] = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    cursor += 2 + Math.floor(Math.random() * 3)
  }
  return colors
}
const DROP_S = 0.72
const EASE = [0.4, 0, 0.2, 1] as const
const QUAKE_Y = -18
const LEFT_TOP = 120
const BACK_TOP = 16

function TitleLetter({
  char,
  color,
  delay,
  quakeDelay,
  reduce,
  quake,
}: {
  char: string
  color: string
  delay: number
  quakeDelay: number
  reduce: boolean
  quake: number
}) {
  const controls = useAnimationControls()

  useEffect(() => {
    if (reduce) {
      void controls.set({ y: 0, opacity: 1, color: MONO })
      return
    }
    void controls.start({
      y: 0,
      opacity: 1,
      color: MONO,
      transition: {
        y: { duration: DROP_S, delay, ease: EASE },
        opacity: { duration: DROP_S, delay, ease: EASE },
        color: { duration: 0.45, delay: delay + 0.48, ease: EASE },
      },
    })
  }, [controls, delay, reduce])

  useEffect(() => {
    if (!quake || reduce) return
    void controls.start({
      y: [0, QUAKE_Y, 0],
      opacity: 1,
      color: MONO,
      transition: {
        y: { duration: 0.46, times: [0, 0.4, 1], delay: quakeDelay, ease: EASE },
        opacity: { duration: 0.01 },
        color: { duration: 0.01 },
      },
    })
  }, [controls, quake, quakeDelay, reduce])

  return (
    <motion.span
      className="inline-block"
      initial={reduce ? false : { y: -10, opacity: 0, color }}
      animate={controls}
    >
      {char}
    </motion.span>
  )
}

export function CaseStudyTitle({ text }: { text: string }) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion() === true
  const [quake, setQuake] = useState(0)
  const [colors] = useState(() => accentColors(text))

  useEffect(() => {
    if (reduce) return
    const root = rootRef.current?.closest("article")
    if (!(root instanceof HTMLElement)) return
    let leftTop = false
    const onScroll = () => {
      const y = root.scrollTop
      if (y > LEFT_TOP) {
        leftTop = true
        return
      }
      if (leftTop && y <= BACK_TOP) {
        leftTop = false
        setQuake((count) => count + 1)
      }
    }
    root.addEventListener("scroll", onScroll, { passive: true })
    return () => root.removeEventListener("scroll", onScroll)
  }, [reduce])

  const words = text.split(" ")
  const letterCount = words.reduce((count, word) => count + word.length, 0)
  const introStep = letterCount > 1 ? Math.min(0.04, 0.72 / (letterCount - 1)) : 0
  const quakeStep = letterCount > 1 ? Math.min(0.018, 0.22 / (letterCount - 1)) : 0
  let cursor = 0
  let letterIndex = 0

  return (
    <span ref={rootRef} aria-hidden className="block pt-5">
      {words.map((word, wordIndex) => {
        const wordStart = cursor
        cursor += word.length + 1
        const letters = Array.from(word).map((char, charIndex) => {
          const ordinal = letterIndex
          letterIndex += 1
          return (
            <TitleLetter
              key={wordStart + charIndex}
              char={char}
              color={colors[wordStart + charIndex] ?? MONO}
              delay={0.09 + ordinal * introStep}
              quakeDelay={ordinal * quakeStep}
              reduce={reduce}
              quake={quake}
            />
          )
        })
        return (
          <span key={wordStart}>
            {wordIndex > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">{letters}</span>
          </span>
        )
      })}
    </span>
  )
}

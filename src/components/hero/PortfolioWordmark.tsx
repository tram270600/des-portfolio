import { useEffect, useRef, useState } from "react"
import { motion, useAnimationControls, useReducedMotion } from "motion/react"

import { HeroSectionLabel } from "@/components/hero/HeroSectionLabel"

const DROP_S = 0.72
const START_S = 0.09
const STAGGER_S = 0.055
const QUAKE_Y = -20
const LEFT_TOP = 120
const BACK_TOP = 16

const LETTERS = [
  { char: "P", family: "Miltonian Tattoo", fallback: "cursive", color: "#00B77F" },
  { char: "O", family: "Miltonian", fallback: "serif", color: "#FC664B" },
  { char: "R", family: "Monomakh", fallback: "serif", color: "#0069D7" },
  { char: "T", family: "Mea Culpa", fallback: "cursive", color: "#00B77F" },
  { char: "F", family: "Montaga", fallback: "serif", color: "#0069D7" },
  { char: "O", family: "Miniver", fallback: "cursive", color: "#FC664B" },
  { char: "L", family: "Momo Signature", fallback: "cursive", color: "#00B77F" },
  { char: "I", family: "McLaren", fallback: "sans-serif", color: "#0069D7" },
  { char: "O", family: "Mate", fallback: "serif", color: "#FC664B" },
] as const

function WordmarkLetter({
  letter,
  index,
  reduce,
  quake,
}: {
  letter: (typeof LETTERS)[number]
  index: number
  reduce: boolean
  quake: number
}) {
  const controls = useAnimationControls()
  const delay = START_S + index * STAGGER_S

  useEffect(() => {
    if (reduce) {
      void controls.set({ y: 0, opacity: 1, color: letter.color })
      return
    }
    void controls.start({
      y: 0,
      opacity: 1,
      color: letter.color,
      transition: {
        y: { duration: DROP_S, delay, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: DROP_S, delay, ease: [0.4, 0, 0.2, 1] },
        color: { duration: 0.38, delay: delay + 0.28, ease: [0.4, 0, 0.2, 1] },
      },
    })
  }, [controls, delay, letter.color, reduce])

  useEffect(() => {
    if (!quake || reduce) return
    void controls.start({
      y: [0, QUAKE_Y, 0],
      transition: {
        duration: 0.46,
        times: [0, 0.4, 1],
        delay: index * 0.018,
        ease: [0.4, 0, 0.2, 1],
      },
    })
  }, [controls, index, quake, reduce])

  return (
    <motion.span
      data-letter={letter.char}
      className="hero-wordmark-letter"
      initial={reduce ? false : { y: -10, opacity: 0, color: "#0a0a0a" }}
      animate={controls}
      style={{ fontFamily: `"${letter.family}", ${letter.fallback}` }}
    >
      {letter.char}
    </motion.span>
  )
}

export function PortfolioWordmark() {
  const reduceMotion = useReducedMotion()
  const reduce = reduceMotion === true
  const leftTop = useRef(false)
  const [quake, setQuake] = useState(0)

  useEffect(() => {
    if (reduce) return

    const onScroll = () => {
      const y = window.scrollY
      if (y > LEFT_TOP) {
        leftTop.current = true
        return
      }
      if (leftTop.current && y <= BACK_TOP) {
        leftTop.current = false
        setQuake((count) => count + 1)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [reduce])

  return (
    <div className="relative mx-auto w-fit max-w-full">
      <h1 className="sr-only">Tram Nguyen Product Designer Portfolio</h1>
      <a href="#contact" aria-label="05. Contact" className="pointer-events-auto block cursor-pointer no-underline">
        <span className="hero-wordmark mix-blend-multiply select-none" aria-hidden>
          {LETTERS.map((letter, index) => (
            <WordmarkLetter
              key={`${letter.char}-${index}`}
              letter={letter}
              index={index}
              reduce={reduce}
              quake={quake}
            />
          ))}
        </span>
      </a>
      <HeroSectionLabel
        index="5"
        label="Contact"
        href="#contact"
        className="absolute top-1/2 left-full ml-4 hidden -translate-y-1/2 xl:inline-flex"
      />
    </div>
  )
}

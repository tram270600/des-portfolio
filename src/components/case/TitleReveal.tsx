import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react"
import { Fragment, useEffect, useRef } from "react"

const START_OPACITY = 0.15
const SPREAD = 0.8
const WORD_DURATION = 0.2

function Word({
  children,
  progress,
  index,
  count,
}: {
  children: string
  progress: MotionValue<number>
  index: number
  count: number
}) {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD
  const end = Math.min(1, start + WORD_DURATION)
  const opacity = useTransform(progress, [start, end], [START_OPACITY, 1])

  return <motion.span style={{ opacity }}>{children}</motion.span>
}

export function TitleReveal({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion() === true
  const progress = useMotionValue(reduce ? 1 : 0)

  useEffect(() => {
    const node = ref.current
    const root = node?.closest("article")
    if (!node || !(root instanceof HTMLElement) || reduce) {
      progress.set(1)
      return
    }

    const update = () => {
      const rootRect = root.getBoundingClientRect()
      const rect = node.getBoundingClientRect()
      const startLine = rootRect.top + rootRect.height * 0.85
      const endLine = rootRect.top + rootRect.height * 0.45
      const range = startLine - (endLine - rect.height)
      const next = range === 0 ? 1 : (startLine - rect.top) / range
      progress.set(Math.min(1, Math.max(0, next)))
    }

    update()
    root.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      root.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [progress, reduce, text])

  const words = text.split(" ")
  if (reduce) return <span ref={ref}>{text}</span>

  return (
    <span ref={ref}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <Word progress={progress} index={index} count={words.length}>
            {word}
          </Word>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  )
}

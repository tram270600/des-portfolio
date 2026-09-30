import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"
import { Fragment, useRef } from "react"

import { cn } from "@/lib/utils"

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

type ScrollWordRevealProps = {
  paragraphs: readonly string[]
  className?: string
  paragraphClassName?: string
}

export function ScrollWordReveal({ paragraphs, className, paragraphClassName }: ScrollWordRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] })

  const words = paragraphs.map((paragraph) => paragraph.split(" "))
  const count = words.reduce((sum, list) => sum + list.length, 0)
  let wordIndex = 0

  return (
    <div ref={ref} className={className}>
      {words.map((list, paragraphIndex) => (
        <p key={paragraphIndex} className={cn(paragraphClassName)}>
          {reduceMotion
            ? paragraphs[paragraphIndex]
            : list.map((word, index) => (
                <Fragment key={index}>
                  <Word progress={scrollYProgress} index={wordIndex++} count={count}>
                    {word}
                  </Word>
                  {index < list.length - 1 ? " " : null}
                </Fragment>
              ))}
        </p>
      ))}
    </div>
  )
}

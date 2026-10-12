import { useEffect, type ReactNode } from "react"
import { motion, useAnimationControls, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const EASE = [0.4, 0, 0.2, 1] as const

type HeroRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function HeroReveal({ children, className, delay = 0, duration = 0.22 }: HeroRevealProps) {
  const reduce = useReducedMotion() === true
  const controls = useAnimationControls()

  useEffect(() => {
    if (reduce) {
      void controls.set({ opacity: 1, clipPath: "none" })
      return
    }
    void controls
      .start({
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        transition: { duration, delay, ease: EASE },
      })
      .then(() => controls.set({ clipPath: "none" }))
  }, [controls, delay, duration, reduce])

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}

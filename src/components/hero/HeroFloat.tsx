import { useEffect, type CSSProperties, type ReactNode } from "react"
import { motion, useAnimationControls, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type HeroFloatProps = {
  children: ReactNode
  caption?: ReactNode
  className?: string
  innerClassName?: string
  style?: CSSProperties
  duration?: string
  delay?: string
  reveal?: boolean
  revealDelay?: number
  x?: string
  y?: string
  rotate?: string
  swing?: string
}

export function HeroFloat({
  children,
  caption,
  className,
  innerClassName,
  style,
  duration = "8.5s",
  delay = "0s",
  reveal = true,
  revealDelay = 0,
  x = "8px",
  y = "-12px",
  rotate = "1.2deg",
  swing = "8deg",
}: HeroFloatProps) {
  const reduce = useReducedMotion() === true || !reveal
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
        transition: { duration: 0.22, delay: revealDelay, ease: [0.4, 0, 0.2, 1] },
      })
      .then(() => controls.set({ clipPath: "none" }))
  }, [controls, reduce, revealDelay])

  return (
    <motion.div
      className={cn("hero-object", className)}
      initial={reduce ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={controls}
      style={
        {
          ...style,
          "--float-duration": duration,
          "--float-delay": delay,
          "--drift-x": x,
          "--drift-y": y,
          "--drift-r": rotate,
          "--swing": swing,
        } as CSSProperties
      }
    >
      <div className={cn("hero-object-swing h-full w-full", innerClassName)}>{children}</div>
      {caption}
    </motion.div>
  )
}

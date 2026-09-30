import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useMotionValue, useReducedMotion, useTransform } from "motion/react"

import { AboutCollage } from "@/components/about/AboutCollage"
import { ScrollWordReveal } from "@/components/about/ScrollWordReveal"
import { TypewriterGroup, TypewriterText } from "@/components/about/Typewriter"
import { Section } from "@/components/layout/Section"
import { SectionTitle } from "@/components/layout/SectionTitle"

const greeting = ["Hello,", "It’s a pleasure to meet you! I’m Tram"] as const

const intro = [
  "Tram Nguyen is an exploratory product designer who turns curiosity into thoughtful, inclusive experiences—bridging creativity and technology to create work that resonates with people and evokes a response.",
] as const

const sides = [
  "A middle UI/UX Designer with over 4 years of professional experience creating user-centered digital products across industries including fashion, e-commerce, construction safety, AI, automation and B2B SaaS.",
  "With hands-on experience in HTML and CSS, I design with technical feasibility in mind, collaborate seamlessly with developers and stakeholders to deliver high-quality products from concept to launch.",
] as const

const typedText = "ruled-lines text-body-l text-foreground/80"
const CENTER_SHARE = 2.3 / 4.2

function useWideLayout() {
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 900px)").matches)

  useLayoutEffect(() => {
    const query = window.matchMedia("(min-width: 900px)")
    const onChange = () => setWide(query.matches)
    query.addEventListener("change", onChange)
    window.addEventListener("resize", onChange)
    return () => {
      query.removeEventListener("change", onChange)
      window.removeEventListener("resize", onChange)
    }
  }, [])

  return wide
}

function PinnedStory() {
  const runwayRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const wide = useWideLayout()
  const reduceMotion = useReducedMotion()
  const settled = !wide || Boolean(reduceMotion)
  const progress = useMotionValue(0)
  const travelRef = useRef(0)
  const lockedHeight = useRef<number | null>(null)
  const [pin, setPin] = useState<"flow" | "fixed" | "dock">("flow")
  const [runwayHeight, setRunwayHeight] = useState<number | null>(null)
  const [fixedBox, setFixedBox] = useState({ top: 72, left: 0, width: 0 })
  const startW = useMotionValue(0)
  const endW = useMotionValue(0)
  const stageW = useMotionValue(0)
  const sideTop = useMotionValue("42%")
  const collageWidth = useTransform([progress, startW, endW], ([value, start, end]) => {
    const from = Number(start)
    const to = Number(end)
    return from + (to - from) * Number(value)
  })
  const sideOpacity = useTransform(progress, [0.12, 0.78], [0, 1])
  const sideWidth = useTransform([endW, stageW], ([end, stage]) =>
    Math.max(0, (Number(stage) - Number(end)) / 2 - 24),
  )
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if (settled) return
    const measure = () => {
      const intro = introRef.current
      const stage = stageRef.current
      if (!intro || !stage) return
      const introWidth = intro.getBoundingClientRect().width
      const stageWidth = stage.getBoundingClientRect().width
      startW.set(introWidth)
      stageW.set(stageWidth)
      endW.set(Math.min(introWidth, stageWidth * CENTER_SHARE))
      setReady(true)
      const figure = stage.querySelector("figure")
      if (!figure) return
      const stageRect = stage.getBoundingClientRect()
      const figureRect = figure.getBoundingClientRect()
      if (!stageRect.height || !figureRect.height) return
      const center = (figureRect.top - stageRect.top + figureRect.height / 2) / stageRect.height
      sideTop.set(`${center * 100}%`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (introRef.current) observer.observe(introRef.current)
    if (stageRef.current) observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [endW, settled, sideTop, stageW, startW])

  useEffect(() => {
    if (settled) return
    const update = () => {
      const runway = runwayRef.current
      const frame = frameRef.current
      if (!runway || !frame) return
      const nav = window.matchMedia("(min-width: 768px)").matches ? 72 : 64
      const travel = Math.round(window.innerHeight * 0.7)
      travelRef.current = travel
      const rect = runway.getBoundingClientRect()
      if (rect.top > nav) {
        lockedHeight.current = null
        setRunwayHeight(null)
        setPin("flow")
        progress.set(0)
        return
      }
      if (lockedHeight.current == null) {
        lockedHeight.current = frame.offsetHeight + travel
        setRunwayHeight(lockedHeight.current)
      }
      const scrolled = nav - rect.top
      if (scrolled >= travel) {
        setPin("dock")
        progress.set(1)
        return
      }
      setPin("fixed")
      setFixedBox((current) =>
        current.top === nav && current.left === rect.left && current.width === rect.width
          ? current
          : { top: nav, left: rect.left, width: rect.width },
      )
      progress.set(scrolled / travel)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [progress, settled])

  if (!wide) {
    return (
      <div className="mt-12 grid gap-10">
        <AboutCollage className="mx-auto w-full" />
        <p className={typedText}>{sides[0]}</p>
        <p className={typedText}>{sides[1]}</p>
      </div>
    )
  }

  if (reduceMotion) {
    return (
      <div className="mt-12 grid items-center gap-8 md:mt-16 md:grid-cols-[minmax(0,0.95fr)_minmax(0,2.3fr)_minmax(0,0.95fr)]">
        <p className={typedText}>{sides[0]}</p>
        <AboutCollage className="w-full" />
        <p className={typedText}>{sides[1]}</p>
      </div>
    )
  }

  const frameStyle =
    pin === "fixed"
      ? { position: "fixed" as const, top: fixedBox.top, left: fixedBox.left, width: fixedBox.width, zIndex: 30 }
      : pin === "dock"
        ? { position: "absolute" as const, top: travelRef.current, left: 0, right: 0 }
        : undefined

  return (
    <div ref={runwayRef} className="relative mt-10 md:mt-14" style={runwayHeight ? { height: runwayHeight } : undefined}>
      <div ref={frameRef} style={frameStyle}>
        <div ref={introRef} className="mx-auto max-w-5xl">
          <ScrollWordReveal
            paragraphs={intro}
            paragraphClassName="text-center text-2xl font-medium leading-[1.35] tracking-tight text-foreground md:text-3xl lg:text-[2.25rem]"
          />
        </div>
        <div ref={stageRef} className="relative mt-12 md:mt-16">
          <motion.div
            style={ready ? { width: collageWidth } : undefined}
            className="relative z-10 mx-auto w-full max-w-4xl"
          >
            <AboutCollage className="w-full" />
          </motion.div>
          <div className="pointer-events-none absolute inset-0">
            <motion.p
              style={{ opacity: sideOpacity, width: sideWidth, top: sideTop }}
              className={`absolute left-0 -translate-y-1/2 ${typedText}`}
            >
              {sides[0]}
            </motion.p>
            <motion.p
              style={{ opacity: sideOpacity, width: sideWidth, top: sideTop }}
              className={`absolute right-0 -translate-y-1/2 ${typedText}`}
            >
              {sides[1]}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <Section id="about" contained={false} className="pt-16 md:pt-20">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <SectionTitle index="01" className="sr-only">
          About me
        </SectionTitle>

        <TypewriterGroup segments={greeting} className="mx-auto max-w-3xl text-center">
          <p className="font-pinyon text-5xl leading-[1.2] text-foreground md:text-6xl">
            <TypewriterText index={0}>{greeting[0]}</TypewriterText>
          </p>
          <p className={`mx-auto mt-4 w-fit ${typedText}`}>
            <TypewriterText index={1}>{greeting[1]}</TypewriterText>
          </p>
        </TypewriterGroup>

        <PinnedStory />
      </div>
    </Section>
  )
}

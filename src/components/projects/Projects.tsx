import { useState } from "react"
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react"

import { SectionTitle } from "@/components/layout/SectionTitle"
import { WorksField } from "@/components/projects/WorksField"
import { projects, type ProjectType } from "@/data/projects"
import { cn } from "@/lib/utils"
import { useWorksScroll } from "@/components/projects/useWorksScroll"

const COUNT = projects.length

function linkProps(href: string) {
  return href.startsWith("http") ? { target: "_blank" as const, rel: "noreferrer" } : {}
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className ?? "size-4"} fill="none">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className={cn("ml-1.5 inline size-3 shrink-0 text-red", className)}>
      <path
        fill="currentColor"
        d="M6 .7l1.45 3.22 3.5.32-2.66 2.3.8 3.46L6 8.4l-3.09 1.6.8-3.46L1.05 4.24l3.5-.32L6 .7z"
      />
    </svg>
  )
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function WorkCard({
  project,
  index,
  visual,
  velocity,
  active,
  reduce,
}: {
  project: ProjectType
  index: number
  visual: MotionValue<number>
  velocity: MotionValue<number>
  active: boolean
  reduce: boolean
}) {
  const opacity = useTransform(visual, (value) => {
    const distance = Math.abs(index - value)
    if (distance > 1.45) return 0
    return 1 - Math.max(0, distance - 1) * 1.6
  })
  const zIndex = useTransform(visual, (value) => Math.round(40 - Math.abs(index - value) * 14))
  const transform = useTransform([visual, velocity], ([value, speed]) => {
    const distance = index - (value as number)
    const scale = 1 - Math.min(Math.abs(distance), 1) * (reduce ? 0.1 : 0.18)
    const swing = reduce
      ? 0
      : Math.sin(distance * Math.PI) * (distance > 0 ? 4 : -4) + Math.max(-0.12, Math.min(0.12, speed as number)) * -18
    const y = distance * 100
    return `translate(-50%, calc(-50% + ${y}%)) scale(${scale}) rotate(${swing}deg)`
  })
  const blur = useTransform(visual, (value) => {
    if (reduce) return "blur(0px)"
    return `blur(${Math.min(Math.abs(index - value), 1) * 7}px)`
  })
  const veil = useTransform(visual, (value) => Math.min(Math.abs(index - value), 1) * 0.58)

  return (
    <motion.a
      href={project.href}
      {...linkProps(project.href)}
      aria-label={`${project.title}. View case study`}
      tabIndex={active ? 0 : -1}
      className="group absolute top-1/2 left-1/2 block h-[58%] w-auto max-w-[92%] origin-center outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{ opacity, zIndex, transform, pointerEvents: active ? "auto" : "none" }}
    >
      <div className="relative aspect-[4/3] h-full overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(26,26,26,0.08)]">
        <motion.img
          src={project.image}
          alt=""
          draggable={false}
          className="size-full object-cover"
          style={{ filter: blur }}
        />
        <motion.div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: veil }} />
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <span className="flex translate-y-2 items-center gap-2 p-6 text-sm font-medium tracking-wide text-white uppercase transition duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
            View Case Study
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </motion.a>
  )
}

function ProjectCopy({
  project,
  index,
  visual,
  active,
}: {
  project: ProjectType
  index: number
  visual: MotionValue<number>
  active: boolean
}) {
  const opacity = useTransform(visual, (value) => {
    const distance = Math.abs(index - value)
    if (distance > 0.4) return 0
    return 1 - distance / 0.4
  })
  const y = useTransform(visual, (value) => (index - value) * 28)
  const pointerEvents = useTransform(opacity, (value) => (value > 0.55 ? "auto" : "none"))

  return (
    <motion.div data-project-index={index} inert={active ? undefined : true} style={{ opacity, y, pointerEvents }} className="absolute inset-0 flex flex-col justify-center">
      <p className="text-sm text-[#8d8d8d] md:text-[15px]">{project.eyebrow}</p>
      <h3 className="mt-3 max-w-full text-[clamp(1.7rem,2.4vw,2.65rem)] leading-[1.12] font-medium text-primary">
        {project.title}
      </h3>
      <p className="mt-0 md:mt-3 line-clamp-4 max-w-[34ch] text-[15px] leading-7 text-[#6d6d6d] md:text-base">
        “{project.description}”
      </p>
      <a
        href={project.href}
        {...linkProps(project.href)}
        className="mt-3 inline-flex w-fit items-center gap-2 text-base text-foreground transition-opacity hover:opacity-60"
      >
        Explore
        <ArrowUpRight />
      </a>
    </motion.div>
  )
}

function NameButton({
  project,
  index,
  visual,
  onSelect,
}: {
  project: ProjectType
  index: number
  visual: MotionValue<number>
  onSelect: (index: number) => void
}) {
  const color = useTransform(visual, (value) => (Math.abs(index - value) < 0.5 ? "#0a0a0a" : "#b5b5b5"))

  return (
    <li className="flex items-center">
      <button
        type="button"
        onClick={() => onSelect(index)}
        className="inline-flex items-center text-left text-[22px] leading-none font-medium tracking-tight xl:text-[26px] hover:cursor-pointer"
      >
        <motion.span style={{ color }}>{project.shortName}</motion.span>
        {project.featured ? <Star /> : null}
      </button>
    </li>
  )
}

export function Projects() {
  const { trackRef, height, visual, velocity, reduce, scrollToIndex } = useWorksScroll(COUNT)
  const [active, setActive] = useState(0)
  useMotionValueEvent(visual, "change", (value) => {
    const next = Math.min(COUNT - 1, Math.max(0, Math.round(value)))
    setActive((current) => (current === next ? current : next))
  })

  return (
    <section
      id="works"
      ref={trackRef}
      data-project-count={COUNT}
      aria-label="works"
      className="relative scroll-mt-24 bg-background"
      style={{ height }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <WorksField />
        <div className="relative z-[1] mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col px-5 pt-20 pb-4 md:px-8 lg:pt-24 lg:pb-8">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle index="03.">Works</SectionTitle>
            <a
              href="/experience"
              className="inline-flex items-center gap-2 pb-1 text-sm text-[#9a9a9a] transition-colors hover:text-foreground md:text-base"
            >
              All Projects
              <ArrowUpRight />
            </a>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto_auto] md:grid-cols-[minmax(190px,250px)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(200px,260px)_minmax(0,1fr)_minmax(124px,170px)] lg:grid-rows-1 lg:gap-x-6">
            <div className="relative h-full min-h-0 overflow-hidden md:col-start-2 md:row-start-1 lg:col-start-2">
              {projects.map((project, index) => (
                <WorkCard
                  key={project.title}
                  project={project}
                  index={index}
                  visual={visual}
                  velocity={velocity}
                  active={active === index}
                  reduce={reduce}
                />
              ))}
            </div>

            <ul className="hidden h-full min-h-0 flex-col items-start justify-center gap-5 lg:col-start-3 lg:row-start-1 lg:flex xl:gap-6">
              {projects.map((project, index) => (
                <NameButton key={project.title} project={project} index={index} visual={visual} onSelect={scrollToIndex} />
              ))}
            </ul>

            <ul className="mt-2 flex w-full items-center justify-between gap-1 md:col-span-2 md:row-start-2 lg:hidden">
              {projects.map((project, index) => (
                <li key={project.title} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => scrollToIndex(index)}
                    aria-current={active === index ? "true" : undefined}
                    className={cn(
                      "inline-flex items-center text-[10px] leading-none font-medium whitespace-nowrap transition-colors duration-300 sm:text-[11px] hover:cursor-pointer",
                      active === index ? "text-mono-950" : "text-mono-400",
                    )}
                  >
                    {project.shortName}
                    {project.featured ? <Star className="ml-0.5 size-2" /> : null}
                  </button>
                </li>
              ))}
            </ul>

            <div className="relative mt-2 h-[118px] shrink-0 md:col-start-1 md:row-start-1 md:mt-0 md:h-auto md:bg-transparent bg-mono-50/90">
              {projects.map((project, index) => (
                <ProjectCopy key={project.title} project={project} index={index} visual={visual} active={active === index} />
              ))}
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {pad(active + 1)} / {pad(COUNT)}. {projects[active]?.title}
        </p>
      </div>
    </section>
  )
}

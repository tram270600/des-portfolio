import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { SkipLink } from "@/components/layout/SkipLink"
import type { CaseFigure, CaseMedia, CaseSection, CaseStudy } from "@/data/cases/types"
import { projects } from "@/data/projects"
import { cn } from "@/lib/utils"

function Label({ children }: { children: string }) {
  return <p className="text-sm font-medium tracking-wide text-mono-400 uppercase">{children}</p>
}

function Body({ children, className }: { children: string; className?: string }) {
  return <p className={cn("text-base leading-8 text-mono-900", className)}>{children}</p>
}

function SectionHeading({ id, children, large = false }: { id: string; children: string; large?: boolean }) {
  return (
    <h2
      id={id}
      className={cn(
        "scroll-mt-28 font-medium tracking-tight text-mono-950 uppercase",
        large ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
      )}
    >
      {children}
    </h2>
  )
}

function GroupTitle({ children }: { children: string }) {
  return <h3 className="text-lg font-medium tracking-wide text-mono-950 uppercase">{children}</h3>
}

function StepLink({
  project,
  label,
  direction,
}: {
  project: (typeof projects)[number] | null
  label: string
  direction: "previous" | "next"
}) {
  const className =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-mono-200 text-mono-950 transition-colors hover:border-mono-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-mono-200"
  const icon = direction === "previous" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />
  if (!project) {
    return (
      <button type="button" className={className} disabled aria-label={label}>
        {icon}
      </button>
    )
  }
  const external = project.href.startsWith("http")
  return (
    <a href={project.href} aria-label={label} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {icon}
    </a>
  )
}

function Shot({ src, alt, caption }: CaseFigure) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <figure className="group">
      <div className="relative rounded-lg bg-mono-50 px-8 py-16">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-sm font-medium text-mono-950 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        >
          Click to zoom
          <Expand className="size-4" aria-hidden />
        </button>
        <button type="button" onClick={() => setOpen(true)} className="block w-full cursor-zoom-in">
          <img src={src} alt={alt} className="w-full" />
        </button>
      </div>
      <figcaption className="mt-4 text-left font-neue text-[14px] font-normal text-mono-950">{caption}</figcaption>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-mono-950/80 p-6 md:p-10"
          onClick={() => setOpen(false)}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 inline-flex size-10 items-center justify-center rounded-full bg-white text-mono-950"
          >
            <X className="size-5" />
          </button>
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </figure>
  )
}

function MediaBlock({ media }: { media: CaseMedia }) {
  if (media.layout === "pair") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {media.figures.map((figure) => (
          <Shot key={figure.src} {...figure} />
        ))}
      </div>
    )
  }
  return <Shot {...media.figure} />
}

function OverviewSection({ section, title }: { section: Extract<CaseSection, { kind: "overview" }>; title: string }) {
  return (
    <section aria-labelledby={section.id} className="space-y-8">
      <div>
        <SectionHeading id={section.id} large>
          {title}
        </SectionHeading>
        <p className="mt-3 text-lg font-medium text-mono-600">{section.eyebrow}</p>
      </div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.1fr)] lg:gap-16">
        <dl className="space-y-6">
          {section.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-sm font-medium tracking-wide text-mono-400 uppercase">{fact.label}</dt>
              <dd className="mt-1 text-lg leading-7 text-mono-900">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-6">
          {section.summary.map((item) => (
            <div key={item.label}>
              <Label>{item.label}</Label>
              <Body className="mt-1">{item.body}</Body>
            </div>
          ))}
        </div>
      </div>
      {section.notes.map((item) => (
        <div key={item.label}>
          <Label>{item.label}</Label>
          <Body className="mt-1">{item.body}</Body>
        </div>
      ))}
      {section.figure ? <Shot {...section.figure} /> : null}
    </section>
  )
}

function ProseSection({ section }: { section: Extract<CaseSection, { kind: "prose" }> }) {
  return (
    <section className="space-y-4">
      <SectionHeading id={section.id}>{section.label}</SectionHeading>
      {section.paragraphs.map((paragraph) => (
        <Body key={paragraph}>{paragraph}</Body>
      ))}
    </section>
  )
}

function ResearchSection({ section }: { section: Extract<CaseSection, { kind: "research" }> }) {
  return (
    <section className="space-y-6">
      <SectionHeading id={section.id}>{section.label}</SectionHeading>
      <Body>{section.intro}</Body>
      <div className="space-y-8">
        {section.areas.map((area) => (
          <div key={area.title}>
            <GroupTitle>{area.title}</GroupTitle>
            <p className="mt-2 text-base leading-8">
              <span className="font-medium">Problem: </span>
              {area.problem}
            </p>
            <p className="mt-2 text-base leading-8">
              <span className="font-medium">Opportunity: </span>
              {area.opportunity}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function GroupsSection({ section }: { section: Extract<CaseSection, { kind: "groups" }> }) {
  const textual = section.groups.every((group) => !group.points?.length && !group.media?.length)
  return (
    <section className="space-y-8">
      <SectionHeading id={section.id}>{section.label}</SectionHeading>
      <div className={textual ? "space-y-6" : "space-y-8"}>
        {section.groups.map((group) => (
          <div key={group.title} className={group.media?.length ? "space-y-8" : undefined}>
            <div>
              <GroupTitle>{group.title}</GroupTitle>
              {group.body ? <Body className="mt-2">{group.body}</Body> : null}
              {group.points?.length ? (
                <ul className="mt-3 space-y-3">
                  {group.points.map((point) => (
                    <li key={point} className="text-base leading-8">
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {group.media?.length ? (
              <div className="space-y-6">
                {group.media.map((item) => (
                  <MediaBlock key={item.layout === "single" ? item.figure.src : item.figures.map((figure) => figure.src).join()} media={item} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

function currentSectionId(root: HTMLElement, ids: string[]) {
  const lastId = ids[ids.length - 1] ?? ""
  const atEnd = root.scrollTop + root.clientHeight >= root.scrollHeight - 8
  if (atEnd) return lastId

  const edge = root.getBoundingClientRect().top + 128
  let current = ids[0] ?? ""
  for (const id of ids) {
    const heading = document.getElementById(id)
    if (heading && heading.getBoundingClientRect().top <= edge) current = id
  }
  return current
}

function CaseSectionView({ section, title }: { section: CaseSection; title: string }) {
  switch (section.kind) {
    case "overview":
      return <OverviewSection section={section} title={title} />
    case "prose":
      return <ProseSection section={section} />
    case "research":
      return <ResearchSection section={section} />
    case "groups":
      return <GroupsSection section={section} />
  }
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const index = projects.findIndex((project) => project.href === study.href)
  const previousProject = index > 0 ? projects[index - 1] : null
  const nextProject = index >= 0 && index < projects.length - 1 ? projects[index + 1] : null
  const [activeId, setActiveId] = useState(study.sections[0]?.id ?? "")
  const articleRef = useRef<HTMLElement>(null)
  const scrollingTo = useRef<string | null>(null)

  useEffect(() => {
    const root = articleRef.current
    if (!root) return
    const ids = study.sections.map((section) => section.id)

    const update = () => {
      if (scrollingTo.current) return
      const next = currentSectionId(root, ids)
      if (next) setActiveId((current) => (current === next ? current : next))
    }

    update()
    root.addEventListener("scroll", update, { passive: true })
    return () => root.removeEventListener("scroll", update)
  }, [study])

  function scrollToHeading(id: string) {
    const root = articleRef.current
    const target = document.getElementById(id)
    if (!root || !target) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
    const top = Math.max(0, target.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - margin)
    const start = root.scrollTop
    const distance = top - start
    scrollingTo.current = id
    setActiveId(id)
    if (reduceMotion || Math.abs(distance) < 1) {
      root.scrollTop = top
      scrollingTo.current = null
      return
    }
    const duration = Math.min(900, Math.max(380, Math.abs(distance) * 0.28))
    const started = performance.now()
    const ease = (progress: number) => (progress < 0.5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2)
    const step = (now: number) => {
      if (scrollingTo.current !== id) return
      const progress = Math.min(1, (now - started) / duration)
      root.scrollTop = start + distance * ease(progress)
      if (progress < 1) requestAnimationFrame(step)
      else scrollingTo.current = null
    }
    requestAnimationFrame(step)
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-white font-neue text-mono-900">
      <SkipLink />
      <main id="main" className="flex min-h-0 w-full flex-1 flex-col p-12">
        <div className="flex shrink-0 items-center gap-8 lg:gap-16">
          <div className="shrink-0 lg:w-[calc(16rem+72px+24px)]">
            <a href="/#projects" className="inline-flex items-center gap-2 text-base font-medium text-mono-950 md:text-lg">
              <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-full border border-mono-200">
                <ChevronLeft className="size-4" />
              </span>
              All Projects
            </a>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-base font-medium text-mono-950 md:text-xl">{study.title}</p>
              <StepLink project={previousProject} label="Previous project" direction="previous" />
              <StepLink project={nextProject} label="Next project" direction="next" />
            </div>
            <a
              href="/#projects"
              aria-label="Close project"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-mono-200 text-mono-950 hover:bg-mono-50"
            >
              <X className="size-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex min-h-0 flex-1 flex-col gap-8 lg:flex-row lg:gap-16">
          <nav aria-label="Case study" className="shrink-0 rounded-[20px] bg-mono-50 p-2 lg:w-[calc(16rem+72px+24px)] lg:self-start lg:p-4">
            <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {study.sections.map((section) => {
                const selected = section.id === activeId
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={selected ? "true" : undefined}
                      onClick={(event) => {
                        event.preventDefault()
                        scrollToHeading(section.id)
                      }}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-base font-medium whitespace-nowrap lg:px-0 lg:whitespace-normal",
                        selected ? "text-mono-950" : "text-mono-500 hover:text-mono-950",
                      )}
                    >
                      {section.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <article ref={articleRef} className="min-h-0 min-w-0 flex-1 space-y-16 overflow-y-auto md:space-y-20">
            {study.sections.map((section) => (
              <CaseSectionView key={section.id} section={section} title={study.title} />
            ))}
          </article>
        </div>
      </main>
    </div>
  )
}

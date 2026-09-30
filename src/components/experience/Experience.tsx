import { Download } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Section } from "@/components/layout/Section"
import { SectionTitle } from "@/components/layout/SectionTitle"
import { experiences } from "@/data/experience"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

export function Experience() {
  const [detail, setDetail] = useState(true)
  const [activeId, setActiveId] = useState("saturnai")
  const [shown, setShown] = useState(true)
  const swapTimer = useRef<number>(0)
  const active = experiences.find((item) => item.id === activeId) ?? experiences[0]

  useEffect(() => () => window.clearTimeout(swapTimer.current), [])

  function selectCompany(id: string) {
    if (id === activeId) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.clearTimeout(swapTimer.current)
    if (reduceMotion) {
      setActiveId(id)
      setShown(true)
      return
    }
    setShown(false)
    swapTimer.current = window.setTimeout(() => {
      setActiveId(id)
      setShown(true)
    }, 180)
  }

  return (
    <Section id="experience" contained={false} className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <SectionTitle index="02">Experience</SectionTitle>
          <div className="ml-auto flex items-center gap-3 text-sm text-p-grey-60">
            <a
              href={site.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              aria-label="Download CV"
            >
              <Download className="size-4" strokeWidth={1.75} aria-hidden />
              CV
            </a>
            <span className="h-4 w-px bg-[#d0d0d0]" aria-hidden />
            <span id="experience-detail-label">Detail</span>
            <button
              type="button"
              role="switch"
              aria-checked={detail}
              aria-labelledby="experience-detail-label"
              onClick={() => setDetail((value) => !value)}
              className={cn(
                "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                detail ? "bg-green" : "bg-[#d5d5d5]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
                  detail && "translate-x-4",
                )}
              />
            </button>
          </div>
        </div>

        {detail ? (
          <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-12">
            <div role="tablist" aria-label="Companies" className="flex flex-col">
              {experiences.map((item) => {
                const selected = item.id === active.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`experience-tab-${item.id}`}
                    aria-selected={selected}
                    aria-controls="experience-panel"
                    onClick={() => selectCompany(item.id)}
                    className={cn(
                      "border-l-2 px-6 py-4 text-left transition-colors duration-300 md:px-8",
                      selected
                        ? "border-primary"
                        : "border-transparent text-p-grey-60 hover:text-primary",
                    )}
                  >
                    <h3
                      className={cn(
                        "font-sans text-xl leading-9 transition-colors duration-300 md:text-2xl",
                        selected ? "font-medium text-primary" : "font-normal",
                      )}
                    >
                      {item.menu.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <div
                      aria-hidden={!selected}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                        selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <p className="mt-1 max-w-sm overflow-hidden text-base leading-6 text-p-grey-50">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div
              role="tabpanel"
              id="experience-panel"
              aria-labelledby={`experience-tab-${active.id}`}
              className={cn(
                "min-w-0 transition-all duration-300 ease-out motion-reduce:transition-none",
                shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
            >
              <div key={active.id}>
                <p className="font-sans text-3xl font-medium text-primary md:text-[40px]">{active.role}</p>
                <p className="mt-3 text-xl text-p-grey-80 md:text-2xl">{active.period}</p>
                {active.comingSoon ? (
                  <p className="mt-6 text-base text-p-grey-50 md:text-lg">Coming soon</p>
                ) : (
                  <>
                    <ul className="mt-6 space-y-1 text-base leading-7 md:text-lg">
                      {active.responsibilities.map((item, index) => (
                        <li
                          key={item}
                          className="text-p-grey-60 motion-safe:animate-[experience-reveal_0.55s_ease_both]"
                          style={{ animationDelay: `${140 + index * 80}ms` }}
                        >
                          - {item}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {active.tools.map((tool, index) => (
                        <li
                          key={tool}
                          className="cursor-default rounded-full border-[1.5px] border-transparent bg-white px-4 py-1.5 text-sm text-primary transition-colors duration-200 hover:border-primary motion-safe:animate-[experience-reveal_0.45s_ease_both] md:text-base"
                          style={{ animationDelay: `${220 + active.responsibilities.length * 80 + index * 50}ms` }}
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <ul className="group/jobs mx-auto mt-12 flex w-full max-w-3xl flex-col gap-7 md:mt-16 md:gap-9 xl:max-w-5xl">
            {experiences.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 transition-all duration-300 ease-out group-hover/jobs:[&:not(:hover)]:opacity-40 hover:translate-x-2.5 motion-reduce:transition-none xl:flex xl:gap-x-6"
              >
                <img
                  src={item.logo}
                  alt=""
                  className="row-span-3 h-10 w-full object-contain object-left xl:row-span-1 xl:h-11 xl:w-28 xl:shrink-0"
                />
                <h3 className="text-sm text-p-grey-60 xl:w-32 xl:shrink-0 xl:text-base">{item.listName}</h3>
                <p className="shrink-0 text-sm text-p-grey-50 xl:text-base">{item.listRole}</p>
                <p className="text-sm whitespace-nowrap text-p-grey-50 xl:order-last xl:w-56 xl:shrink-0 xl:text-base">
                  {item.listPeriod}
                </p>
                <span aria-hidden className="col-span-2 h-px bg-[#c8c8c8] xl:min-w-12 xl:flex-1" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}

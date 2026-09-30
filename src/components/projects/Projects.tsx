import { useState } from "react"

import { ProjectCard } from "@/components/projects/ProjectCard"
import { Section } from "@/components/layout/Section"
import { SectionTitle } from "@/components/layout/SectionTitle"
import { behanceProfile, projectFilters, projects, type ProjectFilter, type ProjectType } from "@/data/projects"
import { cn } from "@/lib/utils"

function visibleRows(items: ProjectType[]) {
  const rows: ProjectType[][] = []
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]
    const next = items[index + 1]
    if (item.layout === "vertical" && next?.layout === "vertical") {
      rows.push([item, next])
      index += 1
    } else {
      rows.push([item])
    }
  }
  return rows
}

export function Projects() {
  const [filter, setFilter] = useState<ProjectFilter>("all")
  const visible = projects.filter((project) => filter === "all" || project.filters.includes(filter))

  return (
    <Section id="projects" contained={false} className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-[1128px] px-5 md:px-8">
        <SectionTitle index="03" className="mb-8 md:mb-12">
          Projects
        </SectionTitle>
        <div role="tablist" aria-label="Project filters" className="flex flex-wrap justify-center gap-3 md:gap-4">
          {projectFilters.map((item) => {
            const selected = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "rounded-full px-5 py-3 text-sm font-medium transition-colors md:px-6 md:py-3.5 md:text-base",
                  selected ? "bg-[#565def] text-white" : "bg-white text-black shadow-sm hover:text-[#565def]",
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:gap-8">
          {visibleRows(visible).map((row) =>
            row.length === 1 ? (
              <ProjectCard key={row[0].title} {...row[0]} />
            ) : (
              <div key={row.map((item) => item.title).join("-")} className="grid gap-6 md:grid-cols-2 md:gap-8">
                {row.map((project) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </div>
            ),
          )}
        </div>

        <div className="mt-8 flex justify-center md:mt-10">
          <a
            href={behanceProfile}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#565def] bg-white px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#565def] transition-colors hover:bg-[#565def] hover:text-white md:text-base"
          >
            View more on Behance
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </Section>
  )
}

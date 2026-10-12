import { useEffect, useState } from "react"

import { ProjectFilters } from "@/components/projects/FilterChips"
import { ProjectList } from "@/components/projects/ProjectList"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { SkipLink } from "@/components/layout/SkipLink"
import {
  projectDomains,
  projectFilters,
  projects,
  type ProjectDomain,
  type ProjectFilter,
} from "@/data/projects"

const typeOptions = projectFilters.filter(
  (item): item is { id: Exclude<ProjectFilter, "all">; label: string } => item.id !== "all",
)
const domainOptions = projectDomains.filter(
  (item): item is { id: Exclude<ProjectDomain, "all">; label: string } => item.id !== "all",
)

export function AllProjects() {
  const [types, setTypes] = useState(typeOptions.map((item) => item.id))
  const [domains, setDomains] = useState(domainOptions.map((item) => item.id))
  const allTypes = types.length === typeOptions.length
  const allDomains = domains.length === domainOptions.length
  const visible = projects.filter(
    (project) =>
      (allTypes || project.filters.some((filter) => types.includes(filter))) &&
      (allDomains || domains.includes(project.domain)),
  )

  useEffect(() => {
    const previous = document.title
    document.title = "All Projects — Tram Nguyen"
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <>
      <SkipLink />
      <Navbar home={false} />
      <main id="main" className="mx-auto min-h-[calc(100svh-85px)] w-full max-w-[1128px] px-5 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24">
        <h1 className="mb-8 text-center font-sans text-3xl font-medium text-foreground md:mb-12 md:text-4xl">
          All Projects
        </h1>
        <ProjectFilters
          types={types}
          domains={domains}
          typeOptions={typeOptions}
          domainOptions={domainOptions}
          onTypesApply={setTypes}
          onDomainsApply={setDomains}
        />
        <ProjectList items={visible} />
      </main>
      <Footer />
    </>
  )
}

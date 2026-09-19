import { Section } from "@/components/layout/Section"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { projects } from "@/data/projects"

export function Projects() {
  return (
    <Section id="projects">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-red">03</p>
        <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Projects</h2>
        <p className="mt-4 text-muted-foreground">
          Selected product work — from first-run experiences to systems that keep teams aligned.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <div key={project.title} className={index === 0 ? "md:col-span-2" : undefined}>
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </Section>
  )
}

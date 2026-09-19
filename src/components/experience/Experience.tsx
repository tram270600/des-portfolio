import { ExperienceItem } from "@/components/experience/ExperienceItem"
import { Section } from "@/components/layout/Section"
import { experiences } from "@/data/experience"

export function Experience() {
  return (
    <Section id="experience">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">02</p>
        <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Experiences</h2>
        <p className="mt-4 text-muted-foreground">
          A path from intern to product designer — always translating requirements into
          interfaces that hold up in the real world.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {experiences.map((item) => (
          <ExperienceItem key={`${item.company}-${item.period}`} {...item} />
        ))}
      </div>
    </Section>
  )
}

import { Section } from "@/components/layout/Section"
import { skillGroups } from "@/data/skills"
import { cn } from "@/lib/utils"

const chip: Record<(typeof skillGroups)[number]["accent"], string> = {
  blue: "border-primary text-primary bg-primary/5",
  red: "border-red text-red bg-red/5",
  green: "border-green text-green bg-green/5",
  yellow: "border-yellow bg-yellow/50 text-foreground",
}

export function Skills() {
  return (
    <Section id="skills">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-green">04</p>
        <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Skills</h2>
        <p className="mt-4 text-muted-foreground">
          The craft, research, and tools behind turning complexity into something usable.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.title} className="sketch-border paper-card border-foreground/15 p-6 text-foreground">
            <h3 className="font-display text-2xl font-semibold">{group.title}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li key={skill}>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-3 py-1.5 text-sm font-medium",
                      chip[group.accent],
                    )}
                  >
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

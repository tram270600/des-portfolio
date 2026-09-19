import { Badge } from "@/components/ui/badge"
import { type ExperienceType } from "@/data/experience"
import { cn } from "@/lib/utils"

const accentClass: Record<ExperienceType["accent"], string> = {
  blue: "border-primary",
  red: "border-red",
  green: "border-green",
  yellow: "border-yellow",
}

export function ExperienceItem({
  company,
  role,
  period,
  description,
  responsibilities,
  tools,
  accent,
}: ExperienceType) {
  return (
    <article
      className={cn(
        "sketch-border paper-card relative p-6 md:p-8",
        accentClass[accent],
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{period}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">{role}</h3>
          <p className="mt-1 text-base font-medium text-foreground/80">{company}</p>
        </div>
        {tools && tools.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Badge key={tool} variant="outline">
                {tool}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-foreground/80">
        {description}
      </p>
      {responsibilities && responsibilities.length > 0 ? (
        <ul className="mt-5 space-y-2 text-sm leading-relaxed text-foreground/75">
          {responsibilities.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

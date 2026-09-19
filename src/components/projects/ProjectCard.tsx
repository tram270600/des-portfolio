import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { type ProjectType } from "@/data/projects"
import { cn } from "@/lib/utils"

const frame: Record<ProjectType["accent"], string> = {
  blue: "bg-primary/10",
  red: "bg-red/10",
  green: "bg-green/10",
  yellow: "bg-yellow/40",
}

export function ProjectCard({
  title,
  description,
  role,
  industry,
  process,
  contribution,
  tools,
  tags,
  image,
  href,
  accent,
}: ProjectType) {
  return (
    <Card className="overflow-hidden rounded-[28px] border border-border/80 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1">
      <div className={cn("relative aspect-[16/10] overflow-hidden", frame[accent])}>
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {role} · {industry}
          </p>
        </div>
        <p className="text-[15px] leading-relaxed text-foreground/80">{description}</p>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="font-medium text-foreground">Process</dt>
            <dd className="text-muted-foreground">{process}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Contribution</dt>
            <dd className="text-muted-foreground">{contribution}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Tools</dt>
            <dd className="text-muted-foreground">{tools.join(" · ")}</dd>
          </div>
        </dl>
        {href ? (
          <a
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View Case Study
            <ArrowUpRight className="size-4" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
            Case study on request
            <ArrowUpRight className="size-4" />
          </span>
        )}
      </div>
    </Card>
  )
}

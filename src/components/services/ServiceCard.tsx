import { type ServiceType } from "@/data/services"
import { cn } from "@/lib/utils"

const accentBar: Record<ServiceType["accent"], string> = {
  blue: "bg-primary",
  red: "bg-red",
  green: "bg-green",
  yellow: "bg-yellow",
}

export function ServiceCard({ title, description, accent }: ServiceType) {
  return (
    <article className="paper-card flex overflow-hidden rounded-[22px] border border-border">
      <div className={cn("w-2.5 shrink-0", accentBar[accent])} />
      <div className="flex flex-1 items-center gap-4 p-5 md:p-6">
        <div
          className="hidden h-16 w-10 shrink-0 rounded-sm border-2 border-current/40 md:block"
          aria-hidden
          style={{ color: "inherit" }}
        >
          <div className={cn("h-full w-full opacity-30", accentBar[accent])} />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </article>
  )
}

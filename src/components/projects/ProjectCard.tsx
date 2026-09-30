import type { ProjectType } from "@/data/projects"
import { cn } from "@/lib/utils"

function ViewProjectLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith("http")

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group relative mt-5 inline-flex h-[66px] w-fit items-start"
    >
      <span className="absolute inset-x-0 top-1.5 h-[60px] rounded-[20px] border-[1.6px] border-[#353a93] bg-[#353a93]" />
      <span className="relative inline-flex h-[60px] items-center gap-2 rounded-[20px] border-[1.6px] border-[#353a93] bg-[#565def] px-8 text-base font-medium uppercase tracking-wide text-white transition-transform group-hover:translate-y-0.5 group-active:translate-y-1.5 md:text-xl">
        {label}
        <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}

export function ProjectCard({ title, eyebrow, description, image, imageAlt, href, layout }: ProjectType) {
  const horizontal = layout === "horizontal"

  return (
    <article
      className={cn(
        "flex h-full gap-6 rounded-[24px] bg-white p-4 shadow-[0_8px_30px_rgba(26,26,26,0.04)] md:p-5",
        horizontal ? "flex-col md:flex-row md:items-center md:gap-10 md:p-6" : "flex-col",
      )}
    >
      <img
        src={image}
        alt={imageAlt}
        className={cn(
          "w-full rounded-[20px] object-cover",
          horizontal ? "aspect-[403/311] md:w-[42%] md:shrink-0" : "aspect-[4/3]",
        )}
      />
      <div className={cn("flex min-w-0 flex-1 flex-col", horizontal ? "md:py-2" : "")}>
        <h3 className="font-sans text-2xl font-normal text-black md:text-[32px] md:leading-tight">{title}</h3>
        <p className="mt-2 text-sm text-[#384d4b] md:text-base">{eyebrow}</p>
        <p className="mt-3 text-base leading-7 text-[#384d4b] md:text-lg">{description}</p>
        <ViewProjectLink href={href} label="View Project" />
      </div>
    </article>
  )
}

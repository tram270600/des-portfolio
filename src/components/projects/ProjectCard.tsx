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
      <span className="absolute inset-x-0 top-1.5 h-[60px] rounded-[20px] border-[1.6px] border-[#004a96] bg-[#004a96]" />
      <span className="relative inline-flex h-[60px] items-center gap-2 rounded-[20px] border-[1.6px] border-[#004a96] bg-primary px-8 text-base font-medium uppercase tracking-wide text-primary-foreground transition-transform group-hover:translate-y-0.5 group-active:translate-y-1.5 md:text-xl">
        {label}
        <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Thumbnail({
  title,
  image,
  imageAlt,
  href,
  horizontal,
}: Pick<ProjectType, "title" | "image" | "imageAlt" | "href"> & { horizontal: boolean }) {
  const external = href.startsWith("http")
  const linked = href.startsWith("/experience") || href.includes("/gallery/")
  const frame = cn(
    "group/thumb relative block w-full overflow-hidden rounded-[20px]",
    horizontal ? "aspect-[403/311] md:w-[42%] md:shrink-0" : "aspect-[4/3]",
    linked && "cursor-pointer",
  )
  const imageEl = (
    <img
      src={image}
      alt={linked ? "" : imageAlt}
      className="size-full object-cover transition-transform duration-500 ease-out group-hover/thumb:scale-105 motion-reduce:transition-none motion-reduce:group-hover/thumb:scale-100"
    />
  )

  if (!linked) {
    return <div className={frame}>{imageEl}</div>
  }

  return (
    <a
      href={href}
      aria-label={`${title}. View case study`}
      className={frame}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {imageEl}
      <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition duration-300 group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100 motion-reduce:transition-none">
        <span className="flex translate-y-2 items-center gap-2 p-4 text-sm font-medium tracking-wide text-white uppercase transition duration-300 group-hover/thumb:translate-y-0 group-focus-visible/thumb:translate-y-0 md:p-6">
          View Case Study
          <ArrowUpRight />
        </span>
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
      <Thumbnail title={title} image={image} imageAlt={imageAlt} href={href} horizontal={horizontal} />
      <div className={cn("flex min-w-0 flex-1 flex-col", horizontal ? "md:py-2" : "")}>
        <h3 className="font-sans text-2xl font-normal text-black md:text-[32px] md:leading-tight">{title}</h3>
        <p className="mt-2 text-sm text-[#384d4b] md:text-base">{eyebrow}</p>
        <p className="mt-3 text-base leading-7 text-[#384d4b] md:text-lg">{description}</p>
        <ViewProjectLink href={href} label="Explore" />
      </div>
    </article>
  )
}

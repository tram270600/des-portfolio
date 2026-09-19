import { ArrowUpRight, Search } from "lucide-react"

import { site } from "@/data/site"

export function SearchCta() {
  return (
    <form
      className="relative mx-auto box-border w-full min-w-0 max-w-full md:max-w-[560px]"
      onSubmit={(event) => {
        event.preventDefault()
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
      }}
    >
      <div className="paper-card max-w-full rounded-[22px] p-2 sm:rounded-[28px] sm:p-3 md:p-4">
        <label className="sr-only" htmlFor="hero-search">
          Continue to {site.name} portfolio
        </label>
        <div className="flex min-w-0 items-center gap-2 rounded-full border-[1.5px] border-red px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5 md:px-5 md:py-3">
          <Search className="size-4 shrink-0 text-red" aria-hidden />
          <button
            id="hero-search"
            type="submit"
            className="min-w-0 flex-1 truncate text-left text-base font-medium md:text-lg"
          >
            <mark className="rounded-sm bg-yellow px-1 py-0.5 text-foreground">{site.name}</mark>
          </button>
          <button
            type="submit"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-red transition-colors hover:bg-red/10 sm:size-8"
            aria-label="Go to About"
          >
            <ArrowUpRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-3 top-[58%] hidden items-center gap-1 lg:flex lg:-right-20">
        <span className="text-xl text-primary" aria-hidden>
          ▸
        </span>
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-card px-2 py-1 shadow-md">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            TN
          </span>
          <span className="pr-2 text-sm font-semibold text-primary">{site.year}</span>
        </div>
      </div>
    </form>
  )
}

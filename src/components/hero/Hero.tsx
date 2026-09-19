import { HeroKeyboard } from "@/components/hero/HeroKeyboard"
import { PortfolioWordmark } from "@/components/hero/PortfolioWordmark"
import { SearchCta } from "@/components/hero/SearchCta"
import { site } from "@/data/site"

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-svh w-full max-w-full overflow-x-hidden px-5 py-16 md:px-8 md:py-20"
    >
      <img
        src="/images/hero-left.png"
        alt=""
        className="pointer-events-none absolute top-[12%] left-0 hidden w-[18vw] max-w-[260px] mix-blend-multiply select-none lg:block lg:w-[22vw] lg:max-w-[280px]"
      />
      <img
        src="/images/hero-right.png"
        alt=""
        className="pointer-events-none absolute top-[10%] right-0 hidden w-[18vw] max-w-[260px] mix-blend-multiply select-none lg:block lg:w-[22vw] lg:max-w-[280px]"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] w-full min-w-0 max-w-4xl flex-col items-stretch justify-center text-center">
        <p className="mb-4 self-center rounded-[4px] border-[1.5px] border-yellow px-3 py-1 text-sm font-semibold tracking-wide md:mb-5 md:text-base">
          {site.title}
        </p>

        <PortfolioWordmark />

        <div className="relative mt-8 w-full min-w-0 md:mt-10">
          <span
            className="pointer-events-none absolute -right-4 -top-8 hidden text-yellow md:block"
            aria-hidden
          >
            ✦
          </span>
          <SearchCta />
        </div>

        <ul className="mt-8 w-full max-w-full space-y-2 px-1 text-left text-[13px] text-primary md:max-w-md md:text-[15px]">
          <li className="flex items-start gap-2">
            <span aria-hidden>◎</span>
            <span>Born in 2000 — at the dawn of the digital age.</span>
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden>◎</span>
            <span>Born at the turning point. Designing what comes next.</span>
          </li>
        </ul>

        <HeroKeyboard />
      </div>
    </section>
  )
}

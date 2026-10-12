import { Clock } from "lucide-react";

import { HeroDecorations } from "@/components/hero/HeroDecorations";
import { HeroKeyboard } from "@/components/hero/HeroKeyboard";
import { HeroReveal } from "@/components/hero/HeroReveal";
import { PortfolioWordmark } from "@/components/hero/PortfolioWordmark";
import { SearchCta } from "@/components/hero/SearchCta";
import { useScrambleText } from "@/components/hero/useScrambleText";
import { site } from "@/data/site";

export function Hero() {
  const { frame } = useScrambleText(site.title);
  const title = frame ?? site.title;

  return (
    <section
      id="home"
      className="relative isolate flex min-h-svh w-full max-w-full flex-col justify-center overflow-x-hidden px-5 py-16 md:px-8"
    >
      <HeroReveal
        delay={0.92}
        duration={0.45}
        className="pointer-events-none absolute inset-0"
      >
        <HeroDecorations />
      </HeroReveal>

      <div className="pointer-events-none relative z-10 mx-auto flex w-full min-w-0 max-w-4xl flex-col items-stretch text-center">
        <HeroReveal
          delay={0.04}
          className="relative mb-5 self-center rounded-lg border-[3px] border-yellow bg-yellow/20 px-4 py-2 md:mb-6 md:px-5 md:py-2.5"
        >
          <span
            className="absolute -top-0.75 -left-0.75 size-2.5 border border-white bg-yellow"
            aria-hidden
          />
          <span
            className="absolute -top-0.75 -right-0.75 size-2.5 border border-white bg-yellow"
            aria-hidden
          />
          <span
            className="absolute -bottom-0.75 -left-0.75 size-2.5 border border-white bg-yellow"
            aria-hidden
          />
          <span
            className="absolute -right-0.75 -bottom-0.75 size-2.5 border border-white bg-yellow"
            aria-hidden
          />
          <p className="inline-grid text-sm font-semibold tracking-wide md:text-base">
            <span className="invisible col-start-1 row-start-1 whitespace-pre">
              {site.title}
            </span>
            <span aria-hidden className="col-start-1 row-start-1 whitespace-pre">
              {title}
            </span>
            <span className="sr-only">{site.title}</span>
          </p>
        </HeroReveal>

        <HeroReveal delay={0.14}>
          <PortfolioWordmark />
        </HeroReveal>

        <HeroReveal delay={0.28} className="relative mt-8 w-full min-w-0 md:mt-10">
          <span
            className="pointer-events-none absolute -right-4 -top-8 text-yellow block"
            aria-hidden
          >
            ✦
          </span>
          <SearchCta />
        </HeroReveal>

        <ul className="mt-8 mx-auto w-full max-w-full space-y-2 px-1 text-left text-[13px] text-primary md:max-w-md md:text-[15px]">
          <li>
            <HeroReveal delay={0.4} className="flex items-start gap-2">
              <Clock
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <span>Born in 2000 — at the dawn of the digital age.</span>
            </HeroReveal>
          </li>
          <li>
            <HeroReveal delay={0.48} className="flex items-start gap-2">
              <Clock
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <span>Born at the turning point. Designing what comes next.</span>
            </HeroReveal>
          </li>
        </ul>

        <HeroReveal delay={0.58}>
          <HeroKeyboard />
        </HeroReveal>
      </div>
    </section>
  );
}

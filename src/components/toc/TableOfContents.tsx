import { contents } from "@/data/contents"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui"

export function TableOfContents() {
  const hoveredTape = useUIStore((state) => state.hoveredTape)
  const setHoveredTape = useUIStore((state) => state.setHoveredTape)

  return (
    <section
      id="contents"
      aria-labelledby="contents-heading"
      className="relative scroll-mt-24 px-5 py-10 md:px-8 md:py-16"
    >
      <div className="mx-auto max-w-xl">
        <h2 id="contents-heading" className="sr-only">
          Table of contents
        </h2>
        <div className="relative">
          <img
            src="/images/toc-cassettes.png"
            alt=""
            className="mx-auto h-auto w-full max-w-[420px] mix-blend-multiply select-none"
          />
          <nav
            aria-label="Section cassettes"
            className="absolute inset-x-[8%] inset-y-[6%] mx-auto flex max-w-[420px] flex-col"
          >
            {contents.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredTape(item.id)}
                onMouseLeave={() => setHoveredTape(null)}
                onFocus={() => setHoveredTape(item.id)}
                onBlur={() => setHoveredTape(null)}
                className={cn(
                  "flex-1 rounded-md motion-safe:transition-transform motion-safe:duration-200",
                  hoveredTape === item.id && "motion-safe:-translate-x-1",
                )}
              >
                <span className="sr-only">
                  {item.index}. {item.label}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}

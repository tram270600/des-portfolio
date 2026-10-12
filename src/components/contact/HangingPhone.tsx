import { useEffect, useState } from "react"
import { getCalApi } from "@calcom/embed-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

const calNamespace = "intro-call"

type Phase = "wait" | "drop" | "rest"

async function openSchedule() {
  const cal = await getCalApi({ namespace: calNamespace })
  cal("modal", {
    calLink: site.calLink,
    config: { layout: "month_view" },
  })
}

export function HangingPhone() {
  const [phase, setPhase] = useState<Phase>(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "rest" : "wait",
  )

  useEffect(() => {
    if (phase === "rest") return
    const reveal = document.querySelector("#contact .contact-reveal")
    if (!reveal) return

    const start = () => {
      if (reveal.getAttribute("data-revealed") === "true") setPhase("drop")
    }
    start()
    const observer = new MutationObserver(start)
    observer.observe(reveal, { attributes: true, attributeFilter: ["data-revealed"] })
    return () => observer.disconnect()
  }, [phase])

  useEffect(() => {
    if (phase !== "drop") return
    const timer = window.setTimeout(() => setPhase("rest"), 1200)
    return () => window.clearTimeout(timer)
  }, [phase])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => void openSchedule()}
          onAnimationEnd={(event) => {
            if (event.animationName === "phone-drop") setPhase("rest")
          }}
          aria-label="Schedule a call"
          className={cn(
            "phone-drop cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
            phase === "drop" && "is-dropping",
            phase === "rest" && "is-resting",
          )}
        >
          <span className="phone-swing block">
            <img
              src="/images/contact/hanging-phone.png"
              alt=""
              draggable={false}
              className="pointer-events-none h-[min(34svh,280px)] w-auto select-none md:h-[min(42svh,360px)]"
            />
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        sideOffset={12}
        collisionPadding={16}
        className="rounded-full bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground"
      >
        Schedule a call
      </TooltipContent>
    </Tooltip>
  )
}

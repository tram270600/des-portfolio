import { ArrowUpRight, Mail } from "lucide-react"

import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/button"
import { site } from "@/data/site"

export function Contact() {
  return (
    <Section id="contact">
      <div className="paper-card relative overflow-hidden rounded-[32px] border border-border px-6 py-14 text-center md:px-12 md:py-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">06</p>
        <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Let's chat</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-foreground/80">
          Have a product idea or design challenge?
          <br />
          Let's create something meaningful together.
        </p>

        <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full border-[1.5px] border-red bg-background px-4 py-2">
          <Mail className="size-4 text-red" aria-hidden />
          <span className="flex-1 text-left text-sm font-medium md:text-base">{site.email}</span>
          <Button asChild size="sm">
            <a href={`mailto:${site.email}`}>
              Email
              <ArrowUpRight />
            </a>
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline">
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </Button>
          <Button asChild variant="accent">
            <a href={`mailto:${site.email}?subject=Let's chat`}>Let's Chat</a>
          </Button>
        </div>
      </div>
    </Section>
  )
}

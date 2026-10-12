import { Section } from "@/components/layout/Section"
import { SectionTitle } from "@/components/layout/SectionTitle"
import { Cabinet } from "@/components/services/Cabinet"
import { FluidReveal } from "@/components/services/FluidReveal"
import { RewindClock } from "@/components/services/RewindClock"

export function Services() {
  return (
    <Section id="services" contained={false} className="overflow-visible bg-background">
      <FluidReveal />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8">
        <SectionTitle index="05">Services</SectionTitle>
        <div className="relative mx-auto mt-36 w-full max-w-[776px] md:mt-48">
          <RewindClock>
            <Cabinet />
          </RewindClock>
        </div>
      </div>
    </Section>
  )
}

import { Section } from "@/components/layout/Section"
import { ServiceCard } from "@/components/services/ServiceCard"
import { services } from "@/data/services"

export function Services() {
  return (
    <Section id="services">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-red">05</p>
        <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Services</h2>
        <p className="mt-4 text-muted-foreground">
          Ways we can work together — from a single flow to a full product experience.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </Section>
  )
}

import { Section } from "@/components/layout/Section"
import { SectionTitle } from "@/components/layout/SectionTitle"
import { ServiceCard } from "@/components/services/ServiceCard"
import { services } from "@/data/services"

export function Services() {
  return (
    <Section id="services">
      <div className="mb-10 max-w-2xl">
        <SectionTitle index="05">Services</SectionTitle>
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

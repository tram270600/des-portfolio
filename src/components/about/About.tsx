import { Section } from "@/components/layout/Section"
import { site } from "@/data/site"

export function About() {
  return (
    <Section id="about" className="pt-8 md:pt-12">
      <h2 className="sr-only">About me</h2>
      <p className="sr-only">
        {site.name} is a Product Designer born in 2000 in Vietnam. She takes a
        user-centered approach, collaborating with developers, product managers,
        and stakeholders to turn requirements into accessible, consistent, and
        scalable digital experiences.
      </p>
      <figure className="mx-auto w-full min-w-0 max-w-5xl">
        <img
          src="/images/about-corkboard.png"
          alt="Corkboard collage with childhood photos, a Vietnamese passport, a nón lá hat, a cassette labeled Life Goes On, a camera, and a stuffed rabbit — a visual portrait of Tram Nguyen."
          className="mx-auto h-auto w-full max-w-full mix-blend-multiply select-none"
        />
      </figure>
    </Section>
  )
}

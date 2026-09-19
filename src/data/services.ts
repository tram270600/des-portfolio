export type ServiceType = {
  title: string
  description: string
  accent: "blue" | "red" | "green" | "yellow"
}

export const services: ServiceType[] = [
  {
    title: "Product Design",
    description:
      "End-to-end product design — from framing the problem to shipping interfaces that feel simple, considered, and human.",
    accent: "blue",
  },
  {
    title: "UX / UI Design",
    description:
      "Clear information architecture, interaction design, and visual UI for web and mobile products.",
    accent: "red",
  },
  {
    title: "Design Systems",
    description:
      "Reusable tokens, components, and guidelines so teams can scale a consistent experience without starting over.",
    accent: "green",
  },
  {
    title: "UX Research",
    description:
      "Requirement analysis, user interviews, and usability testing to ground design decisions in evidence.",
    accent: "yellow",
  },
  {
    title: "Prototyping",
    description:
      "Interactive prototypes that help stakeholders feel the product before engineering invests in build.",
    accent: "blue",
  },
  {
    title: "Design Audit",
    description:
      "A structured review of usability, accessibility, and visual consistency — with prioritized recommendations.",
    accent: "red",
  },
]

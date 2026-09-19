export type ProjectType = {
  title: string
  description: string
  role: string
  industry: string
  process: string
  contribution: string
  tools: string[]
  tags: string[]
  image: string
  href?: string
  accent: "blue" | "red" | "green" | "yellow"
}

export const projects: ProjectType[] = [
  {
    title: "Onboarding, simplified",
    description:
      "A multi-step product onboarding flow redesigned to reduce drop-off and make first-time setup feel calm instead of overwhelming.",
    role: "Product Designer",
    industry: "SaaS / Productivity",
    process: "Research → flows → UI → prototype → usability review",
    contribution:
      "Defined the information architecture, designed the full UI, and prototyped the happy path plus error states.",
    tools: ["Figma", "Prototyping"],
    tags: ["UX Research", "UI Design", "Prototyping"],
    image: "/images/project-onboarding.svg",
    accent: "blue",
  },
  {
    title: "Care, connected",
    description:
      "A patient-facing scheduling experience focused on clarity, trust, and accessible interaction across mobile and desktop.",
    role: "Product Designer",
    industry: "Health",
    process: "Requirement analysis → user flows → UI system → prototype",
    contribution:
      "Turned clinical and operational requirements into a booking journey with clear hierarchy and reduced cognitive load.",
    tools: ["Figma", "User flows"],
    tags: ["User Flows", "Accessibility", "Responsive Design"],
    image: "/images/project-care.svg",
    accent: "green",
  },
  {
    title: "A system to grow with",
    description:
      "A lightweight design system for a growing product team — tokens, components, and usage guidance that keep UI consistent as features ship.",
    role: "Product Designer",
    industry: "Design operations",
    process: "Audit → tokens → components → documentation",
    contribution:
      "Built the core component set and rules so designers and developers could ship faster without visual drift.",
    tools: ["Figma", "Design systems"],
    tags: ["Design Systems", "UI Design", "Collaboration"],
    image: "/images/project-system.svg",
    accent: "red",
  },
]

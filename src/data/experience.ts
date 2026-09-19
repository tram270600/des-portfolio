export type ExperienceType = {
  company: string
  role: string
  period: string
  description: string
  responsibilities?: string[]
  tools?: string[]
  accent: "blue" | "red" | "green" | "yellow"
}

export const experiences: ExperienceType[] = [
  {
    company: "Independent practice",
    role: "Product Designer",
    period: "2024 — Present",
    accent: "blue",
    description:
      "Partnering with founders, PMs, and engineers to turn messy product requirements into interfaces people can actually use.",
    responsibilities: [
      "Lead end-to-end product design from research through high-fidelity UI and prototypes",
      "Facilitate workshops with developers, product managers, and stakeholders",
      "Shape accessible, consistent patterns that can scale across surfaces",
    ],
    tools: ["Figma", "Prototyping", "Design systems"],
  },
  {
    company: "Product team",
    role: "UI/UX Designer",
    period: "2022 — 2024",
    accent: "red",
    description:
      "Designed user-centered flows for web and mobile products, translating business goals into clear interaction models.",
    responsibilities: [
      "Mapped user journeys and turned requirements into usable interface specs",
      "Ran usability reviews and iterated with engineering during implementation",
      "Contributed to a shared component library for visual and interaction consistency",
    ],
    tools: ["Figma", "User flows", "Usability testing"],
  },
  {
    company: "Design studio",
    role: "Product Design Intern",
    period: "2021 — 2022",
    accent: "green",
    description:
      "Supported research, wireframing, and UI design on digital products — learning how craft, constraints, and collaboration meet.",
    responsibilities: [
      "Created wireframes, UI explorations, and interactive prototypes",
      "Documented design decisions for handoff to developers",
      "Helped audit interfaces for accessibility and visual consistency",
    ],
    tools: ["Figma", "Wireframing", "Visual design"],
  },
]

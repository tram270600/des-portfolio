export type SkillGroup = {
  title: string
  accent: "blue" | "red" | "green" | "yellow"
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Design",
    accent: "blue",
    skills: [
      "UI Design",
      "UX Design",
      "Interaction Design",
      "Design Systems",
      "Prototyping",
      "Responsive Design",
      "Accessibility",
    ],
  },
  {
    title: "Research",
    accent: "green",
    skills: [
      "User Research",
      "Requirement Analysis",
      "Usability Testing",
      "User Flows",
      "Information Architecture",
    ],
  },
  {
    title: "Tools",
    accent: "red",
    skills: ["Figma", "Photoshop", "Framer", "AI design tools"],
  },
]

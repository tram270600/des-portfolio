export const site = {
  name: "Tram Nguyen",
  title: "Product Designer",
  year: "2026",
  email: "hello@tramnguyen.design",
  linkedin: "https://www.linkedin.com/in/tram-nguyen",
  location: "Vietnam",
} as const

export const navItems = [
  { id: "about", label: "About", href: "#about" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "services", label: "Services", href: "#services" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const

export type SectionId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "services"
  | "contact"

export const sectionIds: SectionId[] = [
  "home",
  "about",
  "experience",
  "projects",
  "skills",
  "services",
  "contact",
]

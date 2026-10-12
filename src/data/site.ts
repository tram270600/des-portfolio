export const site = {
  name: "Tram Nguyen",
  title: "Product Designer",
  year: "2026",
  email: "ngntram.ityu@gmail.com",
  linkedin: "https://www.linkedin.com/in/tram-nguyen",
  location: "Vietnam",
  cv: "https://drive.google.com/file/d/1JCSpRtZO0J8wtVEPzmM3eFvC17fyyPH-/view?usp=sharing",
  calLink: "tram-nguyen-giang-ngoc-wojkeo/30-minute-intro-call",
} as const

export const navItems = [
  { id: "about", label: "About", href: "#about" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "works", label: "Works", href: "#works" },
  { id: "skills", label: "Skills", href: "#skills" },
  // { id: "services", label: "Services", href: "#services" },
  { id: "playground", label: "Playground", href: "#playground" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const

export type SectionId =
  | "home"
  | "about"
  | "experience"
  | "works"
  | "skills"
  // | "services"
  | "playground"
  | "contact"

export const sectionIds: SectionId[] = [
  "home",
  "about",
  "experience",
  "works",
  "skills",
  // "services",
  "playground",
  "contact",
]

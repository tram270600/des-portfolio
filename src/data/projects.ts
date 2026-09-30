export type ProjectFilter = "all" | "e2e" | "ui" | "ux"

export type ProjectType = {
  title: string
  eyebrow: string
  description: string
  image: string
  imageAlt: string
  href: string
  layout: "horizontal" | "vertical"
  filters: Exclude<ProjectFilter, "all">[]
}

export const projectFilters: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "e2e", label: "E2E Product Design" },
  { id: "ui", label: "UI Enhancement" },
  { id: "ux", label: "UX Improvement" },
]

export const behanceProfile = "https://www.behance.net/tramnguyen2706"

export const projects: ProjectType[] = [
  {
    title: "School Content Management System",
    eyebrow: "UI/UX Design | Usability Research",
    description:
      "A centralized workspace for schools to organize, create, and manage curriculum and lesson content. It supports familiar folder-based organization, multiple learning content types, flexible content management, and AI-powered content creation and review.",
    image: "/images/school-cms/overview.png",
    imageAlt: "School content management system showing a grid of kindergarten courses.",
    href: "/experience?case=school-cms",
    layout: "horizontal",
    filters: ["ux", "ui"],
  },
  {
    title: "Teaching tool",
    eyebrow: "UI/UX Design | Usability Research | Improvement",
    description:
      "An essential teaching tool that helps teachers create an interactive and engaging learning environment. It allows educators to visually explain concepts, encourage student participation, and make lessons more dynamic.",
    image: "/images/project-teaching.png",
    imageAlt: "Teaching tool interface with an alphabet ebook, number cards, and classroom drawing tools.",
    href: behanceProfile,
    layout: "horizontal",
    filters: ["ux", "ui"],
  },
  {
    title: "Làng - Craft Village Web App",
    eyebrow: "UI/UX Case Study | Designathon 2024",
    description:
      "Làng is a website that allows users to explore and discover information about traditional craft villages, events, and activities happening in these communities.",
    image: "/images/project-lang.png",
    imageAlt: "Laptop on a red desk showing the Làng craft village web app.",
    href: behanceProfile,
    layout: "horizontal",
    filters: ["e2e", "ux"],
  },
  {
    title: "Nail Salon Web App",
    eyebrow: "UI Design | Research & Design",
    description:
      "A Nail Salon Management App helps streamline operations, improve customer experience, and boost business efficiency. Providing tools for scheduling, client management, payments, and inventory tracking, making salon operations smoother.",
    image: "/images/project-nail-salon.png",
    imageAlt: "Nail salon web app screens for research, scheduling, and client management.",
    href: behanceProfile,
    layout: "vertical",
    filters: ["ui", "e2e"],
  },
  {
    title: "SSSMarket - Digital Wardrobe",
    eyebrow: "UI/UX Design | Mobile App",
    description:
      "SSSMarket is a platform that helps to share your wardrobe with the community in order to reuse, renew the item, and increase the life cycle of item that are no longer suit with your current style.",
    image: "/images/project-sssmarket.png",
    imageAlt: "SSSMarket mobile fashion app screens for browsing and sharing a digital wardrobe.",
    href: behanceProfile,
    layout: "vertical",
    filters: ["e2e", "ui"],
  },
  {
    title: "Smart Site Safety System (4S)",
    eyebrow: "UI Design | Redesign Website",
    description:
      "Empower Your Jobsites with Automated Construction Management Software Powered with AI Video Analytics",
    image: "/images/project-smart-site.png",
    imageAlt: "Construction worker on a jobsite beside the Smart Site Safety System website.",
    href: behanceProfile,
    layout: "horizontal",
    filters: ["ui"],
  },
]

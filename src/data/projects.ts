export type ProjectFilter = "all" | "e2e" | "ui" | "ux"

export type ProjectDomain =
  | "all"
  | "education"
  | "travel"
  | "food-beverage"
  | "safety-construction"
  | "fashion"
  | "web3"
  | "care-services"

export type ProjectType = {
  title: string
  shortName: string
  featured?: boolean
  eyebrow: string
  description: string
  image: string
  imageAlt: string
  href: string
  layout: "horizontal" | "vertical"
  filters: Exclude<ProjectFilter, "all">[]
  domain: Exclude<ProjectDomain, "all">
}

export const projectFilters: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "e2e", label: "E2E Product Design" },
  { id: "ui", label: "UI Enhancement" },
  { id: "ux", label: "UX Improvement" },
]

export const projectDomains: { id: ProjectDomain; label: string }[] = [
  { id: "all", label: "All" },
  { id: "education", label: "Education" },
  { id: "travel", label: "Travel" },
  { id: "food-beverage", label: "Food & Beverage" },
  { id: "safety-construction", label: "Safety Construction" },
  { id: "fashion", label: "Fashion" },
  { id: "web3", label: "Web3" },
]

export const behanceProfile = "https://www.behance.net/tramnguyen2706"

export const projects: ProjectType[] = [
  {
    title: "Digital Asset Management",
    shortName: "DAM",
    featured: true,
    eyebrow: "UI/UX Design | Improvement",
    description:
      "Digital Asset Management is a Web3-enabled dashboard that helps users track and manage crypto portfolios across multiple blockchains and centralized exchanges. A portfolio can group multiple wallet addresses and exchange accounts into a single view.",
    image: "/images/projects/dam-thumbnail.png",
    imageAlt: "Redesign of a digital asset management dashboard with a net-worth chart and a portfolio overview.",
    href: "/experience?case=dam",
    layout: "horizontal",
    filters: ["ui", "ux"],
    domain: "web3",
  },
  {
    title: "School Content Management System",
    shortName: "CMS",
    featured: true,
    eyebrow: "UI/UX Design | Usability Research",
    description:
      "A centralized workspace for schools to organize, create, and manage curriculum and lesson content. It supports familiar folder-based organization, multiple learning content types, flexible content management, and AI-powered content creation and review.",
    image: "/images/projects/cms-thumbnail.png",
    imageAlt: "School content management system showing a grid of kindergarten courses.",
    href: "/experience?case=school-cms",
    layout: "horizontal",
    filters: ["ux", "ui"],
    domain: "education",
  },
  {
    title: "Teaching tool",
    shortName: "Teaching",
    eyebrow: "UI/UX Design | Usability Research | Improvement",
    description:
      "An essential teaching tool that helps teachers create an interactive and engaging learning environment. It allows educators to visually explain concepts, encourage student participation, and make lessons more dynamic.",
    image: "/images/projects/teaching-tool-thumbnail.png",
    imageAlt: "Teaching tool interface with an alphabet ebook, number cards, and classroom drawing tools.",
    href: "/experience?case=teaching-tool",
    layout: "horizontal",
    filters: ["ux", "ui"],
    domain: "education",
  },
  {
    title: "Làng - Craft Village Web App",
    shortName: "Làng",
    featured: true,
    eyebrow: "UI/UX Case Study | Designathon 2024",
    description:
      "Làng is a website that allows users to explore and discover information about traditional craft villages, events, and activities happening in these communities.",
    image: "/images/projects/lang-thumbnail.png",
    imageAlt: "Laptop on a red desk showing the Làng craft village web app.",
    href: "https://www.behance.net/gallery/210123753/UXUI-Case-Study-Craft-Village-Web-App-Design",
    layout: "horizontal",
    filters: ["e2e", "ux"],
    domain: "travel",
  },
  {
    title: "Nail Salon Web App",
    shortName: "Nail",
    eyebrow: "UI Design | Research & Design",
    description:
      "A Nail Salon Management App helps streamline operations, improve customer experience, and boost business efficiency. Providing tools for scheduling, client management, payments, and inventory tracking, making salon operations smoother.",
    image: "/images/projects/nail-thumbnail.png",
    imageAlt: "Nail salon web app screens for research, scheduling, and client management.",
    href: "https://www.behance.net/gallery/178787373/Nail-Salon-Management-Web-App-UIUX-Design",
    layout: "vertical",
    filters: ["ui", "e2e"],
    domain: "care-services",
  },
  {
    title: "SSSMarket - Digital Wardrobe",
    shortName: "SSS",
    eyebrow: "UI/UX Design | Mobile App",
    description:
      "SSSMarket is a platform that helps to share your wardrobe with the community in order to reuse, renew the item, and increase the life cycle of item that are no longer suit with your current style.",
    image: "/images/projects/sssmarket-thumbnail.png",
    imageAlt: "SSSMarket mobile fashion app screens for browsing and sharing a digital wardrobe.",
    href: "https://www.behance.net/gallery/147710941/SSSMarket-Fashion-App",
    layout: "vertical",
    filters: ["e2e", "ui"],
    domain: "fashion",
  },
  {
    title: "Smart Site Safety System (4S)",
    shortName: "4S",
    eyebrow: "UI Design | Redesign Website",
    description:
      "Empower Your Jobsites with Automated Construction Management Software Powered with AI Video Analytics",
    image: "/images/projects/dam/viact-thumbnail.png",
    imageAlt: "Construction worker on a jobsite beside the Smart Site Safety System website.",
    href: "/experience?case=smart-site-safety-system",
    layout: "horizontal",
    filters: ["ui"],
    domain: "safety-construction",
  },
]
